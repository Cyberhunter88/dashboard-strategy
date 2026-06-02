# Reviewed Surfaces

| Surface | Risk Area | Outcome | Notes |
| --- | --- | --- | --- |
| Strategy entry and chunk loading | Supply-chain / shipped executable assets | No issue found | Build and HACS config reviewed; no remote loader or unexpected executable source found. |
| Registry and filtering helpers | Hidden/config/diagnostic entity exposure | No issue found | Registry-based `hidden_by`, `disabled_by`, `entity_category`, labels, and config hidden sets are used before display. |
| Editor YAML parsing | Unsafe parsing / arbitrary config | No issue found | YAML is administrator-controlled Lovelace config, parsed by `js-yaml`; dependency audit is clean. |
| Editor localized HTML | DOM XSS | Rejected | `unsafeHTML` is limited to bundled translation strings with fixed `<strong>` markup; no user-controlled string reaches it. |
| Generated HA actions | Privileged service action abuse | No issue found | Targets are registry-visible entity lists in matching domains/states. |
| Lit custom cards | DOM injection / stale targeting | No issue found | Uses Lit templates and HA child card elements; `innerHTML` only clears private containers. |
| Static `custom:button-card` date template | Client script template abuse | Rejected | Static template only formats the current date and does not interpolate attacker-controlled data. |
| Dependencies | Known vulnerable package | No issue found | `npm audit --json` reported zero vulnerabilities. |
| Secrets | Credential leakage | No issue found | Secret keyword search found no credentials. |
| `.worktrees/upstream-pr` | Project hygiene / accidental publication | Needs follow-up | Registered local worktree consumes about 329 MB and was added to `.gitignore`; actual removal needs explicit user approval. |
