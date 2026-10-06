/**
 * RadialMenu.tsx — the open-palm radial menu (spec §11).
 *
 * Opens where the palm is; the wedge under the index fingertip highlights and a
 * pinch (or click) commits it. Keyboard arrows + Enter work too, because the
 * settings/accessibility fallback is allowed to use real input devices.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { playSfx } from '../jarvis/sfx';

export interface RadialItem {
  id: string;
  label: string;
  icon: string;
  run: () => void;
  disabled?: boolean;
}

export interface RadialMenuProps {
  items: RadialItem[];
  /** Normalised screen position (0..1) of the palm — the menu centre. */
  center: { x: number; y: number } | null;
  /** Pointer position used to choose a wedge. */
  pointer?: { x: number; y: number } | null;
  open: boolean;
  onClose: () => void;
}

const RADIUS = 118;
const INNER = 44;

export function RadialMenu({ items, center, pointer, open, onClose }: RadialMenuProps) {
  const [keyIndex, setKeyIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const angleOf = (dx: number, dy: number) => (Math.atan2(dy, dx) * 180) / Math.PI;

  const hovered = useMemo(() => {
    if (!center || !pointer) return -1;
    const dx = pointer.x - center.x;
    const dy = pointer.y - center.y;
    const dist = Math.hypot(dx, dy);
    if (dist < INNER / Math.max(1, window.innerWidth) * 2) return -1;
    const a = (angleOf(dx, dy) + 90 + 360) % 360;
    const step = 360 / items.length;
    return Math.floor(a / step) % items.length;
  }, [center, pointer, items.length]);

  const active = hovered >= 0 ? hovered : open ? keyIndex : -1;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setKeyIndex((i) => (i + 1) % items.length);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') setKeyIndex((i) => (i - 1 + items.length) % items.length);
      if (e.key === 'Enter' && items[keyIndex] && !items[keyIndex].disabled) {
        playSfx('select');
        items[keyIndex].run();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, items, keyIndex, onClose]);

  if (!open || !center) return null;

  const left = center.x * 100;
  const top = center.y * 100;

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute z-30"
      style={{ left: `${left}%`, top: `${top}%`, transform: 'translate(-50%, -50%)' }}
      role="menu"
      aria-label="Radial menu"
    >
      <svg width={RADIUS * 2 + 24} height={RADIUS * 2 + 24} className="overflow-visible">
        <circle cx={RADIUS + 12} cy={RADIUS + 12} r={INNER} fill="rgba(4,24,33,0.75)" stroke="#38e8ff" strokeOpacity={0.5} />
        {items.map((item, i) => {
          const step = 360 / items.length;
          const a0 = ((i * step - 90) * Math.PI) / 180;
          const a1 = (((i + 1) * step - 90) * Math.PI) / 180;
          const cx = RADIUS + 12;
          const cy = RADIUS + 12;
          const large = 0;
          const p = (r: number, a: number) => `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
          const isActive = i === active;
          return (
            <g key={item.id}>
              <path
                d={`M ${p(INNER, a0)} L ${p(RADIUS, a0)} A ${RADIUS} ${RADIUS} 0 ${large} 1 ${p(RADIUS, a1)} L ${p(INNER, a1)} A ${INNER} ${INNER} 0 ${large} 0 ${p(INNER, a0)} Z`}
                fill={isActive ? 'rgba(56,232,255,0.32)' : 'rgba(4,24,33,0.62)'}
                stroke={isActive ? '#38e8ff' : 'rgba(56,232,255,0.28)'}
                strokeWidth={isActive ? 2 : 1}
                className={item.disabled ? 'opacity-30' : ''}
              />
              <text
                x={cx + (INNER + RADIUS) / 2 * Math.cos((a0 + a1) / 2)}
                y={cy + (INNER + RADIUS) / 2 * Math.sin((a0 + a1) / 2)}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-hud text-[13px]"
                fill={isActive ? '#ffffff' : item.disabled ? '#4a6b74' : '#38e8ff'}
              >
                {item.icon}
              </text>
              <text
                x={cx + (RADIUS + 26) * Math.cos((a0 + a1) / 2)}
                y={cy + (RADIUS + 26) * Math.sin((a0 + a1) / 2)}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-hud text-[10px] uppercase tracking-widest"
                fill={isActive ? '#ff9d3c' : 'rgba(56,232,255,0.55)'}
              >
                {item.label}
              </text>
            </g>
          );
        })}
        <text x={RADIUS + 12} y={RADIUS + 16} textAnchor="middle" fill="#ff9d3c" className="font-mono text-[10px]">
          {items[active]?.label ?? 'menu'}
        </text>
      </svg>
    </div>
  );
}

export default RadialMenu;
