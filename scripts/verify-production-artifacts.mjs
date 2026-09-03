import fs from 'node:fs';

const root = new URL('../', import.meta.url);
const distUrl = new URL('dist/', root);
const packageJson = JSON.parse(fs.readFileSync(new URL('package.json', root), 'utf8'));
const files = fs.readdirSync(distUrl);

const assertNonEmpty = (name) => {
  const fileUrl = new URL(name, distUrl);
  const stats = fs.statSync(fileUrl);
  if (!stats.isFile() || stats.size === 0) {
    throw new Error(`Production artifact is missing or empty: dist/${name}`);
  }
};

const entryName = 'dashboard-strategy.js';
const entryUrl = new URL(entryName, distUrl);
assertNonEmpty(entryName);
assertNonEmpty(`${entryName}.gz`);
assertNonEmpty(`${entryName}.br`);

const entry = fs.readFileSync(entryUrl, 'utf8');
const markerPattern = /Dashboard Strategy v(?:\$\{[^}]+\}|[A-Za-z_$][\w$]*) loaded/;
if (!markerPattern.test(entry) || !entry.includes(packageJson.version)) {
  throw new Error(
    `dist/${entryName} does not contain a versioned Dashboard Strategy load marker for ${packageJson.version}`,
  );
}

for (const chunkName of ['core', 'editor', 'views', 'lit']) {
  const pattern = new RegExp(`^dashboard-strategy-${chunkName}\\.[a-f0-9]{8}\\.js$`);
  const chunk = files.find((name) => pattern.test(name));
  if (!chunk) {
    throw new Error(`Required production chunk is missing: dashboard-strategy-${chunkName}.*.js`);
  }

  assertNonEmpty(chunk);
  assertNonEmpty(`${chunk}.gz`);
  assertNonEmpty(`${chunk}.br`);
}

const javascriptFiles = files.filter((name) => name.endsWith('.js'));
for (const javascriptFile of javascriptFiles) {
  assertNonEmpty(`${javascriptFile}.gz`);
  assertNonEmpty(`${javascriptFile}.br`);
}

console.log(
  JSON.stringify({
    version: packageJson.version,
    javascriptFiles: javascriptFiles.length,
    compressedFiles: javascriptFiles.length * 2,
  })
);
