# Threat Model: HA-dashboard-strategy

## Overview

This repository ships a client-side Home Assistant custom Lovelace dashboard strategy written in TypeScript. The deployed runtime is the generated JavaScript bundle under `dist/`, loaded by Home Assistant as a frontend resource. Source under `src/` generates Lovelace views and custom Lit cards from Home Assistant registry/state metadata plus operator-provided strategy configuration.

The project has no backend routes, database, credential store, direct filesystem API, or standalone network server. Security-relevant behavior is frontend-side: it decides which entities, cards, badges, views, and Home Assistant actions are represented in Lovelace config.

## Trust Boundaries

- Home Assistant is the privileged host and supplies the `hass` object, entity states, registries, card helpers, localization context, and service/action execution model.
- Dashboard administrators/operators control strategy YAML, custom cards, custom views, custom badges, and editor input. Free-form Lovelace YAML is therefore intentional operator configuration.
- Entity/device/area/floor registry metadata can contain semi-trusted integration-provided names, icons, labels, device classes, and state values.
- Generated Lovelace actions for lights, covers, locks, and security surfaces must be bound to expected registry-derived entity domains and states.
- Build artifacts under `dist/` are shipped by HACS; unexpected, stale, or untracked generated files are release-hygiene risk even when not directly exploitable.

## Main Security Questions

- Can HA metadata or operator config reach local DOM injection sinks such as `unsafeHTML`, `innerHTML`, script/eval, or custom element creation in an unintended way?
- Can generated `perform-action` configs target an unintended domain or hidden/disabled/config/diagnostic entity?
- Can operator-authored YAML gain capability beyond normal Lovelace administrator intent?
- Are release/build assets or dependencies unexpectedly vulnerable or confusing for HACS delivery?
- Are secrets or credentials present in source, config, or release metadata?

## Severity Calibration

- Critical: unauthenticated or non-admin input can execute script in Home Assistant, bypass HA auth, or trigger arbitrary privileged HA actions.
- High: integration-controlled metadata reaches an HTML/script sink, or generated actions can operate on unintended lock/cover/security targets.
- Medium: operator YAML is mishandled beyond expected Lovelace capability, hidden/disabled/config entities are exposed by a shared path, or a dependency issue has plausible frontend/build impact.
- Low: repository hygiene, stale local artifacts, confusing release files, or developer-only files without runtime reachability.
