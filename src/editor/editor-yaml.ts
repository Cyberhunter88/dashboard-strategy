import yaml from 'js-yaml';
interface ParsedEditorYaml {
  parsed_config?: Record<string, any> | Record<string, any>[];
  _yaml_error?: string;
}
function getYamlErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message.split('\n')[0] : 'UngÃ¼ltiges YAML';
  return message || 'UngÃ¼ltiges YAML';
}
export function parseEditorYamlConfig(yamlString: string, invalidMessage: string): ParsedEditorYaml {
  if (!yamlString.trim()) return { parsed_config: undefined };

  try {
    const parsed = yaml.load(yamlString);
    if (parsed && typeof parsed === 'object') {
      return { parsed_config: parsed as Record<string, any> | Record<string, any>[] };
    }
    return { parsed_config: undefined, _yaml_error: invalidMessage };
  } catch (error: unknown) {
    return { parsed_config: undefined, _yaml_error: getYamlErrorMessage(error) };
  }
}
