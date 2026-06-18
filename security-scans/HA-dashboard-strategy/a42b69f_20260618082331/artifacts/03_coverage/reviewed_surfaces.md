# Reviewed Surfaces

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
