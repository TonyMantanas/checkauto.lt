# Project Overview

**checkauto.lt** is a bilingual (Lithuanian/English) marketing website for an independent used car inspection service operating across Lithuania. The business provides pre-purchase vehicle inspections, OBD computer diagnostics, pre-deal consultation, and buying/selling assistance. After every inspection, the client receives a documented report with photos and a clear recommendation.

## Architecture

- **Pure static site** — no server-side logic, no build step, no frameworks.
- **Hosting**: GitHub Pages (indicated by `CNAME` file pointing to `checkauto.lt`).
- **Client-side logic**: Vanilla JavaScript handles mobile navigation, a clipboard copy button, scroll-hint hiding, sticky header state, and a complete client-side internationalization (i18n) system with translations loaded from JSON files.
- **Styling**: Single CSS file with a custom design-token system (CSS custom properties). Mobile-first, Apple-esque design language.
- **SEO**: Each page includes canonical URLs, hreflang tags, Open Graph / Twitter Card meta, and JSON-LD structured data (BreadcrumbList, LocalBusiness, FAQPage, HowTo, Service, Organization schemas).
- **Fonts**: Self-hosted Inter (variable weight 400–700, latin + latin-ext subsets) and Space Grotesk (used only for the 1012.lt credit logo).

---

# Directory Structure

```
checkauto.lt/
├── index.html                  # Homepage — hero, risk stats, comparison, CTA
├── 404.html                    # Custom 404 error page (noindex)
├── CNAME                       # GitHub Pages custom domain config ("checkauto.lt")
├── LICENSE                     # Proprietary license (all rights reserved)
├── README.md                   # Project overview and developer docs
├── robots.txt                  # Crawl rules + sitemap reference
├── sitemap.xml                 # XML sitemap (6 pages, hreflang annotations)
│
├── apie/
│   └── index.html              # About page — philosophy, values, team quote
│
├── assets/
│   ├── fonts/
│   │   ├── Inter-latin-ext.woff2    # Inter font (extended Latin glyphs)
│   │   ├── Inter-latin.woff2        # Inter font (basic Latin glyphs)
│   │   └── SpaceGrotesk-latin.woff2 # Space Grotesk (credit logo only)
│   ├── images/
│   │   ├── favicon.svg              # SVG favicon
│   │   └── hero-car.jpg             # Homepage hero image (primary)
│   └── og/
│       ├── apie.png                 # OG image for /apie/ (1200×630)
│       ├── duk.png                  # OG image for /duk/ (1200×630)
│       ├── home.png                 # OG image for / (1200×630)
│       ├── kontaktai.png            # OG image for /kontaktai/ (1200×630)
│       ├── paslaugos.png            # OG image for /paslaugos/ (1200×630)
│       └── procesas.png             # OG image for /procesas/ (1200×630)
│
├── coming-soon/
│   └── index.html              # Standalone "coming soon" landing page
│
├── css/
│   └── styles.css              # Complete stylesheet (1852 lines, 21 sections)
│
├── duk/
│   └── index.html              # FAQ page — 10 expandable Q&A items
│
├── js/
│   ├── i18n.js                 # Internationalization system (loads /lang/*.json)
│   └── main.js                 # Core interactions (nav, scroll, copy, header)
│
├── kontaktai/
│   └── index.html              # Contact page — phone, email, copy button
│
├── lang/
│   ├── en.json                 # English translations (reference copy)
│   └── lt.json                 # Lithuanian translations (reference copy)
│
├── paslaugos/
│   └── index.html              # Services page — 4 service cards, checklist, FAQ
│
└── procesas/
    └── index.html              # Process page — 6-step timeline
```

### Folder Descriptions

| Folder | Purpose |
|--------|---------|
| `/` (root) | Main site pages and config files |
| `apie/` | "About us" page |
| `assets/fonts/` | Self-hosted web fonts (woff2 format) |
| `assets/images/` | Photography and favicon |
| `assets/og/` | Open Graph social sharing images (one per page) |
| `coming-soon/` | Standalone pre-launch placeholder page |
| `css/` | Single shared stylesheet |
| `duk/` | FAQ page (D.U.K. = Dažnai Užduodami Klausimai) |
| `js/` | JavaScript modules (i18n + main interactions) |
| `kontaktai/` | Contact page |
| `lang/` | JSON translation files (source of truth; loaded at runtime by `i18n.js`) |
| `paslaugos/` | Services page |
| `procesas/` | Process/how-it-works page |

---

# File Documentation

## index.html
**Path:** `/index.html`

**Purpose:** Homepage and primary landing page. Introduces the business value proposition, risk statistics, benefit explanations, a "with vs without" comparison, and a CTA driving to the contact page.

**Key Elements:**
- **Head:** Full SEO meta (canonical, hreflang lt + x-default, OG, Twitter Card), font preloads (Inter latin-ext + latin), early inline i18n script to detect saved language and prevent flash of wrong language.
- **Header:** Sticky header with logo (`check<span>auto</span>.lt`), desktop nav (5 links + language dropdown with LT/US flags), hamburger toggle for mobile, full-screen mobile overlay nav. Duplicated language dropdown in both desktop and mobile navs.
- **Hero section:** Label, h1, subtitle paragraph, primary CTA button linking to `/kontaktai/`, hero image (`hero-car.jpg`), animated scroll-hint indicator.
- **Risk section:** Dark-background block with 3 statistics (63% defects, €1,200+ repair cost, 1 in 4 tampered mileage). Uses `.risk-block`, `.risk-stats`, `.risk-stat` classes.
- **Why inspect section:** 4 benefit cards with inline SVG icons (magnifying glass, document, shield, checkmark). Uses `.benefits-list`, `.benefit-item` grid.
- **Comparison section:** Two-column grid (`.compare-grid`) — "Be patikros" (without, light background with ✕ markers) vs "Su checkauto.lt" (with, dark background with ✓ markers). 6 items per column.
- **CTA band:** Dark section with h2, paragraph, primary CTA button.
- **Footer:** Logo, 5 nav links (Paslaugos, Procesas, Apie, Kontaktai, D.U.K.), copyright.
- **Footer credit:** Dark bar crediting 1012.lt as site creator.
- **Structured data:** JSON-LD with `WebSite`, `LocalBusiness` (phone, email, service types, area served), and `BreadcrumbList`.
- **Scripts:** `js/i18n.js` then `js/main.js` loaded at end of body.

**Dependencies:** `css/styles.css`, `js/i18n.js`, `js/main.js`, `assets/images/hero-car.jpg`, `assets/images/favicon.svg`, `assets/og/home.png`

---

## 404.html
**Path:** `/404.html`

**Purpose:** Custom 404 error page shown when a user navigates to a non-existent URL. Includes `noindex, nofollow` meta to prevent search engine indexing.

**Key Elements:**
- **Head:** `noindex, nofollow` robots directive. Inline `<style>` block for `.error-wrap`, `.error-code` (large "404" display), centered layout with min-height 60vh.
- **Header/Footer:** Identical structure to all other pages (sticky header, desktop nav, mobile nav, footer, credit bar).
- **Content:** Large decorative "404" number (`aria-hidden="true"`), h1 "Puslapis nerastas", explanation paragraph, primary CTA button linking back to homepage.
- **Scripts:** Same `i18n.js` + `main.js`.

**Dependencies:** `css/styles.css`, `js/i18n.js`, `js/main.js`, `assets/images/favicon.svg`

---

## apie/index.html
**Path:** `/apie/index.html`

**Purpose:** "About us" page. Establishes trust by explaining the company's independence, philosophy, and core values.

**Key Elements:**
- **Head:** Full SEO meta (canonical, hreflang, OG, Twitter Card) with `assets/og/apie.png`. Font preloads via `../assets/fonts/` relative paths.
- **Page hero:** Section label "Apie mus", multi-line h1 ("Nepriklausomi. / Objektyvūs. / Jūsų pusėje."), subtitle.
- **About content:** `.about-content` block with decorative logo rendering, 3 paragraphs describing independence and methodology.
- **Philosophy banner:** Full-width dark section (`.philosophy-banner`) with large decorative quotation mark, blockquote, author attribution, divider, and context paragraph.
- **Values grid:** 3-column grid (`.about-values-grid`) with cards for Nepriklausomumas (Independence), Skaidrumas (Transparency), Kruopštumas (Thoroughness).
- **CTA band:** Dark section driving to `/kontaktai/`.
- **Structured data:** JSON-LD `BreadcrumbList` (Pradžia → Apie) + `Organization` schema.

**Dependencies:** `../css/styles.css`, `../js/i18n.js`, `../js/main.js`, `../assets/images/favicon.svg`, `../assets/og/apie.png`

---

## coming-soon/index.html
**Path:** `/coming-soon/index.html`

**Purpose:** Standalone pre-launch "coming soon" placeholder page. Self-contained with all styles inline. Uses `noindex, nofollow`.

**Key Elements:**
- **Head:** `noindex, nofollow`, inline `<style>` block with full CSS reset, custom properties, flexbox centering, fade-up animation.
- **Content:** Logo, "Jau greitai" badge, h1, subtitle paragraph. No navigation, no shared stylesheet.
- **Footer:** Simple copyright + 1012.lt credit.
- **No external scripts:** Does not load `i18n.js` or `main.js`. Fully standalone.
- **Animation:** `@keyframes fadeUp` — opacity 0 → 1, translateY 20px → 0.

**Dependencies:** `../assets/images/favicon.svg` (only external dependency)

---

## duk/index.html
**Path:** `/duk/index.html`

**Purpose:** Dedicated FAQ page with 10 expandable question-answer pairs using native HTML `<details>/<summary>` elements.

**Key Elements:**
- **Head:** Full SEO meta, OG image `assets/og/duk.png`.
- **Page hero:** "D.U.K." label, h1, subtitle "Be marketingo. Tik esmė."
- **FAQ list:** 10 `<details class="faq-item">` elements. Each has a `<summary>` with `data-i18n` key (e.g., `faq.q1`) and a `.faq-answer` div containing a `<p>` with the answer. Topics: value of inspection, duration, travel coverage, deliverables, pricing, participation, negotiation help, booking process.
- **CTA band:** "Neradote atsakymo?" driving to `/kontaktai/`.
- **Structured data:** JSON-LD `BreadcrumbList` + `FAQPage` with all 10 questions/answers.

**Dependencies:** `../css/styles.css`, `../js/i18n.js`, `../js/main.js`, `../assets/images/favicon.svg`, `../assets/og/duk.png`

---

## kontaktai/index.html
**Path:** `/kontaktai/index.html`

**Purpose:** Contact page. Provides phone number and email as interactive cards, with a copy-to-clipboard button for the email.

**Key Elements:**
- **Page hero:** "Kontaktai" label, h1, subtitle.
- **Contact cards:** Two-column grid (`.contact-cards`):
  - **Phone card:** `<a href="tel:+37060945238">` wrapping an SVG icon, label, and phone number.
  - **Email card:** `<div>` containing an `<a href="mailto:info@checkauto.lt">` link and a `.copy-btn` button with `data-copy="info@checkauto.lt"`. Shows copy icon, toggles to checkmark on successful copy.
- **Contact note:** Text paragraph encouraging calls/messages.
- **Navigation links:** Two ghost buttons linking to `/paslaugos/` and `/procesas/`.
- **Structured data:** JSON-LD `BreadcrumbList` + `LocalBusiness` with `ContactPoint` schema.

**Dependencies:** `../css/styles.css`, `../js/i18n.js`, `../js/main.js`, `../assets/images/favicon.svg`, `../assets/og/kontaktai.png`

---

## paslaugos/index.html
**Path:** `/paslaugos/index.html`

**Purpose:** Services catalog page. Lists 4 services, a 10-item inspection checklist, an inline FAQ section, and links to the process and full FAQ pages.

**Key Elements:**
- **Page hero:** "Paslaugos" label, h1, subtitle.
- **Service cards:** 4 `<article class="service-card">` elements, each with:
  - SVG icon (`.service-icon`): clipboard+check, monitor/chip, chat bubble, arrows exchange
  - h3 title and descriptive paragraph
  - Services: Išsami patikra prieš pirkimą, Kompiuterinė diagnostika, Konsultacija prieš apžiūrą, Pagalba perkant ar parduodant
- **Inspection checklist:** `<ul class="checklist-grid">` with 10 `<li>` items (body, engine, suspension, electronics, interior, fluids, tires, mileage, test drive, documented report). Each prefixed with ✓ via CSS `::before`.
- **Inline FAQ:** 4 `<details>` items (same first 4 from the full FAQ page), with a "Visi klausimai" link to `/duk/`.
- **CTA band:** Dark section driving to `/kontaktai/`.
- **Structured data:** JSON-LD `BreadcrumbList` + 3 `Service` schemas + `FAQPage` with 4 items.

**Dependencies:** `../css/styles.css`, `../js/i18n.js`, `../js/main.js`, `../assets/images/favicon.svg`, `../assets/og/paslaugos.png`

---

## procesas/index.html
**Path:** `/procesas/index.html`

**Purpose:** "How it works" page. Presents the inspection process as a 6-step vertical timeline.

**Key Elements:**
- **Page hero:** "Procesas" label, h1, subtitle.
- **Timeline:** `<div class="timeline">` with vertical line (CSS `::before`), containing 6 `.timeline-step` elements:
  1. **Užklausa** (Inquiry) — contact via phone, email, or form
  2. **Laiko suderinimas** (Scheduling) — flexible evenings/weekends
  3. **Atvykimas** (On-site arrival) — at seller, car lot, or service center
  4. **Patikra ir diagnostika** (Inspection & diagnostics) — visual, OBD, test drive
  5. **Ataskaita** (Report) — photos, defects, recommendation
  6. **Jūsų sprendimas** (Your decision) — buy, negotiate, or walk away
- Each step has a `.timeline-dot` (circle with accent border), step number label, h3 title, and descriptive paragraph.
- **CTA band:** "Viskas prasideda nuo užklausos" driving to `/kontaktai/`.
- **Structured data:** JSON-LD `BreadcrumbList` + `HowTo` with 6 `HowToStep` items.

**Dependencies:** `../css/styles.css`, `../js/i18n.js`, `../js/main.js`, `../assets/images/favicon.svg`, `../assets/og/procesas.png`

---

## styles.css
**Path:** `/css/styles.css`

**Purpose:** Complete stylesheet for the entire website. 1852 lines organized into 21 numbered sections. Mobile-first, no preprocessor, no framework. Uses CSS custom properties as design tokens.

**Key Elements:**

### Section 0 — Custom Properties (Design Tokens)
All design values defined in `:root`:
- **Colors:** `--color-bg` (#ffffff), `--color-bg-alt` (#f7f7f8), `--color-bg-dark` (#111113), `--color-text` (#1d1d1f), `--color-text-secondary` (#6e6e73), `--color-accent` (#0071e3), `--color-success` (#34c759), `--color-warning` (#ff9f0a), `--color-danger` (#ff3b30)
- **Typography:** `--font-family` (Inter → system stack), 7 fluid font sizes using `clamp()` (xs through xxl), 4 line-height values, 2 letter-spacing values
- **Spacing:** 7 spacing tokens (xs 0.5rem through 3xl 8rem)
- **Layout:** `--container-max: 1120px`, fluid `--container-padding` via `clamp()`
- **Transitions:** 3 easing functions, 3 duration tokens (200ms/400ms/700ms)
- **Borders:** 3 radius tokens (8px/12px/20px)
- **Header:** `--header-height: 56px` (64px at ≥768px)

### Section 1 — Reset & Base
Universal box-model reset, smooth scrolling, font smoothing, body scroll lock (`.nav-open`), image defaults, link/list/button/input resets. Includes `html.i18n-loading body { opacity: 0 }` to hide body during language switch.

### Section 2 — Typography
h1–h4 styles, paragraph secondary color, `.text-accent` utility.

### Section 3 — Layout Utilities
`.container` (max-width centered), `.section` (vertical padding, increases at ≥768px), `.section--alt` (gray bg), `.section--dark` (dark bg with inverted text).

### Section 4 — Header & Navigation
- **Sticky header:** `position: sticky`, frosted glass effect (`backdrop-filter: saturate(180%) blur(20px)`), border-bottom
- **Logo:** Text-based, span colored with accent
- **Desktop nav:** Hidden below 768px, horizontal `<ul>`, animated underline on hover (`::after` pseudo-element), `aria-current="page"` styling
- **Language dropdown:** Button toggle with flag icons (CSS data URI SVGs for LT and US flags), dropdown menu with slide-down animation, `.open` class toggles visibility
- **Hamburger:** 2-line toggle, CSS transform to X on `.nav-open`
- **Mobile overlay:** Fixed full-screen, centered links, staggered entrance animation (80ms increments), hidden via opacity/visibility

### Section 5 — Hero
Full-viewport hero with `.hero-layout` grid (1fr 1fr at ≥768px). Image with gradient overlay (`::before`). Scroll-hint with bounce animation.

### Section 5b — Page Hero
Background-image hero variant with gradient overlay and backdrop blur (unused in current pages but CSS is present).

### Section 6 — Buttons
Three button styles: `.btn-primary` (solid blue pill, 980px radius), `.btn-secondary` (outlined), `.btn-ghost` (text-only with animated arrow). Min-height 48px for tap targets.

### Section 7 — Section Headers
Centered header block with label, heading, and optional paragraph.

### Section 8 — Benefit Cards
Grid layout (1col → 2col at ≥640px), cards with icon column + text column using CSS Grid.

### Section 8b — Comparison Grid
Two-column side-by-side comparison. "Without" column: light bg, red ✕ markers. "With" column: dark bg, green ✓ markers. Items use `grid-auto-rows: 1fr` for equal heights.

### Section 8c — FAQ Accordion
Native `<details>/<summary>` styling. Custom marker replacement (+ / −), hover accent color, max-width 680px centered.

### Section 9 — Risk Section
Dark rounded card (`.risk-block`) with statistics grid (1col → 3col at ≥640px). Warning-colored stat numbers.

### Section 10 — Services
Centered service cards with icon + text. On ≥768px, switches to left-aligned grid with icon in row span. Checklist grid (1col → 2col at ≥768px) with ✓ prefix.

### Section 11 — Timeline
Vertical timeline with `::before` line, positioned dots, step numbers, and left padding. Responsive padding increases at ≥768px.

### Section 12 — About
Centered content block, philosophy banner (dark bg with decorative quote mark), values grid (1col → 3col at ≥768px).

### Section 13 — Contact
Card grid (1col → 2col at ≥560px) with hover lift effect. Copy button with icon swap animation (`.copied` state). Legacy contact layout classes retained.

### Section 14 — CTA Band
Centered dark-section call-to-action.

### Section 15 — Footer
Border-top, flex column (→ row at ≥768px), footer credit bar with Space Grotesk font for "1012.lt" branding.

### Section 16 — Image Sections
`.image-break` utility (21:9 aspect ratio, object-fit cover) — defined but unused in current HTML.


### Section 18 — Utilities
`.visually-hidden` (sr-only), `:focus-visible` ring, `[data-i18n]:empty` min-height (FOUC prevention).

### Section 19 — Portrait Image
`.portrait-image` (4:5 aspect, unused in current HTML).

### Section 20 — Pullquote
Accent-bordered left pullquote style (used conceptually by philosophy section).

### Section 21 — Divider
Simple 1px horizontal rule utility.

**Dependencies:** `../assets/fonts/Inter-latin-ext.woff2`, `../assets/fonts/Inter-latin.woff2`, `../assets/fonts/SpaceGrotesk-latin.woff2`

---

## main.js
**Path:** `/js/main.js`

**Purpose:** Core interaction logic for the entire site. No dependencies. IIFE-wrapped, strict mode, vanilla JavaScript.

**Key Elements:**

### Functions

| Function | Purpose | Called By |
|----------|---------|-----------|
| `initMobileNav()` | Toggles `.nav-open` class on body for mobile nav overlay. Binds click on `.nav-toggle`, click on `.nav-mobile a` (auto-close), and Escape key (close + focus toggle). Updates `aria-expanded` and `aria-label` attributes. | `init()` |

| `initCopyButtons()` | Attaches click handlers to all `.copy-btn[data-copy]` elements. Uses `navigator.clipboard.writeText()`, adds `.copied` class for 1.5 seconds on success. Stops event propagation. | `init()` |
| `initHeaderScroll()` | Adds/removes `.scrolled` class on `.site-header` based on `window.scrollY > 10`. Uses passive scroll listener. | `init()` |
| `initScrollHint()` | Hides `.scroll-hint` element (adds `.hidden` class) after 60px scroll. Re-shows if user scrolls back to top. Uses passive listener. | `init()` |
| `init()` | Master initializer. Calls all 5 `init*` functions. | DOMContentLoaded or immediate if DOM ready |

### Event Listeners
- `click` on `.nav-toggle` — toggle mobile nav
- `click` on `.nav-mobile a` — close mobile nav
- `keydown` (Escape) — close mobile nav
- `scroll` (passive) — header scroll state, scroll-hint visibility
- `click` on `.copy-btn[data-copy]` — clipboard copy

### Global Variables
None exported. Entirely self-contained in an IIFE.

**Dependencies:** None. Pure vanilla JS. Used by all HTML pages.

---

## i18n.js
**Path:** `/js/i18n.js`

**Purpose:** Complete client-side internationalization system. Translations are loaded from `/lang/*.json` files at runtime and cached after first fetch. IIFE-wrapped, strict mode.

**Key Elements:**

### Constants
- `DEFAULT_LANG`: `'lt'` (Lithuanian)
- `SUPPORTED_LANGS`: `['lt', 'en']`
- `translations`: Cache object populated at runtime by fetching `/lang/lt.json` and `/lang/en.json`

### Functions

| Function | Purpose | Called By |
|----------|---------|-----------|
| `resolve(obj, path)` | Resolves a dot-notation key (e.g., `"nav.home"`) against a nested object. Returns `null` if path doesn't exist. | `applyTranslations()` |
| `applyTranslations(data)` | Iterates all `[data-i18n]` elements. For leaf elements (no children), sets `textContent`. For elements with child elements, uses `TreeWalker` to update only direct text nodes (preserves inner HTML like `<span>` in the comparison heading). Also handles `[data-i18n-placeholder]` and `[data-i18n-aria]` attributes. | `setLanguage()` |
| `updateSwitcherUI(lang)` | Updates all `.lang-dropdown` elements: sets `data-active-lang`, toggles `.active` class on menu items. | `setLanguage()` |
| `loadTranslations(lang)` | Fetches `/lang/{lang}.json` via `fetch()`, caches result. Returns cached data on subsequent calls. Returns a Promise. | `setLanguage()` |
| `setLanguage(lang)` | Master language setter. Calls `loadTranslations()` then `applyTranslations()`, `updateSwitcherUI()`, persists to `localStorage` (`checkauto-lang` key), sets `document.documentElement.lang`, removes `i18n-loading` class. | `init()`, dropdown click |
| `init()` | Reads saved language from `localStorage` (defaults to `lt`), calls `setLanguage()`. Binds click handlers on all `.lang-dropdown-toggle` buttons (open/close, close others) and `li[data-lang]` items (switch language). Binds document click to close open dropdowns. | DOMContentLoaded or immediate |

### Global Exports
- `window.checkautoI18n = { setLanguage }` — exposes language setter for external use.

### Translation Key Coverage
Both `lt` and `en` objects cover: `nav`, `home` (hero, problem, why, compare, cta), `services` (hero, s1–s4, cta, checklist, faq), `faq` (hero, q1–q10, a1–a10, cta), `process` (hero, step1–step6, cta), `about` (hero, intro, values, philosophy, cta), `contact` (hero, info, form), `footer`.

**Dependencies:** None. Pure vanilla JS. Used by all HTML pages except `coming-soon/index.html`.

---

## lt.json
**Path:** `/lang/lt.json`

**Purpose:** Lithuanian translations — the source of truth for all Lithuanian UI text. Loaded at runtime by `i18n.js` via `fetch()`.

**Key Elements:**
- Complete Lithuanian translation tree matching all `data-i18n` keys used across the site

**Dependencies:** Fetched by `js/i18n.js` at runtime.

---

## en.json
**Path:** `/lang/en.json`

**Purpose:** English translations — the source of truth for all English UI text. Loaded at runtime by `i18n.js` via `fetch()`.

**Key Elements:**
- Complete English translation tree

**Dependencies:** Fetched by `js/i18n.js` at runtime.

---

## robots.txt
**Path:** `/robots.txt`

**Purpose:** Search engine crawl directives.

**Key Elements:**
- `User-agent: *` / `Allow: /` — permits all crawlers
- `Disallow: /404.html` — blocks 404 page from indexing
- `Sitemap: https://checkauto.lt/sitemap.xml`
- `Crawl-delay: 1` — polite crawling

---

## sitemap.xml
**Path:** `/sitemap.xml`

**Purpose:** XML sitemap for search engines. Lists 6 pages with hreflang annotations.

**Key Elements:**
- 6 URLs: `/`, `/paslaugos/`, `/procesas/`, `/apie/`, `/kontaktai/`, `/duk/`
- All pages: `lastmod: 2026-03-03`, hreflang `lt` + `x-default`
- Priority: homepage 1.0, services 0.9, contacts 0.8, process/FAQ 0.7, about 0.6
- Changefreq: homepage weekly, all others monthly

---

## CNAME
**Path:** `/CNAME`

**Purpose:** GitHub Pages custom domain configuration.

**Content:** `checkauto.lt`

---

## LICENSE
**Path:** `/LICENSE`

**Purpose:** Proprietary license. All rights reserved by checkauto.lt. No reproduction without written permission. Excludes third-party fonts (SIL Open Font License) and stock images.

---

## README.md
**Path:** `/README.md`

**Purpose:** Developer-facing project documentation covering site structure, how the bilingual system works, navigation behavior, animation system, and design approach.

---

# Component / Page Breakdown

## Navigation

All pages (except `coming-soon/index.html`) share an identical header/footer structure, manually duplicated in each HTML file (no templating system):

### Header
- **Desktop nav** (≥768px): Horizontal link list (`Pradžia`, `Paslaugos`, `Procesas`, `Apie`, `Kontaktai`) + language dropdown
- **Mobile nav** (<768px): Hamburger button → full-screen overlay with same links + language dropdown
- Active page marked with `aria-current="page"` on the appropriate `<a>` tag
- Sticky positioning with frosted glass backdrop blur effect

### Footer
- Footer logo + 5 nav links (Paslaugos, Procesas, Apie, Kontaktai, D.U.K.) + copyright
- Credit bar: Dark strip with "Svetainę sukūrė 1012.lt" linking externally

### Language Switcher
- Appears in both desktop and mobile nav on every page
- Two options: Lietuvių (LT flag) and English (US flag)
- Persists selection to `localStorage('checkauto-lang')`
- Flags rendered as inline SVG data URIs in CSS

## Page Interconnections

| From | Links To |
|------|----------|
| Homepage | → `/kontaktai/` (hero CTA + CTA band) |
| Paslaugos | → `/kontaktai/` (CTA), → `/procesas/` (checklist link), → `/duk/` (FAQ "more" link) |
| Procesas | → `/kontaktai/` (CTA) |
| Apie | → `/kontaktai/` (CTA) |
| Kontaktai | → `/paslaugos/` + `/procesas/` (ghost buttons) |
| D.U.K. | → `/kontaktai/` (CTA) |
| 404 | → `/` (return home button) |
| Footer (all pages) | → all 5 inner pages |

## Shared Components

| Component | Implementation | Used On |
|-----------|---------------|---------|
| Header | Manual HTML duplication | All pages except coming-soon |
| Footer | Manual HTML duplication | All pages except coming-soon |
| Language dropdown | Duplicate in desktop + mobile nav | All pages except coming-soon |
| CTA band | `.section--dark > .cta-band` pattern | All pages except 404, coming-soon |
| FAQ accordion | `<details>/<summary>` with `.faq-list` | paslaugos (4 items), duk (10 items) |
| Section label | `.section-label` uppercase accent text | All content pages |


## Scripts Used Across Pages

| Script | Pages |
|--------|-------|
| `js/i18n.js` | All pages except `coming-soon/index.html` |
| `js/main.js` | All pages except `coming-soon/index.html` |

---

# JavaScript Logic Map

## js/main.js — Function Map

### `initMobileNav()`
- **Purpose:** Controls mobile hamburger menu open/close behavior
- **DOM queries:** `.nav-toggle`, `.nav-mobile a`
- **Events:** click (toggle, links), keydown (Escape)
- **Side effects:** Toggles `body.nav-open` class, updates `aria-expanded`/`aria-label`
- **Called by:** `init()`
- **Files using it:** All pages via `main.js`

### `initCopyButtons()`
- **Purpose:** Copy text to clipboard from data attribute
- **DOM queries:** `.copy-btn[data-copy]`
- **APIs:** `navigator.clipboard.writeText()`
- **Side effects:** Adds/removes `.copied` class (1.5s timeout)
- **Called by:** `init()`
- **Files using it:** `kontaktai/index.html` (email copy button)

### `initHeaderScroll()`
- **Purpose:** Detect scroll position for header styling
- **DOM queries:** `.site-header`
- **Events:** scroll (passive)
- **Side effects:** Adds/removes `.scrolled` class at 10px threshold
- **Called by:** `init()`
- **Files using it:** All pages

### `initScrollHint()`
- **Purpose:** Auto-hide the "žemyn" scroll indicator
- **DOM queries:** `.scroll-hint`
- **Events:** scroll (passive)
- **Side effects:** Adds/removes `.hidden` class at 60px threshold
- **Called by:** `init()`
- **Files using it:** `index.html` (homepage only — only page with `.scroll-hint`)

### `init()`
- **Purpose:** Master entry point — calls all 4 sub-initializers
- **Trigger:** `DOMContentLoaded` event (or immediate if DOM already loaded)

## js/i18n.js — Function Map

### `resolve(obj, path)`
- **Purpose:** Dot-notation path resolver for nested objects
- **Input:** Translation object + key string (e.g., `"home.hero.title"`)
- **Output:** Resolved value or `null`
- **Called by:** `applyTranslations()`

### `applyTranslations(data)`
- **Purpose:** Render all translations to the DOM
- **DOM queries:** `[data-i18n]`, `[data-i18n-placeholder]`, `[data-i18n-aria]`
- **Logic:** For leaf elements → `textContent`. For elements with children → `TreeWalker` to update only direct text nodes (preserves `<span>` tags inside comparison headings like "Su check**auto**.lt").
- **Called by:** `setLanguage()`

### `updateSwitcherUI(lang)`
- **Purpose:** Sync dropdown visual state with active language
- **DOM queries:** `.lang-dropdown`, `.lang-dropdown-menu li`
- **Called by:** `setLanguage()`

### `loadTranslations(lang)`
- **Purpose:** Fetch and cache translations from `/lang/{lang}.json`
- **Returns:** Promise resolving to the translation data object
- **Side effects:** Populates `translations[lang]` cache; subsequent calls return cached data instantly
- **Called by:** `setLanguage()`

### `setLanguage(lang)`
- **Purpose:** Complete language switch — load translations, update UI, persist, update HTML lang attribute
- **Side effects:** `localStorage.setItem('checkauto-lang', lang)`, `document.documentElement.lang = lang`, removes `i18n-loading` class
- **Called by:** `init()`, language dropdown click handlers
- **Exposed as:** `window.checkautoI18n.setLanguage`

### `init()`
- **Purpose:** Bootstrap i18n — read saved language, apply translations, bind dropdown events
- **Events:** click on `.lang-dropdown-toggle` (open/close), click on `li[data-lang]` (switch), document click (close all)
- **Trigger:** `DOMContentLoaded` event

## Event Flow Summary

```
Page Load
  ├─ <head> inline script: detect saved lang, set html.lang, add .i18n-loading
  ├─ CSS loads, body hidden (.i18n-loading → opacity: 0)
  ├─ i18n.js: init() → read localStorage → setLanguage() → fetch /lang/{lang}.json → applyTranslations()
  │   ├─ fetch translation JSON (cached after first load)
  │   ├─ update all [data-i18n] elements
  │   ├─ update switcher UI
  │   ├─ remove .i18n-loading → body becomes visible
  │   └─ bind dropdown handlers
  └─ main.js: init()
      ├─ initMobileNav() → bind toggle/links/escape
      ├─ initCopyButtons() → bind copy click handlers
      ├─ initHeaderScroll() → bind scroll listener
      └─ initScrollHint() → bind scroll listener

User Scrolls
  ├─ Header: .scrolled class added/removed at 10px
  └─ Scroll hint: .hidden class added at 60px

User Clicks Hamburger
  ├─ body.nav-open toggled
  ├─ CSS animates hamburger → X, overlay fades in, links stagger-animate
  └─ Escape key or link click → close

User Switches Language
  ├─ Dropdown opens (toggle button click)
  ├─ Language option clicked → setLanguage(lang)
  │   ├─ fetch /lang/{lang}.json (or use cache)
  │   ├─ All [data-i18n] elements updated
  │   ├─ Dropdown state updated
  │   ├─ localStorage persisted
  │   └─ html[lang] attribute updated
  └─ Dropdown closes

User Clicks Copy (email)
  ├─ navigator.clipboard.writeText()
  ├─ .copied class added (icon swaps to checkmark)
  └─ After 1.5s, .copied removed (icon reverts)
```

---

# CSS Architecture

## Layout System
- **Container:** `.container` with `max-width: 1120px`, auto margins, fluid padding via `clamp(1.25rem, 4vw, 2.5rem)`
- **Grid:** CSS Grid used for hero layout, benefit cards, comparison columns, risk stats, service cards (desktop), checklist, values grid, contact cards, footer
- **Flexbox:** Used for header, nav, buttons, footer credit, mobile overlay, contact card internals
- **Spacing tokens:** 7-level scale from `--space-xs` (0.5rem) to `--space-3xl` (8rem)

## Naming Conventions
- **BEM-like but not strict BEM:** Block-element pattern (e.g., `.hero-content`, `.hero-image`, `.risk-stat-number`, `.compare-item--no`) but no strict `__` element separator
- **Component prefixes:** `.site-header`, `.site-footer`, `.nav-desktop`, `.nav-mobile`, `.nav-toggle`
- **Modifiers:** Double-dash pattern (`.section--alt`, `.section--dark`, `.compare-col--without`, `.compare-item--yes`, `.btn-primary`, `.btn-ghost`)
- **State classes:** `.nav-open` (body), `.scrolled` (header), `.copied` (copy button), `.open` (dropdown), `.active` (dropdown item), `.hidden` (scroll hint)
- **Utility classes:** `.container`, `.section`, `.text-accent`, `.visually-hidden`

## Responsive Behavior
Mobile-first approach with 3 breakpoints:
| Breakpoint | Usage |
|------------|-------|
| `≥560px` | Contact cards → 2 columns |
| `≥640px` | Benefit cards → 2 columns, risk stats → 3 columns |
| `≥768px` | Desktop nav shown, hamburger hidden, hero → side-by-side grid, service cards → left-aligned grid, checklist → 2 columns, values → 3 columns, footer → row layout, header height increases, section padding increases, timeline padding increases |
| `≥1024px` | Hero grid columns tuned (1.1fr / 0.9fr) |

## Reusable Classes
| Class | Description |
|-------|-------------|
| `.container` | Centered width-constrained wrapper |
| `.section` | Vertical padding block |
| `.section--alt` | Light gray background variant |
| `.section--dark` | Dark background with inverted text |
| `.section-header` | Centered section title block |
| `.section-label` | Small uppercase accent label |
| `.btn` | Base button (pill shape, 48px min-height) |
| `.btn-primary` | Solid accent-colored button |
| `.btn-secondary` | Outlined accent button |
| `.btn-ghost` | Text-only with arrow |
| `.text-accent` | Accent color text |
| `.visually-hidden` | Screen-reader-only content |

## Font System
- 3 `@font-face` declarations at the top of the file
- Inter: variable weight (400–700), two subsets split by `unicode-range` (latin-ext for Lithuanian diacritics, latin for ASCII)
- Space Grotesk: weight 700 only, used for credit logo
- All fonts: `font-display: swap` for performance
- Fallback stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif`

---

# Asset Usage

## Fonts

| File | Font | Weight | Usage |
|------|------|--------|-------|
| `Inter-latin-ext.woff2` | Inter | 400–700 | All body text, headings — Lithuanian diacritics (ą, č, ę, ė, į, š, ų, ū, ž) |
| `Inter-latin.woff2` | Inter | 400–700 | All body text, headings — basic Latin characters |
| `SpaceGrotesk-latin.woff2` | Space Grotesk | 700 | Footer credit "1012.lt" logo text only |

Preloaded in `<head>` of all pages (except coming-soon and 404 which load Inter implicitly via stylesheet): `Inter-latin-ext.woff2` and `Inter-latin.woff2`.

## Images

| File | Format | Usage |
|------|--------|-------|
| `favicon.svg` | SVG | Favicon on all pages (`<link rel="icon">`) |
| `hero-car.jpg` | JPEG | Homepage hero section (640×800 declared, lazy-load disabled `loading="eager"`) |

## Open Graph Images

| File | Used By (og:image meta) |
|------|------------------------|
| `og/home.png` | `index.html` |
| `og/paslaugos.png` | `paslaugos/index.html` |
| `og/procesas.png` | `procesas/index.html` |
| `og/apie.png` | `apie/index.html` |
| `og/kontaktai.png` | `kontaktai/index.html` |
| `og/duk.png` | `duk/index.html` |

## Inline SVG Icons
All icons are rendered as inline SVGs directly in HTML (no icon font, no external SVG sprite):
- **Nav:** Chevron for language dropdown
- **Hero:** Scroll-hint arrow
- **Benefits:** Magnifying glass, document, shield, checkmark
- **Services:** Clipboard+check, monitor, chat bubble, exchange arrows
- **Contact:** Phone, email envelope, copy icon, check icon
- **Flags:** Lithuanian and US flags as CSS data URI SVGs

---

# Execution Flow

## 1. HTML Loads
Browser requests the HTML file. The `<html lang="lt">` tag sets Lithuanian as default.

## 2. Early Language Detection (Head Inline Script)
Before any CSS or external JS loads, an inline IIFE in `<head>` runs:
```js
(function(){
  var l = localStorage.getItem('checkauto-lang');
  if (l && l !== 'lt') {
    document.documentElement.lang = l;
    document.documentElement.classList.add('i18n-loading');
  }
})();
```
If the user previously selected English, the `<html>` tag is updated to `lang="en"` and the `i18n-loading` class is added, which hides the body (`opacity: 0`) to prevent a flash of Lithuanian text.

## 3. CSS Applies Layout
`styles.css` is loaded (linked in `<head>`). Font preloads ensure Inter is available early. The body is hidden if `i18n-loading` is active. The sticky header, grid layouts, reveal-hidden elements, and all visual styles are applied.

## 4. i18n.js Initializes
Loaded at end of `<body>`. On DOMContentLoaded:
1. Reads `checkauto-lang` from `localStorage` (defaults to `'lt'`)
2. Calls `setLanguage(savedLang)` which fetches `/lang/{lang}.json`:
   - Fetches translation JSON file (cached after first load)
   - Iterates all `[data-i18n]` elements and replaces their text content with the correct language
   - Updates language dropdown visual state
   - Persists language to localStorage
   - Removes `i18n-loading` class → body fades in (60ms transition)
3. Binds click handlers on language dropdown toggles and options

## 5. main.js Initializes
Also loaded at end of `<body>`. On DOMContentLoaded:
1. `initMobileNav()` — hamburger menu becomes interactive
2. `initCopyButtons()` — email copy button on contact page becomes functional
3. `initHeaderScroll()` — scroll listener starts tracking position for header `.scrolled` class
4. `initScrollHint()` — scroll listener starts tracking for homepage scroll indicator

## 6. User Interaction
- **Scrolling:** Header may gain shadow. Scroll hint fades.
- **Navigation:** Desktop links work as standard anchor navigation. Mobile hamburger toggles full-screen overlay with staggered animation.
- **Language switch:** Instant text replacement without page reload. All `data-i18n` elements update. Choice persists across sessions.
- **Copy email:** Single click copies `info@checkauto.lt` to clipboard. Visual feedback via icon swap.
- **FAQ:** Native `<details>` elements toggle open/close without JavaScript.

---

# Observations

## Architectural Patterns
1. **No build system, but shared components via JS:** Every page is a standalone HTML file with no build step. Header and footer markup is centralized in `js/components.js`, which injects the full header (desktop nav, mobile nav, language dropdown) and footer (nav links, copyright, credit bar) into `<div id="site-header">` and `<div id="site-footer">` placeholders using `outerHTML` replacement. Active page detection (`aria-current="page"`) is automatic based on `location.pathname`. All asset and link paths use absolute URLs (e.g., `/css/styles.css`, `/kontaktai/`). The script must load before `i18n.js` so that injected `data-i18n` elements are present in the DOM for translation.
2. **Translations loaded from JSON files:** The i18n system fetches translations from `/lang/lt.json` and `/lang/en.json` at runtime via `fetch()`, caching them after first load. To edit any text on the site, only the JSON files need to be changed — no JavaScript modifications required. This requires an HTTP server for local development (e.g., `python3 -m http.server`).
3. **Progressive enhancement:** FAQ accordions use native `<details>/<summary>` (works without JS). Language defaults to Lithuanian with no JS.
4. **SEO-first design:** Every page has unique meta tags, structured data, canonical URLs, hreflang alternatives, and an XML sitemap. The 404 page is properly excluded from indexing.
5. **Performance optimizations:** Font preloading, `font-display: swap`, inline SVG icons (no external requests), scripts at end of body, passive scroll listeners, `decoding="async"` on hero image.

## Potential Issues
1. **`coming-soon` page inconsistency:** This page doesn't share the main stylesheet or scripts, and uses inline styles with some of the same CSS custom property names but different values (e.g., no `--space-*` tokens). It also has a `footer-credit` div but lacks the CSS to style it since `styles.css` isn't loaded.
2. **No `hreflang="en"` in HTML or sitemap:** While the site supports English via client-side switching, there are no separate English URLs. Hreflang tags only declare `lt` and `x-default`. Search engines cannot discover the English version since language switching is purely client-side with no URL change. This is acceptable for a Lithuanian-market business — English exists as a UX convenience, not an SEO target.

## Possible Improvements
1. **Fix `coming-soon/index.html`** to either load the shared stylesheet or include the `.footer-credit` styles inline.

---

# Changelog

## 2026-03-12
- **Fixed duplicate `footer` key in lang files:** Merged the two separate `"footer"` objects in both `lt.json` and `en.json` into a single object containing both `"copy"` and `"credit"` keys.
- **Removed unused image assets:** Deleted 6 unreferenced images from `assets/images/` (`hero-car1.jpg`, `inspection-vertical.jpg`, `inspection.jpg`, `parked-car.jpg`, `services-hero.jpg`, `diagnostics.jpg`). Only `favicon.svg` and `hero-car.jpg` remain.
- **Removed dead `lastScroll` variable:** Cleaned up the unused `lastScroll` variable and associated `currentScroll` assignment in `initHeaderScroll()` in `main.js`. The function now reads `window.scrollY` directly in the threshold check.
- **Fixed outdated documentation:** Removed 4 items from Potential Issues / Possible Improvements that were already resolved: header/footer duplication (solved by `components.js`), 404 relative paths (already uses absolute paths), static site generator suggestion (unnecessary), and 404 absolute paths suggestion (already done).

## 2026-03-12 (2)
- **Refactored i18n to load from JSON files:** Replaced ~300 lines of inline translation data in `i18n.js` with `fetch()` calls to `/lang/lt.json` and `/lang/en.json`. Translations are cached after first load. The JSON files are now the single source of truth for all UI text — editing translations no longer requires touching JavaScript.
- **Synced JSON files with i18n.js:** Before the refactor, the JSON files were out of sync with the inline translations. Extracted the canonical data from `i18n.js` and wrote it to both JSON files to ensure parity.
- **Removed `max-width` from `.section-header`:** The `max-width: 640px` constraint was causing hero text to wrap across multiple pages. Removed it globally from `css/styles.css`.
- **Updated English "About" hero text:** Changed "On the client's side" to "On your side" and made the subtitle more natural-sounding.
