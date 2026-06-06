# Reviewed Surfaces

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
