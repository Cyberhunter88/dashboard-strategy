# Project status

Updated: 2026-10-26

## Current development state

- Dashboard Strategy development version: 1.35.0. `package.json` is the version source; source marker and tracked distribution must stay synchronized.
- The project uses TypeScript, Webpack, Vitest, browser checks, and GitHub Actions CI. Production `dist/` assets are tracked for HACS.
- Version 1.34.0 combines CCTV option clarity with legacy behavior, keyboard room-stack ordering, Hungarian and Polish translations, and manual `/local/` chunk loading; its pull request is merged.
- Version 1.34.1 fixes async chunk loading when Home Assistant imports the entry while an unrelated card is the last script in the page. Browser coverage exercises HACS and `/local/` resources through both script loading and dynamic import.
- Version 1.35.0 adds an opt-in slim summary layout for the default overview, optional hiding of completed to-dos, and direct navigation to editor panels.
- The manual release-build workflow needs `GH_TOKEN` in both release-asset verification steps; its v1.35.0 run failed after uploading assets because the first verifier lacked that environment variable.

## Open tasks

- Validate the cross-platform pre-push hook on CachyOS and Windows in each local clone.
- Install the hook per clone and configure the shared Codex Git secret scanner when available.
- Resolve the historical credential finding through private coordination; do not rewrite any published branch without explicit approval.
- Review the seven historical binary or oversized objects that the text scanner could not inspect.

## Technical decisions

- Feature work uses dedicated branches and PRs; `main` is not edited directly.
- Public documentation contains only project-level information. Local settings, Home Assistant configuration, and credentials stay outside Git.
- Generated HACS distribution files remain tracked; broad `dist/` ignore rules would break releases.

## Next steps

1. Review the release-build token fix through a pull request, then rerun the manual workflow for v1.35.0 and verify the asset and publication checks.
2. Validate version 1.35.0 in Home Assistant before publishing.
3. Validate the cross-platform pre-push hook on CachyOS and Windows in each local clone.
