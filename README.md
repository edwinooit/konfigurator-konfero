# Konfigurator Konfero

Interaktywny konfigurator wynajmu dla [Konfero](https://konfero.pl) – centrum konferencyjnego w Ustroniu.

## Jak to działa

`konfigurator.js` to samoładujący się skrypt, który wstrzykuje CSS, HTML i logikę JS do strony. W Webflow jest osadzony jako:

```html
<div id="konfero-konfigurator"></div>
<script src="https://cdn.jsdelivr.net/gh/edwinooit/konfigurator-konfero@main/konfigurator.js"></script>
```

## Edycja

1. Edytuj `konfigurator.js` na GitHubie
2. Commit & push na `main`
3. Wyczyść cache CDN: `https://purge.jsdelivr.net/gh/edwinooit/konfigurator-konfero@main/konfigurator.js`

## Struktura pliku

Plik `konfigurator.js` zawiera:
- **CSS** – wstrzykiwany do `<head>` (klasy z prefixem `.kk`)
- **HTML** – 4-krokowy wizard (pakiety → dodatki → moduły → podsumowanie)
- **JS** – logika renderowania, kalkulacji cen, nawigacji

## Pliki

| Plik | Opis |
|------|------|
| `konfigurator.js` | Główny plik – jedyne źródło prawdy |
| `konfigurator-embed.html` | Backup – wersja HTML do wklejenia bezpośrednio w Webflow |
| `CLAUDE.md` | Kontekst dla Claude Code |
