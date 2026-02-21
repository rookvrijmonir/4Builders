# 4Builders Website — Project Instructies voor Claude

## Project Info
- **Domein:** 4builders-amsterdam.nl (GitHub Pages)
- **Stack:** Static HTML5, Tailwind CSS v3.4.0, Vanilla JS
- **CRM:** HubSpot (Portal: 147527077, Form: c7133bc0-7e37-4a0a-8c2a-419f2d7eeb8f)
- **Analytics:** GA4 (G-0XLK96R0P8) + Google Ads (AW-17920851706)

## Landingspagina's (Google Ads traffic)
- **NL:** `schilderwerk/offerte/index.html` → bedankt: `schilderwerk/bedankt/`
- **EN:** `en/painting/quote/index.html` → bedankt: `en/painting/thank-you/`
- Standalone HTML met inline critical CSS + deferred Tailwind
- Footer/header geladen via `js/includes.js` (components-loaded event)
- Sticky mobile CTA: overridden op landingspagina's naar `#offerte` / `#quote`

## Conversion Tracking
- `generate_lead` GA4 event op form submit
- `form_step_complete` trackt funnel steps: schilderwerk (service → location → contact), renovatie (project → location → planning → contact)
- **Direct Google Ads conversion tag:** LIVE op bedankt-pagina's (AW-17920851706/h1X3CN6GiPsbEPr9qeFC) — type WEBPAGE, actie ID 7505838942
- GA4 → Google Ads import: optioneel, niet meer blocker

## Google Ads
Zie `/home/blackhat/.claude/projects/-home-blackhat-projects-4BUILDERS/memory/google-ads-playbook.md` voor complete referentie met alle IDs, tools, en veelgebruikte operaties.

## Belangrijke conventies
- Altijd NL + EN tegelijk aanpassen
- Critical CSS inline in `<style>` tag — nieuwe utilities daar toevoegen
- `style.min.css` deferred laden via `media="print" onload`
- Fonts: Playfair Display (headings), Inter (body), Oswald (accenten)
- Hero: `min-h-screen sm:min-h-[90vh]`, mobiel `pt-7 pb-16`, desktop `sm:py-32`
- Formulier: 3 stappen, 6 opties in stap 1 (2x3 grid)

## Verplichte QA na elke paginawijziging (nieuw + bestaand)
- Elke wijziging aan een pagina krijgt standaard een **mobiele Lighthouse audit** voor livegang.
- Dit geldt voor zowel nieuwe pagina's als bestaande pagina's die aangepast worden.
- Gebruik altijd het vaste script: `bash ./scripts/lighthouse-mobile.sh <url>`
- Voor stabiele inschatting: draai minimaal 3 keer (`npm run lighthouse:mobile:3x`) en kijk naar de mediane score.
- Minimaal te halen doel voor landingspagina's:
  - Performance: `>= 85` (mediaan van 3 runs)
  - Accessibility: `>= 95`
  - Best Practices: `>= 95`
- Fouten met prioriteit **altijd** fixen:
  - `errors-in-console`
  - `label` / `link-name`
  - `color-contrast`
  - `unsized-images`
- Bij optimalisaties: formulierflow niet breken.
  - Stap 1 -> stap 2
  - Validatie werkt
  - Submit flow + redirect/feedback werkt

## Definition of Done (DoD) - Paginawijzigingen
- [ ] Mobiele Lighthouse audit is uitgevoerd op de aangepaste URL (`bash ./scripts/lighthouse-mobile.sh <url>`).
- [ ] Lighthouse is 3x gedraaid en beoordeeld op mediaan (`npm run lighthouse:mobile:3x`).
- [ ] Minimumscores zijn gehaald: Performance `>= 85`, Accessibility `>= 95`, Best Practices `>= 95`.
- [ ] Kritieke issues zijn opgelost: `errors-in-console`, `label`/`link-name`, `color-contrast`, `unsized-images`.
- [ ] Formulierflow is mobiel getest: stapovergang, validatie, submit, en bedankt/feedback werken.
- [ ] Tracking is gevalideerd: `generate_lead` event en Google Ads conversie op de bedankt-pagina.
- [ ] NL + EN variant zijn beide gecontroleerd als de wijziging op beide talen van toepassing is.

## Lighthouse Tooling (globaal/persistent)
- Lighthouse CLI globaal: `~/.npm-global/bin/lighthouse` (v12.8.2)
- Playwright CLI globaal: `~/.npm-global/bin/playwright` (v1.49.1)
- Chromium persistent pad (niet npx-cache):  
  `/home/blackhat/.local/playwright-browsers/chromium-1148/chrome-linux/chrome`
- Script `scripts/lighthouse-mobile.sh` gebruikt standaard deze binary via `CHROME_PATH`.
