# Dashboard Strategy - Agent Instructions

Custom Lovelace Dashboard Strategy for Home Assistant. The project generates dynamic dashboards from Home Assistant registry and state data, with a YAML-capable editor. It is user-facing HACS software: keep changes conservative, backwards-compatible, and tested.

This fork is `Cyberhunter88/dashboard-strategy` and must keep its own public names so it can coexist with `TheRealSimon42/dashboard-strategy`.

## Public contract

Do not rename or remove these identifiers:

- config type: `custom:dashboard-strategy`
- strategy: `ll-strategy-dashboard-strategy`
- views: `ll-strategy-dashboard-strategy-view-{overview,lights,covers,security,batteries,climate,room,cctv,maintenance}`
- cards: `dashboard-strategy-{summary,lights-group,covers-group,batteries,area,camera,editable,video-tip}-card`
- editor: `dashboard-strategy-editor`
- HACS file: `dashboard-strategy.js`
- HACS resource path: `/hacsfiles/dashboard-strategy/`
- HACS name: `Dashboard Strategy`

Existing dashboards use:

```yaml
strategy:
  type: custom:dashboard-strategy
```

## Architecture and data flow

- TypeScript, strict mode, ES2020; Webpack production build with code-split chunks.
- Runtime source of truth is the Home Assistant `hass` object: `entities`, `devices`, `areas`, `floors`, and `states`.
- `src/dashboard-strategy.ts` registers the main strategy immediately, starts chunk loading early, and `generate()` waits for modules, initializes `Registry`, applies state/user visibility rules, and pre-resolves views.
- `src/Registry.ts` is a static singleton. It builds raw and pre-filtered entity/device/domain/area lookup maps. Prefer its APIs over rescanning Home Assistant registries.
- Registry-only properties (`hidden_by`, `disabled_by`, `entity_category`, `platform`, `device_id`) must come from `hass.entities[id]` or `Registry.getEntity(id)`, never from state attributes.
- Visibility is centralized in `Registry._isEntityVisible()`: `no_dboard`, area/group overrides, HA hidden state, config/diagnostic entities, and required state availability are handled there.
- Custom cards receive frequent `hass` updates; preserve reactive updates and avoid rebuilding the full DOM unnecessarily.

Source layout:

```text
src/
├── dashboard-strategy.ts       # entry, version, registration, generate()
├── Registry.ts                 # registry indexes and visibility
├── cards/                      # area, camera, groups, summary, editable, video tip
├── editor/                     # StrategyEditor, panels, YAML/config helpers
├── sections/                   # overview, areas, weather/energy, custom, plants, agenda, todos, persons, vacuums, maintenance
├── translations/               # de/en strings
├── types/                      # Home Assistant, Lovelace, registry, strategy types
├── utils/                      # filtering, ordering, localization, tiles, badges, maintenance
└── views/                      # overview, utility, room, CCTV, and maintenance strategies
```

## Configuration and feature notes

Keep `src/types/strategy.ts`, editor panels/rendering, translations, README, and generated behavior synchronized when adding or changing options. The current surface includes:

- overview: clock/date sizing, person/search/status badges, native/custom search variants, summaries, general and light favorites, section order/visibility, dense placement, plants, agenda, todos, persons, vacuums, and maintenance
- weather/energy: weather presentation and sensors, pollen entities, weather-start free layout and YAML block overrides, energy distribution, power badge, and linked dashboard
- views: summary, room, CCTV, battery, security, and maintenance views; per-user visibility; opt-in security activity/area grouping; camera renderer/live toggle/WebRTC settings
- rooms/areas: floor grouping, area ordering/navigation, entity-state room visibility, switches and alerts, room pins, locks, scripts, automations, vacuums/mowers, energy, UPS, and opt-in window/door contact badges
- custom content: YAML cards, guided tiles, full sections, custom badges, custom views, per-room custom cards, and inline editor overrides
- availability and battery behavior: hidden/unavailable filtering, mobile-app and note entities, critical/low thresholds, unavailable battery bucket

Important behavior:

- Area temperature/humidity and room primary temperature/humidity use explicit Home Assistant area assignments; other sensor badges may be auto-detected.
- UPS detection uses only visible pre-filtered entities and is enabled by default.
- Camera behavior is controlled by `camera_renderer`, `camera_live_toggle`, and `camera_webrtc_streams`; do not assume native `camera.*` entities are always used.
- Adaptive native tile features are centralized in `src/utils/tile-card-utils.ts` and must only expose features supported by each entity.
- The editor is the main complexity hotspot. Its navigation is a flat set of independently collapsible panels whose keys persist in local storage. Keep panel metadata in `src/editor/editor-panel-registry.ts`, reusable panels under `src/editor/panels/`, and shared contracts in `src/editor/editor-host.ts`.
- Preserve YAML parsing, config-changed events, expansion persistence, inline-editor state, and error reporting when extracting or changing editor panels.
- `search_card_variant: tip` must remain dependency-free; the default `custom` variant remains backwards-compatible with `custom:search-card`.
- `room_visibility` controls generated room views/navigation only. Area cards remain present. User visibility remains display logic, not access control.
- Security activity is opt-in, requires HA's `logbook` component, and excludes registry entities carrying `no_seclog` from the activity card without hiding them from the security view.

## Performance constraints

- Keep the entry chunk small and register `ll-strategy-dashboard-strategy` immediately.
- Keep code splitting and content-hashed chunk names; start loading chunks from the entry point.
- Pre-resolve views in `generate()` rather than returning lazy strategy stubs.
- Use Registry pre-filtered maps instead of repeated per-card scans.
- Keep lights and covers group-card tile pooling; do not reintroduce repeated `innerHTML` rebuilds.
- Pass only existing controls/sensor classes to area cards and only supported features to tile cards.

## Development workflow

Before editing, check `git status --short --branch`. Preserve unrelated user changes, especially dirty `dist/` output; never reset or restore files you did not create.

Useful checks:

```bash
npm run typecheck
npm run lint
node scripts/lint-translations.mjs
npm test
npm run build
node scripts/verify-version-sync.mjs
git diff --check
```

For source changes, run typecheck, lint, and the DE/EN translation lint; run tests/build when practical. User-facing behavior should also be validated against the live Home Assistant instance before publishing when that integration is available. Production builds update tracked `dist/` artifacts and must be included when the bundle changes.

GitHub Actions are intentionally separated: `ci.yml` owns code/translation/build quality, `validate.yml` owns actionable HACS validation while ignoring only the known license check, `release-please.yml` owns release PRs, and `release-build.yml` builds and uploads release assets. Do not reintroduce a parallel tag-only integrity workflow that duplicates the release build.

## Version, Git, and release rules

Do not commit directly to `main`; use a feature branch. Before push/PR/release, verify the intended repository and remotes explicitly (`origin` is the fork; do not rely on an accidental GitHub CLI context).

Version surfaces must stay aligned:

| File | Field |
| --- | --- |
| `package.json` | `version` |
| `package-lock.json` | lockfile version metadata |
| `src/dashboard-strategy.ts` | `STRATEGY_VERSION` |
| `dist/dashboard-strategy.js` | built version output |
| GitHub release/tag | `v<version>` |

Use `scripts/verify-version-sync.mjs` early for release work, then rebuild `dist`. Patch versions are bugfixes; minor versions are features; beta releases are GitHub pre-releases. A hygiene-only change without a version bump does not need a release/tag.

Normal feature flow: branch from `main`, implement, validate, build, commit source and generated output when applicable, push, open a PR, wait for CI/HACS validation, then merge and release only when requested.

## Porting upstream/community changes

Port behavior manually into the current TypeScript structure. Preserve fork public names and current architecture. Update types, editor UI, translations, README, tests, and `dist/` when applicable. Credit the original author in the commit when appropriate and reference the source PR/issue.

## References

Read current repository code and README before making claims about behavior. Optional local read-only references may exist under `../references/` for Home Assistant strategies, Mushroom Strategy, and HACS documentation. For current Home Assistant frontend behavior or release notes, use current upstream sources.
