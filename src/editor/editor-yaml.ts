// ====================================================================
// Editor YAML gateway
// ====================================================================
// js-yaml is only needed after a user action (typing YAML, opening the card
// picker, running the dashboard check), never for the first editor render.
// It therefore ships as its own `yaml` chunk: the editor starts loading it
// in the background (preloadYaml) and every YAML action runs through
// withYaml(), which runs immediately once the module is there and otherwise
// right after it has loaded. Code inside such an action uses requireYaml().
// ====================================================================

import type * as JsYaml from 'js-yaml';

type YamlModule = Pick<typeof JsYaml, 'load' | 'dump'>;

let yamlModule: YamlModule | undefined;
let pending: Promise<YamlModule> | undefined;

/** Load js-yaml once; later calls share the same promise. */
export function preloadYaml(): Promise<YamlModule> {
  pending ??= import(/* webpackChunkName: "yaml" */ 'js-yaml')
    .then((module) => {
      yamlModule = (module as { default?: YamlModule }).default ?? module;
      return yamlModule;
    })
    .catch((error: unknown) => {
      pending = undefined; // allow a retry on the next action
      throw error;
    });
  return pending;
}

/** The loaded js-yaml module. Only call inside withYaml() or after preloadYaml() resolved. */
export function requireYaml(): YamlModule {
  if (!yamlModule) throw new Error('js-yaml is not loaded yet; wrap the YAML action in withYaml()');
  return yamlModule;
}

/**
 * Run a YAML action: synchronously when js-yaml is loaded (the normal case,
 * since the editor preloads it), otherwise as soon as it has loaded.
 */
export function withYaml(action: () => void): void {
  if (yamlModule) {
    action();
    return;
  }
  void preloadYaml().then(action, () => undefined);
}

interface ParsedEditorYaml {
  parsed_config?: Record<string, any> | Record<string, any>[];
  _yaml_error?: string;
}
function getYamlErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message.split('\n')[0] : 'Ungültiges YAML';
  return message || 'Ungültiges YAML';
}
export function parseEditorYamlConfig(yamlString: string, invalidMessage: string): ParsedEditorYaml {
  if (!yamlString.trim()) return { parsed_config: undefined };

  try {
    const parsed = requireYaml().load(yamlString);
    if (parsed && typeof parsed === 'object') {
      return { parsed_config: parsed as Record<string, any> | Record<string, any>[] };
    }
    return { parsed_config: undefined, _yaml_error: invalidMessage };
  } catch (error: unknown) {
    return { parsed_config: undefined, _yaml_error: getYamlErrorMessage(error) };
  }
}
