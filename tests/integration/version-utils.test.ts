import { describe, expect, it } from 'vitest';
import { execFileSync, spawnSync } from 'node:child_process';
import { parseVersion, shouldRelease, verifyVersionFields, versionTag } from '../../scripts/version-utils.mjs';

describe('package version and release decisions', () => {
  it.each(['1.33.0', '1.34.0-beta.1', '2.0.0-rc.0+build.12'])('accepts %s', (version) => {
    expect(parseVersion({ version })).toBe(version);
    expect(versionTag(version)).toBe(`v${version}`);
  });
  it.each([undefined, 1, '', 'v1.2.3', '01.2.3', '1.2', '1.2.3-beta.01', '1.2.3-beta-foo.01', '1.2.3\n'])('rejects invalid version %s', (version) => {
    expect(() => parseVersion({ version })).toThrow();
  });
  it('runs the actual workflow decision without dependencies or publication', () => {
    const before = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
    const run = (event: string, sha: string) => spawnSync(process.execPath, ['scripts/release-decision.mjs'], {
      encoding: 'utf8', env: { ...process.env, EVENT_NAME: event, BEFORE_SHA: sha, GITHUB_OUTPUT: '' },
    });
    const unchanged = run('push', before);
    expect(unchanged.status).toBe(0);
    const decision = JSON.parse(unchanged.stdout);
    expect(decision.release).toBe(decision.previousVersion !== decision.version);
    const manual = run('workflow_dispatch', 'missing-history');
    expect(manual.status).toBe(0);
    expect(JSON.parse(manual.stdout).release).toBe(true);
    expect(run('push', 'missing-history').status).not.toBe(0);
  });
  it('skips dependency changes and permits version changes, prereleases and manual recovery', () => {
    const previous = { version: '1.33.0', dependencies: {} };
    expect(shouldRelease(previous, { ...previous, dependencies: { lit: '^3.3.2' } })).toBe(false);
    expect(shouldRelease(previous, { version: '1.33.1' })).toBe(true);
    expect(shouldRelease(previous, { version: '1.34.0-beta.1' })).toBe(true);
    expect(shouldRelease(previous, previous, true)).toBe(true);
    expect(shouldRelease(null, previous)).toBe(true);
  });
  it('checks both lockfile versions and the runtime version', () => {
    const lock = { version: '1.33.0', packages: { '': { version: '1.33.0' } } };
    expect(() => verifyVersionFields('1.33.0', lock, '1.33.0')).not.toThrow();
    expect(() => verifyVersionFields('1.33.1', lock, '1.33.0')).toThrow();
    expect(() => verifyVersionFields('1.33.0', { ...lock, version: '1.32.0' }, '1.33.0')).toThrow();
    expect(() => verifyVersionFields('1.33.0', { ...lock, packages: {} }, '1.33.0')).toThrow();
    expect(() => verifyVersionFields('1.33.0', lock, '1.32.0')).toThrow();
  });
});
