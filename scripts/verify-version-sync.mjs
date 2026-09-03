import fs from 'node:fs';

const args = new Set(process.argv.slice(2));
const requireTag = args.has('--require-tag');
const tagIndex = process.argv.indexOf('--tag');
const tagArgument = tagIndex >= 0 ? process.argv[tagIndex + 1] : undefined;

if (tagIndex >= 0 && !tagArgument) {
  throw new Error('--tag requires a value');
}

const packageJson = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const packageVersion = packageJson.version;

const strategySource = fs.readFileSync(new URL('../src/dashboard-strategy.ts', import.meta.url), 'utf8');
const strategyVersion = strategySource.match(/const STRATEGY_VERSION = '([^']+)';/)?.[1];

if (!strategyVersion) {
  throw new Error('Could not read STRATEGY_VERSION from src/dashboard-strategy.ts');
}

if (strategyVersion !== packageVersion) {
  throw new Error(
    `src/dashboard-strategy.ts version ${strategyVersion} does not match package.json version ${packageVersion}`,
  );
}

if (requireTag) {
  const actualTag = tagArgument ?? process.env.GITHUB_REF_NAME;
  const expectedTag = `v${packageVersion}`;

  if (!actualTag) {
    throw new Error('GITHUB_REF_NAME is missing for tag verification');
  }

  if (actualTag !== expectedTag) {
    throw new Error(`Git tag ${actualTag} does not match expected ${expectedTag}`);
  }
}

console.log(
  JSON.stringify({
    packageVersion,
    strategyVersion,
    tagChecked: requireTag,
    tag: requireTag ? tagArgument ?? process.env.GITHUB_REF_NAME : undefined,
  }),
);
