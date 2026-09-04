import fs from 'node:fs';

export const VERSION_FILE_NAME = 'VERSION.txt';
const versionFileUrl = new URL(`../${VERSION_FILE_NAME}`, import.meta.url);

const semverPattern =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;

export function readVersion() {
  const version = fs.readFileSync(versionFileUrl, 'utf8').trim();
  if (!semverPattern.test(version)) {
    throw new Error(`${VERSION_FILE_NAME} must contain exactly one SemVer version, received: ${JSON.stringify(version)}`);
  }

  return version;
}

export function versionTag(version) {
  return `v${version}`;
}
