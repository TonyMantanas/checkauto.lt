# checkauto.lt

Independent used car inspection service in Lithuania. A static, bilingual (LT/EN) marketing website built with zero frameworks — pure HTML, CSS, and vanilla JavaScript.

---

## What it is

**checkauto.lt** is a professional website for an independent car inspection service. The business helps buyers avoid costly mistakes when purchasing used vehicles by providing:

- **Pre-purchase vehicle inspection** — on-site visual examination covering body, engine, transmission, suspension, electrics, and interior
- **OBD computer diagnostics** — error code scanning, system health checks, mileage verification
- **Pre-deal consultation** — remote evaluation of a car listing before the buyer visits in person
- **Buying & selling assistance** — help finding a reliable car or selling one transparently

The service operates across all of Lithuania, arriving at the vehicle's location (seller, car lot, or service center). After every inspection, the client receives a documented report with photos and a clear recommendation.

---

## Site structure

```
/
├── index.html              # Home — hero, risk stats, comparison, CTA
├── 404.html                # Custom 404 error page
├── sitemap.xml             # XML sitemap (6 pages)
├── robots.txt              # Crawl directives
│
├── paslaugos/index.html    # Services — 4 service cards, inspection checklist, FAQ
├── procesas/index.html     # Process — 6-step timeline from inquiry to report
├── apie/index.html         # About — company philosophy, values
├── kontaktai/index.html    # Contact — phone, email, contextual service links
├── duk/index.html          # FAQ — 10 questions with expandable answers
│
├── css/styles.css          # Complete stylesheet (design tokens, mobile-first)
│
├── js/
│   ├── main.js             # Navigation, scroll reveal, copy button, scroll hint
│   └── i18n.js             # Internationalization system (inline translations)
│
├── lang/
│   ├── lt.json             # Lithuanian translations (reference file)
│   └── en.json             # English translations (reference file)
│
└── assets/
    ├── fonts/              # Self-hosted Inter & Space Grotesk (woff2)
    ├── images/             # Hero, service, and inspection photos
    └── og/                 # Open Graph images (1200×630 PNG, one per page)
```

---

## How it works

### Pages

| Page | Purpose | Key content |
|------|---------|-------------|
| **Pradžia** (`/`) | Landing page | Hero section, risk statistics (63% defects, €1,200+ avg repair), "with vs without inspection" comparison, CTA |
| **Paslaugos** (`/paslaugos/`) | Service catalog | 4 service cards with icons, 10-item inspection checklist, 4 FAQ items, link to process page |
| **Procesas** (`/procesas/`) | How it works | 6-step visual timeline: inquiry → scheduling → arrival → inspection → report → decision |
| **Apie** (`/apie/`) | About / trust | Company philosophy quote, 3 core values (independence, transparency, thoroughness) |
| **Kontaktai** (`/kontaktai/`) | Contact | Phone + email cards with copy-to-clipboard, contextual links to services & process |
| **D.U.K.** (`/duk/`) | FAQ | 10 expandable questions covering pricing, duration, coverage, and process |

### Bilingual system (LT/EN)

All visible text is managed through a `data-i18n` attribute system. Translations are stored both as inline objects in `i18n.js` (for `file://` protocol compatibility) and as standalone JSON files in `/lang/`.

- Default language: Lithuanian (`lt`)
- Language selection persists to `localStorage`
- Switching is instant — no page reload
- The language dropdown appears in both desktop and mobile navigation

To add or modify text:
1. Update the translation key in `js/i18n.js` (inline translations object) for both `lt` and `en`
2. Optionally update `lang/lt.json` and `lang/en.json` as reference copies
3. Use `data-i18n="section.key"` on the HTML element

### Navigation

- **Desktop**: horizontal nav bar with language dropdown
- **Mobile**: full-screen overlay triggered by a hamburger button, closes on link click or Escape key
- **Header**: adds a `scrolled` class after 10px scroll for subtle shadow/style changes
- Active page is marked with `aria-current="page"`

### Animations

Scroll-reveal animations use `IntersectionObserver` to add a `.revealed` class when elements enter the viewport. Animations are disabled when `prefers-reduced-motion: reduce` is set. Staggered reveals are supported via `.reveal-stagger` parent containers.

---

## Design

- **Style**: Apple-esque, minimal, premium feel
- **Typography**: Inter (self-hosted, variable weight 400–700, `font-display: swap`)
- **Color palette**: neutral whites/grays with a single blue accent (`#0071e3`)
- **Layout**: mobile-first, CSS Grid + Flexbox, `clamp()` for fluid typography
- **Dark sections**: `--color-bg-dark: #111113` with inverted text
- **Custom properties**: all design tokens (spacing, colors, radii, font sizes) defined in `:root`

---

## SEO

Each page includes:

- Unique `<title>` (under 60 characters)
- Unique `<meta description>` (145–160 characters)
- `<link rel="canonical">` to `https://checkauto.lt/...`
- `hreflang` tags for `lt` and `x-default`
- Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale`)
- Twitter Card tags (`summary_large_image`)
- Branded OG images (1200×630 PNG) in `assets/og/`
- JSON-LD structured data:
  - **Home**: `WebSite`, `LocalBusiness`, `BreadcrumbList`
  - **Paslaugos**: `Service` (×3), `FAQPage`, `BreadcrumbList`
  - **Procesas**: `HowTo` (6 steps), `BreadcrumbList`
  - **Apie**: `Organization`, `BreadcrumbList`
  - **Kontaktai**: `LocalBusiness`, `ContactPoint`, `BreadcrumbList`
  - **D.U.K.**: `FAQPage` (10 Q&As), `BreadcrumbList`

The `404.html` page has `<meta name="robots" content="noindex, nofollow">`.

---

## Performance

- Self-hosted fonts with `font-display: swap` and `<link rel="preload">`
- Hero image uses `loading="eager"` and `decoding="async"` with explicit `width`/`height`
- No external CSS or JS frameworks — total payload is minimal
- Scripts loaded at end of `<body>`
- All CSS in a single file with no render-blocking imports
- Inline SVG icons (no icon font or sprite requests)

---

## Contact information

Phone and email are defined in the i18n translation files:

- `contact.info.phone`: `+370 609 45 238`
- `contact.info.email`: `info@checkauto.lt`

Update these values in `js/i18n.js` (both `lt` and `en` sections) and optionally in `lang/lt.json` / `lang/en.json`.

---

## License

See [LICENSE](LICENSE).
