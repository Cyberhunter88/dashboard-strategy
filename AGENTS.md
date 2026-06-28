# Dashboard Strategy - Agent Instructions

Custom Lovelace Dashboard Strategy for Home Assistant. The project generates dynamic dashboards from Home Assistant area, device, entity, floor, and state metadata with a configurable editor. This code is user-facing and distributed through HACS, so keep changes conservative, stable, and tested.

> Fork rename: this fork is `Cyberhunter88/dashboard-strategy` and intentionally uses its own public custom element names so it can coexist with the original `TheRealSimon42/dashboard-strategy`.

## Public Names

Do not regress these public identifiers:

- Dashboard config type: `custom:dashboard-strategy`
- Main strategy element: `ll-strategy-dashboard-strategy`
- View strategies: `ll-strategy-dashboard-strategy-view-{overview,lights,covers,security,batteries,climate,room}`
- Cards:
  - `dashboard-strategy-summary-card`
  - `dashboard-strategy-lights-group-card`
  - `dashboard-strategy-covers-group-card`
  - `dashboard-strategy-batteries-card`
  - `dashboard-strategy-area-card`
  - `dashboard-strategy-camera-card`
  - `dashboard-strategy-editable-card`
- Editor: `dashboard-strategy-editor`
- HACS filename: `dashboard-strategy.js`
- HACS resource path: `/hacsfiles/dashboard-strategy/`
- HACS display name in `hacs.json`: `Dashboard Strategy`

Existing dashboards must use:

```yaml
strategy:
  type: custom:dashboard-strategy
```

## Architecture

- Language: TypeScript, ES2020, strict mode.
- Build: Webpack with code-split chunks.
- Distribution: HACS custom repository, compiled files in `dist/`.
- Runtime data source: the Home Assistant `hass` object, especially `hass.entities`, `hass.devices`, `hass.areas`, `hass.floors`, and `hass.states`.

Main source layout:

```text
src/
├── dashboard-strategy.ts       # entry point, version log, custom element registration, generate()
├── Registry.ts                 # static singleton registry and pre-filtered lookup maps
├── cards/                      # Lit/custom card implementations
│   ├── AreaNavigationCard.ts
│   ├── CameraCard.ts
│   ├── CoversGroupCard.ts
│   ├── EditableCard.ts
│   ├── LightsGroupCard.ts
│   └── SummaryCard.ts
├── editor/                     # graphical strategy editor
│   ├── StrategyEditor.ts       # largest file; state, rendering, config mutations
│   ├── editor-handlers.ts
│   ├── editor-styles.ts
│   └── editor-template.ts
├── sections/                   # overview, areas, weather, energy section builders
├── translations/               # de/en i18n strings
├── types/                      # HA, registry, Lovelace, and strategy config types
├── utils/                      # filters, ordering, localization, card helpers
└── views/                      # overview, utility, and room view strategies
```

Important build output:

```text
dist/
├── dashboard-strategy.js
├── dashboard-strategy-core.<hash>.js
├── dashboard-strategy-lit.<hash>.js
├── dashboard-strategy-views.<hash>.js
├── dashboard-strategy-editor.<hash>.js
├── *.js.gz
├── *.js.br
└── *.LICENSE.txt
```

## Data Flow

1. `src/dashboard-strategy.ts` registers the main element immediately.
2. It starts loading all strategy chunks early, before `generate()` is called.
3. `generate(config, hass)` waits for modules, initializes `Registry`, resolves visible areas, and pre-resolves all views.
4. `Registry.initialize(hass, config)` builds raw and visible lookup maps from the `hass` object.
5. Overview, utility, and room strategies generate native Lovelace view configs.
6. Custom cards render reactive UI and receive frequent `hass` updates from Home Assistant.

## Registry Rules

`Registry` is a static singleton. Prefer its lookup APIs over rescanning raw Home Assistant registries.

It builds:

| Map | Key | Value | Scope |
| --- | --- | --- | --- |
| `_entityById` | `entity_id` | entity registry entry | raw |
| `_deviceById` | `device_id` | device registry entry | raw |
| `_entitiesByDevice` | `device_id` | `entity_id[]` | raw |
| `_entitiesByDomain` | domain | `entity_id[]` | raw with state |
| `_entitiesByArea` | `area_id` | entity registry entries | raw |
| `_visibleEntitiesByArea` | `area_id` | entity registry entries | pre-filtered |
| `_visibleEntitiesByDomain` | domain | `entity_id[]` | pre-filtered |
| `_configDiagEntitiesByArea` | `area_id` | config/diagnostic entries | config/diagnostic only |

Visibility filtering happens once in `Registry._isEntityVisible()`:

- entity is not labeled `no_dboard`
- entity is not hidden by `areas_options.*.groups_options.*.hidden`
- entity is not hidden in the HA entity registry
- entity category is not `config` or `diagnostic`
- entity has a current state where required by the map builder

`Registry.initialize()` is idempotent for state-only updates, but reinitializes when registry object references or the strategy config object change.

## Entity Registry Is Authoritative

Many important properties are registry-only. Always read these from `hass.entities[id]` or `Registry.getEntity(id)`, not from state attributes:

| Property | Registry | State attributes |
| --- | --- | --- |
| `hidden_by` | authoritative | usually unavailable |
| `disabled_by` | authoritative when present | usually unavailable |
| `entity_category` | authoritative | sometimes copied, often missing |
| `platform` | authoritative | unavailable |
| `device_id` | authoritative | unavailable |

Summary cards often start from `hass.states`, so they must look up registry entries before filtering. Group cards and room builders usually receive or fetch pre-filtered registry entries.

## Configuration Surface

Keep `src/types/strategy.ts`, editor rendering, translations, README, and generated behavior in sync when adding or changing options.

Current main config areas:

- Appearance: `theme`
- Overview toggles: `show_clock_card`, `alarm_entity`, `show_search_card`, `show_light_summary`, `show_covers_summary`, `show_security_summary`, `show_battery_summary`, `show_climate_summary`
- Weather and energy: `show_weather`, `weather_entity`, `show_energy`, `energy_link_dashboard`
- Summary behavior: `summaries_columns`, `show_partially_open_covers`, `hide_mobile_app_batteries`, `battery_critical_threshold`, `battery_low_threshold`
- Availability: `hide_unavailable_entities`
- Layout: `overview_layout`, `sections_order`, `weather_start_order`, `weather_start_layout_items`, `weather_start_blocks_config`
- Areas and floors: `group_by_floors`, `use_default_area_sort`, `areas_display.hidden`, `areas_display.order`, `areas_display.nav_items`
- Area cards: `show_switches_on_areas`, `show_alerts_on_areas`
- Room views: `show_room_views`, `show_locks_in_rooms`, `show_automations_in_rooms`, `show_scripts_in_rooms`, `show_ups_in_rooms`, `show_window_contacts_in_rooms`, `show_door_contacts_in_rooms`, `nested_light_groups`
- Room entities: `room_pin_entities`, `room_pins_show_state`, `room_pins_hide_last_changed`
- Per-area options: `areas_options.{areaId}.groups_options`, `areas_options.{areaId}.stacks_order`, `areas_options.{areaId}.custom_cards`
- Custom content: `custom_cards`, `custom_cards_heading`, `custom_cards_icon`, `custom_sections`, `custom_badges`, `custom_views`

## Feature Notes

- Overview has two layouts: default sections and `weather_start`.
- Weather start supports built-in blocks, free layout items, area/floor placement, custom cards, custom sections, and YAML overrides per block.
- Overview custom cards can target `custom_cards`, `overview`, `areas`, `weather`, or `energy`.
- Custom sections are full Lovelace sections with their own title/icon.
- Custom badges render in the overview header next to person badges.
- Per-room custom cards support `yaml`, guided `tile`, and full `section` modes, with `top` or `bottom` placement.
- Room stack order is per area via `areas_options.{areaId}.stacks_order`.
- Room views can include lights, covers, covers_window, locks, climate, media, scenes, automations, scripts, switches, vacuums, energy sensors, cameras, UPS groups, room pins, and sensor badges.
- UPS detection is enabled by default and should only use visible pre-filtered entities.
- Window and door contact badges are opt-in.
- Temperature and humidity on area cards are only shown when explicitly assigned in HA area settings.
- Room detail temperature and humidity also use explicit area assignments for primary badges; other sensor badges are auto-detected.
- Alert icons on area cards use a curated binary sensor device class allowlist.
- Adaptive tile card features are centralized in `src/utils/tile-card-utils.ts`.

## Performance Constraints

Do not undo these decisions:

- The entry chunk must stay tiny and register `ll-strategy-dashboard-strategy` immediately.
- Keep code splitting: entry, lit, core, views, editor.
- Keep content-hashed chunk filenames for cache busting.
- Start chunk loading immediately in the entry point.
- Pre-resolve views in `generate()` instead of returning lazy strategy stubs.
- Use `Registry` pre-filtered maps instead of repeated per-card scans.
- Area cards must receive only controls and sensor classes that actually exist.
- Tile cards should receive only features supported by the entity.
- Custom cards should stay reactive and avoid full DOM rebuilds on every `hass` update.
- Lights and covers group cards use tile card pooling; do not revert to repeated `innerHTML` rebuilds.

## Complexity Hotspots

Use extra care in:

1. `src/editor/StrategyEditor.ts` - editor state, expand persistence, YAML parsing, config-changed events.
2. `src/views/RoomViewStrategy.ts` - entity categorization, badge logic, camera logic, stack ordering, custom room content.
3. `src/Registry.ts` - central filtering and all lookup maps.
4. `src/utils/name-utils.ts` and `src/utils/order-utils.ts` - sorting and merge behavior used across views.
5. `src/utils/tile-card-utils.ts` - native tile features across many domains.
6. `src/cards/SummaryCard.ts`, `LightsGroupCard.ts`, `CoversGroupCard.ts` - reactive update and pooling behavior.

## Development Workflow

Before editing:

- Check working tree status.
- Do not revert user changes or generated files you did not create.
- If `dist/` is already dirty, treat it as user/generated state and avoid cleanup unless asked.

Common checks:

```bash
npm run typecheck
npm run lint
npm run build
```

Other scripts:

```bash
npm run build-dev
npm run watch
npm run format:check
npm run format
npm run lint:fix
```

For source changes, run at least typecheck and lint when practical. For release-ready work, run the production build and include updated `dist/` files.

Live Home Assistant validation is expected before pushing user-facing dashboard behavior.

## Git and Release Workflow

Never commit directly to `main`. Use a feature branch.

Feature flow:

1. Branch from `main`.
2. Implement and test.
3. Build production output.
4. Commit source and `dist/` together when the change affects the bundle.
5. Push the feature branch.
6. Open a PR to `main`.
7. Wait for HACS validation and CI.
8. Merge, then create the release/tag from the merged commit when requested.

Version checklist for releases:

| File | Field |
| --- | --- |
| `package.json` | `version` |
| `package-lock.json` | lockfile version metadata |
| `src/dashboard-strategy.ts` | `STRATEGY_VERSION` |
| GitHub release/tag | `v<version>` |

`STRATEGY_VERSION` is logged in the browser console as `Dashboard Strategy vX.Y.Z loaded`.

Beta releases are GitHub pre-releases, e.g. `v1.3.4-beta.10`. Patch bumps are for bugfix-only releases; minor bumps are for feature releases.

## Community PR Porting

When porting a PR from the old/original codebase:

1. Manually port the behavior into the current TypeScript structure.
2. Preserve the fork's public names.
3. Credit the original author with `Co-Authored-By: Name <user@users.noreply.github.com>` in the commit when appropriate.
4. Reference the issue or PR in the commit/PR body when useful.
5. Update README, translations, editor UI, types, and dist as needed.

## References

Local read-only reference checkouts may exist next to this repo:

| Path | Source | Use |
| --- | --- | --- |
| `../references/ha-strategies/` | Home Assistant frontend strategies | official strategy patterns |
| `../references/mushroom-strategy/` | DigiLive mushroom strategy | community strategy patterns |
| `../references/hacs-docs/` | HACS documentation | publishing and HACS metadata |

For Home Assistant release notes, prefer the Markdown posts in:

```text
https://github.com/home-assistant/home-assistant.io/blob/rc/source/_posts/
```

Use current upstream sources before making claims about recent Home Assistant frontend behavior.
