import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const translationDir = path.join(root, 'src', 'translations');

function flatten(value, prefix = '', result = new Map()) {
  for (const [key, child] of Object.entries(value)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === 'object' && !Array.isArray(child)) flatten(child, fullKey, result);
    else result.set(fullKey, child);
  }
  return result;
}

async function load(locale) {
  const file = path.join(translationDir, `${locale}.json`);
  const parsed = JSON.parse(await readFile(file, 'utf8'));
  return flatten(parsed);
}

const [de, en] = await Promise.all([load('de'), load('en')]);
const errors = [];
for (const key of en.keys()) if (!de.has(key)) errors.push(`Missing in de.json: ${key}`);
for (const key of de.keys()) if (!en.has(key)) errors.push(`Missing in en.json: ${key}`);
for (const [locale, entries] of [['de', de], ['en', en]]) {
  for (const [key, value] of entries) {
    if (typeof value !== 'string' || value.trim() === '') errors.push(`Empty or non-string value in ${locale}.json: ${key}`);
  }
}

async function sourceFiles(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await sourceFiles(target));
    else if (entry.name.endsWith('.ts')) result.push(target);
  }
  return result;
}

const known = en;
for (const file of await sourceFiles(path.join(root, 'src'))) {
  const source = await readFile(file, 'utf8');
  for (const match of source.matchAll(/localize\(\s*['"]([^'"`]+)['"]\s*\)/g)) {
    if (!known.has(match[1])) errors.push(`Unknown translation key in ${path.relative(root, file)}: ${match[1]}`);
  }
}

if (errors.length > 0) {
  for (const error of errors) console.error(error);
  process.exit(1);
}
console.log(`Translations synchronized: ${en.size} keys in de/en`);
