import assert from 'node:assert/strict';
import { readFile, stat, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const html = await readFile(path.join(dist, 'index.html'), 'utf8');
const data = JSON.parse(await readFile(path.join(dist, 'data/production-dataset.json'), 'utf8'));
const expected = ['taian-table', 'fu-he-hui', 'sushi-oyama', 'bombana', 'yi-long-court'];
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m => m[1]);
scripts.forEach((source, index) => new vm.Script(source, { filename: `index-inline-${index}.js` }));

function constant(name, end) {
  const start = html.indexOf(`const ${name}=`);
  assert(start >= 0, `${name} declaration missing`);
  const finish = html.indexOf(end, start);
  assert(finish > start, `${name} terminator missing`);
  return vm.runInNewContext(`${html.slice(start, finish)};${name}`);
}

const home = constant('homeCards', 'const homeOrder=');
const order = constant('homeOrder', ';let activeCuisine=');
const details = constant('detailPresentation', 'function detailDateText(');
assert.deepEqual(Array.from(order).sort(), [...expected].sort(), 'Only the five V1.0 restaurants may be public');
assert(data.directory.some(d => d.id === 'da-vittorio'), 'Da Vittorio data must be retained');
assert(!html.includes('href="#menu"'), 'Menu jump must not replace the restaurant hash route');

const localImages = new Set([...html.matchAll(/(?:url|image):\s*['"](\/assets\/[^'"]+)['"]/g)].map(m => m[1]));
for (const url of localImages) {
  const file = path.join(dist, url.slice(1));
  assert((await stat(file)).size > 0, `Missing or empty image: ${url}`);
}

const unsafe = /(?:file:\/\/|\/Users\/|(?:^|[\s'"(])[A-Z]:[\\/]|(?:https?:\/\/)?(?:localhost|127\.0\.0\.1)(?=[:/]))/i;
assert(!unsafe.test(html), 'Local-only production reference in HTML');
function inspect(value, key = '') {
  if (typeof value === 'string' && /(?:url|artifact|path)$/i.test(key)) {
    assert(!unsafe.test(value), `Local-only data reference: ${value}`);
  } else if (Array.isArray(value)) value.forEach(v => inspect(v));
  else if (value && typeof value === 'object') Object.entries(value).forEach(([k, v]) => inspect(v, k));
}
inspect(data);

for (const id of expected) {
  const entry = data.directory.find(d => d.id === id);
  assert(entry && data.records[entry.record_index]?.menus?.length, `${id}: menu data missing`);
  assert(home[id]?.visual?.url && details[id]?.hero?.url, `${id}: visual missing`);
  for (const url of [home[id].visual.url, details[id].booking?.url]) {
    assert(url, `${id}: URL missing`);
    if (url.startsWith('/assets/')) assert((await stat(path.join(dist, url.slice(1)))).size > 0);
    else if (url.startsWith('tel:')) assert(/^tel:\+\d{8,15}$/.test(url), `${id}: invalid phone link`);
    else assert(new URL(url).protocol === 'https:', `${id}: HTTPS required`);
  }
  console.log(`PASS ${id}: menu, image references, reservation URL`);
}

async function countFiles(directory) {
  let files = 0, bytes = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { const nested = await countFiles(file); files += nested.files; bytes += nested.bytes; }
    else { files++; bytes += (await stat(file)).size; }
  }
  return { files, bytes };
}
console.log(`PASS static production build: ${scripts.length} valid scripts, ${localImages.size} local image references, ${JSON.stringify(await countFiles(dist))}`);
console.log('Output: dist. Routing uses /#restaurant=<id>; URL fragments need no server rewrite. No environment variables required.');
