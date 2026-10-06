/**
 * useCamera.ts — the one and only way the app gets pixels.
 *
 * Camera access is COMPULSORY: the hook never "falls back" to a webcam-free mode.
 * It exposes a status machine that CameraGate renders (boot → requesting → live |
 * denied | error | unsupported) and hands the live MediaStream to the vision layer.
 *
 * Privacy: the stream is only ever attached to a local <video> element and drawn to
 * local canvases. Nothing is uploaded, recorded or stored.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

export type CameraStatus = 'idle' | 'requesting' | 'live' | 'denied' | 'error' | 'unsupported';

export interface CameraOptions {
  width?: number;
  height?: number;
  /** 'user' = front-facing (required for hand gestures). */
  facingMode?: VideoFacingModeEnum;
}

export interface UseCameraResult {
  videoRef: React.RefObject<HTMLVideoElement>;
  status: CameraStatus;
  error: string | null;
  stream: MediaStream | null;
  retry: () => void;
  stop: () => void;
  /** True when the browser has no getUserMedia at all. */
  supported: boolean;
}

const DEFAULT_OPTS: Required<CameraOptions> = { width: 1280, height: 720, facingMode: 'user' };

export function useCamera(options: CameraOptions = {}): UseCameraResult {
  const opts = { ...DEFAULT_OPTS, ...options };
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const supported =
    typeof navigator !== 'undefined' && !!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia;

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStream(null);
  }, []);

  useEffect(() => {
    if (!supported) {
      setStatus('unsupported');
      setError('This browser does not expose getUserMedia — JARVIS LAB needs a camera.');
      return;
    }
    let cancelled = false;
    let localStream: MediaStream | null = null;

    const start = async () => {
      setStatus('requesting');
      setError(null);
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: opts.facingMode,
            width: { ideal: opts.width },
            height: { ideal: opts.height },
            frameRate: { ideal: 30, max: 60 },
          },
          audio: false,
        });
        if (cancelled) {
          localStream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = localStream;
        setStream(localStream);
        const video = videoRef.current;
        if (video) {
          video.srcObject = localStream;
          video.playsInline = true;
          video.muted = true;
          await video.play().catch(() => undefined);
        }
        // If the user revokes permission mid-session (or unplugs the camera).
        localStream.getVideoTracks()[0]?.addEventListener('ended', () => {
          if (!cancelled) {
            setStatus('error');
            setError('The camera stream ended unexpectedly.');
          }
        });
        setStatus('live');
      } catch (e) {
        if (cancelled) return;
        const err = e as DOMException;
        const name = err?.name ?? '';
        if (name === 'NotAllowedError' || name === 'SecurityError') {
          setStatus('denied');
          setError('Camera permission was denied.');
        } else if (name === 'NotFoundError' || name === 'OverconstrainedError') {
          setStatus('error');
          setError('No camera device found.');
        } else if (name === 'NotReadableError') {
          setStatus('error');
          setError('The camera is already in use by another application.');
        } else {
          setStatus('error');
          setError(err?.message ?? 'Unknown camera error.');
        }
      }
    };

    void start();

    return () => {
      cancelled = true;
      localStream?.getTracks().forEach((t) => t.stop());
    };
    // Re-runs when `attempt` changes (retry button).
  }, [supported, attempt, opts.width, opts.height, opts.facingMode]);

  const retry = useCallback(() => {
    stop();
    setAttempt((a) => a + 1);
  }, [stop]);

  return { videoRef, status, error, stream, retry, stop, supported };
}

/** Small helper: does this browser support the (Chrome-only) frame callback we use
 *  to hit 30 fps inference instead of a rAF busy-loop? */
export function supportsVideoFrameCallback(video: HTMLVideoElement | null): boolean {
  return !!video && 'requestVideoFrameCallback' in video;
}
