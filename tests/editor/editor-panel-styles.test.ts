import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

describe('editor panel styles', () => {
  it('allows expanded picker overlays to escape panel boundaries', () => {
    const source = readFileSync('src/editor/StrategyEditor.ts', 'utf8');

    expect(source).toMatch(/\.section\.panel\s*{[^}]*overflow:\s*visible;/s);
    expect(source).toMatch(/\.section\.panel\.collapsed\s*{[^}]*overflow:\s*hidden;/s);
  });
});
