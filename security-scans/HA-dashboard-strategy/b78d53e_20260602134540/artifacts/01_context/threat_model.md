# Threat Model: HA Dashboard Strategy

## Overview

This repository ships a Home Assistant custom Lovelace dashboard strategy written in TypeScript. The runtime bundle is loaded by Home Assistant as a frontend resource and generates Lovelace views from the Home Assistant `hass` object, entity/device/area registries, and user-provided strategy configuration. The main deployed assets are the generated JavaScript chunks under `dist/`; source files under `src/` define the strategy entry point, registry, view strategies, custom Lit cards, and the configuration editor.

The product does not expose its own server, HTTP routes, database, credentials store, or direct filesystem/network APIs. Security-relevant behavior is primarily client-side: it chooses which Home Assistant entities, cards, actions, and custom user-provided Lovelace YAML are rendered into the authenticated Home Assistant frontend.

## Threat Model, Trust Boundaries, and Assumptions

- Home Assistant itself is the privileged host application. It provides the `hass` object, entity state data, registry metadata, custom-card infrastructure, localization, and service/action execution.
- Dashboard users and administrators control the strategy YAML and editor inputs. Free-form custom cards, custom views, custom badges, and per-area custom cards are operator-controlled configuration, not arbitrary anonymous input.
- Entity, device, area, floor, state, and registry metadata can contain integration-provided names, icons, device classes, areas, labels, and state values. These should be treated as semi-trusted Home Assistant data and rendered through safe templating rather than string-concatenated DOM.
- The strategy can generate Lovelace configs that trigger Home Assistant actions such as lock or cover services via `perform-action`. These actions must be bound to registry-derived entity IDs and should not be influenced by unrelated custom YAML except where the operator intentionally configures custom cards.
- Build and release assets under `dist/` are shipped through HACS. Stale, duplicated, or unexpected generated assets can confuse release review and cache behavior even when they are not direct vulnerabilities.
- Local development artifacts such as worktrees, plans, scan reports, and documentation are not runtime code unless committed or served by HACS. They still matter for repository hygiene and accidental publication.

## Attack Surface, Mitigations, and Attacker Stories

- Custom YAML parsing: `src/editor/StrategyEditor.ts` parses user-provided YAML via `js-yaml` and stores parsed Lovelace card/view/badge config. This is an intentional operator feature. The relevant risks are unsafe schema behavior, accidental propagation of parse errors, and rendering arbitrary card types selected by the dashboard administrator.
- Dynamic Lovelace config generation: `src/views/*`, `src/sections/*`, and `src/dashboard-strategy.ts` transform HA metadata into view/card configs. The main risks are injecting untrusted strings into unsafe DOM sinks, generating dangerous service actions for the wrong entities, or failing to respect hidden/disabled/config/diagnostic registry metadata.
- Custom Lit cards: `src/cards/*` receive frequent `hass` updates. Risks are DOM injection, stale entity references, accidental service targeting, and performance denial-of-service on weak dashboards. Existing use of Lit templates and registry pre-filtering are important mitigations.
- Editor UI: `src/editor/StrategyEditor.ts` is a large component with stateful config editing and some `unsafeHTML` usage for localized help text. Because translations are bundled project files, this is lower risk than user-controlled HTML, but any future user-controlled string passed to `unsafeHTML` would be security-sensitive.
- HA service actions: generated `perform-action` configs in security, lights, and covers views are privileged in the sense that they can lock/unlock or move devices. Current risk calibration depends on entity IDs coming from HA registries rather than arbitrary URL/query inputs.
- Dependencies and build tooling: `lit`, `js-yaml`, Webpack, TypeScript, ESLint, and compression plugins run at build time or in the frontend bundle. Known vulnerable dependency versions would matter, especially for `js-yaml` parsing and build-time package compromise.

Realistic attacker stories:

- A malicious or compromised Home Assistant integration controls entity names/icons/states. It should not be able to inject script into the dashboard through those strings.
- A Home Assistant administrator intentionally pastes custom Lovelace YAML. That administrator can already configure custom cards in HA; the strategy should not unexpectedly elevate a lower-privileged actor to that ability.
- A repository maintainer accidentally commits local worktrees or stale bundles. This can bloat releases, confuse HACS, or expose non-runtime draft files, but it is generally hygiene unless secrets are included.

Out-of-scope attacker stories:

- Anonymous internet users directly calling this project. The repository has no backend route surface.
- Browser users without Home Assistant dashboard access. They cannot load or configure this strategy unless HA serves it to them.
- Arbitrary filesystem reads/writes by the strategy at runtime. The frontend bundle has no direct Node or filesystem API.

## Severity Calibration (Critical, High, Medium, Low)

- Critical: A change that lets non-admin or anonymous input execute script in the Home Assistant frontend, bypass Home Assistant authentication/authorization, or trigger arbitrary privileged Home Assistant service actions without operator intent.
- High: A reusable DOM injection sink reachable from integration-controlled registry/state metadata, a service-action generation bug that targets unintended locks/covers/security entities, or a build/release issue that ships malicious or unexpected executable assets.
- Medium: Unsafe handling of operator YAML beyond normal Lovelace capabilities, persistent editor-state corruption that causes hidden/disabled entities to be exposed, or dependency vulnerabilities with plausible frontend/build impact.
- Low: Repository hygiene issues, stale local worktrees, oversized untracked assets, confusing docs, or developer-only artifacts with no secrets and no runtime path.
