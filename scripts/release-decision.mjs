import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { shouldRelease } from './version-utils.mjs';

const current = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const before = process.env.BEFORE_SHA;
const manual = process.env.EVENT_NAME === 'workflow_dispatch';
let previous = null;
if (!manual && before && !/^0+$/.test(before)) {
  // Missing/unreadable history must fail, never accidentally authorize publication.
  previous = JSON.parse(execFileSync('git', ['show', `${before}:package.json`], { encoding: 'utf8' }));
}
const release = shouldRelease(previous, current, manual);
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `release=${release}\n`);
console.log(JSON.stringify({ version: current.version, previousVersion: previous?.version, release }));
