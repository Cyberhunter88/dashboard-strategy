// ====================================================================
// Climate group member detection
// ====================================================================
// Wrapper climate entities (Better Thermostat, climate groups) control
// one or more physical thermostats. Showing both the wrapper and its
// members renders the same radiator twice, so the Registry hides the
// members while the wrapper itself stays visible.
// ====================================================================

const CLIMATE_PREFIX = 'climate.';

function climateIds(values: unknown, selfId: string): string[] {
  if (!Array.isArray(values)) return [];
  return values.filter(
    (value): value is string => typeof value === 'string' && value.startsWith(CLIMATE_PREFIX) && value !== selfId
  );
}

function betterThermostatMembers(batteries: unknown, selfId: string): string[] {
  let parsed: unknown = batteries;
  if (typeof batteries === 'string') {
    try {
      parsed = JSON.parse(batteries);
    } catch {
      return [];
    }
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return [];
  return climateIds(Object.keys(parsed), selfId);
}

/**
 * Returns the physical climate entities controlled by a wrapper climate entity.
 *
 * - Climate Group Helper exposes `member_entities`.
 * - Home Assistant climate groups expose `entity_id`.
 * - Better Thermostat lists its real thermostats as keys of the `batteries`
 *   attribute (a JSON string); only `climate.*` keys are used.
 */
export function getClimateGroupMembers(
  entityId: string,
  platform: string | undefined,
  attributes: Record<string, unknown> | undefined
): string[] {
  if (!entityId.startsWith(CLIMATE_PREFIX) || !attributes) return [];

  const members = new Set<string>([
    ...climateIds(attributes.member_entities, entityId),
    ...climateIds(attributes.entity_id, entityId),
  ]);
  if (platform === 'better_thermostat') {
    for (const id of betterThermostatMembers(attributes.batteries, entityId)) members.add(id);
  }
  return [...members];
}
