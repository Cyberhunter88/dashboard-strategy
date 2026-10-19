# Project status

Updated: 2026-10-19

## Current development state

- Dashboard Strategy development version: 1.34.0 on `codex/dashboard-strategy-v134`. `package.json` is the version source; source marker and tracked distribution must stay synchronized.
- The project uses TypeScript, Webpack, Vitest, browser checks, and GitHub Actions CI. Production `dist/` assets are tracked for HACS.
- Version 1.34.0 combines CCTV option clarity with legacy behavior, keyboard room-stack ordering, Hungarian and Polish translations, and manual `/local/` chunk loading. The combined feature branch is prepared for review.

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

1. Review the 1.34.0 pull request and CI results before merging.
2. Validate the cross-platform pre-push hook on CachyOS and Windows in each local clone.
