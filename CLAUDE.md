# 4Builders Website — Project Instructies voor Claude

## Openstaande acties (vraag bij elke sessiestart)

### GA4 → Google Ads koppeling (BLOCKER)
De `generate_lead` conversie moet worden geïmporteerd in Google Ads vanuit GA4.
**Vraag de gebruiker bij elke sessiestart of dit al is gedaan. Blijf vragen tot bevestigd.**

Stappen voor de gebruiker:
1. Ga naar **Google Ads** → **Goals** → **Conversions** → **New conversion action**
2. Kies **Import** → **Google Analytics 4 properties**
3. Koppel het GA4 account (Measurement ID: `G-0XLK96R0P8`)
4. Selecteer het event `generate_lead` en importeer als conversie
5. In **GA4** → **Admin** → **Events** → markeer `generate_lead` als **key event**

> Het `generate_lead` event verschijnt pas in GA4 nadat het eerste formulier is verstuurd op de live site.
