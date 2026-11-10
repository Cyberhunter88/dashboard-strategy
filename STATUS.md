# Project status

Updated: 2026-11-10

## Current development state

- Dashboard Strategy development version: 1.37.1. `package.json` is the version source; source marker and tracked distribution must stay synchronized.
- Version 1.37.1 is a repository cleanup without behavior changes: unused helper exports, changelog-generator templates, the Codacy configuration, and `ts-node` are removed; documentation media is WebP; development builds write to `dist-dev/`.
- Version 1.37.0 adapts room card names to the Home Assistant 2026.11 naming model (device-name prefix stripping). Validation in Home Assistant is still pending.
- Version 1.36.0 loads non-English translations as on-demand chunks, completes the Russian translation, and extracts the custom views editor panel. Validation in Home Assistant is still pending.
- The project uses TypeScript, Webpack, Vitest, browser checks, and GitHub Actions CI. Production `dist/` assets are tracked for HACS.

## Open tasks

- Split further panels out of `src/editor/StrategyEditor.ts` (about 4,800 lines; the editor chunk is the largest bundle).
- Audit translation keys for unused entries; many keys are composed dynamically, so a plain text search is not sufficient.
- Decide whether the unwired inline-editor helper (`src/utils/inline-editor.ts`) and `dismissTip` (`src/utils/video-tips.ts`) should be reconnected or removed. Nothing imports them, but they belong to documented features.
- Validate the cross-platform pre-push hook on CachyOS and Windows in each local clone, and configure the shared Codex Git secret scanner when available.
- Resolve the historical credential finding through private coordination; do not rewrite any published branch without explicit approval.
- Review the seven historical binary or oversized objects that the text scanner could not inspect.

## Technical decisions

- Feature work uses dedicated branches and PRs; `main` is not edited directly.
- Public documentation contains only project-level information. Local settings, Home Assistant configuration, and credentials stay outside Git.
- Generated HACS distribution files remain tracked; broad `dist/` ignore rules would break releases.
- Git history is not rewritten to drop the old documentation videos; the clone size is accepted.

## Next steps

1. Validate versions 1.36.0 to 1.37.1 in Home Assistant before publishing.
2. Open the pull request for 1.37.0 and 1.37.1 and wait for CI and HACS validation.
