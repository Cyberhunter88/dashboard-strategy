# Finding Discovery Report

## Scope

- Scan id: `a42b69f_20260618082331`
- Commit reviewed: `a42b69f`
- Repository version: `1.18.2`
- Mode: repository-wide Codex Security scan with subagent file-review shards
- Threat model: `artifacts/01_context/threat_model.md`

## Worklist

- Generated deterministic `rank_input.csv` with 306 source-like rows.
- Selected `deep_review_input.csv` with 47 current runtime/source/config rows.
- Deep-reviewed all 47 selected rows and wrote a completion receipt for each row in `work_ledger.jsonl`.
- Explicitly excluded historical `security-scans/`, local `.worktrees/`, `.superpowers/`, media assets, planning docs, generated caches, and generated `dist/` bundles from full-file source review. `dist/` was reviewed for release hygiene only.

## Discovery Results

No raw candidate findings were emitted.

Reviewed and closed surfaces included:

- DOM injection sinks: `unsafeHTML`, `innerHTML`, native HA card creation, dynamic custom card elements, translated strings, and Lit templates.
- YAML/config handling: `js-yaml` parsing in `StrategyEditor.ts` and `EditableCard.ts`, editor `config-changed` events, visual card picker YAML, custom cards, custom sections, custom badges, custom views, and weather-start overrides.
- HA action generation: fixed `light`, `cover`, and `lock` action configs and their entity sources.
- Entity visibility: `Registry` pre-filtering for hidden, disabled, config, diagnostic, `no_dboard`, and config-hidden entities.
- Custom content pass-through: administrator-authored Lovelace config only, with no lower-privileged metadata source reaching raw HTML or script sinks.
- Release hygiene: HACS filename/path, Webpack public path, chunk naming, source-map absence, compressed bundle outputs, and dependency advisories.
- Secrets: keyword scan produced only false positives for local render-token variable names in card code.

## Evidence Summary

- Subagent shards returned no raw candidates for all assigned files.
- `npm audit --audit-level=low` returned `found 0 vulnerabilities`.
- `npm audit --json` returned zero vulnerabilities.
- `npm run typecheck` passed.
- `npm run lint` passed.
- No `.map` files were present under `dist/`.
- No `sourceMappingURL`, `webpack://`, or `eval(` markers were found in `dist/`.

## Candidate Inventory

`raw_candidates.jsonl` is empty. No per-candidate ledgers were required.
