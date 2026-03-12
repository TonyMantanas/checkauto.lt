# checkauto.lt

Marketing website for an independent used car inspection service covering all of Lithuania. Static, bilingual (LT/EN), zero dependencies — vanilla HTML, CSS, and JavaScript deployed on GitHub Pages.

**Live:** [https://checkauto.lt](https://checkauto.lt)

---

## Overview

checkauto.lt helps used car buyers avoid expensive surprises. The service sends an inspector to the vehicle's location — seller, car lot, or service center — anywhere in Lithuania. Each inspection produces a documented report with photos and a clear buy/negotiate/walk-away recommendation.

**Services offered:**

| Service | Description |
|---------|-------------|
| Pre-purchase inspection | Full visual check of body, engine, transmission, suspension, electrics, interior |
| OBD computer diagnostics | Error code scanning, system health, mileage verification |
| Pre-deal consultation | Remote evaluation of a listing before visiting in person |
| Buying & selling assistance | Help finding a reliable car or selling transparently |

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Hosting | GitHub Pages, custom domain via CNAME |
| Markup | Semantic HTML5 (no templating engine) |
| Styling | Single CSS file, custom properties as design tokens, mobile-first |
| Scripts | ~600 lines of vanilla ES5-compatible JavaScript, 4 modules |
| Fonts | Self-hosted Inter (variable 400–700) + Space Grotesk (WOFF2) |
| i18n | Embedded translations in JS, `localStorage` persistence |
| Data | JSON for gallery case studies |
| Build step | None — works from `file://` protocol |

---

## Project structure

```
.
├── index.html                  Home — hero, risk stats, comparison grid, CTA
├── paslaugos/index.html        Services — 4 cards, 10-item checklist, mini FAQ
├── procesas/index.html         Process — 6-step vertical timeline
├── galerija/index.html         Gallery — filterable case studies with lightbox
├── apie/index.html             About — philosophy, 3 core values
├── kontaktai/index.html        Contact — phone, email with copy-to-clipboard
├── duk/index.html              FAQ — 10 expandable questions (<details>)
├── 404.html                    Custom error page (noindex)
│
├── css/
│   └── styles.css              Complete stylesheet (~1850 lines, 22 sections)
│
├── js/
│   ├── components.js           Shared header & footer (dynamic injection)
│   ├── main.js                 Nav toggle, scroll reveal, copy button, scroll hint
│   ├── i18n.js                 Bilingual system with inline LT/EN translations
│   └── gallery.js              Gallery rendering, filtering, lightbox
│
├── data/
│   └── gallery.json            6 inspection case studies
│
├── lang/
│   ├── lt.json                 Lithuanian translations (reference copy)
│   └── en.json                 English translations (reference copy)
│
├── assets/
│   ├── fonts/                  Inter & Space Grotesk (woff2)
│   ├── images/                 Hero, gallery placeholders, favicon
│   └── og/                     Open Graph images (1200×630 PNG, per page)
│
├── sitemap.xml                 XML sitemap with hreflang annotations
├── robots.txt                  Crawl directives (disallows 404.html)
├── CNAME                       GitHub Pages custom domain
└── LICENSE                     Proprietary (third-party fonts excluded)
```

---

## Pages

| Route | Page | Content |
|-------|------|---------|
| `/` | Pradžia (Home) | Hero with car image, risk statistics (63% defects, €1,200+ avg repair, 1 in 4 tampered odometers), "with vs without inspection" comparison, CTA band |
| `/paslaugos/` | Paslaugos (Services) | 4 service cards with SVG icons, 10-item inspection checklist grid, 4 FAQ entries, link to process page |
| `/procesas/` | Procesas (Process) | 6-step timeline: inquiry → scheduling → on-site arrival → inspection & diagnostics → report → decision |
| `/galerija/` | Galerija (Gallery) | Filter by category (body, engine, mileage, electrical), 6 real-world case studies with seller claims vs actual findings, image lightbox |
| `/apie/` | Apie (About) | Multi-line hero title, philosophy banner with decorative quote mark, 3 values: independence, transparency, thoroughness |
| `/kontaktai/` | Kontaktai (Contact) | Phone & email cards with copy-to-clipboard (checkmark animation), contextual links to services & process |
| `/duk/` | D.U.K. (FAQ) | 10 expandable questions using native `<details>/<summary>` accordion |

---

## JavaScript modules

### `components.js`

Dynamically injects a consistent header and footer into every page. Generates 7 nav links, a language dropdown with flag icons, a mobile hamburger overlay, and footer with copyright. Marks the current page with `aria-current="page"`.

### `main.js`

Core interactions:

- **Mobile nav** — full-screen overlay toggle, closes on Escape or link click, hamburger ↔ X transform
- **Scroll reveal** — `IntersectionObserver` adds `.revealed` (opacity 0→1, translateY 32→0), supports staggered children via `.reveal-stagger`, respects `prefers-reduced-motion`
- **Copy button** — writes email to clipboard via `navigator.clipboard`, shows green checkmark for 1.5s
- **Header scroll** — adds `.scrolled` class after 10px for shadow/style changes
- **Scroll hint** — bouncing arrow at hero bottom, hides after 60px scroll

### `i18n.js`

Bilingual system with no network requests:

- Full Lithuanian and English translations embedded as JS objects
- HTML elements use `data-i18n="section.key"` for text, `data-i18n-placeholder` for inputs, `data-i18n-aria` for accessibility
- Dot-notation resolver navigates nested keys (e.g., `"nav.home"` → `"Pradžia"`)
- Language persisted to `localStorage('checkauto-lang')`, default is `lt`
- Instant switch — no page reload, re-renders all `[data-i18n]` elements
- FOUC prevention: `html.i18n-loading body { opacity: 0 }` removed after init

### `gallery.js`

- Fetches `/data/gallery.json` and renders cards dynamically
- Filter buttons toggle visibility by category
- Lightbox: full-screen overlay, close via X button / Esc / background click, scroll lock
- HTML-escapes user-visible strings (XSS prevention)
- Re-renders on language change via `MutationObserver` on `<html lang>`

---

## Gallery data

Six real-world case studies in `data/gallery.json`:

| Vehicle | Category | Finding |
|---------|----------|---------|
| BMW 520d (2017) | Body | Repainted panels hiding accident damage |
| VW Passat (2016) | Mileage | Odometer rolled back from 280k+ to 120k km |
| Audi A4 2.0 TDI (2018) | Engine | Sticking turbo requiring ~€2,000 repair |
| Mercedes C220d (2019) | Electrical | 14 active error codes |
| Toyota RAV4 (2017) | Body | Dangerous underbody corrosion |
| Opel Insignia (2015) | Mileage | 95k declared vs 210k actual kilometers |

Each entry includes bilingual seller claims, actual findings, and a verdict. Images use lazy loading.

---

## Design system

### Visual language

Apple-esque, minimal, premium. Neutral whites and grays with a single blue accent.

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#ffffff` | Background |
| `--color-accent` | `#0071e3` | Buttons, links, highlights |
| `--color-bg-dark` | `#111113` | Dark sections, footer |
| `--color-text` | `#1d1d1f` | Body text |
| `--color-text-secondary` | `#6e6e73` | Muted text |
| `--color-border` | `#e8e8ed` | Borders, dividers |
| `--color-success` | `#34c759` | Positive indicators |
| `--color-warning` | `#ff9f0a` | Risk statistics |
| `--color-danger` | `#ff3b30` | Negative indicators |

### Typography

- **Primary font:** Inter (self-hosted, variable weight 400–700)
- **Display font:** Space Grotesk
- **Rendering:** `font-display: swap`, preloaded via `<link rel="preload">`
- **Fluid sizing:** `clamp()` for all font-size tokens (e.g., `--font-size-xxl: clamp(2.25rem, 1.5rem + 3vw, 4rem)`)

### Spacing scale

`--space-xs` (0.5rem) → `--space-sm` (1rem) → `--space-md` (1.5rem) → `--space-lg` (2.5rem) → `--space-xl` (4rem) → `--space-2xl` (6rem) → `--space-3xl` (8rem)

### Responsive breakpoints

| Breakpoint | Layout changes |
|------------|----------------|
| < 640px | Single column, stacked cards, mobile nav overlay |
| ≥ 640px | 2-column benefit/checklist grids |
| ≥ 768px | Desktop nav visible, header 64px, layout shifts |
| ≥ 1024px | 3–4 column grids, wider containers |

### Key components

| Component | Implementation |
|-----------|---------------|
| `.btn-primary` | Blue pill button (`border-radius: 980px`), hover scale 1.02 |
| `.btn-ghost` | Text-only link, arrow animates on hover |
| `.hero` | Full-viewport, background image with gradient overlay |
| `.compare-grid` | Two-column with/without comparison (light/dark) |
| `.timeline` | Vertical line with accent-bordered dots and step numbers |
| `.faq-item` | Native `<details>/<summary>` with custom +/− marker |
| `.gallery-card` | Image + seller claim vs finding, hover shadow |
| `.contact-card` | Flex card with hover lift effect |

---

## SEO

Every page includes:

- Unique `<title>` (< 60 chars) and `<meta description>` (145–160 chars)
- `<link rel="canonical">` pointing to `https://checkauto.lt/...`
- `hreflang` tags for `lt` and `x-default`
- Open Graph meta (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale`)
- Twitter Card (`summary_large_image`)
- Branded OG images per page (1200×630 PNG in `assets/og/`)

### Structured data (JSON-LD)

| Page | Schemas |
|------|---------|
| Home | `WebSite`, `LocalBusiness`, `BreadcrumbList` |
| Paslaugos | `Service` ×3, `FAQPage`, `BreadcrumbList` |
| Procesas | `HowTo` (6 steps), `BreadcrumbList` |
| Apie | `Organization`, `BreadcrumbList` |
| Kontaktai | `LocalBusiness`, `ContactPoint`, `BreadcrumbList` |
| D.U.K. | `FAQPage` (10 Q&As), `BreadcrumbList` |

`robots.txt` allows all crawlers, sets a 1-second crawl delay, and points to `sitemap.xml`. The sitemap covers all 7 public pages with `hreflang` annotations.

---

## Performance

| Technique | Detail |
|-----------|--------|
| Font loading | `font-display: swap` + `<link rel="preload">` for critical font files |
| Hero image | `loading="eager"`, `decoding="async"`, explicit `width`/`height` |
| Gallery images | `loading="lazy"` |
| CSS | Single file, no `@import`, all design tokens via custom properties |
| JavaScript | 4 scripts at end of `<body>`, non-blocking, no transpilation |
| Icons | Inline SVGs — zero network requests for icons |
| Payload | No frameworks, no external CDNs, ~600 lines of JS total |
| FOUC | Body hidden during i18n init, `[data-i18n]:empty` gets `min-height: 1em` |

---

## Accessibility

- Semantic HTML5 elements (`<nav>`, `<main>`, `<section>`, `<footer>`, `<details>`)
- `aria-current="page"` on active nav links
- `aria-label` and `aria-expanded` on interactive controls
- `:focus-visible` rings for keyboard navigation
- `prefers-reduced-motion: reduce` disables all scroll animations
- `data-i18n-aria` for translated accessibility labels

---

## Development

No build tools required. Clone and open `index.html` in a browser:

```sh
git clone https://github.com/<owner>/checkauto.lt.git
cd checkauto.lt
open index.html
```

Or serve locally for full path resolution:

```sh
python3 -m http.server 8000
# → http://localhost:8000
```

### Adding or editing translations

1. Add/update the key in the `translations` object inside `js/i18n.js` for both `lt` and `en`
2. Optionally update the reference files `lang/lt.json` and `lang/en.json`
3. Use `data-i18n="section.key"` on the target HTML element (or `data-i18n-placeholder` / `data-i18n-aria`)

### Adding a gallery item

Add an entry to `data/gallery.json` following the existing schema (image path, category, bilingual title/seller claim/finding/verdict). The gallery page re-renders automatically.

### Contact details

Phone and email are defined in the i18n translations:

- `contact.info.phone` — `+370 609 45 238`
- `contact.info.email` — `info@checkauto.lt`

Update in `js/i18n.js` (both language sections) and optionally in the `lang/*.json` reference files.

---

## Deployment

Push to `main` — GitHub Pages serves the site automatically at the custom domain configured in `CNAME`. No build step, no CI pipeline.

---

## License

All rights reserved. See [LICENSE](LICENSE) for details. Third-party fonts (Inter, Space Grotesk) are licensed separately under the SIL Open Font License.
