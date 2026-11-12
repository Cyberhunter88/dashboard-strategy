# Project status

Updated: 2026-11-12

## Current development state

- Dashboard Strategy development version: 1.40.1. `package.json` is the version source; source marker and tracked distribution must stay synchronized.
- Version 1.40.2 (branch `codex/webrtc-camera-defaults`, not yet pushed) gives the `webrtc` camera renderer smooth-playback defaults (`mode: webrtc,mse`, muted, `intersection: 0.5`, `background: false`, all overridable per camera in `camera_webrtc_streams`) and documents connecting RTSP/go2rtc sources such as cctv-viewer. Validation in Home Assistant is still pending.
- Version 1.40.1 is a CI-only release: the version release workflow no longer repeats typecheck, lint, and tests that CI already runs on the same commit (it only rebuilds and validates the production artifacts), and it is now started manually only (Actions > Version Release) instead of on every merge that changes `package.json`, since several PRs can land with the same version.
- Version 1.40.0 makes the editor easier to use: a search field over all options with a "changed from default" filter, a diagnostics hint (`redundant_exclusion`) for hidden-list entries that Home Assistant data already excludes (label, hidden/disabled, config/diagnostic category, or control by a visible Better Thermostat/climate group wrapper), and a `title` for built-in weather/forecast/alarm blocks in the free weather start layout. Validation in Home Assistant is still pending.
- Version 1.39.0 adds the `hide_grouped_climate_members` option (default on): thermostats that Better Thermostat or a climate group already controls are hidden so the same radiator is not shown twice, while the controlling entity stays visible. With `hide_unavailable_entities`, `unknown` is now treated as a normal state for button, scene, event, input_button, and siren entities (only `unavailable` hides them), and six unused editor translation keys are removed. Validation in Home Assistant is still pending.
- Version 1.38.0 adds the quick actions, media and activity overview sections, the windows summary, the energy view, climate humidity/CO2 alerts and a working video tip dismissal, and moves the overview, summary, favorites and room pin editor panels out of `StrategyEditor.ts` (about 3,600 lines left). Validation in Home Assistant is still pending.
- Version 1.37.2 is a bugfix and runtime optimization release: parent-aware device areas are used consistently (lights/battery grouping, security, CCTV, room pins), reactive cards do less work per state update, and the video tip card no longer re-renders on every update. Validation in Home Assistant is still pending.
- Version 1.37.1 is a repository cleanup without behavior changes: unused helper exports, changelog-generator templates, the Codacy configuration, and `ts-node` are removed; documentation media is WebP; development builds write to `dist-dev/`.
- Version 1.37.0 adapts room card names to the Home Assistant 2026.11 naming model (device-name prefix stripping). Validation in Home Assistant is still pending.
- Version 1.36.0 loads non-English translations as on-demand chunks, completes the Russian translation, and extracts the custom views editor panel. Validation in Home Assistant is still pending.
- The project uses TypeScript, Webpack, Vitest, browser checks, and GitHub Actions CI. Production `dist/` assets are tracked for HACS.

## Open tasks

- Split further panels out of `src/editor/StrategyEditor.ts` (about 3,600 lines; remaining candidates: area options, custom content, weather-start layout helpers, and the drag/drop handlers).
- Audit translation keys for unused entries; many keys are composed dynamically, so a plain text search is not sufficient.
- Decide whether the unwired inline-editor helper (`src/utils/inline-editor.ts`) and `src/cards/EditableCard.ts` should be reconnected or removed. Nothing imports them, but the card name `dashboard-strategy-editable-card` is part of the public contract, so removal needs a deliberate decision.
- Validate the cross-platform pre-push hook on CachyOS and Windows in each local clone, and configure the shared Codex Git secret scanner when available.
- Resolve the historical credential finding through private coordination; do not rewrite any published branch without explicit approval.
- Review the seven historical binary or oversized objects that the text scanner could not inspect.

## Technical decisions

- Feature work uses dedicated branches and PRs; `main` is not edited directly.
- Public documentation contains only project-level information. Local settings, Home Assistant configuration, and credentials stay outside Git.
- Generated HACS distribution files remain tracked; broad `dist/` ignore rules would break releases.
- Git history is not rewritten to drop the old documentation videos; the clone size is accepted.

## Next steps

1. Validate versions 1.36.0 to 1.38.0 in Home Assistant before publishing.
2. Open the pull request for branch `codex/runtime-optimizations` (1.37.2 and 1.38.0) and wait for CI and HACS validation.
