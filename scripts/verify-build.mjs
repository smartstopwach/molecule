/**
 * Boots the BUILT bundle (docs/assets/index-*.js) inside jsdom with no WebGL and
 * no camera. If this prints "MOUNTED", the shipped app boots in a browser-like
 * environment and the boot placeholder is removed.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';

const dir = process.argv[2] ?? 'docs';
const html = readFileSync(`${dir}/index.html`, 'utf8');
const entry = readdirSync('docs/assets').find((f) => /^index-.*\.js$/.test(f) && !f.includes('coco'));

const dom = new JSDOM(html, { url: 'http://localhost:5173/', pretendToBeVisual: true, runScripts: 'outside-only' });
const w = dom.window;

// Minimal browser surface the bundle touches at boot.
w.HTMLCanvasElement.prototype.getContext = () => null; // no WebGL, no 2D → worst case
w.matchMedia ||= () => ({ matches: false, addEventListener() {}, removeEventListener() {} });

for (const key of [
  'window','document','navigator','location','history','HTMLElement','HTMLCanvasElement','HTMLVideoElement',
  'Element','Node','Event','CustomEvent','MutationObserver','getComputedStyle','requestAnimationFrame',
  'cancelAnimationFrame','DOMRect','Image','self','localStorage','sessionStorage','screen',
]) {
  if (w[key] === undefined) continue;
  try {
    Object.defineProperty(globalThis, key, { value: w[key], configurable: true, writable: true });
  } catch { /* some globals are read-only in node — skip */ }
}
globalThis.IS_REACT_ACT_ENVIRONMENT = false;

const errors = [];
w.addEventListener('error', (e) => errors.push(String(e.message || e.target)));
process.on('unhandledRejection', (e) => errors.push('rejection: ' + e));

await import(pathToFileURL(`docs/assets/${entry}`).href);
await new Promise((r) => setTimeout(r, 4000));

const root = w.document.getElementById('root');
const boot = w.document.getElementById('boot');
console.log('entry bundle      :', entry);
console.log('#root children    :', root?.childElementCount ?? 'NO ROOT');
console.log('#boot present     :', !!boot);
console.log('__JARVIS__        :', JSON.stringify(w.__JARVIS__));
console.log('boot text         :', (boot?.textContent || '(removed)').slice(0, 160).replace(/\s+/g, ' '));
console.log('rendered text has :', ['Jarvis Lab', 'CAMERA', 'Elements', '3D stage']
  .filter((t) => (root?.textContent || '').includes(t)).join(', ') || '(none)');
console.log('errors            :', errors.length ? errors.slice(0, 5) : 'none');
console.log(root?.childElementCount ? 'RESULT: MOUNTED ✅' : 'RESULT: NOT MOUNTED ❌');
process.exit(0);
