# Release workflow

## Automated stable release

Normal feature and fix pull requests use Conventional Commit prefixes such as
`feat:` and `fix:`. They do not change `package.json`, `src/dashboard-strategy.ts`,
the release manifest, or the release section in `CHANGELOG.md` manually.

After a pull request is merged into `main`, the workflow in
`.github/workflows/release-please.yml` maintains the Release-Please PR. When that
PR is merged, the workflow performs this sequence:

1. Read the generated release tag.
2. Check out that exact tag.
3. Run typecheck, lint, translation checks, all tests, and the production build.
4. Verify the version marker, all required code-split chunks, compressed files,
   and the HACS distribution.
5. Upload the complete `dist` asset set to a draft GitHub release.
6. Verify that the draft contains exactly the local release asset set.
7. Publish the release.
8. Verify that the published release still contains the complete asset set.

The release is never intentionally published before its HACS assets pass the
remote verification. The old `release.published` trigger was removed because it
published first and uploaded the code-split assets afterwards.

## One-time GitHub configuration

No custom token or GitHub App is required. GitHub creates the short-lived
`GITHUB_TOKEN` automatically for every Actions run. The workflow requests write
access for repository contents, issues, and pull requests.

In the repository settings, enable **Settings → Actions → General → Workflow
permissions → Read and write permissions**. If GitHub shows the option, also
enable **Allow GitHub Actions to create and approve pull requests**. The
repository-level permissions in the workflow still limit the token to the
operations needed here.

GitHub Actions created with `GITHUB_TOKEN` do not reliably trigger additional
workflow runs. The release workflow therefore performs the release build,
asset upload, remote verification, and publication in the same run.

## Manual repair or recovery

Use **Actions → Release build**, enter an existing tag such as `v1.29.0`, and
leave **Publish** disabled when repairing an already published release. The
workflow checks out the tag, verifies that it is reachable from `main`, rebuilds
the exact release assets, uploads them, and verifies the remote asset set.

Enable **Publish** only for a draft release that has passed the asset check.
The manual workflow also accepts tags through an explicit argument in the
version check, so it does not depend on the branch that started the dispatch.

## Local release gate

Run this before merging release-related changes:

```text
npm run verify:release
```

This runs the quality checks, production build, version synchronization check,
artifact validation, and HACS distribution validation.
