/**
 * ErrorBoundary.tsx — the difference between "a panel broke" and "a blank page".
 *
 * Wrapped around the whole app (main.tsx) and around the 3D stage (App.tsx). On a
 * crash it shows a JARVIS-styled diagnostic card with the message, the stack and a
 * reload button, so a failure is always explainable instead of a white screen.
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { playSfx } from '../jarvis/sfx';

export interface ErrorBoundaryProps {
  children?: ReactNode;
  /** Shown in the card heading, e.g. "3D renderer" or "JARVIS LAB". */
  label?: string;
  /** Compact styling for in-panel use (the 3D stage) vs full-screen (the app). */
  compact?: boolean;
  /** Called when the boundary trips — used to log/telemetry-free diagnostics. */
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  error: Error | null;
  info: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  state: State = { error: null, info: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.setState({ info });
    // eslint-disable-next-line no-console
    console.error(`[JARVIS] ${this.props.label ?? 'component'} crashed:`, error, info.componentStack);
    try {
      playSfx('reject');
    } catch {
      /* audio is never essential */
    }
    this.props.onError?.(error, info);
  }

  private reload = () => {
    if (typeof window !== 'undefined') window.location.reload();
  };

  private reset = () => this.setState({ error: null, info: null });

  render(): ReactNode {
    const { error, info } = this.state;
    if (!error) return this.props.children ?? null;

    const compact = this.props.compact;

    return (
      <div
        role="alert"
        className={
          compact
            ? 'pointer-events-auto flex h-full w-full items-center justify-center p-4'
            : 'fixed inset-0 z-[100] flex items-center justify-center bg-[#02080d] p-6 font-hud'
        }
      >
        <div className="max-h-full w-[min(94vw,680px)] overflow-y-auto rounded-xl border border-jarvis-red/50 bg-[#0b0f14]/95 p-5 shadow-danger">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-jarvis-red/80">
            {this.props.label ?? 'JARVIS LAB'} — fault
          </p>
          <h2 className="mt-1 text-lg font-semibold uppercase tracking-[0.2em] text-jarvis-cyan">
            Something short-circuited
          </h2>
          <p className="mt-2 text-[12.5px] leading-snug text-jarvis-cyan/80">
            {this.props.label === '3D renderer'
              ? 'The 3D stage could not start — most often WebGL is disabled or unsupported in this browser. The rest of the lab still works; gestures, chemistry and JARVIS are unaffected.'
              : 'A panel threw an exception. Nothing was lost — reload to restart the lab.'}
          </p>
          <pre className="mt-3 max-h-40 overflow-auto rounded border border-jarvis-red/30 bg-black/50 p-2 font-mono text-[11px] leading-tight text-jarvis-red/90">
            {error.message || String(error)}
          </pre>
          {info?.componentStack && (
            <details className="mt-2 text-[11px] text-jarvis-cyan/50">
              <summary className="cursor-pointer uppercase tracking-widest">component stack</summary>
              <pre className="mt-1 max-h-40 overflow-auto whitespace-pre-wrap font-mono text-[10px]">
                {info.componentStack.trim()}
              </pre>
            </details>
          )}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={this.reset}
              className="rounded border border-jarvis-cyan/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-jarvis-cyan/85 hover:bg-jarvis-cyan/15"
            >
              try again
            </button>
            <button
              type="button"
              onClick={this.reload}
              className="rounded border border-jarvis-red/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-jarvis-red/85 hover:bg-red-500/15"
            >
              reload
            </button>
          </div>
        </div>
      </div>
    );
  }
}

/** Convenience hook-free wrapper for the 3D stage. */
export function StageBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary label="3D renderer" compact>
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;
