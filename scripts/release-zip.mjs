// Build and inspect the Marketplace ZIP release asset.
//
// Home Assistant 2026.12+ installs `<filename>.zip` from the latest release in
// preference to the single JavaScript asset and extracts every file into the
// card folder. Our build is code-split, so the ZIP carries the entry, all
// lazy chunks, and their precompressed variants flat in its root. The single
// files stay attached for older Home Assistant versions.
//
// Usage: node scripts/release-zip.mjs [--out dist-release/dashboard-strategy.zip]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

export const RELEASE_ASSET_PATTERN = /\.js(?:\.gz|\.br)?$|\.js\.LICENSE\.txt$/;
export const ZIP_ASSET_NAME = 'dashboard-strategy.zip';

const CRC_TABLE = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

// Fixed timestamp (1980-01-01) keeps the archive byte-identical for identical input.
const DOS_TIME = 0;
const DOS_DATE = (0 << 9) | (1 << 5) | 1;

/** List the dist files that belong into the release, sorted for reproducible output. */
export function releaseFiles(distDir) {
  return fs
    .readdirSync(distDir)
    .filter((name) => RELEASE_ASSET_PATTERN.test(name))
    .sort();
}

/** Create a ZIP archive (deflate for text, store for already compressed files). */
export function createZip(entries) {
  const locals = [];
  const centrals = [];
  let offset = 0;
  for (const { name, data } of entries) {
    const nameBytes = Buffer.from(name, 'utf8');
    const precompressed = /\.(?:gz|br)$/.test(name);
    const body = precompressed ? data : zlib.deflateRawSync(data, { level: 9 });
    const method = precompressed ? 0 : 8;
    const crc = crc32(data);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6); // UTF-8 names
    local.writeUInt16LE(method, 8);
    local.writeUInt16LE(DOS_TIME, 10);
    local.writeUInt16LE(DOS_DATE, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(body.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBytes.length, 26);
    local.writeUInt16LE(0, 28);
    locals.push(local, nameBytes, body);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(method, 10);
    central.writeUInt16LE(DOS_TIME, 12);
    central.writeUInt16LE(DOS_DATE, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(body.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(nameBytes.length, 28);
    central.writeUInt32LE(offset, 42);
    centrals.push(central, nameBytes);

    offset += local.length + nameBytes.length + body.length;
  }
  const centralSize = centrals.reduce((sum, part) => sum + part.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, ...centrals, end]);
}

/** Read entry names and contents back (used by the self-check and tests). */
export function readZip(buffer) {
  const endOffset = buffer.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (endOffset < 0) throw new Error('ZIP end of central directory not found');
  const count = buffer.readUInt16LE(endOffset + 10);
  let cursor = buffer.readUInt32LE(endOffset + 16);
  const entries = [];
  for (let i = 0; i < count; i++) {
    if (buffer.readUInt32LE(cursor) !== 0x02014b50) throw new Error('Corrupt ZIP central directory');
    const method = buffer.readUInt16LE(cursor + 10);
    const crc = buffer.readUInt32LE(cursor + 16);
    const compressedSize = buffer.readUInt32LE(cursor + 20);
    const nameLength = buffer.readUInt16LE(cursor + 28);
    const extraLength = buffer.readUInt16LE(cursor + 30);
    const commentLength = buffer.readUInt16LE(cursor + 32);
    const localOffset = buffer.readUInt32LE(cursor + 42);
    const name = buffer.toString('utf8', cursor + 46, cursor + 46 + nameLength);
    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const start = localOffset + 30 + localNameLength + localExtraLength;
    const body = buffer.subarray(start, start + compressedSize);
    const data = method === 8 ? zlib.inflateRawSync(body) : Buffer.from(body);
    if (crc32(data) !== crc) throw new Error(`CRC mismatch for ${name}`);
    entries.push({ name, data });
    cursor += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
}

export function buildReleaseZip(distDir) {
  const names = releaseFiles(distDir);
  if (!names.includes('dashboard-strategy.js'))
    throw new Error('dist/dashboard-strategy.js is missing; run npm run build');
  return createZip(names.map((name) => ({ name, data: fs.readFileSync(path.join(distDir, name)) })));
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const outIndex = process.argv.indexOf('--out');
  const out = path.resolve(
    root,
    outIndex >= 0 ? process.argv[outIndex + 1] : path.join('dist-release', ZIP_ASSET_NAME)
  );
  const distDir = path.join(root, 'dist');
  const zip = buildReleaseZip(distDir);

  // Self-check: every dist file must round-trip byte-identical.
  const expected = releaseFiles(distDir);
  const entries = readZip(zip);
  const names = entries.map((entry) => entry.name);
  if (JSON.stringify(names) !== JSON.stringify(expected)) throw new Error('ZIP entries do not match dist files');
  for (const entry of entries) {
    if (!entry.data.equals(fs.readFileSync(path.join(distDir, entry.name)))) {
      throw new Error(`ZIP entry ${entry.name} differs from dist`);
    }
  }

  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, zip);
  console.log(
    JSON.stringify({ zip: path.relative(root, out).split(path.sep).join('/'), files: names.length, bytes: zip.length })
  );
}
