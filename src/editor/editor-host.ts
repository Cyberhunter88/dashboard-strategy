import type { Simon42StrategyConfig } from '../types/strategy';
import type { HomeAssistant } from '../types/homeassistant';
import type { AreaRegistryEntry } from '../types/registries';
import type { TemplateResult } from 'lit';

export interface StrategyEditorHost {
  _hass: HomeAssistant | null;
  _config: Simon42StrategyConfig;
  _getSortedAreas(): AreaRegistryEntry[];
  _renderCheckbox(id: string, label: string, checked: boolean, change: (checked: boolean) => void): TemplateResult;
  _fireConfigChanged(config: Simon42StrategyConfig): void;
}

export function dispatchStrategyConfigChanged(host: HTMLElement, config: Simon42StrategyConfig): void {
  host.dispatchEvent(new CustomEvent('config-changed', {
    detail: { config },
    bubbles: true,
    composed: true,
  }));
}
