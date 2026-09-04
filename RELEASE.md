# Release workflow

## Version source

The release version is maintained in `VERSION.txt`. It contains exactly one
SemVer value without a leading `v`, for example:

```text
1.29.3
```

After changing `VERSION.txt`, synchronize the derived project version files:

```text
npm run version:sync
npm run verify:version
```

Commit `VERSION.txt` together with the synchronized package, lockfile, and
runtime version files. The release tag is generated automatically as
`v<version>`.

## Continuous integration

`.github/workflows/ci.yml` runs for pull requests targeting `main`, pushes or
merges to `main`, and manual `workflow_dispatch` runs. It installs dependencies,
checks formatting and runs the complete quality, test, build,
production-artifact, and HACS-distribution checks. The formatting check
is currently reported without failing the job because the existing source
baseline has pre-existing Prettier deviations.

## Automated release

Normal feature and fix pull requests use Conventional Commit prefixes such as
`feat:` and `fix:`. CI runs on pull requests, pushes to `main`, and manual
dispatches. It checks the version source, typecheck, lint, translations, tests,
the production build, all code-split assets, and the HACS distribution.

When a change to `VERSION.txt` reaches `main`, the version-driven release
workflow performs this sequence:

1. Read and validate `VERSION.txt` through the shared version parser.
2. Inspect the existing tag and release state.
3. Verify that all derived version files match it.
4. Run the complete quality gate and production build.
5. Create and push an annotated Git tag if it is missing.
6. Create a draft GitHub release with automatically generated notes if it is missing.
7. Upload the complete `dist` asset set.
8. Verify that the draft contains exactly the local release asset set.
9. Publish the release when it is still a draft.
10. Verify that the published release still contains the complete asset set.

The release workflow also supports an explicit manual dispatch on `main`; the
normal automatic trigger remains limited to pushes that change `VERSION.txt`.
If a run fails after creating a tag or draft release, rerunning it resumes the
missing steps instead of treating the partial state as complete. Published
releases are checked and their assets are repaired idempotently when necessary.

The release is never intentionally published before its HACS assets pass the
remote verification. The release workflow creates and publishes the release in
one run and does not depend on a second workflow triggered by `GITHUB_TOKEN`.

## Manual repair or recovery

Use **Actions → Release build**, enter an existing tag such as `v1.29.3`, and
leave **Publish** disabled when repairing an already published release. The
workflow checks out the tag, verifies that it is reachable from `main`, rebuilds
the exact release assets, uploads them, and verifies the remote asset set.

Enable **Publish** only for a draft release that has passed the asset check.
The manual workflow also accepts tags through an explicit argument in the
version check, so it does not depend on the branch that started the dispatch.

## One-time GitHub configuration

No custom token or GitHub App is required. GitHub creates the short-lived
`GITHUB_TOKEN` automatically for every Actions run. The release workflow needs
`contents: write`; CI only needs read access.

In the repository settings, enable **Settings → Actions → General → Workflow
permissions → Read and write permissions**. The workflow still limits the
token to the operations needed for the release.

## Local release gate

Run this before merging release-related changes:

```text
npm run verify:release
```

This runs the quality checks, production build, version synchronization check,
artifact validation, and HACS distribution validation.
