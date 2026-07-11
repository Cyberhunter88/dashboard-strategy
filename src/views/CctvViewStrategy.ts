import { Registry } from '../Registry';
import type { HomeAssistant } from '../types/homeassistant';
import type { LovelaceCardConfig, LovelaceSectionConfig, LovelaceViewConfig } from '../types/lovelace';
import { createSectionsView } from '../utils/view-builder';

class DashboardStrategyCctvViewStrategy extends HTMLElement {
  static async generate(config: any, hass: HomeAssistant): Promise<LovelaceViewConfig> {
    const strategyConfig = config.config || {};
    if (!Registry.isCurrent(hass, strategyConfig)) Registry.initialize(hass, strategyConfig);

    const cameras = Registry.getVisibleEntityIdsForDomain('camera').filter((id) => hass.states[id]);
    const byArea = new Map<string, string[]>();
    for (const id of cameras) {
      const entity = Registry.getEntity(id);
      const device = entity?.device_id ? Registry.getDevice(entity.device_id) : undefined;
      const areaId = entity?.area_id || device?.area_id || 'other';
      const list = byArea.get(areaId) || [];
      list.push(id);
      byArea.set(areaId, list);
    }

    const sections: LovelaceSectionConfig[] = [];
    for (const [areaId, ids] of byArea) {
      const areaName = hass.areas[areaId]?.name || 'CCTV';
      const cards: LovelaceCardConfig[] = [
        { type: 'heading', heading: areaName, heading_style: 'title', icon: 'mdi:cctv' },
        ...ids.map((entity) => ({
          type: 'picture-entity', entity, camera_image: entity, camera_view: 'auto',
          show_name: true, show_state: false,
        })),
      ];
      sections.push({ type: 'grid', cards });
    }

    if (strategyConfig.cctv_show_activity === true) {
      const activity = Registry.getVisibleEntityIdsForDomain('binary_sensor').filter((id) => {
        const deviceClass = hass.states[id]?.attributes?.device_class as string | undefined;
        return !!deviceClass && ['motion', 'occupancy', 'doorbell'].includes(deviceClass);
      });
      if (activity.length > 0) {
        sections.push({
          type: 'grid',
          cards: [
            { type: 'heading', heading: 'Activity', heading_style: 'title', icon: 'mdi:motion-sensor' },
            { type: 'history-graph', hours_to_show: 12, entities: activity },
          ],
        });
      }
    }

    return createSectionsView(sections, strategyConfig);
  }
}

customElements.define('ll-strategy-dashboard-strategy-view-cctv', DashboardStrategyCctvViewStrategy);
