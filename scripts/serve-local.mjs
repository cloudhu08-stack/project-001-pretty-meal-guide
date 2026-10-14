import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const port = Number(process.env.PORT || 4175);
const qaPublicOrigin = new URL(process.env.QA_PUBLIC_ORIGIN || 'https://pretty-meal-guide.vercel.app/');
if (qaPublicOrigin.protocol !== 'https:' || qaPublicOrigin.username || qaPublicOrigin.password || qaPublicOrigin.pathname !== '/' || qaPublicOrigin.search || qaPublicOrigin.hash) {
  throw new Error('QA_PUBLIC_ORIGIN must be a public HTTPS origin without credentials or a path.');
}
const types = { '.html': 'text/html; charset=utf-8', '.json': 'application/json', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png' };
http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url, 'http://localhost');
  const pathname = decodeURIComponent(requestUrl.pathname);
  if (['/__qa/mobile', '/__qa/mobile-public', '/__qa/desktop-public'].includes(pathname)) {
    const restaurant = requestUrl.searchParams.get('restaurant');
    const publicIds = ['taian-table', 'fu-he-hui', 'sushi-oyama', 'bombana', 'yi-long-court'];
    const fragment = publicIds.includes(restaurant) ? `#restaurant=${restaurant}` : '';
    const previewSource = pathname.endsWith('-public') ? `${qaPublicOrigin.origin}/${fragment}` : '/';
    const previewWidth = pathname === '/__qa/desktop-public' ? 1280 : 390;
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.end(`<!doctype html><title>Pretty Meal Guide public QA</title><style>body{margin:0;background:#444}iframe{display:block;width:${previewWidth}px;height:844px;border:0;margin:auto}</style><iframe title="Site preview" src="${previewSource}"></iframe>`);
    return;
  }
  const target = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
  if (target !== root && !target.startsWith(root + path.sep)) { response.writeHead(403); response.end(); return; }
  try { const bytes = await readFile(target); response.setHeader('Content-Type', types[path.extname(target)] || 'application/octet-stream'); response.end(bytes); }
  catch { response.writeHead(404); response.end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Local QA server: http://127.0.0.1:${port}; mobile fixture: /__qa/mobile`));
