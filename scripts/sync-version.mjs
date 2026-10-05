import fs from 'node:fs';
import { readVersion } from './version-utils.mjs';

const root = new URL('../', import.meta.url);
const version = readVersion();

const writeJson = (name, value) => {
  fs.writeFileSync(new URL(name, root), `${JSON.stringify(value, null, 2)}\n`);
};

const lockfileUrl = new URL('package-lock.json', root);
if (fs.existsSync(lockfileUrl)) {
  const lockfile = JSON.parse(fs.readFileSync(lockfileUrl, 'utf8'));
  lockfile.version = version;
  if (lockfile.packages?.['']) {
    lockfile.packages[''].version = version;
  }
  writeJson('package-lock.json', lockfile);
}

const sourceUrl = new URL('src/dashboard-strategy.ts', root);
const source = fs.readFileSync(sourceUrl, 'utf8');
const updatedSource = source.replace(
  /const STRATEGY_VERSION = '[^']+';[^\r\n]*/,
  `const STRATEGY_VERSION = '${version}'; // synchronized from package.json`
);

if (updatedSource === source && !source.includes(`const STRATEGY_VERSION = '${version}';`)) {
  throw new Error('Could not find STRATEGY_VERSION in src/dashboard-strategy.ts');
}

fs.writeFileSync(sourceUrl, updatedSource);
console.log(`Synchronized project version to ${version}`);
