import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildReleaseZip, createZip, readZip, releaseFiles, ZIP_ASSET_NAME } from '../../scripts/release-zip.mjs';

describe('Marketplace release ZIP', () => {
  it('is named after the HACS filename', () => {
    expect(ZIP_ASSET_NAME).toBe('dashboard-strategy.zip');
  });

  it('round-trips deflated and stored entries byte-identical', () => {
    const entries = [
      { name: 'dashboard-strategy.js', data: Buffer.from('console.log("x");'.repeat(50)) },
      { name: 'dashboard-strategy.js.gz', data: Buffer.from([0x1f, 0x8b, 1, 2, 3]) },
    ];
    const zip = createZip(entries);
    const read = readZip(zip);
    expect(read.map((e: { name: string }) => e.name)).toEqual(entries.map((e) => e.name));
    read.forEach((entry: { data: Buffer }, i: number) => expect(entry.data.equals(entries[i].data)).toBe(true));
    expect(createZip(entries).equals(zip)).toBe(true);
  });

  it('packs every release file flat into the archive root', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ds-zip-'));
    try {
      for (const name of [
        'dashboard-strategy.js',
        'dashboard-strategy-core.abc.js',
        'dashboard-strategy.js.br',
        'notes.md',
      ]) {
        fs.writeFileSync(path.join(dir, name), name);
      }
      expect(releaseFiles(dir)).toEqual([
        'dashboard-strategy-core.abc.js',
        'dashboard-strategy.js',
        'dashboard-strategy.js.br',
      ]);
      const names = readZip(buildReleaseZip(dir)).map((e: { name: string }) => e.name);
      expect(names).toEqual(releaseFiles(dir));
      expect(names.every((name: string) => !name.includes('/'))).toBe(true);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('refuses to build without the entry file', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ds-zip-'));
    try {
      expect(() => buildReleaseZip(dir)).toThrow(/dashboard-strategy\.js is missing/);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
