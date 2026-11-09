// Local preview of the production build (`dist/client`).
//
// `astro preview` is not supported by the Vercel adapter, so this tiny server
// mimics what Vercel does for the static output: trailing-slash redirects,
// headers from vercel.json, brotli/gzip, and the custom 404 page.
// The on-demand view-counter API is not run here; it answers `{ enabled: false }`,
// which is exactly how the page behaves when the Redis variables are missing.
//
// Usage: pnpm preview [--port 4321]
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { pipeline } from 'node:stream';
import { brotliCompressSync, constants, gzipSync } from 'node:zlib';

const root = resolve('dist/client');
const portArg = process.argv.indexOf('--port');
const port = Number(portArg > -1 ? process.argv[portArg + 1] : (process.env.PORT ?? 4321));

if (!existsSync(root)) {
  console.error('dist/client not found. Run `pnpm build` first.');
  process.exit(1);
}

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
  '.pf_fragment': 'application/octet-stream',
  '.pf_index': 'application/octet-stream',
  '.pf_meta': 'application/octet-stream',
  '.pagefind': 'application/octet-stream',
};
const compressible = /^(text\/|application\/(json|xml|javascript)|image\/svg)/;

// Headers declared in vercel.json (source patterns -> RegExp).
const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
const headerRules = (vercel.headers ?? []).map((rule) => ({
  pattern: new RegExp(`^${rule.source.replace(/\(\.\*\)/g, '.*')}$`),
  headers: rule.headers,
}));

function resolveFile(pathname) {
  const safe = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  const full = join(root, safe);
  if (full !== root && !full.startsWith(root + sep)) return null;
  if (existsSync(full) && statSync(full).isFile()) return full;
  const index = join(full, 'index.html');
  if (existsSync(index)) return index;
  return null;
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host}`);
  const { pathname } = url;

  if (pathname.startsWith('/api/')) {
    req.resume();
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify({ enabled: false, views: null }));
    return;
  }

  // trailingSlash: redirect "/blog" -> "/blog/" (files with an extension are left alone).
  if (!pathname.endsWith('/') && !extname(pathname)) {
    res.writeHead(308, { Location: `${pathname}/${url.search}` });
    res.end();
    return;
  }

  let file = resolveFile(pathname);
  let status = 200;
  if (!file) {
    file = join(root, '404.html');
    status = 404;
  }

  const type = types[extname(file)] ?? 'application/octet-stream';
  const headers = { 'Content-Type': type, Vary: 'Accept-Encoding' };
  for (const rule of headerRules) {
    if (rule.pattern.test(pathname)) for (const h of rule.headers) headers[h.key] = h.value;
  }
  if (!headers['Cache-Control']) headers['Cache-Control'] = 'public, max-age=0, must-revalidate';

  const accept = String(req.headers['accept-encoding'] ?? '');
  if (compressible.test(type) && req.method !== 'HEAD') {
    const body = readFileSync(file);
    if (accept.includes('br')) {
      const out = brotliCompressSync(body, { params: { [constants.BROTLI_PARAM_QUALITY]: 5 } });
      res.writeHead(status, { ...headers, 'Content-Encoding': 'br', 'Content-Length': out.length });
      res.end(out);
      return;
    }
    if (accept.includes('gzip')) {
      const out = gzipSync(body);
      res.writeHead(status, {
        ...headers,
        'Content-Encoding': 'gzip',
        'Content-Length': out.length,
      });
      res.end(out);
      return;
    }
  }

  res.writeHead(status, { ...headers, 'Content-Length': statSync(file).size });
  if (req.method === 'HEAD') return res.end();
  pipeline(createReadStream(file), res, () => {});
});

server.listen(port, () => console.log(`Preview: http://localhost:${port}/  (serving ${root})`));
