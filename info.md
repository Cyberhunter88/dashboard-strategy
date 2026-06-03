# Dashboard Strategy

Eine modulare und hochkonfigurierbare Dashboard-Strategy für Home Assistant, die automatisch Views basierend auf Bereichen, Geräten, Entitäten, Etagen und Zuständen generiert.

## Highlights

- Grafischer Konfigurator mit Drag & Drop für Bereiche, Sections und Startseiten-Blöcke
- Automatische Raum-Erkennung über Home Assistant Areas, Devices und Floors
- Spezialisierte Views für Lichter, Rollos, Sicherheit, Batterien und Klima
- Wetter-Startseite mit frei sortierbaren Blöcken, Bereichen, Etagen, eigenen Karten und eigenen Abschnitten
- Zusammenfassungskarten für Lichter, Rollos, Sicherheit, Batterien und Klima
- Eigene Karten, eigene Abschnitte, eigene Badges, eigene Views und zusätzliche Karten pro Raum
- Raum-Pins, Favoriten, Alarm-Panel, Alert-Icons, Fenster-/Türkontakte und UPS/USV-Gruppen
- Granulare Filterung per Home-Assistant-Sichtbarkeit, Label `no_dboard` oder Strategy-Editor
- Deutsch und Englisch mit automatischer Spracherkennung
- Performance-optimiert durch Code-Splitting, Registry-Caching, LitElement und Tile-Card-Pooling

## Erste Schritte

Nach der Installation über HACS ein neues Dashboard anlegen und im Raw-Konfigurationseditor einfügen:

```yaml
strategy:
  type: custom:dashboard-strategy
```

Danach öffnet sich über das Stift-Icon oben rechts der grafische Editor.

Für detaillierte Anweisungen siehe das [README](https://github.com/Cyberhunter88/dashboard-strategy).
