import { describe, expect, it } from 'vitest';
import { buildCompleteCustomSection, normalizeSectionYaml } from './CustomSections';

describe('custom section YAML', () => {
  it('passes complete section properties through and filters invalid cards', () => {
    expect(buildCompleteCustomSection({
      type: 'grid', column_span: 2,
      visibility: [{ condition: 'state', entity: 'input_boolean.show', state: 'on' }],
      cards: [{ type: 'tile', entity: 'light.kitchen' }, { entity: 'sensor.invalid' }],
    })).toMatchObject({ type: 'grid', column_span: 2, cards: [{ type: 'tile', entity: 'light.kitchen' }] });
  });

  it('wraps card lists and single cards', () => {
    expect(normalizeSectionYaml([{ type: 'markdown', content: 'hello' }])?.cards).toHaveLength(1);
    expect(buildCompleteCustomSection({ type: 'tile', entity: 'light.kitchen' })?.cards).toHaveLength(1);
  });

  it('drops empty or malformed YAML values', () => {
    expect(buildCompleteCustomSection(null)).toBeNull();
    expect(buildCompleteCustomSection({ type: 'grid', cards: [{ entity: 'sensor.invalid' }] })).toBeNull();
  });
});
