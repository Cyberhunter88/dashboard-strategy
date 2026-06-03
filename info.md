# Dashboard Strategy

Eine modulare und hochkonfigurierbare Dashboard-Strategy für Home Assistant, die automatisch Views basierend auf Bereichen, Entitäten und deren Zuständen generiert.

## Features

- **Grafischer Konfigurator** — Keine YAML-Kenntnisse erforderlich, Drag & Drop für Bereiche
- **Automatische Raum-Erkennung** — Nutzt Home Assistant Areas, Devices & Floors
- **Spezialisierte Views** — Lichter, Rollos, Sicherheit, Batterien, Klima
- **Zusammenfassungskarten** — Einzeln ein-/ausschaltbar
- **Etagen-Gruppierung** — Bereiche und Lichter optional nach Etagen gliedern
- **Reaktive Updates** — Echtzeit-Aktualisierung via LitElement Custom Cards
- **Performance-optimiert** — Code-Split Bundles, Registry-Caching, Tile-Card-Pooling
- **Mehrsprachig** — Deutsch und Englisch

## Erste Schritte

Nach der Installation über HACS ein neues Dashboard anlegen und folgenden Code im Raw-Konfigurationseditor einfügen:

```yaml
strategy:
  type: custom:dashboard-strategy
```

Danach öffnet sich über das **Stift-Icon** oben rechts der grafische Editor.

Für detaillierte Anweisungen siehe das [README](https://github.com/Cyberhunter88/dashboard-strategy).
