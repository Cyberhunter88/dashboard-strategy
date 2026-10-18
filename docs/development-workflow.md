# Development on Windows and CachyOS

Use Node.js 22, npm, Git, VS Code, and the local Codex CLI. Start each session by reading `AGENTS.md` and `STATUS.md`, then run `git status --short --branch`. Work on a dedicated feature branch. Keep machine-specific files and Home Assistant configuration outside Git.

Install dependencies with `npm ci`. Before pushing source changes, run `npm run verify:quality`, `npm run build`, `npm run verify:production`, and `npm run test:browser` when the browser environment is available. Stage exact paths, inspect `git diff --cached`, and commit on the feature branch. Request authorization before any push.

## Secret checks and hook

Run `git config --local core.hooksPath .githooks` once per clone on Windows and CachyOS. The repository's `pre-push` hook needs Git's shell and Node.js on `PATH`; Git for Windows includes the shell. Verify the installation with `git config --local --get core.hooksPath`. Never use `--no-verify` to conceal a failed check.

Run `node scripts/check-secrets.mjs --tracked` to inspect tracked files, `--history` for reachable local history, and `--outgoing` for local commits absent from `origin` remote refs. Fetch `origin` before relying on the outgoing result. The hook runs `--outgoing` and blocks on findings, unscanned binary or large files, missing remote refs, or a push to a different remote. Known GIF/PNG/MP4 documentation media are excluded explicitly; gzip and Brotli distribution bundles are decompressed and checked. It prints locations and rule names, never matched values. Treat a clean result as one check, not proof that no secret exists; review staged diffs and run the shared Codex Git secret scanner when it is available in the local environment. The shared PowerShell scanner is not distributed with this repository; on CachyOS it requires PowerShell (`pwsh`). Do not disable either check silently.

If a secret is found, stop the push, revoke or rotate it, and remove it from the outgoing work. For already published history, document only masked metadata and obtain approval before rewriting history.
