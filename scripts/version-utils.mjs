import fs from 'node:fs';

export const VERSION_FILE_NAME = 'package.json';
const versionFileUrl = new URL(`../${VERSION_FILE_NAME}`, import.meta.url);

const semverPattern =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;

export function parseVersion(packageJson) {
  const version = packageJson?.version;
  const match = typeof version === 'string' ? semverPattern.exec(version) : null;
  if (!match || match[0] !== version || match[4]?.split('.').some((part) => /^0\d+$/.test(part))) {
    throw new Error(`${VERSION_FILE_NAME}.version must be a SemVer version, received: ${JSON.stringify(version)}`);
  }
  return version;
}

export function readVersion() {
  return parseVersion(JSON.parse(fs.readFileSync(versionFileUrl, 'utf8')));
}

export function shouldRelease(previousPackage, currentPackage, manual = false) {
  const version = parseVersion(currentPackage);
  return manual || previousPackage === null || parseVersion(previousPackage) !== version;
}

export function verifyVersionFields(version, lockfile, strategyVersion) {
  if (lockfile.version !== version || lockfile.packages?.['']?.version !== version || strategyVersion !== version) {
    throw new Error('package.json, package-lock.json and STRATEGY_VERSION must match');
  }
}

export function versionTag(version) {
  return `v${version}`;
}
