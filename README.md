# 4Builders Vastgoedonderhoud B.V. - Website

## Over het project

Premium website voor **4Builders Vastgoedonderhoud B.V.**, een vastgoedonderhoudsbedrijf in Amsterdam gericht op:
- Vermogende Amsterdammers in het centrum
- VVE's (Verenigingen van Eigenaren)
- Expats

**Locatie:** Pieter Baststraat 29, 1071 TV Amsterdam
**Telefoon:** +31 6 18 92 21 34
**Email:** info@4builders-amsterdam.nl
**Website:** https://4builders-amsterdam.nl/

---

## Technische Stack

- **HTML5** met Tailwind CSS (via CDN)
- **Custom CSS** in `css/style.css`
- **JavaScript** in `js/main.js`
- **Fonts:** Inter (body), Oswald (headers)
- **Icons:** Phosphor Icons
- **Hosting:** GitHub Pages
- **Domein:** 4builders-amsterdam.nl

---

## Website Structuur

### Nederlandse pagina's (root)
| Bestand | Beschrijving |
|---------|--------------|
| `index.html` | Homepage |
| `schilderwerk.html` | Schilderwerk diensten |
| `vloeren.html` | Vloeren diensten |
| `timmerwerk.html` | Timmerwerk diensten |
| `bestrating.html` | Bestrating diensten |
| `vve.html` | VVE onderhoud diensten |
| `privacy.html` | Privacybeleid |

### Engelse pagina's (`/en/`)
| Bestand | Beschrijving |
|---------|--------------|
| `en/index.html` | Homepage (English) |
| `en/painting.html` | Painting services |
| `en/flooring.html` | Flooring services |
| `en/carpentry.html` | Carpentry services |
| `en/paving.html` | Paving services |
| `en/property-management.html` | HOA/VVE services |

### Assets
- `css/style.css` - Custom styling
- `js/main.js` - JavaScript functionaliteit
- `img/` - Project afbeeldingen
- `sitemap.xml` - SEO sitemap
- `robots.txt` - Search engine instructies

---

## Functionaliteiten

### Tweetalige website (NL/EN)
- Taalswitch knop in navigatie (desktop + mobiel)
- Premium Engelse vertalingen gericht op expats
- Sterke CTA's: "Get a Quote", "Premium Maintenance"

### Contact sectie (alle pagina's)
- Telefoon, email, WhatsApp links
- Adres met Google Maps embed
- Contactformulier

### UI/UX Features
- Mobile-first responsive design
- Sticky CTA bar op mobiel (Bellen, WhatsApp, Offerte)
- Floating WhatsApp button (desktop)
- Service cards met hover effecten
- Portfolio grid met overlay
- Testimonials sectie
- FAQ accordions

### SEO
- Meta tags en Open Graph
- Structured data (JSON-LD)
- Sitemap.xml met alle pagina's
- Canonical URLs
- Hreflang tags voor taalversies

---

## Belangrijke ontwerpkeuzes

### Kleurenpalet
- **Brand Orange:** #FF5722
- **Brand Dark:** #111111
- **Brand Gray:** #1A1A1A
- **Brand Light:** #F8F9FA

### Doelgroep taal
- **Nederlands:** Professioneel, nuchter, betrouwbaar
- **Engels:** Premium, expat-gericht, sterke CTA's

### Afbeeldingen
- Hero images via Unsplash (Amsterdam grachtenpanden)
- Project foto's in `img/` folder
- Object-fit: cover voor consistente weergave

---

## Recente wijzigingen (Jan 2025)

1. **Engelse website versie** - Complete vertaling met premium taal
2. **VVE pagina** - Nieuwe dienst voor Verenigingen van Eigenaren
3. **Google Maps** - Toegevoegd aan alle contact secties
4. **Taalswitch** - NL/EN knop op alle pagina's
5. **Privacy pagina** - Toegevoegd
6. **Over Ons sectie** - Uitgebreide tekst met feature cards
7. **Service card fix** - CSS fix voor afbeelding weergave

---

## Lokaal ontwikkelen

```bash
# Start een lokale server
python -m http.server 8000

# Of met Node.js
npx serve .

# Open in browser
http://localhost:8000
```

---

## Git Workflow

```bash
# Status bekijken
git status

# Wijzigingen toevoegen
git add .

# Committen
git commit -m "Beschrijving van wijzigingen"

# Pushen naar GitHub (triggert GitHub Pages deploy)
git push
```

**Let op:** GitHub Pages deployment duurt 2-5 minuten na push.

---

## Contactformulier

Het formulier gebruikt momenteel een honeypot voor spam-protectie. Voor productie moet er nog een backend worden gekoppeld (bijv. HubSpot, Netlify Forms, of custom endpoint).

---

## TODO / Verbeterpunten

- [ ] Contactformulier backend koppelen
- [ ] Afbeeldingen optimaliseren (WebP formaat)
- [ ] Lazy loading voor afbeeldingen
- [ ] Cookie consent banner
- [ ] Google Analytics integratie
- [ ] Performance optimalisatie (Critical CSS)

---

## Repository

**GitHub:** github.com/rookvrijmonir/4Builders
