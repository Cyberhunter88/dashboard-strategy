# Release workflow

## Version source

The release version is maintained in `version.txt`. It contains exactly one
SemVer value without a leading `v`, for example:

```text
1.29.3
```

After changing `version.txt`, synchronize the derived project version files:

```text
npm run version:sync
npm run verify:version
```

Commit `version.txt` together with the synchronized package, lockfile, and
runtime version files. The release tag is generated automatically as
`v<version>`.

## Automated stable release

Normal feature and fix pull requests use Conventional Commit prefixes such as
`feat:` and `fix:`. CI runs on pull requests, pushes to `main`, and manual
dispatches. It checks the version source, typecheck, lint, translations, tests,
the production build, all code-split assets, and the HACS distribution.

When a change to `version.txt` reaches `main`, the version-driven release
workflow performs this sequence:

1. Read and validate `version.txt`.
2. Verify that all derived version files match it.
3. If the tag or release already exists, finish as a safe no-op.
4. Run the complete quality gate and production build.
5. Create and push an annotated Git tag for the exact `v<version>` value.
6. Create a draft GitHub release with automatically generated notes.
7. Upload the complete `dist` asset set.
8. Verify that the draft contains exactly the local release asset set.
9. Publish the release.
10. Verify that the published release still contains the complete asset set.

The release is never intentionally published before its HACS assets pass the
remote verification. The release workflow creates and publishes the release in
one run and does not depend on a second workflow triggered by `GITHUB_TOKEN`.

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
