# Security Review: HA-dashboard-strategy

## Scope

- In-scope code: `C:\Users\admin\Documents\Claude-Projects\HA-dashboard-strategy`
- Scan mode: repository-wide local Codex Security standard scan with subagent file-review shards
- Commit reviewed: `853fdd2` (`main`, release v1.15.8)
- Scan id: `853fdd2_20260606220952`
- Worklist reviewed: 40 current root runtime/build rows from `artifacts/02_discovery/deep_review_input.csv`
- Completion evidence: all 40 rows have receipts in `artifacts/02_discovery/work_ledger.jsonl`
- Runtime/test status: `npm audit --audit-level=low`, `npm audit --json`, `npm run lint`, and `npm run typecheck` completed successfully
- Explicit exclusions: local `.worktrees/`, existing `security-scans/`, docs/media assets, `node_modules/`, `.superpowers/`, and generated tracked `dist` bundles were not deep-reviewed as source; `dist` was checked for source maps/secrets/release hygiene only
- Cleanup performed before scan: removed untracked `.codex-remote-attachments/`, untracked stale `dist/` chunks, and untracked incomplete Inline Editor files

### Scan Summary

| Field | Value |
| --- | --- |
| Reportable findings | 0 |
| Severity mix | none |
| Confidence mix | high confidence no reportable runtime security issue was found in reviewed surfaces |
| Coverage | 40 / 40 deep-review rows closed; 8 coverage rows closed |
| Validation mode | static review, subagent file review, dependency audit, lint, typecheck, source-wide sink and secret searches |
| Main hygiene result | Planned conservative cleanup completed; tracked release artifacts and scan history preserved |

Artifacts:

- Threat model: `artifacts/01_context/threat_model.md`
- Discovery report: `artifacts/02_discovery/finding_discovery_report.md`
- Work ledger: `artifacts/02_discovery/work_ledger.jsonl`
- Coverage ledger: `artifacts/03_coverage/repository_coverage_ledger.md`
- Reviewed surfaces: `artifacts/03_coverage/reviewed_surfaces.md`
- Validation summary: `artifacts/05_findings/validation_summary.md`
- Attack-path analysis: `artifacts/05_findings/attack_path_analysis_report.md`

## Threat Model

### Overview

This repository ships a client-side Home Assistant custom Lovelace dashboard strategy written in TypeScript. The deployed runtime is the generated JavaScript bundle under `dist/`, loaded by Home Assistant as a frontend resource. Source under `src/` generates Lovelace views and custom Lit cards from Home Assistant registry/state metadata plus operator-provided strategy configuration.

The project has no backend routes, database, credential store, direct filesystem API, or standalone network server. Security-relevant behavior is frontend-side: it decides which entities, cards, badges, views, and Home Assistant actions are represented in Lovelace config.

### Trust Boundaries

- Home Assistant is the privileged host and supplies the `hass` object, entity states, registries, card helpers, localization context, and service/action execution model.
- Dashboard administrators/operators control strategy YAML, custom cards, custom views, custom badges, and editor input. Free-form Lovelace YAML is therefore intentional operator configuration.
- Entity/device/area/floor registry metadata can contain semi-trusted integration-provided names, icons, labels, device classes, and state values.
- Generated Lovelace actions for lights, covers, locks, and security surfaces must be bound to expected registry-derived entity domains and states.
- Build artifacts under `dist/` are shipped by HACS; unexpected, stale, or untracked generated files are release-hygiene risk even when not directly exploitable.

### Main Security Questions

- Can HA metadata or operator config reach local DOM injection sinks such as `unsafeHTML`, `innerHTML`, script/eval, or custom element creation in an unintended way?
- Can generated `perform-action` configs target an unintended domain or hidden/disabled/config/diagnostic entity?
- Can operator-authored YAML gain capability beyond normal Lovelace administrator intent?
- Are release/build assets or dependencies unexpectedly vulnerable or confusing for HACS delivery?
- Are secrets or credentials present in source, config, or release metadata?

### Severity Calibration

- Critical: unauthenticated or non-admin input can execute script in Home Assistant, bypass HA auth, or trigger arbitrary privileged HA actions.
- High: integration-controlled metadata reaches an HTML/script sink, or generated actions can operate on unintended lock/cover/security targets.
- Medium: operator YAML is mishandled beyond expected Lovelace capability, hidden/disabled/config entities are exposed by a shared path, or a dependency issue has plausible frontend/build impact.
- Low: repository hygiene, stale local artifacts, confusing release files, or developer-only files without runtime reachability.

## Findings

| Severity | Count |
| --- | ---: |
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |

### Confidence Scale

| Label | Meaning |
| --- | --- |
| high | Direct source, configuration, or runtime evidence supports the finding, with no material unresolved reachability or exploitability blocker. |
| medium | Source evidence supports a plausible issue, but runtime behavior, deployment configuration, role reachability, type constraints, or exploit reliability still need proof. |
| low | Weak or incomplete evidence; include only when the user explicitly wants follow-up candidates in the final report. |

### No Findings

No reportable security findings survived discovery, validation, or attack-path review. The plausible hotspots were reviewed and closed with counterevidence:

- `js-yaml` usage parses administrator/operator Lovelace YAML and does not execute it in this project.
- `unsafeHTML` receives only bundled translation strings with fixed markup.
- `innerHTML` use only clears private card containers with an empty string.
- Generated HA actions target visible registry-derived entities in expected domains with fixed service names.
- Custom cards, custom views, custom badges, and per-area custom cards remain normal administrator-authored Lovelace configuration.
- `npm audit --json` reported zero known vulnerabilities.
- Secret keyword search found no credentials.

## Reviewed Surfaces

| Surface | Risk Area | Outcome | Notes |
| --- | --- | --- | --- |
| Registry and entity filtering | Hidden/disabled/config entity exposure | No issue found | Registry visibility controls and raw accessor callsites were reviewed. |
| Editor YAML parsing | Unsafe parsing / arbitrary config | No issue found | YAML is operator-controlled Lovelace config; invalid configs are tracked as parse errors. |
| Localized HTML | DOM XSS | Rejected | `unsafeHTML` only receives bundled translations with fixed markup. |
| Custom Lit cards | DOM injection / stale service targeting | No issue found | Lit bindings and fixed HA child-card elements are used; `innerHTML` clears only. |
| Generated HA actions | Wrong lock/cover/light target | No issue found | Fixed service names use registry-derived visible entities in matching domains. |
| Overview and room custom cards | Operator config pass-through | No issue found | Parsed config objects are forwarded as Lovelace config, not raw HTML. |
| Build and HACS metadata | Release/dependency risk | No issue found | Audit clean; production Webpack config matches fixed HACS path and hashed chunks. |
| Secrets | Credential leakage | No issue found | Source/config keyword search found no credentials. |
| Local hygiene | Untracked clutter | Cleaned | Removed untracked attachment folder, untracked stale `dist` chunks, and incomplete untracked Inline Editor files. |

## Open Questions And Follow Up

- The existing local worktrees under `.worktrees/` are still ignored and were intentionally not removed. A separate cleanup can run `git worktree list` and remove only worktrees you no longer need.
- Future feature work that makes Inline Editor functionality intentional should reintroduce it as a complete feature with types, registration, tests, and a fresh security review of the `lovelace/config/save` WebSocket path.
