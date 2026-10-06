/**
 * serve-static.mjs — zero-dependency static file server for the built app.
 *
 * Why this exists: the live preview must keep working even when `node_modules` is
 * unavailable (sandboxes routinely drop it between sessions). `npm run build`
 * produces a self-contained `site/` folder, and this script serves it with plain
 * node:http — no packages required.
 *
 *   node scripts/serve-static.mjs [port] [directory]
 */

import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const port = Number(process.argv[2] ?? process.env.PORT ?? 5173);
const root = resolve(process.argv[3] ?? process.env.SITE_DIR ?? 'site');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.wasm': 'application/wasm',
  '.task': 'application/octet-stream',
};

async function fileAt(path) {
  try {
    const info = await stat(path);
    return info.isFile() ? path : null;
  } catch {
    return null;
  }
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith('/')) pathname += 'index.html';

    // Path traversal guard.
    const safe = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
    let file = await fileAt(join(root, safe));

    // SPA fallback: unknown routes render the app shell.
    if (!file && !extname(safe)) file = await fileAt(join(root, 'index.html'));

    if (!file) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('404 — not found in ' + root);
      return;
    }

    res.writeHead(200, {
      'content-type': MIME[extname(file).toLowerCase()] ?? 'application/octet-stream',
      // The preview is rebuilt often; never let a stale bundle stick around.
      'cache-control': 'no-cache, no-store, must-revalidate',
      'permissions-policy': 'camera=(self), microphone=()',
      'x-content-type-options': 'nosniff',
    });
    createReadStream(file).pipe(res);
  } catch (err) {
    res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('500 — ' + String(err?.message ?? err));
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`[JARVIS] serving ${root} → http://0.0.0.0:${port}`);
});
