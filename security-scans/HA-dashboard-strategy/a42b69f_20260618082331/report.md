# Security Review: HA-dashboard-strategy

## Scope

- In-scope code: `C:\Users\admin\SynologyDrive\Documents\Claude-Projects\HA-dashboard-strategy`
- Scan mode: repository-wide Codex Security scan with subagent file-review shards
- Commit reviewed: `a42b69f`
- Repository version: `1.18.2`
- Scan id: `a42b69f_20260618082331`
- Threat model: generated during Phase 1 and saved to `artifacts/01_context/threat_model.md`
- Worklist reviewed: 47 / 47 current runtime/source/config rows from `artifacts/02_discovery/deep_review_input.csv`
- Completion evidence: all 47 rows have receipts in `artifacts/02_discovery/work_ledger.jsonl`
- Runtime/test status: `npm audit --audit-level=low`, `npm audit --json`, `npm run typecheck`, and `npm run lint` completed successfully
- Explicit exclusions: historical `security-scans/`, local `.worktrees/`, `.superpowers/`, docs/media assets, planning docs, dependency/vendor trees, and generated caches were not deep-reviewed as source. Generated `dist/` bundles were checked for source maps, secrets, HACS path consistency, and release hygiene.

### Scan Summary

| Field | Value |
| --- | --- |
| Reportable findings | 0 |
| Severity mix | none |
| Confidence mix | high confidence no reportable runtime security issue was found in reviewed surfaces |
| Coverage | 47 / 47 deep-review rows closed; 9 coverage rows closed |
| Validation mode | static trace, subagent full-file review, targeted sink search, dependency audit, typecheck, lint, source-map and secret hygiene checks |
| Final HTML report | `report.html` |

Artifacts:

- Threat model: `artifacts/01_context/threat_model.md`
- Seed research: `artifacts/01_context/seed_research.md`
- Discovery report: `artifacts/02_discovery/finding_discovery_report.md`
- Work ledger: `artifacts/02_discovery/work_ledger.jsonl`
- Coverage ledger: `artifacts/03_coverage/repository_coverage_ledger.md`
- Reviewed surfaces: `artifacts/03_coverage/reviewed_surfaces.md`
- Dedupe report: `artifacts/04_reconciliation/dedupe_report.md`
- Validation summary: `artifacts/05_findings/validation_summary.md`
- Attack-path analysis: `artifacts/05_findings/attack_path_analysis_report.md`

## Threat Model

### Overview

Dashboard Strategy is a client-side Home Assistant Lovelace dashboard strategy distributed through HACS. The shipped runtime is the generated JavaScript bundle in `dist/`, built from TypeScript source in `src/`. Home Assistant loads the resource in the browser and invokes the custom strategy element to generate Lovelace views from the `hass` object, registry metadata, entity states, and administrator-provided dashboard strategy configuration.

The repository has no backend service, database, authentication layer, credential store, or direct filesystem API at runtime. Security-sensitive behavior is therefore frontend and configuration oriented: the strategy decides which entities are represented in generated Lovelace config, which Home Assistant actions are exposed through cards, how operator-authored YAML is parsed and forwarded, and what bundle artifacts HACS users install.

Primary runtime components include `src/dashboard-strategy.ts` for entry registration and view generation, `src/Registry.ts` for Home Assistant registry indexing and visibility filtering, `src/views/*` and `src/sections/*` for generated Lovelace view structure, `src/cards/*` for reactive custom card UI, `src/editor/StrategyEditor.ts` for the graphical editor and YAML parsing, `src/types/strategy.ts` for the configuration surface, and `webpack.config.ts` plus `hacs.json` for release delivery.

### Trust Boundaries And Assumptions

Home Assistant is the privileged host. It supplies `hass.entities`, `hass.devices`, `hass.areas`, `hass.floors`, `hass.states`, localization context, custom card helpers, and service/action execution semantics. The strategy must treat registry-only fields such as `hidden_by`, `disabled_by`, `entity_category`, `platform`, and `device_id` as authoritative from the HA registry.

Dashboard administrators control the strategy YAML and the editor output. Custom cards, custom sections, custom badges, custom views, and per-area custom cards are intentional administrator-authored Lovelace configuration. This configuration can be powerful in Home Assistant terms, but the strategy must not accidentally transform it into raw HTML/script execution or into actions against unintended entities.

Home Assistant integrations and devices can influence semi-trusted metadata such as entity names, area names, icons, device classes, labels, and current state strings. These values should be rendered through Lit or Lovelace configuration contexts, not through unsafe DOM string sinks.

End users who can view the dashboard may interact with generated cards. Their realistic attack surface is limited to UI interactions that trigger configured Lovelace actions; they should not be able to make the strategy operate hidden/config/diagnostic entities, expand access beyond Home Assistant permissions, or alter generated action targets.

The HACS install path and public custom element names are compatibility boundaries. Release artifacts must keep the configured `publicPath`, stable custom element names, `dashboard-strategy.js` filename, and expected chunks intact.

### Attack Surface And Mitigations

Relevant frontend injection surfaces include Lit templates, `unsafeHTML`, `innerHTML`, dynamically created Home Assistant card elements, translated strings, YAML-derived Lovelace config, icons, names, and user-entered editor strings. The safe baseline is to rely on Lit bindings and Home Assistant Lovelace card config rather than inserting registry or YAML data as raw HTML.

Relevant action-generation surfaces include lights, covers, locks, alarm/security views, room controls, area cards, room pins, custom sections, and utility summary views. The important invariant is that generated Home Assistant actions use fixed service names and registry-derived entities from the intended domain, and that hidden, disabled, config, diagnostic, or explicitly suppressed entities are not reintroduced through a bypassing path.

Relevant configuration surfaces include `js-yaml` parsing in the editor, `config-changed` events, visual card picker templates, weather-start blocks, custom cards, custom sections, custom badges, and custom views. Because these are administrator-controlled Lovelace config paths, vulnerabilities matter when the strategy mishandles the parsed objects, widens capability beyond ordinary Lovelace admin intent, or confuses invalid YAML with trusted generated config.

Relevant supply-chain and release surfaces include `package-lock.json`, `webpack.config.ts`, `hacs.json`, generated `dist/` chunks, compressed artifacts, license output, and README/HACS metadata. The main risks are vulnerable dependencies that affect shipped frontend code, release bundles that do not match source expectations, accidentally shipped source maps or secrets, and HACS metadata that points Home Assistant to the wrong resource path.

Existing mitigations include TypeScript strict mode, centralized registry visibility filtering in `Registry`, pre-filtered lookup maps, stable domain-specific view builders, fixed tile feature helpers, Lit-based rendering, code splitting with a small entry chunk, and generated chunk names with content hashes.

### Severity Calibration

Critical issues would require unauthenticated or non-admin attacker input to execute arbitrary script in the Home Assistant frontend, bypass Home Assistant authentication, or cause arbitrary privileged Home Assistant actions against attacker-selected entities.

High issues include integration-controlled metadata reaching an HTML/script sink, generated lock/cover/security actions targeting unintended entities due to broken registry filtering, or a release artifact that ships attacker-controlled executable content.

Medium issues include administrator YAML being mishandled beyond expected Lovelace capability, hidden/config/diagnostic entities being exposed through a shared path, custom card config being transformed into unsafe DOM, dependency vulnerabilities with plausible frontend/build impact, or stale generated bundles that create confusing but bounded HACS behavior.

Low issues include repository hygiene problems, documentation or metadata inconsistencies, stale local scan/build artifacts without runtime reachability, non-sensitive information leakage in release files, and developer-only issues that do not affect installed HACS users.

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

### No findings

No reportable security findings survived discovery, validation, or attack-path review.

The reviewed suspicious surfaces were closed with counterevidence:

- `unsafeHTML` receives only static bundled translation strings with fixed markup.
- `innerHTML` is used only to clear containers before rebuilding child card pools.
- `yaml.load` parses administrator-authored Lovelace config as data; no code execution or raw HTML sink was identified.
- Custom cards, custom sections, custom badges, custom views, and area custom cards are intentional administrator Lovelace config pass-through.
- Light, cover, and lock actions use fixed service names and visible registry-derived entity lists unless explicitly configured by an administrator.
- `Registry` centralizes visibility filtering for `no_dboard`, config-hidden, HA-hidden/disabled, and config/diagnostic entities.
- Native camera rendering uses visible camera entities; WebRTC stream configuration is administrator-controlled and this repository performs no network fetch.
- `npm audit` reported zero known vulnerabilities.
- `dist/` contains no source maps and no `sourceMappingURL`, `webpack://`, or `eval(` markers.
- Secret search found only local render-token variable names.

## Reviewed Surfaces

| Surface | Risk Area | Outcome | Notes |
| --- | --- | --- | --- |
| Editor YAML and config mutation | Unsafe parsing, DOM injection, config privilege expansion | No issue found | `yaml.load` parses administrator Lovelace config as data; `config-changed` preserves parsed config and strips editor-only `_yaml_error`; `unsafeHTML` uses fixed bundled translation keys. |
| Registry visibility filtering | Hidden/disabled/config/diagnostic entity exposure | No issue found | Visible maps exclude `no_dboard`, config-hidden, HA-hidden/disabled, and config/diagnostic entities. Raw area accessor usage is used to compute native card exclusions. |
| Generated HA actions | Wrong service or target entity | No issue found | Light, cover, and lock actions use fixed services and visible registry-derived entity lists, with admin-authored config treated as Lovelace admin intent. |
| Custom Lovelace content | Confused deputy / XSS via custom cards, views, sections, badges | Rejected | Custom content is administrator-authored Lovelace config pass-through and is not inserted as raw HTML by this repository. |
| Cards and native HA child cards | DOM sink or unsafe card creation | No issue found | `innerHTML` clears only; card creation uses fixed HA/custom element paths or admin Lovelace config; no script sink was found. |
| Camera rendering | Unsafe URL fetch or camera exposure | No issue found | Native camera cards use visible camera entities; WebRTC stream config is administrator-controlled; this repo does not perform network fetches. |
| Release and supply chain | Dependency/advisory, source maps, HACS path mismatch | No issue found | `npm audit` clean; HACS filename and Webpack public path align; no source maps in `dist`. |
| Secrets | Hardcoded credential leakage | No issue found | Secret scan found only local variable names containing `token` in render guards. |
| Historical/generated paths | Scan artifacts, worktrees, media, generated bundles | Not applicable | Excluded from source deep review; `dist/` was checked for release hygiene. |

## Open Questions And Follow Up

- A live Home Assistant validation pass can still be useful before release for behavioral assurance, especially around generated cards and editor flows, but no security finding depends on that runtime proof.
- Future changes touching `src/editor/StrategyEditor.ts`, `src/Registry.ts`, `src/views/RoomViewStrategy.ts`, or generated action builders should get targeted security review because those files carry the main trust boundaries.
