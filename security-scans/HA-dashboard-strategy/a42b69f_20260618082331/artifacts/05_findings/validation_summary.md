# Validation Summary

## Rubric

- [x] Every `deep_review_input.csv` row has a completion receipt.
- [x] Every coverage-ledger row has a terminal disposition: `suppressed` or `not_applicable`.
- [x] Every plausible sink family has exact counterevidence or a non-applicability reason.
- [x] Dependency, lint, and typecheck validation completed successfully.
- [x] No raw candidate finding requires a per-candidate validation receipt.

## Validation Method

Validation used static trace, subagent full-file receipts, targeted sink searches, dependency audit, typecheck, lint, `dist/` hygiene checks, and coverage-ledger reconciliation.

Commands completed successfully:

- `npm audit --audit-level=low`: `found 0 vulnerabilities`
- `npm audit --json`: zero total vulnerabilities across 228 dependencies
- `npm run typecheck`
- `npm run lint`

Additional validation:

- DOM sink search found only static-translation `unsafeHTML`, clear-only `innerHTML`, and non-security timer usage.
- HA action search showed fixed `perform-action` services and visible/domain-filtered target lists.
- Secret scan found only local render-token variable false positives in card rendering code.
- `dist/` contained no `.map` files and no `sourceMappingURL`, `webpack://`, or `eval(` markers.

## Validation Closure Table

| Ledger Row | Instance Key | Advisory / Source | Seed Anchor | Root Control | Entrypoint / Source | Sink / Control | Disposition | Counterevidence Or Proof Gap | Survives |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| COV-001 | dom-xss:editor-cards-translations | none | none | `StrategyEditor.ts` unsafeHTML call sites and card `innerHTML` call sites | HA metadata, admin config, static translations | DOM/script rendering | suppressed | `unsafeHTML` receives static bundled localization strings; `innerHTML` clears containers only; no lower-privileged source reaches raw HTML. | no |
| COV-002 | yaml-config:editor-editable-custom-content | none | none | `StrategyEditor.ts` / `EditableCard.ts` YAML parse paths | Administrator-authored YAML | `yaml.load`, parsed config storage, `config-changed` | suppressed | YAML is parsed as Lovelace config data for dashboard administrators; no code execution or raw DOM sink was found. | no |
| COV-003 | action-target:light-cover-lock | none | none | Light, cover, security view/card action builders | Dashboard viewer clicks generated controls | `perform-action` targets | suppressed | Services are fixed and targets come from visible registry-domain lists or explicit admin config; no service-domain selection by metadata/user input. | no |
| COV-004 | entity-visibility:registry-generated-views | none | none | `Registry._isEntityVisible` and generated view callers | HA registry metadata and strategy config | Visible-domain/area maps and entity selection | suppressed | Registry excludes hidden/disabled/config/diagnostic/no_dboard/config-hidden entities; raw accessor use computes exclusions. | no |
| COV-005 | custom-lovelace:admin-pass-through | none | none | Lovelace custom content rendering helpers | Administrator custom cards/views/sections/badges | Parsed Lovelace config pass-through | suppressed | Pass-through is intentional Lovelace admin capability and does not introduce a new lower-privileged source or raw script sink. | no |
| COV-006 | camera-webrtc:visible-camera-admin-stream | none | none | Camera card and room camera builder | Visible camera entities and admin stream config | Native camera card / WebRTC config | suppressed | No fetch sink exists in this repo; camera entities are visible registry entries and stream URLs are admin config. | no |
| COV-007 | supply-chain:release-build-hacs | none | none | HACS and Webpack release config | Installed HACS resource and build output | Public path, chunks, dependencies, source maps | suppressed | HACS and Webpack paths align; production build has no devtool; audit is clean; no source maps are present. | no |
| COV-008 | secrets:source-config-release | none | none | Repository source and metadata | Repo files | Secret patterns | suppressed | Secret scan found no credentials; only render-token variable false positives. | no |
| COV-009 | excluded-generated-historical | none | none | Scope boundary | Historical scans, worktrees, media, generated bundles | Full-file source review | not_applicable | These paths are not current runtime source/control surfaces; `dist/` received hygiene checks. | no |

## Result

No candidate survived validation. No per-finding validation reports or validation artifacts were required because `raw_candidates.jsonl` is empty.
