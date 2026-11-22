import { describe, expect, it, vi } from 'vitest';

describe('lazy js-yaml gateway', () => {
  it('defers a YAML action until js-yaml has loaded, then runs later actions synchronously', async () => {
    vi.resetModules();
    const gateway = await import('./editor-yaml');
    expect(() => gateway.requireYaml()).toThrow(/not loaded/);

    const deferred = vi.fn(() => gateway.requireYaml().load('a: 1'));
    gateway.withYaml(deferred);
    expect(deferred).not.toHaveBeenCalled();
    await gateway.preloadYaml();
    await vi.waitFor(() => expect(deferred).toHaveBeenCalledTimes(1));
    expect(deferred).toHaveReturnedWith({ a: 1 });

    const immediate = vi.fn();
    gateway.withYaml(immediate);
    expect(immediate).toHaveBeenCalledTimes(1);
  });

  it('shares one load and parses editor YAML after loading', async () => {
    vi.resetModules();
    const gateway = await import('./editor-yaml');
    const first = gateway.preloadYaml();
    expect(gateway.preloadYaml()).toBe(first);
    await first;
    expect(gateway.parseEditorYamlConfig('type: tile\nentity: light.x', 'invalid')).toEqual({
      parsed_config: { type: 'tile', entity: 'light.x' },
    });
    expect(gateway.parseEditorYamlConfig('just text', 'invalid')).toEqual({
      parsed_config: undefined,
      _yaml_error: 'invalid',
    });
    expect(gateway.requireYaml().dump({ type: 'tile' }).trim()).toBe('type: tile');
  });

  it('copies a YAML-backed item with its parse result and error', async () => {
    vi.resetModules();
    const gateway = await import('./editor-yaml');
    await gateway.preloadYaml();
    const item = { title: 'Card', yaml: 'old: 1', parsed_config: { old: 1 } };
    const valid = gateway.withParsedYaml(item, 'type: tile', 'invalid');
    expect(valid).toEqual({
      title: 'Card',
      yaml: 'type: tile',
      parsed_config: { type: 'tile' },
      _yaml_error: undefined,
    });
    expect(item.yaml).toBe('old: 1');
    const invalid = gateway.withParsedYaml(item, 'text', 'must be an object');
    expect(invalid).toEqual({
      title: 'Card',
      yaml: 'text',
      parsed_config: undefined,
      _yaml_error: 'must be an object',
    });
  });
});
