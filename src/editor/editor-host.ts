import type { Simon42StrategyConfig } from '../types/strategy';

export function dispatchStrategyConfigChanged(host: HTMLElement, config: Simon42StrategyConfig): void {
  host.dispatchEvent(new CustomEvent('config-changed', {
    detail: { config },
    bubbles: true,
    composed: true,
  }));
}
