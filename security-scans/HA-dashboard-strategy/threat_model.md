# Overview

Dashboard Strategy is a client-side Home Assistant Lovelace dashboard strategy distributed through HACS. The shipped runtime is the generated JavaScript bundle in `dist/`, built from TypeScript source in `src/`. Home Assistant loads the resource in the browser and invokes the custom strategy element to generate Lovelace views from the `hass` object, registry metadata, entity states, and administrator-provided dashboard strategy configuration.

The repository has no backend service, database, authentication layer, credential store, or direct filesystem API at runtime. Security-sensitive behavior is therefore frontend and configuration oriented: the strategy decides which entities are represented in generated Lovelace config, which Home Assistant actions are exposed through cards, how operator-authored YAML is parsed and forwarded, and what bundle artifacts HACS users install.

Primary runtime components include `src/dashboard-strategy.ts` for entry registration and view generation, `src/Registry.ts` for Home Assistant registry indexing and visibility filtering, `src/views/*` and `src/sections/*` for generated Lovelace view structure, `src/cards/*` for reactive custom card UI, `src/editor/StrategyEditor.ts` for the graphical editor and YAML parsing, `src/types/strategy.ts` for the configuration surface, and `webpack.config.ts` plus `hacs.json` for release delivery.

# Threat Model, Trust Boundaries, and Assumptions

Home Assistant is the privileged host. It supplies `hass.entities`, `hass.devices`, `hass.areas`, `hass.floors`, `hass.states`, localization context, custom card helpers, and service/action execution semantics. The strategy must treat those objects as authoritative for registry-only fields such as `hidden_by`, `disabled_by`, `entity_category`, `platform`, and `device_id`.

Dashboard administrators control the strategy YAML and the editor output. Custom cards, custom sections, custom badges, custom views, and per-area custom cards are intentional administrator-authored Lovelace configuration. This configuration can be powerful in Home Assistant terms, but the strategy must not accidentally transform it into raw HTML/script execution or into actions against unintended entities.

Home Assistant integrations and devices can influence semi-trusted metadata such as entity names, area names, icons, device classes, labels, and current state strings. These values should be rendered through Lit or Lovelace configuration contexts, not through unsafe DOM string sinks.

End users who can view the dashboard may interact with generated cards. Their realistic attack surface is limited to UI interactions that trigger configured Lovelace actions; they should not be able to make the strategy operate hidden/config/diagnostic entities, expand access beyond Home Assistant permissions, or alter generated action targets.

The HACS install path and public custom element names are compatibility boundaries. Release artifacts must keep the configured `publicPath`, stable custom element names, `dashboard-strategy.js` filename, and expected chunks intact. Stale bundles, source maps with secrets, or inconsistent source/dist output are release-hygiene risks.

# Attack Surface, Mitigations, and Attacker Stories

Relevant frontend injection surfaces include Lit templates, `unsafeHTML`, `innerHTML`, dynamically created Home Assistant card elements, translated strings, YAML-derived Lovelace config, icons, names, and user-entered editor strings. The safe baseline is to rely on Lit bindings and Home Assistant Lovelace card config rather than inserting registry or YAML data as raw HTML.

Relevant action-generation surfaces include lights, covers, locks, alarm/security views, room controls, area cards, room pins, custom sections, and utility summary views. The important invariant is that generated Home Assistant actions use fixed service names and registry-derived entities from the intended domain, and that hidden, disabled, config, diagnostic, or explicitly suppressed entities are not reintroduced through a bypassing path.

Relevant configuration surfaces include `js-yaml` parsing in the editor, `config-changed` events, visual card picker templates, weather-start blocks, custom cards, custom sections, custom badges, and custom views. Because these are administrator-controlled Lovelace config paths, vulnerabilities matter when the strategy mishandles the parsed objects, widens capability beyond ordinary Lovelace admin intent, or confuses invalid YAML with trusted generated config.

Relevant supply-chain and release surfaces include `package-lock.json`, `webpack.config.ts`, `hacs.json`, generated `dist/` chunks, compressed artifacts, license output, and README/HACS metadata. The main risks are vulnerable dependencies that affect shipped frontend code, release bundles that do not match source expectations, accidentally shipped source maps or secrets, and HACS metadata that points Home Assistant to the wrong resource path.

Existing mitigations include TypeScript strict mode, centralized registry visibility filtering in `Registry`, pre-filtered lookup maps, stable domain-specific view builders, fixed tile feature helpers, Lit-based rendering, code splitting with a small entry chunk, and generated chunk names with content hashes. These controls reduce accidental unsafe rendering, repeated ad hoc entity scans, and release-cache confusion.

Out of scope for this repository are direct server-side authentication bypass, database injection, SSRF, filesystem traversal, file upload, command execution, and network callback abuse unless introduced by build tooling, dependencies, or a future runtime feature. Home Assistant itself remains responsible for core authentication, authorization, service execution policy, and Lovelace sandbox semantics.

# Severity Calibration

Critical issues would require unauthenticated or non-admin attacker input to execute arbitrary script in the Home Assistant frontend, bypass Home Assistant authentication, or cause arbitrary privileged Home Assistant actions against attacker-selected entities. This is unlikely in the current client-only architecture but would matter if integration metadata or dashboard viewer input reached script execution or service-call target selection.

High issues include integration-controlled metadata reaching an HTML/script sink, generated lock/cover/security actions targeting unintended entities due to broken registry filtering, or a release artifact that ships attacker-controlled executable content. High severity requires a realistic non-admin or semi-trusted source crossing into a privileged frontend or action boundary.

Medium issues include administrator YAML being mishandled beyond expected Lovelace capability, hidden/config/diagnostic entities being exposed through a shared path, custom card config being transformed into unsafe DOM, dependency vulnerabilities with plausible frontend/build impact, or stale generated bundles that create confusing but bounded HACS behavior.

Low issues include repository hygiene problems, documentation or metadata inconsistencies, stale local scan/build artifacts without runtime reachability, non-sensitive information leakage in release files, and developer-only issues that do not affect installed HACS users.
