# Validation Summary

## Validation Rubric

- [x] Verify whether any discovered candidate has an attacker-controlled source.
- [x] Verify whether any discovered candidate reaches a dangerous sink or broken security control.
- [x] Verify whether repository evidence supports realistic reachability from the threat model.
- [x] Verify whether dependency or secret scans produce reportable findings.
- [x] Verify whether hygiene issues are distinguishable from security vulnerabilities.

## Candidate Validation

No candidate findings entered validation. Discovery produced no reportable candidates, and the coverage ledger rows were closed as `suppressed`, `not_applicable`, or `needs follow-up` for hygiene-only worktree removal.

## Closure Table

| Ledger Row | Instance Key | Root Control | Entrypoint / Source | Sink / Control | Disposition | Counterevidence or Proof Gap | Survives |
| --- | --- | --- | --- | --- | --- | --- | --- |
| COV-001 | supply-chain:entry | `src/dashboard-strategy.ts`, `webpack.config.ts` | HACS frontend resource | Webpack chunk/resource loading | suppressed | No remote loader; generated chunks come from local build. | no |
| COV-002 | entity-filtering:registry | `src/Registry.ts` | HA registry/state metadata | Visibility filtering | suppressed | Registry checks hidden/disabled/config/diagnostic/no_dboard controls. | no |
| COV-003 | yaml:editor | `src/editor/StrategyEditor.ts` | Admin YAML config | `js-yaml` parse and Lovelace config | suppressed | Admin-controlled config only; no execution by this project; audit clean. | no |
| COV-004 | dom:editor-unsafehtml | `src/editor/StrategyEditor.ts` | Bundled translations | `unsafeHTML` | suppressed | Only fixed bundled translation strings reach `unsafeHTML`. | no |
| COV-005 | action:ha-service | `src/views/SecurityViewStrategy.ts`, `src/cards/*GroupCard.ts` | Registry-visible entities | HA `perform-action` targets | suppressed | Targets are generated from matching visible HA entity domains/states. | no |
| COV-006 | dom:custom-cards | `src/cards/*.ts` | HA state updates | Lit DOM and HA child card elements | suppressed | No attacker-controlled HTML sink; `innerHTML` only clears containers. | no |
| COV-007 | template:button-card-date | `src/views/OverviewViewStrategy.ts` | Static code template | `custom:button-card` JS template | suppressed | Template contains no user/entity interpolation. | no |
| COV-008 | deps:npm | `package.json`, `package-lock.json` | Dependency graph | Known vulnerable packages | suppressed | `npm audit --json` reported zero vulnerabilities. | no |
| COV-009 | secrets:repo | repository text | Repository contents | Secret material | suppressed | Secret keyword search found no credentials. | no |
| COV-010 | hygiene:worktree | `.worktrees/upstream-pr` | Local registered worktree | Accidental publication / ballast | not_applicable | Not shipped runtime code; ignored now. Removal needs explicit approval. | no |
