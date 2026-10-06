/**
 * speech.ts — JARVIS's voice and ears (spec §8).
 *
 * OUTPUT  SpeechSynthesis, biased toward a deep male British voice (en-GB).
 *         Every utterance also fires `onCaption` so captions are never out of sync.
 * INPUT   webkitSpeechRecognition when available; continuous listening with an
 *         optional wake word ("Jarvis"). Falls back to a no-op on Safari/Firefox
 *         where the API is missing — nothing else in the app depends on it.
 *
 * Both are strictly optional: if the browser refuses, JARVIS simply types.
 */

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  /** Cancel anything already queued. */
  interrupt?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
}

type SynthVoice = SpeechSynthesisVoice;

let chosenVoice: SynthVoice | null = null;
let voicesLoaded = false;

/** Score voices: en-GB first, then any en-*, preferring deeper/male-ish names. */
const PREFERRED = [
  'google uk english male',
  'microsoft george',
  'microsoft ryan',
  'daniel',
  'alex',
  'google english male',
  'microsoft david',
  'english male',
];

export function pickVoice(voices: SynthVoice[]): SynthVoice | null {
  if (!voices.length) return null;
  const lower = (v: SynthVoice) => v.name.toLowerCase();
  for (const pref of PREFERRED) {
    const hit = voices.find((v) => lower(v).includes(pref));
    if (hit) return hit;
  }
  const gb = voices.find((v) => v.lang?.toLowerCase().startsWith('en-gb'));
  if (gb) return gb;
  const en = voices.find((v) => v.lang?.toLowerCase().startsWith('en'));
  return en ?? voices[0];
}

function loadVoices(): SynthVoice[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices.length) {
    voicesLoaded = true;
    chosenVoice = pickVoice(voices);
  }
  return voices;
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices();
  window.speechSynthesis.addEventListener?.('voiceschanged', () => loadVoices());
}

export const speechSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

export function speak(text: string, opts: SpeakOptions = {}, onCaption?: (t: string) => void): void {
  onCaption?.(text);
  if (!speechSupported() || typeof SpeechSynthesisUtterance === 'undefined') {
    opts.onEnd?.();
    return;
  }
  const synth = window.speechSynthesis;
  if (!voicesLoaded) loadVoices();
  if (opts.interrupt) synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = opts.rate ?? 0.94;
  utterance.pitch = opts.pitch ?? 0.82; // lower pitch = deeper, more JARVIS
  utterance.volume = opts.volume ?? 0.92;
  utterance.lang = 'en-GB';
  if (chosenVoice) utterance.voice = chosenVoice;
  utterance.onstart = () => opts.onStart?.();
  utterance.onend = () => opts.onEnd?.();
  utterance.onerror = () => opts.onEnd?.();
  // Chrome sometimes needs a nudge after cancel().
  window.setTimeout(() => synth.speak(utterance), opts.interrupt ? 60 : 0);
}

export function stopSpeaking(): void {
  if (speechSupported()) window.speechSynthesis.cancel();
}

export function isSpeaking(): boolean {
  return speechSupported() ? window.speechSynthesis.speaking : false;
}

/* ------------------------------------------------------------- listening */

export interface ListenHandle {
  stop: () => void;
  restart: () => void;
}

export interface ListenOptions {
  /** Require "Jarvis" before a command counts. */
  wakeWord?: boolean;
  lang?: string;
  onInterim?: (text: string) => void;
  onFinal: (text: string) => void;
  onError?: (message: string) => void;
  onWake?: () => void;
}

/* Minimal typings for the Web Speech *recognition* half. TypeScript's lib.dom does
 * not ship these yet, and we only use the small subset declared here. */
interface SpeechRecognitionAlternativeLike { transcript: string; confidence: number }
interface SpeechRecognitionResultLike {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
}
interface SpeechRecognitionResultListLike {
  length: number;
  [index: number]: SpeechRecognitionResultLike;
}
interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultListLike;
}
interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

export const recognitionSupported = () =>
  typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

export function startListening(options: ListenOptions): ListenHandle | null {
  if (!recognitionSupported()) {
    options.onError?.('Speech recognition is not available in this browser.');
    return null;
  }
  const Ctor =
    (window as unknown as { SpeechRecognition?: SpeechRecognitionCtor }).SpeechRecognition ??
    (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionCtor }).webkitSpeechRecognition;
  if (!Ctor) return null;

  const recognition = new Ctor();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = options.lang ?? 'en-GB';
  recognition.maxAlternatives = 3;

  let stoppedByUser = false;

  recognition.onresult = (event: SpeechRecognitionEventLike) => {
    let interim = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      const transcript = result[0]?.transcript?.trim() ?? '';
      if (result.isFinal) {
        const lowered = transcript.toLowerCase();
        const needsWake = options.wakeWord ?? false;
        if (!needsWake || lowered.includes('jarvis')) {
          if (needsWake) options.onWake?.();
          options.onFinal(transcript.replace(/^jarvis[,:]?\s*/i, ''));
        }
      } else {
        interim += transcript;
      }
    }
    if (interim) options.onInterim?.(interim);
  };

  recognition.onerror = (event) => {
    // 'no-speech' and 'aborted' are routine during continuous listening.
    if (event.error !== 'no-speech' && event.error !== 'aborted') {
      options.onError?.(event.error);
    }
  };

  recognition.onend = () => {
    if (!stoppedByUser) {
      try {
        recognition.start();
      } catch {
        /* browser throttling — give up quietly */
      }
    }
  };

  try {
    recognition.start();
  } catch {
    return null;
  }

  return {
    stop: () => {
      stoppedByUser = true;
      try {
        recognition.stop();
      } catch { /* ignore */ }
    },
    restart: () => {
      stoppedByUser = false;
      try {
        recognition.start();
      } catch { /* ignore */ }
    },
  };
}
