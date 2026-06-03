# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Dashboard Strategy

Custom Lovelace Dashboard Strategy for Home Assistant. Generates dynamic dashboards from area/device/entity metadata with flexible user configuration. This is a fork (`Cyberhunter88/dashboard-strategy`) of the original `TheRealSimon42/dashboard-strategy` — it registers its own global custom element names to avoid collision when both are installed in HA simultaneously.

> **Fork-specific identifiers (breaking change from original):**
> - Dashboard-Config-Typ: `custom:dashboard-strategy` (vorher `custom:simon42-dashboard`)
> - Haupt-Strategy-Element: `ll-strategy-dashboard-strategy`
> - View-Strategien: `ll-strategy-dashboard-strategy-view-{overview,lights,covers,security,batteries,climate,room}`
> - Cards: `dashboard-strategy-{summary,lights-group,covers-group}-card`
> - Editor: `dashboard-strategy-editor`
> - Build-Output / HACS-`filename`: `dashboard-strategy.js`; `publicPath` / Resource-URL: `/hacsfiles/dashboard-strategy/`
> - HACS-Anzeigename (`hacs.json` `name`): `Dashboard Strategy`
>
> Internal JS class names (`Simon42DashboardStrategy` etc.) remain JS-internal and cause no global collision. Source filenames under `src/` use the fork name (`dashboard-strategy.ts` etc.) — invisible to HA/HACS.

## Build Commands

```bash
npm run build       # Production (minified, no source maps)
npm run build-dev   # Development (source maps)
npm run watch       # Dev + auto-rebuild on file changes
npm run lint        # ESLint (TypeScript)
npm run lint:fix    # ESLint with auto-fix
npm run format      # Prettier format
npm run format:check  # Prettier check (CI)
```

No test suite exists — testing is done manually on a live HA instance.

## Architecture

**Language:** TypeScript (ES2020, strict mode)  
**Build:** Webpack → code-split chunks (main + lit + core + views + editor on-demand)  
**Distribution:** HACS-compatible (Custom Repository)

### Module Overview

```
src/
├── dashboard-strategy.ts    # Entry point: generate(config, hass) → {title, views[]}
├── Registry.ts              # Singleton registry (synchronous init from hass object, pre-computed Maps)
├── types/                   # Type definitions
│   ├── homeassistant.ts     #   HA interfaces (hass object, callWS, formatters)
│   ├── registries.ts        #   Entity/device/area/floor registry types
│   ├── strategy.ts          #   Strategy config types
│   └── lovelace.ts          #   Lovelace card/view/section/badge types
├── utils/
│   ├── entity-filter.ts     #   Entity collection (collectPersons, findWeatherEntity, findDummySensor)
│   ├── name-utils.ts        #   Name/entity helpers (stripAreaName, getVisibleAreas, sortByLastChanged)
│   ├── badge-builder.ts     #   Person badge creation
│   └── view-builder.ts      #   View generation helpers
├── sections/
│   ├── OverviewSection.ts   #   Clock, alarm, search, summaries, favorites
│   ├── AreasSection.ts      #   Area cards (with optional floor grouping)
│   └── WeatherEnergySection.ts  # Weather forecast + energy distribution
├── cards/                   # LitElement custom cards (reactive, tile card pooling)
│   ├── SummaryCard.ts       #   Reactive summary tiles (lights, covers, security, batteries, climate)
│   ├── LightsGroupCard.ts   #   On/off light grouping (heading badges + tile card pool + floor grouping)
│   └── CoversGroupCard.ts   #   Open/closed cover grouping (heading badges + tile card pool)
├── views/                   # Specialized view strategies
│   ├── RoomViewStrategy.ts        # Room detail view (15+ device classes, Reolink + Aqara cameras)
│   ├── LightsViewStrategy.ts      # Light aggregation (optional floor grouping)
│   ├── CoversViewStrategy.ts      # Cover/blind aggregation
│   ├── SecurityViewStrategy.ts    # Security overview (locks, doors, windows, garages, smoke/gas detectors)
│   ├── BatteriesViewStrategy.ts   # Battery status (critical/low/ok)
│   └── ClimateViewStrategy.ts     # Climate/thermostat overview (heating/cooling/idle/off)
└── editor/                  # Configuration UI
    ├── StrategyEditor.ts    #   Editor class (largest file — config form, state management)
    ├── editor-handlers.ts   #   Event listeners, drag/drop area reordering
    ├── editor-template.ts   #   HTML template generation
    └── editor-styles.ts     #   CSS styling
```

Build output (`dist/`):
```
dashboard-strategy.js                   # Entry point (instant custom element registration)
dashboard-strategy-core.<hash>.js       # Registry, cards, utils
dashboard-strategy-lit.<hash>.js        # Lit framework (shared)
dashboard-strategy-views.<hash>.js      # All view strategies
dashboard-strategy-editor.<hash>.js     # Editor (lazy-loaded on demand)
*.js.gz / *.js.br                       # Pre-compressed variants
```

### Data Flow

1. **Entry Point** registers custom elements, starts async chunk loading, calls `Registry.initialize(hass, config)` synchronously
2. **Registry** reads entity/device/area data from `hass` object (synchronous), builds pre-computed Maps/Sets
3. **Utils** collect persons, weather, favorites using pre-filtered Registry methods
4. **Section Builders** generate overview, areas, weather/energy sections
5. **View Builders** generate utility views (lights, covers, security, batteries, climate) + per-area room views
6. **Custom Cards** render reactive UI (real-time `hass` updates via `set hass()`)

### Registry — Core Design

The Registry is a **static singleton** (no instance, all static members). Initialized once, then provides O(1) lookups everywhere.

**Synchronous Init** (reads directly from hass object, no WebSocket needed):
```
Object.values(hass.entities)  → EntityRegistryDisplayEntry[]
Object.values(hass.devices)   → DeviceRegistryEntry[]
Object.values(hass.areas)     → AreaRegistryEntry[]
```
Called once in `generate()` before views are returned. Idempotent — subsequent calls in view strategies are no-ops.

**Pre-Computed Maps:**

| Map | Key | Value | Filtered? |
|-----|-----|-------|-----------|
| `_entityById` | entity_id | EntityRegistryDisplayEntry | Raw |
| `_deviceById` | device_id | DeviceRegistryEntry | Raw |
| `_entitiesByDevice` | device_id | entity_id[] | Raw |
| `_entitiesByDomain` | domain | entity_id[] | Raw |
| `_entitiesByArea` | area_id | EntityRegistryDisplayEntry[] | Raw |
| `_visibleEntitiesByArea` | area_id | EntityRegistryDisplayEntry[] | **Pre-filtered** |
| `_visibleEntitiesByDomain` | domain | entity_id[] | **Pre-filtered** |
| `_configDiagEntitiesByArea` | area_id | EntityRegistryDisplayEntry[] | Config/diagnostic only |

Raw Maps stay available for the Editor (needs all entities for show/hide toggles).

**Pre-Filtering** (applied once during init via `_isEntityVisible()`):
- Not in `_excludeSet` (no "no_dboard" label)
- Not in `_hiddenFromConfig` (not in `areas_options.*.groups_options.*.hidden`)
- Not `hidden_by` (user or integration)
- Not `disabled_by` (user or integration)
- Not `entity_category` "config" or "diagnostic"

### Entity Filtering Pipeline

```
Entity → no_dboard label? → areas_options hidden? → Registry status (hidden_by, disabled_by)?
      → Category check (config/diagnostic excluded) → Platform filter → Dedup → Display
```

### HA Entity Registry vs. State-Attributes (CRITICAL)

Many entity properties exist ONLY in the Entity Registry, NOT in state attributes. Always use the registry as primary source:

| Property | Registry (`hass.entities[id]`) | State attributes |
|----------|-------------------------------|-----------------|
| `hidden_by` | "user", "integration", null | NOT available |
| `disabled_by` | "user", "integration", null | NOT available |
| `entity_category` | "config", "diagnostic", null | Sometimes copied, often missing |
| `platform` | "mobile_app", "mqtt", etc. | NOT available |
| `device_id` | device UUID | NOT available |

**Rule:** Always read `hidden_by`, `disabled_by`, `entity_category`, and `platform` from the registry. Group cards (lights, covers) get entities pre-filtered from the registry array — they have these fields directly on the entity object. The summary card works with `hass.states` keys and must look up registry entries via `hass.entities?.[id]`.

### Config Hierarchy

- **Global toggles**: show_weather, show_energy, show_summary_views, show_room_views, group_by_floors, show_covers_summary, show_clock_card, show_light_summary, show_security_summary, show_battery_summary, show_climate_summary, show_search_card, show_locks_in_rooms, hide_mobile_app_batteries, group_lights_by_floors, use_default_area_sort, show_switches_on_areas, show_alerts_on_areas, show_ups_in_rooms, nested_light_groups
- **Layout**: overview_layout ('default' | 'weather_start'), summaries_columns (2 | 4), clock_size (px, default 120), date_size (px, default 72)
- **Area-level**: areas_display.hidden, areas_display.order
- **Area-level stack order**: areas_options.{areaId}.stacks_order (per-room ordering of RoomViewStrategy blocks)
- **Entity-level**: areas_options.{areaId}.groups_options.{domain}.hidden
- **Per-area custom cards**: areas_options.{areaId}.custom_cards[] (per-card `mode` yaml|tile, `position` top|bottom, optional `title`; rendered in the room detail view)
- **Custom overview sections**: custom_sections[] (each section has `title?`, `icon?`, `cards[]`; rendered as separate grid sections at the `custom_sections` position in `sections_order`)
- **Special**: room_pin_entities, alarm_entity, favorite_entities, custom_views

## Complexity Hotspots

These files require extra care — changes here most likely cause regressions:

1. **editor/StrategyEditor.ts** — Editor state management, expand state persistence, config-changed events
2. **views/RoomViewStrategy.ts** — Entity categorization across 15+ device classes
3. **Registry.ts** — Central data layer, all views depend on its Maps/Sets
4. **utils/name-utils.ts** — Utilities used everywhere (changes ripple through entire codebase)

## Development Workflow

1. Create a feature branch from `main` (e.g. `feature/my-feature`)
2. Build: `npm run build` (production) or `npm run build-dev` (with source maps)
3. Deploy: copy all files from `dist/` to your HA instance at `/config/www/community/dashboard-strategy/`
   - **Windows (SMB):** copy to `\\<HA-IP>\config\www\community\dashboard-strategy\`
   - **macOS (SMB):** copy to `/Volumes/config/www/community/dashboard-strategy/`
4. Delete stale `.gz` and `.br` files after copying (HA serves compressed over `.js` if both present)
5. Hard-refresh browser (`Ctrl+Shift+R` / `Cmd+Shift+R`). HA restart only needed for structural changes
6. **Test on the live system** — always before pushing to GitHub!

## Git & Release Workflow

**Never commit directly to `main`.** Always use feature branches.

### Feature Development
1. `git checkout -b feature/<name>` from `main`
2. Develop, build, test on live system
3. **Commit all files — source AND `dist/`!** HACS serves the `dist/` files from the tagged commit
4. `git push -u origin feature/<name>`
5. Create PR from feature branch → `main` (triggers HACS validation workflow)
6. Wait for CI to pass, then merge
7. Delete feature branch (local + remote)

### Beta Releases
- Beta versions are tagged as **Pre-Release** on GitHub (e.g. `v1.3.0-beta.1`)
- Each beta builds on the previous one — everything flows into `main`
- Increment beta number: `beta.1` → `beta.2` → `beta.3`
- When stable: tag `v1.3.0` as a regular release
- **Minor bump** (`v1.3.0`) for new features, **patch bump** (`v1.2.1`) for pure bugfixes

### Version Checklist (before every release/beta)

| File | Field | Example |
|------|-------|---------|
| `package.json` | `"version"` | `"1.3.4-beta.10"` |
| `src/dashboard-strategy.ts` | `STRATEGY_VERSION` | `'1.3.4-beta.10'` |
| `package-lock.json` | updated automatically via `npm install` | — |
| **Git tag** | create on release | `v1.3.4-beta.10` or `v1.3.4` |

`STRATEGY_VERSION` is logged to the browser console — useful for asking users which version they have installed.

### Porting Community PRs
When PRs were created against the old codebase and cannot be merged directly:
1. Manually port the changes into the current TypeScript codebase
2. Credit the original author as `Co-Authored-By: Name <user@users.noreply.github.com>` in the commit
3. Close the original PR with a friendly comment + link to the release
4. Issue reference in the commit (`Closes #XX`) automatically closes the issue on merge

## Design Decisions

Deliberate architecture decisions that should not be changed:

### Code-Split Chunk Architecture (PERFORMANCE-CRITICAL)
The bundle is deliberately split into 5 chunks:

| Chunk | Contents | Loads |
|-------|----------|-------|
| `main` (Entry) | Custom element registration | Immediately — must register before HA's 5s timeout |
| `lit` | Lit framework (shared) | Async, shared by core/views/editor |
| `core` | Registry, Utils, Cards, OverviewView | Async, for the home screen |
| `views` | Lights/Covers/Security/Batteries/Climate/Room Views | Async, on navigation |
| `editor` | StrategyEditor + js-yaml | On-demand, only when user opens config |

**Why:** HA has a fixed 5-second timeout for custom element registration. The tiny entry point registers the element instantly while the rest loads in the background. Without this split, the bundle competed for browser connections (max. 6 per origin) with HA's own frontend chunks.

**Content-Hash Chunk Filenames:** Chunks include a `[contenthash:8]` in their filename. HACS only sets its cache-busting `hacstag` on the entry file — without content hashes, browsers would serve stale cached chunks after a HACS update.

### No Auto-Detection for Temperature/Humidity on Area Cards
The overview area cards only show temperature/humidity when the user has explicitly assigned an entity in **HA area settings** (`area.temperature_entity_id`, `area.humidity_entity_id`). In room detail views (RoomViewStrategy), sensors ARE auto-detected — they appear as badges and can be filtered via `no_dboard` label or `groups_options.hidden`.

### Pre-filtered Features on Area Cards and Tile Cards (PERFORMANCE-CRITICAL)
Area cards only receive `controls` that actually exist in the area. Tile cards only receive `features` that the entity supports (e.g. `light-brightness` only for lights with brightness support). Without pre-filtering, weak devices (tablets, wall panels) experience massive load times.

### Custom Cards: LitElement with Reactive willUpdate() (PERFORMANCE-CRITICAL)
All custom cards (SummaryCard, LightsGroupCard, CoversGroupCard) use LitElement with `willUpdate(changedProps)`. HA calls `card.hass = ...` on **every** state change (hundreds of times per minute) — without the reactive pattern, each card would rebuild its entire DOM on every call. Cards check whether relevant states actually changed and only re-render when needed. LightsGroupCard and CoversGroupCard use tile card pooling (DOM elements reused instead of recreated). **Do not revert to innerHTML rebuilds!**

### Climate Summary Default: Off
`show_climate_summary` defaults to `false` because not every user has thermostats. All other summaries (lights, covers, security, batteries) default to on.

## Open Roadmap Items

### Evaluate
- SummaryCard entity caching removal (HA's home-summary doesn't cache — stateless per render = more correct behavior for dynamic entity changes)

### Phase 2: Align Further Views
- CoversViewStrategy, SecurityViewStrategy, BatteriesViewStrategy — optimize analogous to LightsView
- RoomViewStrategy: evaluate HA patterns (computeAreaTileCardConfig, feature auto-detection)

## References

Local reference copies for architecture and pattern lookup (sparse checkouts, read-only):

| Local Path | Repository | Contents |
|------------|------------|----------|
| `../references/ha-strategies/` | `home-assistant/frontend` → `src/panels/lovelace/strategies/` | Official HA strategies (TypeScript, architecture reference) |
| `../references/mushroom-strategy/` | `DigiLive/mushroom-strategy` | Community dashboard strategy (TypeScript + build pipeline reference) |
| `../references/hacs-docs/` | `hacs/documentation` → `source/docs/publish/` | HACS publishing documentation (hacs.json options, release handling) |

**HA Release Notes (Markdown)**: `https://github.com/home-assistant/home-assistant.io/blob/rc/source/_posts/` — Blog posts in MD format. Example for April 2026: `2026-04-01-release-20264.markdown`. Useful for checking whether issues have become obsolete due to HA updates.
