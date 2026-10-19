# Development on Windows and CachyOS

## First setup on a new computer

Install Git, VS Code, Node.js 22, and npm. The `.nvmrc` records the supported Node major version; select Node 22 with your version manager or install it directly. This repository has no Go module or Go build dependency. Run the same Git and `node`/`npm` commands in a VS Code terminal or Codex on either OS. In PowerShell installations that block `npm.ps1`, use `npm.cmd` for the same npm commands; Git Bash can use `npm`.

Clone `https://github.com/Cyberhunter88/dashboard-strategy.git` and enter the repository. Verify `git remote -v` points to this fork and run `git status --short --branch` before changing branches. Read `AGENTS.md` and `STATUS.md`. Install the locked dependencies with `npm ci` (or `npm.cmd ci` in the PowerShell case). Do not commit `node_modules`, editor settings, local credentials, or Home Assistant configuration. The tracked `dist/` files are HACS release artifacts.

Install the repository hook in each clone with `git config --local core.hooksPath .githooks` and verify with `git config --local --get core.hooksPath`. The `pre-push` hook needs Git's shell and Node.js on `PATH`; Git for Windows includes the shell. Confirm the shared Codex Git secret scanner is configured if available. Its PowerShell implementation requires `pwsh` on CachyOS. Never bypass a failed or missing check with `--no-verify`.

## Start a task and move between computers

Check `git status --short --branch` first. If the working tree contains changes, identify and preserve them before switching or pulling; do not reset, clean, force checkout, or automatically stash them. From a clean, up-to-date `main`, run `git switch -c codex/<topic>`. Keep one task per branch. Do not commit on `main`.

Before leaving computer A, run the relevant checks, stage only intended paths, inspect `git diff --cached`, commit on the feature branch, and push only when authorized. The first push uses `git push -u origin codex/<topic>`; later pushes use `git push`. Verify the target with `git remote -v` and `git status --short --branch` first. Never force push or rebase published commits.

On computer B, check its working tree before changing branches. Run `git fetch origin`, then `git switch --track origin/codex/<topic>` if the branch does not exist locally, or `git switch codex/<topic>` if it does. Check `git status --short --branch` again and run `git pull --ff-only` on a clean branch. If branches diverge or local changes would be overwritten, stop and reconcile the work deliberately; do not force a pull. Run `npm ci` when the lockfile changed. Repeat in the other direction for the next computer switch.

## Checks, review, and merge

For source changes, run `npm run verify:quality`, `npm run build`, `npm run verify:production`, and `npm run test:browser` when a browser is available. Run `git diff --check`; use `npm audit` for dependency work. A documentation-only change needs documentation and hook checks but does not require rebuilding `dist/`. On PowerShell, substitute `npm.cmd` for `npm` if script execution blocks npm. A functional change needs the appropriate version bump and rebuilt tracked distribution as described in `AGENTS.md`.

Open a pull request targeting `main` after the authorized push. Wait for CI and HACS validation, then merge through GitHub review. After the merge, on each computer check for local changes, run `git switch main`, `git fetch origin`, and `git pull --ff-only`. Start the next task with a fresh `codex/<topic>` branch. No branch deletion is required for this workflow.

## GitHub repository rules to configure manually

Repository administrators should inspect the current ruleset or branch protection for `main` before changing it. Require pull requests and successful status checks, prevent force pushes and deletion, and include administrators if the repository policy permits. The current CI check names are `Quality, build, and production distribution` and `Browser editor and responsive regressions`; require both after confirming their exact names from a completed PR. `HACS Validation` runs on same-repository PRs, but skips fork PRs, so require it only if all accepted PRs originate in this repository or the workflow is changed to provide a check for forks. Keep `workflow_dispatch` enabled. Repository rules cannot be enforced by files in this clone; no GitHub settings are changed by this document.

## Secret checks

Run `node scripts/check-secrets.mjs --tracked` to inspect tracked files, `--history` for reachable local history, and `--outgoing` for local commits absent from `origin` remote refs. Fetch `origin` before relying on the outgoing result. The hook runs `--outgoing` and blocks on findings, unscanned binary or large files, missing remote refs, or a push to a different remote. Known GIF/PNG/MP4 documentation media are excluded explicitly; gzip and Brotli distribution bundles are decompressed and checked. It prints locations and rule names, never matched values. Review staged diffs and run the shared Codex Git secret scanner when available; a clean local check is not proof that no secret exists.

If a secret is found, stop the push, revoke or rotate it, and remove it from the outgoing work. For already published history, document only masked metadata and obtain approval before rewriting history.
