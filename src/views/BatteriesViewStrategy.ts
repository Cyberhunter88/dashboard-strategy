// ====================================================================
// VIEW STRATEGY — BATTERIES (Battery Status Overview)
// ====================================================================

import type { HomeAssistant } from '../types/homeassistant';
import type { LovelaceViewConfig } from '../types/lovelace';
import { Registry } from '../Registry';

class Simon42ViewBatteriesStrategy extends HTMLElement {
  static async generate(config: any, hass: HomeAssistant): Promise<LovelaceViewConfig> {
    // Ensure Registry is initialized (idempotent — no-op if already done)
    const strategyConfig = config.config || {};
    if (!Registry.isCurrent(hass, strategyConfig)) {
      Registry.initialize(hass, strategyConfig);
    }

    return {
      type: 'sections',
      max_columns: 4,
      sections: [
        {
          type: 'grid',
          column_span: 4,
          cards: [
            {
              type: 'custom:dashboard-strategy-batteries-card',
              config: strategyConfig,
              grid_options: { columns: 'full', rows: 'auto' },
            },
          ],
        },
      ],
    };
  }
}

customElements.define('ll-strategy-dashboard-strategy-view-batteries', Simon42ViewBatteriesStrategy);
