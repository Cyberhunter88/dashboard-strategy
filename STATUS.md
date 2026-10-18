# Project status

Updated: 2026-10-18

## Current development state

- Dashboard Strategy development version: 1.33.3. `package.json` is the version source; source marker and tracked distribution must stay synchronized.
- The project uses TypeScript, Webpack, Vitest, browser checks, and GitHub Actions CI. Production `dist/` assets are tracked for HACS.
- Workflow setup is being prepared on `chore/cross-platform-workflow`; no push or PR has been performed for it.

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

1. Finish the secret audit and quality checks for this workflow change.
2. Review the changes, then push and open a PR only after authorization.
