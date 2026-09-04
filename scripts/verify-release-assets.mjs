import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { readVersion, versionTag, VERSION_FILE_NAME } from './version-utils.mjs';

const getArgument = (name) => {
  const index = process.argv.indexOf(name);
  if (index < 0) {
    return undefined;
  }

  const value = process.argv[index + 1];
  if (!value || value.startsWith('--')) {
    throw new Error(`${name} requires a value`);
  }

  return value;
};

const tag = getArgument('--tag') ?? process.env.RELEASE_TAG ?? process.env.GITHUB_REF_NAME;
const repository = getArgument('--repo') ?? process.env.GITHUB_REPOSITORY;
const requireDraft = process.argv.includes('--require-draft');
const requirePublished = process.argv.includes('--require-published');

if (!tag) {
  throw new Error('A release tag is required via --tag, RELEASE_TAG, or GITHUB_REF_NAME');
}

if (!repository) {
  throw new Error('A GitHub repository is required via --repo or GITHUB_REPOSITORY');
}

if (requireDraft && requirePublished) {
  throw new Error('--require-draft and --require-published cannot be used together');
}

const root = new URL('../', import.meta.url);
const distUrl = new URL('dist/', root);
const version = readVersion();
const expectedTag = versionTag(version);
if (tag !== expectedTag) {
  throw new Error(`Release tag ${tag} does not match ${VERSION_FILE_NAME} version ${version}`);
}
const releaseAssetPattern = /\.js(?:\.gz|\.br)?$|\.js\.LICENSE\.txt$/;
const expectedAssets = fs
  .readdirSync(distUrl)
  .filter((name) => releaseAssetPattern.test(name))
  .sort();

const release = JSON.parse(
  execFileSync(
    'gh',
    ['release', 'view', tag, '--repo', repository, '--json', 'assets,isDraft,isPrerelease,publishedAt,tagName'],
    { encoding: 'utf8' }
  )
);

if (release.tagName !== tag) {
  throw new Error(`GitHub returned release ${release.tagName}, expected ${tag}`);
}

const expectedPrerelease = version.includes('-');
if (release.isPrerelease !== expectedPrerelease) {
  throw new Error(
    `Release ${tag} prerelease=${release.isPrerelease} does not match ${VERSION_FILE_NAME} ${version}`
  );
}

if (requireDraft && !release.isDraft) {
  throw new Error(`Release ${tag} is not a draft; refusing to treat it as pre-publication`);
}

if (requirePublished && (release.isDraft || !release.publishedAt)) {
  throw new Error(`Release ${tag} is not published`);
}

const actualAssets = release.assets.map((asset) => asset.name).sort();
const expectedSet = new Set(expectedAssets);
const actualSet = new Set(actualAssets);
const missing = expectedAssets.filter((name) => !actualSet.has(name));
const extra = actualAssets.filter((name) => !expectedSet.has(name));

if (missing.length > 0 || extra.length > 0) {
  const details = [
    missing.length > 0 ? `missing: ${missing.join(', ')}` : undefined,
    extra.length > 0 ? `unexpected: ${extra.join(', ')}` : undefined,
  ]
    .filter(Boolean)
    .join('; ');

  throw new Error(`Release ${tag} does not contain the exact dist asset set${details ? ` (${details})` : ''}`);
}

console.log(
  JSON.stringify({
    tag,
    draft: release.isDraft,
    prerelease: release.isPrerelease,
    publishedAt: release.publishedAt,
    assets: actualAssets.length,
  })
);
