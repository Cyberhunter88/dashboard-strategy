# Dashboard Strategy - Agent Instructions

Custom Lovelace Dashboard Strategy for Home Assistant. The project generates dynamic dashboards from Home Assistant registry and state data, with a YAML-capable editor. It is user-facing HACS software: keep changes conservative, backwards-compatible, and tested.

This fork is `Cyberhunter88/dashboard-strategy` and must keep its own public names so it can coexist with `TheRealSimon42/dashboard-strategy`.

Current development version: `1.29.3`. The validated baseline is 35 test files with 163 tests.

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
- dashboard picker metadata: `custom:dashboard-strategy`, title `Dashboard Strategy`, icon `mdi:view-dashboard`

Backwards-compatible YAML aliases are normalized at the entry point. Keep `show_camera_view` as an alias for `show_cctv_view` and `show_maintenance_summary` as an alias for `show_maintenance_view`; explicit fork-native options win.

Existing dashboards use:

```yaml
strategy:
  type: custom:dashboard-strategy
```

## Architecture and data flow

- TypeScript, strict mode, ES2020; Webpack production build with code-split chunks.
- Runtime dependency baseline is `js-yaml ^4.3.1` and `lit ^3.3.2`; keep lockfile-compatible security patches current.
- Runtime source of truth is the Home Assistant `hass` object: `entities`, `devices`, `areas`, `floors`, and `states`.
- `src/dashboard-strategy.ts` registers the main strategy immediately, starts chunk loading early, and `generate()` waits for modules, initializes `Registry`, and pre-resolves views.
- The main strategy declares the Home Assistant registry dependencies `entities`, `devices`, `areas`, and `floors`; keep these aligned with the registries consumed by `Registry`.
- `src/Registry.ts` is a static singleton. It builds raw and pre-filtered entity/device/domain/area lookup maps. Prefer its APIs over rescanning Home Assistant registries.
- Summary-backed utility views use `src/utils/summary-view-utils.ts` as their single activation source. Keep dashboard generation, user visibility, custom-view positioning, and deep links aligned with it.
- Area subgroup ordering is centralized in `src/utils/area-group-utils.ts`; the trailing unassigned bucket must remain last.
- Registry-only properties (`hidden_by`, `disabled_by`, `entity_category`, `platform`, `device_id`) must come from `hass.entities[id]` or `Registry.getEntity(id)`, never from state attributes.
- Visibility is centralized in `Registry._isEntityVisible()`: `no_dboard`, area/group overrides, HA hidden state, config/diagnostic entities, and required state availability are handled there.
- Custom cards receive frequent `hass` updates; preserve reactive updates and avoid rebuilding the full DOM unnecessarily.

Source layout:

```text
src/
|-- dashboard-strategy.ts       # entry, version, registration, generate()
|-- Registry.ts                 # registry indexes and visibility
|-- cards/                      # area, camera, groups, summary, editable, video tip
|-- data/                       # static user-facing data such as video-tip metadata
|-- editor/                     # StrategyEditor, panels, YAML/config helpers
|-- loaders/                    # bounded eager runtime chunk entry points
|-- sections/                   # overview, areas, weather/energy, custom, plants, agenda, todos, persons, vacuums, maintenance
|-- translations/              # de/en/ru strings; English is the fallback
|-- types/                      # Home Assistant, Lovelace, registry, strategy types
|-- utils/                      # filtering, ordering, localization, tiles, badges, maintenance
`-- views/                      # overview, utility, room, CCTV, and maintenance strategies
```

## Configuration and feature notes

Keep `src/types/strategy.ts`, editor panels/rendering, translations, README, and generated behavior synchronized when adding or changing options. The current surface includes:

- overview: clock/date sizing, alarm and house-mode selector, person/search/status badges, summaries, favorites, section order/visibility, dense placement, plants, agenda, todos, persons, vacuums, and maintenance
- weather/energy: weather presentation and sensors, pollen entities, weather-start free layout and YAML block overrides, energy distribution, power badge, and linked dashboard
- views: summary, room, CCTV, battery, and maintenance views; standalone utility-view switches; camera renderer/live toggle/WebRTC settings
- rooms/areas: floor and nested area grouping, area ordering/navigation, compact or picture cards, switches and alerts, room pins, locks, scripts, automations, vacuums/mowers, energy, UPS, opt-in window/door badges, safe opt-in cover batch controls, and dedicated switch/outlet sections
- custom content: YAML cards, guided tiles, full sections, custom badges, custom views with `after_view` placement or live references, per-room custom cards, and inline editor overrides
- visibility: per-user view and overview-section display rules plus entity-state-based room and section visibility; these are presentation rules, not access control
- availability and battery behavior: hidden/unavailable filtering, mobile-app and note entities, critical/low thresholds, unavailable battery bucket

The generated maintenance view is resolved centrally through `resolveFeatureToggle`: explicit `false` stays disabled, explicit `true` stays enabled, and an unset option is enabled only when usable maintenance data exists. Other overview sections retain their historical opt-in behavior. Personal entity IDs, custom layouts, and camera view overrides remain configuration-owned.

Important behavior:

- Area temperature/humidity and room primary temperature/humidity use explicit Home Assistant area assignments; other sensor badges may be auto-detected.
- `groups_options.badges.hidden` is badge-local and must never enter the Registry's dashboard-wide exclusion set. Automatic badges show one entity per sensor type until that type is manually curated; then all still-selected entities of that type render. Explicit `badges.additional` entries remain supported.
- Power, energy, water, and gas sensors belong to the room energy block and are not automatic badge candidates. Config and diagnostic registry entities must not appear in editor entity pickers.
- UPS detection uses only visible pre-filtered entities and is enabled by default.
- `house_mode_entity` accepts user-facing `input_select.*` and `select.*` entities. It renders as a full-width native tile with `select-options`; categorized config/diagnostic selects are excluded from the editor picker.
- Camera behavior is controlled by `camera_renderer`, `camera_live_toggle`, and `camera_webrtc_streams`; do not assume native `camera.*` entities are always used.
- Dual-lens camera devices render one block per preferred lens stream, but device-level companion entities, PTZ controls, and recordings links render only once per device.
- Areas hidden from the overview remain visible in Security/CCTV by default and get no invalid room navigation link. Only `hide_hidden_areas_in_security: true` filters them from both layouts, cameras, and security activity.
- Room cover batch controls are opt-in in this fork (`show_cover_controls_in_rooms: true`). They target only covers supporting each requested feature and exclude window/door/gate/garage cover classes by using only shading and curtain groups.
- `camera_renderer: webrtc` requires the external `custom:webrtc-camera` card. `camera_webrtc_streams` is keyed by camera entity id and can contain a URL or card options. Keep the native renderer as the dependency-free default.
- Adaptive native tile features are centralized in `src/utils/tile-card-utils.ts` and must only expose features supported by each entity.
- The editor is the main complexity hotspot: preserve YAML parsing, config-changed events, expansion persistence, inline-editor state, and error reporting.

## Performance constraints

- Keep the entry chunk small and register `ll-strategy-dashboard-strategy` immediately.
- Keep code splitting and content-hashed chunk names; start loading chunks from the entry point.
- Pre-resolve views in `generate()` rather than returning lazy strategy stubs.
- Use Registry pre-filtered maps instead of repeated per-card scans.
- Keep lights and covers group-card tile pooling; do not reintroduce repeated `innerHTML` rebuilds.
- Preserve pooled floor/area heading cards and reactive `Etage → Bereich → Entitäten` reconciliation in lights and covers cards.
- Pass only existing controls/sensor classes to area cards and only supported features to tile cards.

## Development workflow

Before editing, check `git status --short --branch`. Preserve unrelated user changes, especially dirty `dist/` output; never reset or restore files you did not create.

Useful checks:

```bash
npm run typecheck
npm run lint
npm test
npm run build
node scripts/lint-translations.mjs
node scripts/verify-version-sync.mjs
node scripts/verify-hacs-distribution.mjs
npm audit
git diff --check
```

For source changes, run typecheck and lint; run tests/build when practical. User-facing behavior should also be validated against the live Home Assistant instance before publishing when that integration is available. Production builds update tracked `dist/` artifacts and must be included when the bundle changes.

## Version, Git, and release rules

Do not commit directly to `main`; use a feature branch. Before push/PR/release, verify the intended repository and remotes explicitly (`origin` is the fork; do not rely on an accidental GitHub CLI context).

Version surfaces must stay aligned:

| File | Field |
| --- | --- |
| `VERSION.txt` | source-of-truth SemVer |
| `package.json` | `version` |
| `package-lock.json` | lockfile version metadata |
| `src/dashboard-strategy.ts` | `STRATEGY_VERSION` |
| `dist/dashboard-strategy.js` | built version output |
| GitHub release/tag | `v<version>` |

Use `scripts/verify-version-sync.mjs` early for release work, then rebuild `dist`. Patch versions are bugfixes; minor versions are features; beta releases are GitHub pre-releases. A hygiene-only change without a version bump does not need a release/tag.

Normal feature flow: branch from `main`, implement, validate, build, commit source and generated output when applicable, push, open a PR, wait for CI/HACS validation, then merge. After the merge, the release workflow runs only when `VERSION.txt` changed.

For every functional change, determine whether the version change is PATCH,
MINOR, or MAJOR and update `VERSION.txt` in the same pull request. Never create
or push Git tags or GitHub releases manually. After the pull request is merged
into `main`, the GitHub Actions release workflow creates the corresponding
`v<version>` tag and GitHub Release automatically.

CI must run for pull requests targeting `main`, after pushes or merges to
`main`, and through `workflow_dispatch`. CI performs the project quality,
build, test, and validation checks but never creates tags or
releases.

## Porting upstream/community changes

Port behavior manually into the current TypeScript structure. Preserve fork public names and current architecture. Update types, editor UI, translations, README, tests, and `dist/` when applicable. Credit the original author in the commit when appropriate and reference the source PR/issue.

## References

Read current repository code and README before making claims about behavior. Optional local read-only references may exist under `../references/` for Home Assistant strategies, Mushroom Strategy, and HACS documentation. For current Home Assistant frontend behavior or release notes, use current upstream sources.
