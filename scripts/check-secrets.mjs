#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { brotliDecompressSync, gunzipSync } from 'node:zlib';

const mode = process.argv[2] || '--tracked';
if (!['--tracked', '--outgoing', '--history'].includes(mode)) {
  console.error('Usage: node scripts/check-secrets.mjs [--tracked|--outgoing|--history]');
  process.exit(2);
}

function git(args, options = {}) {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...options });
}

const rules = [
  ['private key', /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g],
  ['GitHub token', /\b(?:gh[pousr]_[A-Za-z0-9_]{30,}|github_pat_[A-Za-z0-9_]{30,})\b/g],
  ['AWS access key', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g],
  ['credential assignment', /\b(?:api[_-]?key|access[_-]?token|auth[_-]?token|client[_-]?secret|password|passwd|secret[_-]?key)\b\s*[:=]\s*['"`]?([A-Za-z0-9_+\/=.-]{16,})/gi],
];
const placeholder = /^(?:x+|0+|your[_-].*|replace[_-].*|example.*|placeholder.*|dummy.*|changeme.*)$/i;
const findings = [];
const skipped = [];
const media = [];

function scan(label, data, path = label) {
  if (/^assets\/.+\.(?:gif|png|mp4)$/i.test(path)) {
    media.push(label);
    return;
  }
  if (path.endsWith('.gz')) {
    try { data = gunzipSync(data); } catch { skipped.push(label); return; }
  } else if (path.endsWith('.br')) {
    try { data = brotliDecompressSync(data); } catch { skipped.push(label); return; }
  }
  if (data.length > 2 * 1024 * 1024 || data.includes(0)) {
    skipped.push(label);
    return;
  }
  const lines = data.toString('utf8').split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    for (const [name, rule] of rules) {
      rule.lastIndex = 0;
      for (const match of lines[i].matchAll(rule)) {
        if (name === 'credential assignment' && (placeholder.test(match[1]) || (path === 'node_modules/@types/node/url.d.ts' && lines[i].includes('password:' + ' URLPatternComponentResult')))) continue;
        findings.push(`${label}:${i + 1} [${name}]`);
      }
    }
  }
}

try {
  if (mode === '--tracked') {
    for (const path of git(['ls-files', '-z']).split('\0').filter(Boolean)) {
      try { scan(path, readFileSync(path)); } catch { skipped.push(path); }
    }
  } else {
    const args = ['rev-list', '--objects', '--all'];
    if (mode === '--outgoing') {
      const refs = git(['for-each-ref', '--format=%(refname)', 'refs/remotes/origin/']).trim().split(/\r?\n/).filter(Boolean);
      if (!refs.length) throw new Error('No origin remote refs; fetch origin before checking outgoing commits');
      args.splice(3, 0, 'HEAD', '--not', ...refs);
      args.splice(args.indexOf('--all'), 1);
    }
    const seen = new Set();
    const objects = [];
    for (const line of git(args).split(/\r?\n/).filter(Boolean)) {
      const [oid, ...nameParts] = line.split(' ');
      const name = nameParts.join(' ') || oid.slice(0, 12);
      if (seen.has(oid)) continue;
      seen.add(oid);
      if (/^assets\/.+\.(?:gif|png|mp4)$/i.test(name)) { media.push(name); continue; }
      objects.push({ oid, name });
    }
    const metadata = git(['cat-file', '--batch-check'], { input: objects.map(({ oid }) => oid).join('\n') + '\n' }).trim().split(/\r?\n/);
    const eligible = [];
    for (let i = 0; i < objects.length; i++) {
      const { oid, name } = objects[i];
      const [, type, sizeText] = metadata[i].split(' ');
      if (type !== 'blob') continue;
      if (Number(sizeText) > 2 * 1024 * 1024) { skipped.push(name); continue; }
      eligible.push({ oid, name });
    }
    for (let start = 0; start < eligible.length; start += 32) {
      const group = eligible.slice(start, start + 32);
      const output = execFileSync('git', ['cat-file', '--batch'], {
        input: group.map(({ oid }) => oid).join('\n') + '\n',
        maxBuffer: 70 * 1024 * 1024,
      });
      let offset = 0;
      for (const { oid, name } of group) {
        const end = output.indexOf(10, offset);
        const [actualOid, type, sizeText] = output.subarray(offset, end).toString('utf8').split(' ');
        if (actualOid !== oid || type !== 'blob') throw new Error('Unexpected git cat-file response');
        const size = Number(sizeText);
        scan(`${name} (${oid.slice(0, 12)})`, output.subarray(end + 1, end + 1 + size), name);
        offset = end + 2 + size;
      }
    }
  }
} catch (error) {
  console.error(`Secret check could not complete: ${error.message}`);
  process.exit(2);
}

console.log(`Secret check ${mode}: ${findings.length} finding(s), ${skipped.length} unscanned file(s), ${media.length} known image asset(s) excluded.`);
for (const finding of findings) console.error(finding);
for (const item of skipped) console.error(`${item} [unscanned binary or large file]`);
if (findings.length || (mode !== '--history' && skipped.length)) process.exit(1);
