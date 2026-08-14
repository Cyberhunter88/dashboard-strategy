// ====================================================================
// VIEW STRATEGY — LIGHTS (reactive group cards)
// ====================================================================

import type { LovelaceViewConfig } from '../types/lovelace';
import { createSectionsView } from '../utils/view-builder';

class Simon42ViewLightsStrategy extends HTMLElement {
  static async generate(config: any, _hass: any): Promise<LovelaceViewConfig> {
    const dashboardConfig = config.dashboardConfig || config.config || {};
    const groupByFloors = dashboardConfig.group_lights_by_floors === true;
    const groupByAreas = dashboardConfig.group_lights_by_areas === true;
    const nestedGroups = dashboardConfig.nested_light_groups === true;

    return createSectionsView(
      [
        {
          type: 'grid',
          cards: [
            {
              type: 'custom:dashboard-strategy-lights-group-card',
              entities: config.entities,
              config: config.config,
              group_type: 'on',
              group_by_floors: groupByFloors,
              group_by_areas: groupByAreas,
              nested_groups: nestedGroups,
            },
            {
              type: 'custom:dashboard-strategy-lights-group-card',
              entities: config.entities,
              config: config.config,
              group_type: 'off',
              group_by_floors: groupByFloors,
              group_by_areas: groupByAreas,
              nested_groups: nestedGroups,
            },
          ],
        },
      ],
      dashboardConfig
    );
  }
}

customElements.define('ll-strategy-dashboard-strategy-view-lights', Simon42ViewLightsStrategy);
