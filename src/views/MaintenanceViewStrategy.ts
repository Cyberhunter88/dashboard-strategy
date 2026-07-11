import { Registry } from '../Registry';
import type { HomeAssistant } from '../types/homeassistant';
import type { LovelaceCardConfig, LovelaceSectionConfig, LovelaceViewConfig } from '../types/lovelace';
import { collectMaintenanceEntities } from '../utils/maintenance-utils';
import { createSectionsView } from '../utils/view-builder';

class DashboardStrategyMaintenanceViewStrategy extends HTMLElement {
  static async generate(config: any, hass: HomeAssistant): Promise<LovelaceViewConfig> {
    const strategyConfig = config.config || {};
    if (!Registry.isCurrent(hass, strategyConfig)) Registry.initialize(hass, strategyConfig);
    const maintenance = collectMaintenanceEntities(hass);
    const sections: LovelaceSectionConfig[] = [];
    const add = (heading: string, icon: string, ids: string[], color?: string): void => {
      if (ids.length === 0) return;
      const cards: LovelaceCardConfig[] = [
        { type: 'heading', heading, heading_style: 'title', icon },
        ...ids.map((entity) => ({ type: 'tile', entity, vertical: false, ...(color ? { color } : {}) })),
      ];
      sections.push({ type: 'grid', cards });
    };
    add('Updates', 'mdi:update', maintenance.updates, 'orange');
    add('Unavailable', 'mdi:alert-circle-outline', maintenance.unavailable, 'red');
    sections.push({ type: 'grid', cards: [{ type: 'custom:dashboard-strategy-video-tip-card' }] });
    return createSectionsView(sections, strategyConfig);
  }
}

customElements.define('ll-strategy-dashboard-strategy-view-maintenance', DashboardStrategyMaintenanceViewStrategy);
