/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        jarvis: {
          cyan: '#38e8ff',
          blue: '#0a3a52',
          deep: '#03121b',
          dark: '#02080d',
          orange: '#ff9d3c',
          amber: '#ffc76b',
          red: '#ff4d5e',
          green: '#4dffb8',
          violet: '#a97bff',
        },
      },
      fontFamily: {
        hud: ['"Rajdhani"', '"Share Tech Mono"', 'ui-monospace', 'monospace'],
        mono: ['"Share Tech Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        hud: '0 0 12px rgba(56,232,255,0.35), inset 0 0 12px rgba(56,232,255,0.08)',
        'hud-strong': '0 0 26px rgba(56,232,255,0.55), inset 0 0 18px rgba(56,232,255,0.12)',
        danger: '0 0 18px rgba(255,77,94,0.55)',
      },
      keyframes: {
        scanline: { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100%)' } },
        pulseRing: { '0%': { opacity: '0.9', transform: 'scale(0.6)' }, '100%': { opacity: '0', transform: 'scale(2.2)' } },
        spinSlow: { to: { transform: 'rotate(360deg)' } },
        flicker: { '0%,100%': { opacity: '1' }, '45%': { opacity: '0.65' }, '55%': { opacity: '0.9' } },
        rise: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        scanline: 'scanline 6s linear infinite',
        pulseRing: 'pulseRing 1.8s ease-out infinite',
        spinSlow: 'spinSlow 18s linear infinite',
        flicker: 'flicker 4s ease-in-out infinite',
        rise: 'rise 0.25s ease-out both',
      },
    },
  },
  plugins: [],
};
