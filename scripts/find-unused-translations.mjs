// Reports English translation keys that look unused by the TypeScript sources.
//
// A key counts as used when it appears as a quoted literal in non-test source,
// or when it matches a dynamically built key: template literals such as
// `editor.${key}_desc` and string concatenations such as 'editor.foo_' + x are
// turned into patterns. Patterns whose only static text is the namespace
// (`editor.${key}`) are weak: a key matched only by them is used when its
// dynamic remainder appears as an identifier or string elsewhere in the source.
// Suffix patterns (`${labelKey}_desc`) count only when the base key is a literal.
//
// Usage (from the repository root): node scripts/find-unused-translations.mjs
// The script is advisory and always exits with code 0.

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const srcDir = path.join(root, 'src');
// Dashboard strings and editor-only strings (editor/en.json) together.
const enFiles = [path.join(srcDir, 'translations', 'en.json'), path.join(srcDir, 'translations', 'editor', 'en.json')];

function flatten(value, prefix = '', result = []) {
  for (const [key, child] of Object.entries(value)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === 'object' && !Array.isArray(child)) flatten(child, fullKey, result);
    else result.push(fullKey);
  }
  return result;
}

async function sourceFiles(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...(await sourceFiles(full)));
    else if (entry.name.endsWith('.ts') && !/\.(test|spec)\.ts$/.test(entry.name) && !entry.name.endsWith('.d.ts')) {
      result.push(full);
    }
  }
  return result;
}

/**
 * Minimal scanner: collects plain string literals (with the character that
 * follows them, to detect concatenation) and the static parts of template
 * literals, including templates nested inside `${...}` expressions.
 */
function scan(code) {
  const strings = [];
  const templates = [];
  let i = 0;

  function readQuoted(quote) {
    let value = '';
    i++;
    while (i < code.length && code[i] !== quote) {
      if (code[i] === '\\') {
        value += code[i + 1] ?? '';
        i += 2;
      } else if (code[i] === '\n') {
        break;
      } else {
        value += code[i++];
      }
    }
    i++;
    return value;
  }

  function readTemplate() {
    const parts = [''];
    i++;
    while (i < code.length && code[i] !== '`') {
      if (code[i] === '\\') {
        parts[parts.length - 1] += code[i + 1] ?? '';
        i += 2;
      } else if (code[i] === '$' && code[i + 1] === '{') {
        i += 2;
        skipExpression();
        parts.push('');
      } else {
        parts[parts.length - 1] += code[i++];
      }
    }
    i++;
    templates.push(parts);
  }

  // Scans code inside `${ ... }` until the matching closing brace.
  function skipExpression() {
    let depth = 1;
    while (i < code.length && depth > 0) {
      const ch = code[i];
      if (ch === '{') {
        depth++;
        i++;
      } else if (ch === '}') {
        depth--;
        i++;
      } else {
        step();
      }
    }
  }

  function step() {
    const ch = code[i];
    const next = code[i + 1];
    if (ch === '/' && next === '/') {
      while (i < code.length && code[i] !== '\n') i++;
    } else if (ch === '/' && next === '*') {
      const end = code.indexOf('*/', i + 2);
      i = end === -1 ? code.length : end + 2;
    } else if (ch === "'" || ch === '"') {
      const value = readQuoted(ch);
      const rest = code.slice(i, i + 40).trimStart();
      strings.push({ value, concatenated: rest.startsWith('+') && !rest.startsWith('++') });
    } else if (ch === '`') {
      readTemplate();
    } else {
      i++;
    }
  }

  while (i < code.length) step();
  return { strings, templates };
}

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const keys = [];
for (const file of enFiles) flatten(JSON.parse(await readFile(file, 'utf8')), '', keys);
const namespaces = new Set(keys.map((key) => key.split('.')[0]));
const files = await sourceFiles(srcDir);

const literals = new Set();
const identifiers = new Set();
const patterns = [];

for (const file of files) {
  const code = await readFile(file, 'utf8');
  for (const match of code.matchAll(/[A-Za-z_][A-Za-z0-9_]*/g)) identifiers.add(match[0]);
  const { strings, templates } = scan(code);
  for (const { value, concatenated } of strings) {
    literals.add(value);
    if (concatenated && /^[a-z_]+\.[A-Za-z0-9_.]*$/.test(value) && namespaces.has(value.split('.')[0])) {
      patterns.push({ source: `'${value}' + ...`, parts: [value, ''], file });
    }
  }
  for (const parts of templates) {
    if (parts.length === 1) {
      literals.add(parts[0]);
      continue;
    }
    // Skip templates that cannot build a key: CSS, HTML, multi-word text.
    if (parts.some((part) => /[\s<>{}:;,'"()=]/.test(part))) continue;
    if (parts.every((part) => part === '')) continue;
    patterns.push({ source: '`' + parts.join('${…}') + '`', parts, file });
  }
}

function compile(pattern) {
  const regex = new RegExp('^' + pattern.parts.map(escapeRegExp).join('(.+?)') + '$');
  const [first, ...others] = pattern.parts;
  const namespace = /^([a-z_]+)\./.exec(first)?.[1];
  if (namespace && namespaces.has(namespace)) {
    const weak = first === `${namespace}.` && others.every((part) => part === '');
    return { ...pattern, regex, kind: weak ? 'weak' : 'strong' };
  }
  // A key-derived suffix such as `${labelKey}_desc`: used when the base key is a literal.
  if (first === '' && others.length === 1 && /^[_.][A-Za-z]/.test(others[0])) {
    return { ...pattern, regex, kind: 'suffix' };
  }
  return null;
}

const compiled = patterns.map(compile).filter((pattern) => pattern && keys.some((key) => pattern.regex.test(key)));

const unused = [];
const weakOnly = [];
for (const key of keys) {
  if (literals.has(key)) continue;
  const matches = compiled.filter((pattern) => pattern.regex.test(key));
  if (matches.some((pattern) => pattern.kind === 'strong')) continue;
  if (matches.length > 0) {
    const covered = matches.some((pattern) => {
      const rest = key.match(pattern.regex)?.[1] ?? '';
      return pattern.kind === 'suffix' ? literals.has(rest) : literals.has(rest) || identifiers.has(rest);
    });
    if (covered) continue;
    weakOnly.push({ key, via: [...new Set(matches.map((pattern) => pattern.source))] });
    continue;
  }
  unused.push(key);
}

const rel = (file) => path.relative(root, file).split(path.sep).join('/');
console.log(`Scanned ${files.length} source files and ${keys.length} English keys.`);
console.log(`Dynamic key patterns: ${compiled.length}`);
for (const pattern of compiled) console.log(`  ${pattern.kind.padEnd(6)} ${pattern.source}  (${rel(pattern.file)})`);

console.log(`\nSuspected unused keys (no literal, no dynamic pattern): ${unused.length}`);
for (const key of unused) console.log(`  ${key}`);

console.log(`\nPossibly unused keys (only a broad pattern matches, remainder not found in source): ${weakOnly.length}`);
for (const { key, via } of weakOnly) console.log(`  ${key}  via ${via.join(', ')}`);

process.exitCode = 0;
