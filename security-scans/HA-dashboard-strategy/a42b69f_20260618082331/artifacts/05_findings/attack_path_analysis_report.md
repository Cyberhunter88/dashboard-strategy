# Attack-Path Analysis Report

## Inputs

- Threat model: `artifacts/01_context/threat_model.md`
- Discovery report: `artifacts/02_discovery/finding_discovery_report.md`
- Coverage ledger: `artifacts/03_coverage/repository_coverage_ledger.md`
- Validation summary: `artifacts/05_findings/validation_summary.md`

## Reportability Decision

No candidate finding reached attack-path analysis as a surviving issue. All nine coverage-ledger rows were closed during validation as `suppressed` or `not_applicable`, and `raw_candidates.jsonl` is empty.

## Attack-Path Facts

- In-scope status: The reviewed source and release metadata are in scope for the repository threat model.
- Exposure: The shipped runtime is a browser-loaded Home Assistant Lovelace resource installed through HACS.
- Identity and privileges: Home Assistant owns core authentication, authorization, service execution, and Lovelace rendering semantics. This repository builds client-side config and card UI.
- Attacker input control: Lower-privileged attacker control was not identified for raw DOM/script sinks or service-action selection. Administrator-authored YAML and custom Lovelace config are intentional admin configuration.
- Cross-boundary behavior: No reviewed path showed HA metadata or dashboard-viewer input crossing into script execution, arbitrary service selection, hidden/config entity rendering, or network/filesystem impact.
- Mitigations: Registry pre-filtered visible maps, fixed service names, Lit rendering, static bundled translations, production Webpack config without source maps, and clean dependency audit.
- Counterevidence: The strongest suspicious surfaces were `unsafeHTML`, `innerHTML`, `yaml.load`, custom Lovelace pass-through, lock/cover/light batch actions, WebRTC stream configuration, and generated `dist/` bundles. Each was closed with repository evidence: static translations only, clear-only HTML, admin config only, fixed services with visible targets, admin stream config, and no source maps/advisories.
- Blindspots: No live Home Assistant instance was used. This limits runtime UI confirmation but does not leave any candidate proof gap because no source-to-sink candidate survived static validation.
- Confidence: High confidence that no reportable security issue was found in the reviewed surfaces.

## Severity And Policy

No severity is assigned because there are no reportable findings.

Policy decision: `ignore` for all suppressed or not-applicable rows. The final report should list zero findings and preserve reviewed-surface evidence for auditability.
