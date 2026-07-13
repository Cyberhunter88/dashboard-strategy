import fs from 'node:fs';

const root = new URL('../', import.meta.url);
const manifest = JSON.parse(fs.readFileSync(new URL('hacs.json', root), 'utf8'));
const distUrl = new URL('dist/', root);
const javascriptFiles = fs.readdirSync(distUrl).filter((name) => name.endsWith('.js')).sort();

if (!javascriptFiles.includes('dashboard-strategy.js')) {
  throw new Error('dist/dashboard-strategy.js is missing');
}

if (javascriptFiles.length > 1 && manifest.filename) {
  throw new Error(
    `hacs.json filename=${manifest.filename} restricts this multi-file plugin to one download; ` +
    'remove filename so HACS installs every JavaScript file from dist',
  );
}

if (manifest.content_in_root !== false) {
  throw new Error('hacs.json content_in_root must be false because the plugin files live in dist');
}

const entry = fs.readFileSync(new URL('dist/dashboard-strategy.js', root), 'utf8');
for (const file of javascriptFiles.filter((name) => name !== 'dashboard-strategy.js')) {
  const hash = file.match(/\.([a-f0-9]{8})\.js$/)?.[1];
  if (hash && !entry.includes(hash)) {
    throw new Error(`dist chunk ${file} is not referenced by the entry runtime`);
  }
}

console.log(JSON.stringify({ javascriptFiles: javascriptFiles.length, filenameRestricted: false }));
