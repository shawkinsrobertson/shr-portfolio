# SPEC.md: Requirements and Design Spec
> Created: 2026-11-20
> Source of intent: `Claude/intent.md` (commit `d613bde`)
> Design source: Figma "FED-Portfolio" (`cWG4R8JJebjgilBEJngZ7z`, page "Quick Design Draft")
> Status: Draft for review. Items marked **[OPEN]** need a decision. Items marked **[PROPOSED]** are my recommendation where the Figma or INTENT is silent.

This spec turns INTENT.md into buildable work against the existing React 19 + Vite + TypeScript + react-router codebase. It is written so each section can be built and verified on its own.

---

## 1. Summary

**Product.** Seamus Robertson's front-end developer portfolio. First impression for interviewers. Introduces Seamus, key projects and their process, contact info, and is itself a portfolio project.

**Audience.** Recruiters/hiring managers and engineers/interviewers equally. Skim layer first, depth on demand.

**Target roles.** Remote React/TypeScript at startups and small businesses. Enterprise only with mentorship.

**Quality bar.** WCAG 2.2 AA and Lighthouse 95+ (all four categories) on every route, in every theme.

**Deadline.** Live on a custom domain by **Dec 1, 2026** (11 days from this spec). Case studies may finish by end of Dec. Job search starts January 2027.

### 1.1 Decisions already made

| # | Decision | Source |
|---|---|---|
| D1 | Contact is links only (email, LinkedIn, GitHub). No form. | INTENT |
| D2 | Hand-coded vs agentic is a badge/tag on the card. Two homepage sections may return later. | Chat |
| D3 | Incomplete case studies are hidden until complete. | Chat |
| D4 | Launch blockers: real project images, complete case studies, custom domain, resume attached (conditional button removed). | Chat |
| D5 | Four themes ship by Dec 1: light, dark, glass, opossum. Picker is four-way. | Chat |
| D6 | Default theme follows `prefers-color-scheme`, and the choice is remembered. | INTENT |
| D7 | `prefers-reduced-motion` honored for all animation. | INTENT |
| D8 | Case studies move to MDX now. | Chat |
| D9 | Host on Cloudflare Pages with a custom domain. | Chat |
| D10 | Vitest + `vitest-axe`. Site must stay testable at any size. | Chat |
| D11 | Routes become `/`, `/projects/:slug`, `/bio`, plus a 404. Footer mounted on every page. Substack hidden until it has a real URL. | Chat (defaults accepted) |
| D12 | Profanity in "Do Shit" and the tagline stays. **Amended:** the project URL slug is the neutral `todo-app`; the title stays "Do Shit". | Chat |
| D13 | Lean copy and project order toward startup and React/TypeScript work. | Chat |
| D14 | Opossum base is an opaque vertical gradient `#505200` to `#5E3A00`, both stops at 100% opacity, top to bottom. | Chat |
| D15 | Proposed contrast fixes accepted (light secondary text, dark accent text, glass accent text; opossum text tokens in 6.4). | Chat |
| D17 | Opossum accent is `#FF914E`. Verified: 3.69 to 4.52:1 on the gradient (fine for rings and fills, not small text), and `#232323` button text on it is 7.04:1. | Chat |
| D16 | Nov 27 cut line accepted. Light and dark are the v1 benchmark. If only one extra theme can pass AA, **opossum takes priority over glass**. | Chat |

### 1.2 Open items

| # | Item | Recommendation | Needed by |
|---|---|---|---|
| O1 | SEO and sharing (INTENT item 5) | Section 11 | Before build of Phase 3 |
| O2 | Analytics (INTENT item 6) | Cloudflare Web Analytics, section 12 | Before Phase 3 |
| O3 | ~~Opossum theme palette incomplete in Figma~~ **Resolved (D14).** Remaining: confirm the proposed opossum text tokens in 6.4/6.5 | Section 6.5 | Before Phase 2 |
| O4 | ~~Figma contrast failures~~ **Resolved (D15).** | Section 6.4 | |
| O5 | ~~Cut line~~ **Resolved (D16).** Checkpoint is Nov 27. | Section 17 | |
| O6 | Success targets (INTENT item 12 has none) | Optional | Post-launch |

---

## 2. Current-state audit

Findings from reading the codebase. IDs are referenced by the requirements below.

### 2.1 Accessibility and UX

| ID | Finding | Where |
|---|---|---|
| A1 | Theme toggle is an icon-only button with no accessible name or state. It is wrapped in a `<label>` that labels nothing. | `ThemeToggle.tsx:15-19` |
| A2 | Theme state starts as `'light'` regardless of OS setting. Choice is not persisted. Page flashes light on load for dark users. | `ThemeToggle.tsx:6` |
| A3 | Projects dropdown opens on hover and `:focus-within` only. Its trigger is `<Link to="#">`, with no `aria-expanded` and no Escape handling. Hover menus do not work on touch. | `Nav.tsx:15`, `Nav.css:61` |
| A4 | Heading levels skip: hero uses `h1` then `h3`; home sections use `h3` with no `h2`. | `Hero.tsx`, `HomePage.tsx` |
| A5 | Images use `alt=""`. Fine for decorative card thumbnails, wrong for the case study hero image. | `LongformCard.tsx:49`, `ProjectCard.tsx:32` |
| A6 | Substack "link" is the string `'coming soon'`, rendered as an `href`. | `BioStats.tsx`, `bio.tsx` |
| A7 | No skip link. No `<main>` landmark. Sticky header can cover focused elements (WCAG 2.4.11). | `App.tsx`, `Nav.css:1` |
| A8 | Focus ring exists only on a leftover Vite-template `.counter` class. No global `:focus-visible` style. | `App.css:14` |
| A9 | `button {}` and `button:hover { transform: scale(1.05) }` are global selectors defined in `ThemeToggle.css`. They leak onto every button and ignore reduced motion. | `ThemeToggle.css:12-26` |
| A10 | Class `liquid-glass` is used on the theme button and hero CTAs but never defined. The CTAs are unstyled. Only `.glass` exists. | `Hero.tsx:17`, `ThemeToggle.tsx:18` |
| A11 | Entire project card is one link wrapping a heading, paragraphs, and a list. Screen readers read all of it as the link name. | `ProjectCard.tsx` |
| A12 | Missing case study shows a bare `<div>Case study not found</div>`. No 404 route, no `<h1>`, no way back. | `LongformCard.tsx:13` |
| A13 | Footer component exists but is never rendered. Its social items are plain text, not links. | `Footer.tsx` |
| A14 | Stray Vite-template CSS (`.counter`, `.base`, `.framework`, `.vite`, `#projects`) remains in `App.css`. | `App.css` |

### 2.2 Contrast (computed from current tokens)

| Pair | Ratio | Result |
|---|---|---|
| Dark: accent `#3752ff` on bg `#16171d` | 3.25:1 | **Fails** AA text (4.5:1) |
| Glass (light): white on glass blue over white | ~3.2:1 | **Fails** AA text |
| Light: `--text #6b6375` on `#fff` | 5.73:1 | Pass |
| Dark: `--text #d4d6d9` on `#16171d` | 12.28:1 | Pass |

These tokens are replaced by the Figma palette (section 6), but the failure mode (translucent surfaces and accent-colored text) carries over, so it is tested for explicitly.

### 2.3 Performance and tech

| ID | Finding |
|---|---|
| P1 | `--sans` and `--heading` list `system-ui` first, so Google Fonts (Open Sans, Istok Web) are downloaded but never used. Figma specifies Inter (headings) and Open Sans (body), so the stack must change anyway. |
| P2 | Fonts load from `fonts.googleapis.com`. Third-party request, blocks nothing but costs a connection and a privacy disclosure. |
| P3 | Project images are 50-70 KB PNGs with no width/height (layout shift) and no lazy loading. |
| P4 | `index.html` title is `portfolio`. No description, no Open Graph tags, no theme-color. |
| P5 | Single bundle. All case study data loads on every route. |
| P6 | No tests, no CI, no deploy config. |
| P7 | `hasLongFormContent` in the data file decides what is public. It needs `isValidElement` because data contains JSX (agentic study "What I Did" bold lead-ins). MDX removes the need for JSX in data. |

### 2.4 Security surface

Static client-side site. No backend, no forms, no user input, no auth, no secrets. The relevant risks are listed in section 13.

---

## 3. Requirements

IDs: **FR** functional, **NFR** non-functional. Each maps to acceptance criteria in section 18.

### 3.1 Functional

| ID | Requirement |
|---|---|
| FR1 | Home page shows hero (name, role, tagline, email + resume CTAs) and project cards. Cards link to their case study. |
| FR2 | Only case studies with `draft: false` and passing the publish bar (section 8.3) appear in cards, nav, sitemap, and routes. |
| FR3 | Each card shows a text badge: "Hand-coded" or "Agentic". Badge is not color-only. |
| FR4 | Case study page renders frontmatter header (title, description, stack, platform, status, image, links) plus the MDX body. |
| FR5 | Bio page shows headshot, business section, personal section, and contact links (email, LinkedIn, GitHub). Substack appears only when it has a URL. |
| FR6 | Resume is a downloadable PDF linked from the hero, bio page, and footer. The conditional-render logic is removed. |
| FR7 | Theme picker offers light, dark, glass, opossum. Default follows `prefers-color-scheme` (light or dark). Choice persists across visits and tabs. |
| FR8 | Footer on every page: copyright, email, LinkedIn, GitHub as real links. |
| FR9 | Unknown URLs render a 404 page with `<h1>` and a link home. Unknown or draft project slugs render the same 404. |
| FR10 | Nav provides Home, Projects (list of published studies), Bio, and the theme picker. Works at 320px wide and on touch. |
| FR11 | Skip link ("Skip to main content") is the first focusable element. |
| FR12 | Each route sets its own `<title>` and meta description. |
| FR13 | Deep links (`/projects/<slug>`, `/bio`) work on first load and on refresh in production. |

### 3.2 Non-functional

| ID | Requirement |
|---|---|
| NFR1 | WCAG 2.2 AA on every route in every theme (section 10). |
| NFR2 | Lighthouse Performance, Accessibility, Best Practices, SEO each at 95 or higher, mobile profile, on `/`, `/bio`, and one case study. |
| NFR3 | Mobile first. Layout works from 320px with no horizontal scroll. Desktop is elegant, not merely stretched. |
| NFR4 | No third-party requests at runtime except the chosen analytics beacon. |
| NFR5 | Content security headers deployed (section 13). |
| NFR6 | Writing a new case study requires adding one `.mdx` file and its image, with no code change. |
| NFR7 | Test suite runs in CI on every push. Build fails on type errors, lint errors, failing tests, or invalid case study frontmatter. |
| NFR8 | Respects `prefers-reduced-motion`, `prefers-contrast`, `forced-colors`, and (progressively) `prefers-reduced-transparency`. |

---

## 4. Information architecture

| Route | Component | Notes |
|---|---|---|
| `/` | `HomePage` | Hero, then projects. Replaces the two-section split with one grid plus badges; the section split is easy to restore (D2). |
| `/projects/:slug` | `CaseStudyPage` | Replaces `/pages/:slug`. Lazy-loaded MDX body. |
| `/bio` | `BioPage` | Replaces `/pages/bio`. |
| `*` | `NotFoundPage` | Also used for unknown or draft slugs. |

Because the site is not live yet, no redirects from `/pages/*` are needed.

Layout shell for every route: `SkipLink`, `Nav` (`<header>`), `<main id="main">`, `Footer`.

---

## 5. Architecture

### 5.1 File layout (target)

```
portfolio/
  public/
    resume/seamus-robertson-resume.pdf        (FR6)
    og-image.png                              (O1)
    robots.txt, sitemap.xml                   (O1, generated at build)
    _headers                                  (section 13)
  src/
    app/ (App.tsx, routes.tsx, Layout.tsx)
    components/
      SkipLink/ Nav/ ThemeSwitcher/ Hero/ ProjectCard/ Badge/ Footer/ ...
      mdx/ (Callout, Figure, CodeBlock, mdx-components.tsx)
    content/projects/<slug>.mdx               (D8)
    lib/ (projects.ts, theme.ts, seo.tsx)
    styles/ (tokens.css, base.css, themes/{light,dark,glass,opossum}.css)
    pages/ (HomePage, BioPage, CaseStudyPage, NotFoundPage)
    data/ (site.ts)
    test/ (setup.ts, helpers)
  index.html
```

Existing component folders stay where they are for this pass. Moves are optional and only worth doing if they do not slow the Dec 1 date.

### 5.2 Styling approach

Keep plain CSS with custom properties (current convention). No Tailwind, no CSS-in-JS. Figma's generated Tailwind output is reference only and is translated to tokens.

### 5.3 Dependencies to add

| Package | Why |
|---|---|
| `remark-frontmatter`, `remark-mdx-frontmatter` | Expose `frontmatter` export from MDX (the experiment branch has only `@mdx-js/rollup`) |
| `@fontsource-variable/inter`, `@fontsource-variable/open-sans` | Self-host fonts (P2, NFR4) |
| `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `vitest-axe` | D10 |
| `@lhci/cli` (dev, CI only) | NFR2 gate |

No runtime library for head management: React 19 hoists `<title>` and `<meta>` rendered in components.

---

## 6. Design system

**Source of truth: the Figma file.** The current CSS tokens (accent `#3752ff`, Istok Web, blue glass) are replaced. Figma values below were read from the file; **[PROPOSED]** marks anything I derived to fix contrast or fill a gap.

### 6.1 Typography (Figma)

| Role | Font | Weight |
|---|---|---|
| Headings | Inter | Medium (500) |
| Body | Open Sans | Light (300) and Regular (400) |

**[PROPOSED]** Body text below 18px/24px uses Regular (400). Light (300) is for large text only. Light at body size on the light theme is a legibility risk even where ratios pass, and the "readable fonts" requirement in INTENT outranks the aesthetic. Mono (`--mono`) is unchanged for code.

Type scale: keep the existing `h1 56/36`, `h2 24/20`, base `18/16` at the 1024px breakpoint; confirm against Figma when text styles are added there.

### 6.2 Core tokens (Figma)

| Token | Light | Dark | Glass | Opossum |
|---|---|---|---|---|
| `--bg` | `#FBFBFB` | `#232323` | gradient (6.3) | `linear-gradient(180deg, #505200 0%, #5E3A00 100%)` (D14) |
| `--text-primary` | `#00052F` | `#FBFBFB` | `#FBFBFB` | `#FBFBFB` |
| `--text-secondary` | `#6A6A6A` **[adjusted from Figma `#8D8D8D`]** | `#8D8D8D` | `#8D8D8D` | `#F5B94A` **[adjusted from Figma `#D38200`]** |
| `--accent` (fills, decoration) | `#0019D2` | `#0019D2` | `#0019D2` | `#FF914E` **[owner's choice, replaces Figma `#BA4400`]** |
| `--accent-text` / `--focus` (text, links, rings) | `#0019D2` | `#8C9BFF` **[adjusted]** | `#A9B4FF` **[adjusted]** | `#FFB080` **[adjusted]** |

Note: the opossum frame's swatch **labels** still read `#0019D2` and `#8D8D8D`, but the swatch **fills** are `#BA4400` and `#D38200`. I used the fills as the starting point, then adjusted for contrast below. The Figma frame could be updated to match.

### 6.3 Glass (Figma)

- Background: `linear-gradient(129.86deg, #00052F 22%, #9F3501 39%, rgba(0,5,47,0.75) 68%, rgba(0,25,210,0.56) 91%)`
- Glass surface: radius `22px`; 1px solid `#FBFBFB` border; backdrop blur `40px` (variable `--liquid-glass/shadow---blur---bg` 80px, halved)
- Fill: two stacked white radial sheens (center `rgba(255,255,255,.52)` fading to 0 at 20% opacity; and `.45 → .23 → .18` at 26% opacity)
- Shadows: `0 1px 2px rgba(0,0,0,.13)`, `0 14px 42px -11px rgba(0,0,0,.27)`; inset rims `inset 0 -1px 0 rgba(255,255,255,.15)`, `inset 0 1px 0 rgba(255,255,255,.7)`, `inset 0 0 0 .5px rgba(255,255,255,.47)`, `inset 0 0 16px rgba(0,0,0,.08)`

This replaces the existing `--glass-*` variables. The existing `.glass` mechanics (pseudo-element sheen and rim, `isolation`) can be kept and re-pointed at the new values.

### 6.4 Contrast results and required adjustments

Computed with the WCAG relative-luminance formula. AA needs 4.5:1 for body text, 3:1 for large text (18.66px bold / 24px) and for UI components and focus indicators.

| Pair | Ratio | Result | Action |
|---|---|---|---|
| Light: primary `#00052F` on `#FBFBFB` | 19.10 | Pass | |
| Light: accent `#0019D2` on `#FBFBFB` | 9.81 | Pass | |
| Light: secondary `#8D8D8D` on `#FBFBFB` | **3.21** | **Fails** body text | **[PROPOSED]** `--text-secondary-light: #6A6A6A` (5.23) |
| Dark: primary `#FBFBFB` on `#232323` | 15.19 | Pass | |
| Dark: secondary `#8D8D8D` on `#232323` | 4.74 | Pass (narrow) | Keep |
| Dark: accent `#0019D2` on `#232323` | **1.55** | **Fails** as text, links, borders, focus ring | **[PROPOSED]** `--accent-text` / `--focus` in dark: `#8C9BFF` (6.17). Keep `#0019D2` only as a button *fill* behind `#FBFBFB` text (9.81) |
| Glass: `#FBFBFB` on gradient, sampled at `#00052F`, `#9F3501`, blue end | 19.10 / 6.80 / 14.08 | Pass at sampled points | Text must sit on a scrim (6.6) so content over unsampled mid-tones also passes |
| Glass: accent `#0019D2` on `#00052F` | **1.95** | **Fails** as text | **[PROPOSED]** `#A9B4FF` (10.03) for glass links/accent text |
| Opossum (D14 gradient, worst case across stops): `#FBFBFB` on `#505200` to `#5E3A00` | 7.96 (top) to 9.75 (bottom) | Pass | |
| Opossum: secondary `#D38200` on the gradient | 2.73 to 3.35 | **Fails** body text | **[PROPOSED]** `#F5B94A` (4.68 worst case) |
| Opossum: Figma accent `#BA4400` on the gradient | 1.54 to 1.88 | **Fails** as text, links, rings | Replaced by owner's `#FF914E` (below) |
| Opossum: accent `#FF914E` on the gradient | 3.69 (top) to 4.52 (bottom) | Passes 3:1 for rings, borders, large text. **Fails 4.5:1 for small text** near the top of the page | Use for fills, decoration, focus ring. For small accent-colored text and links use `#FFB080` (4.62 worst case) |
| `#FBFBFB` on accent fill `#0019D2` | 9.81 | Pass | Button text |
| `#232323` on opossum accent fill `#FF914E` | 7.04 | Pass | Opossum button text. **`#FBFBFB` on `#FF914E` is only 2.16 and must not be used** |

Rule applied throughout: **the accent color may be a fill or decoration, but any accent-colored text, link, border, or focus ring must use a token that passes 4.5:1 (text) or 3:1 (non-text) against its actual background.**

### 6.5 Opossum theme (decided, D14)

Figma's opossum frame was a translucent wash with no opaque base, so its rendered color depended on whatever sat underneath. Decision: make the wash the base. `--bg` is `linear-gradient(180deg, #505200 0%, #5E3A00 100%)`, both stops fully opaque, top to bottom. In CSS, `180deg` is top to bottom.

This makes opossum a **dark** theme (olive at the top, brown at the bottom). Consequences:
- `color-scheme: dark`, so native controls and scrollbars match.
- `#FBFBFB` primary text passes everywhere: 7.96:1 at the top stop, 9.75:1 at the bottom.
- Secondary and accent colors from Figma do not pass on this base, so the text variants in 6.2/6.4 are used: `#F5B94A` (secondary) and `#FFB080` (small accent-colored text and links). The accent itself is `#FF914E` (D17): fills, decoration, and the focus ring (3.69:1 at its lowest, which meets the 3:1 non-text bar). Buttons filled with `#FF914E` use `#232323` text (7.04:1), not white.
- Because the gradient is smooth and the page is taller than one screen, apply it with `background-attachment: fixed` or on `<body>` with `min-height: 100%` so it does not repeat or seam on long pages. Contrast is tested at both stops, and every intermediate position is bracketed by them.
- Text on opossum surfaces such as cards sits on the same gradient or a solid derived tint, never on a translucent layer that changes the base.

The token test (section 14) checks each text and focus token against both gradient stops. The proposed values above are verified against those stops, but should be re-checked in the browser. Remaining check: confirm you are happy with `#F5B94A` and `#FFB080` as the text variants.

Opossum is the only theme whose `--accent` and `--accent-text` differ in lightness by design; the token test asserts each token only against the use it is declared for (fill needs contrast with its label text, ring needs 3:1, text needs 4.5:1).

### 6.6 Glass legibility rule

Any text on a glass surface must pass AA against the **worst-case backdrop**, not the average. Implementation requirements:
1. Glass cards that carry body text add a solid-ish scrim layer (for example `rgba(0,5,47,.55)`) between the blur and the text. Contrast is tested against the scrim over the lightest and darkest gradient stops.
2. Fallback when `backdrop-filter` is unsupported (`@supports not (backdrop-filter: blur(1px))`), under `prefers-reduced-transparency: reduce`, and under `forced-colors: active`: use an opaque surface of the theme's base color with the same text tokens.
3. `backdrop-filter` is limited to cards and the nav bar; never full-viewport layers, to protect mobile performance (NFR2).

### 6.7 Spacing, radius, elevation

Not defined in Figma. **[PROPOSED]** keep the current 8px spacing rhythm and 24px page padding, 12px base radius for non-glass surfaces, 22px for glass (from Figma), 50px pill for buttons (current). Add these as tokens so themes can override them.

### 6.8 Token architecture

```css
/* styles/tokens.css: semantic tokens only, consumed by components */
:root { --bg; --surface; --text; --text-muted; --accent-fill; --accent-contrast;
        --accent-text; --border; --focus; --radius-card; --radius-pill; --shadow-card; }
/* styles/themes/<name>.css: sets them under [data-theme='<name>'] */
```

Components use only semantic tokens, never raw hex. `color-scheme` is set per theme (`light` or `dark`; glass and opossum declare whichever matches their base) so native controls and scrollbars match.

---

## 7. Theming architecture (FR7, A1, A2)

### 7.1 Behavior

- Stored value: one of `light | dark | glass | opossum`, key `theme`, in `localStorage`.
- On load: stored value if present and valid; otherwise `prefers-color-scheme` mapped to `light` or `dark`.
- While no stored choice exists, a `matchMedia` listener keeps the theme in sync with the OS. Once the user picks, the OS no longer overrides.
- Storage reads and writes are wrapped in try/catch (private mode and blocked storage must not break the page). Stored values are validated against the allow-list; anything else is ignored.
- Cross-tab sync via the `storage` event.

### 7.2 No flash of wrong theme

A tiny blocking script in `<head>` sets `data-theme` on `<html>` before first paint. It must be an external file (`/theme-init.js`, same-origin) or inline with a CSP hash. **[PROPOSED]** external file, so the CSP needs no `unsafe-inline` for scripts (section 13). `<meta name="theme-color">` is updated per theme.

### 7.3 Picker UI

- A button labeled "Theme" showing the current theme name, opening a small panel with a `role="radiogroup"` of four options. Each option shows an icon **and** a text label. Arrow keys move within the group; Escape closes and returns focus to the button.
- `aria-expanded`, `aria-controls` on the button. Selected option is `aria-checked`. Changes are announced through the radio state (no extra live region needed).
- Targets are at least 44px on touch (and never below 24px, WCAG 2.5.8).
- Replaces the current two-way sun/moon toggle (A1, A9). `ThemeToggle` is renamed `ThemeSwitcher`.
- Theme transitions (if any) are suppressed under `prefers-reduced-motion`.

---

## 8. Content model (D8, FR2, FR4, NFR6)

### 8.1 One MDX file per project

`src/content/projects/<slug>.mdx`:

```mdx
---
slug: todo-app
title: Do Shit
tagline: A vanilla JS to-do application
description: Responsive web app using CRUD and local storage to organize tasks, lists, and projects.
agentic: false
stack: [HTML, CSS, JavaScript]
role: Solo Developer
platform: Web
status: v1 complete
order: 10
draft: false
achievement: ""            # optional
links: { repo: "...", live: "..." }   # optional, https only
image: { file: feature-01.webp, alt: "Do Shit task list with a sidebar of projects", width: 1280, height: 720 }
thumb: { file: thumb-01.webp, width: 640, height: 360 }   # decorative on cards
---

### What It Is
...
```

Frontmatter requires `remark-frontmatter` and `remark-mdx-frontmatter` (section 5.3). The experiment branch's `todo-app.mdx` has no frontmatter yet; it gains the block above.

### 8.2 Loading

- **Metadata** (cards, nav, sitemap, tests): `import.meta.glob('../content/projects/*.mdx', { eager: true, import: 'frontmatter' })`. Small and eager.
- **Body** (case study page): `import.meta.glob('../content/projects/*.mdx')` (lazy), rendered through `React.lazy` + `Suspense`, so the home page does not ship every study's prose (P5).
- **Images:** resolved from `src/assets/project-img/` through a glob with `?url` so they keep Vite content hashes.
- `lib/projects.ts` exposes `getPublishedProjects()` (filtered by `draft` and the publish bar, sorted by `order`, startup/React/TS-relevant first per D13) and `getProject(slug)`. Everything else (Nav, HomePage, routes, sitemap) calls these two functions. This replaces `hasLongFormContent` and `getCaseStudySlug` (P7). The slug is explicit in frontmatter, not derived from the title, so URLs stay stable and a title edit cannot break a shared link.

### 8.3 Publish bar (D3)

A study is public only if `draft: false` **and** it has: non-empty `title`, `tagline`, `description`; at least one `stack` entry; `role`; `platform`; an `image` with non-empty `alt`; and a body containing at least one `###` section. **[PROPOSED]** The minimum body is adjustable, but the bar is enforced by a test (section 14) so an incomplete study cannot go live by accident, which matters given the Dec 1 launch with unfinished studies.

### 8.4 MDX components

`mdx-components.tsx` maps Markdown elements to styled, accessible components and provides:
- `Figure` (requires `alt`; optional caption)
- `Callout` (variants: note, bug, learning; text label included, not color-only)
- `CodeBlock` (monospace, horizontally scrollable, keyboard-focusable when it overflows)
- Links: external links get `target="_blank"` with `rel="noopener noreferrer"` and a visually hidden "(opens in new tab)".

Heading rule: the page `<h1>` is the project title (from frontmatter). MDX bodies use `###`-style headings as in the experiment, which render as `<h2>` by mapping one level up in `mdx-components`, so authors cannot create skipped levels.

### 8.5 Migration of the existing eight studies

| # | Study | Action |
|---|---|---|
| 1 | Do Shit | Converted (experiment branch). Add frontmatter. |
| 2-7 | Empty or partial entries | Create `.mdx` files with `draft: true`. They stay hidden until written. |
| 8 | No Guts No Glory | Convert. Its JSX bold lead-ins become Markdown `**bold**`. |

After migration, `CaseStudies.tsx`, `LongformCard`, and the `isValidElement` import are deleted.

---

## 9. Components

Each lists purpose, behavior, a11y, and changes from today.

### 9.1 SkipLink (new)
First tab stop. Visible on focus. Targets `#main`. Satisfies 2.4.1.

### 9.2 Nav (`Nav.tsx`, fixes A3, A7)
- `<header>` containing `<nav aria-label="Primary">`.
- Links: Home, Bio. "Projects" is a disclosure `<button aria-expanded aria-controls>` (not a `Link to="#"`) revealing the list of published studies. Opens on click and Enter/Space; closes on Escape, outside click, and route change. No hover dependency, so touch works.
- Mobile (below 640px): the list appears as an in-flow panel under the bar, not an absolute dropdown.
- Current page marked `aria-current="page"`.
- Sticky header height is exposed as `--header-h`, and `html { scroll-padding-top: var(--header-h) }` so focused elements are never hidden (2.4.11).
- The only motion is the open/close fade, disabled under reduced motion.

### 9.3 ThemeSwitcher
As section 7.3.

### 9.4 Hero (`Hero.tsx`, fixes A4, A10)
- `h1` name; the role line becomes a `<p>` (not `h3`).
- CTAs: "Email me" (`mailto:`) and "Download resume" (PDF). Both always rendered (D4); the conditional is deleted. Styled as real buttons on the semantic tokens, replacing the undefined `liquid-glass` class (A10).
- Resume link includes file type and size in its accessible text, for example "Download resume (PDF)".
- Copy leans to startup and React/TypeScript (D13). The current tagline stays (D12).

### 9.5 ProjectCard (`ProjectCard.tsx`, fixes A5, A11)
- Heading-link pattern: `<h3><a href>Title</a></h3>`, with the whole card clickable via a stretched `::after` on the link. The accessible name is the title only.
- Contains tagline, description, stack list (`<ul aria-label="Tech stack">`), role, optional achievement, and the **Badge** (D2, FR3).
- Thumbnail image is decorative (`alt=""`) because the title is adjacent; it carries `width`/`height`, `loading="lazy"`, `decoding="async"`.
- Hover and focus states: lift/outline, no layout shift; focus ring visible on all four themes.

### 9.6 Badge (new)
Text "Hand-coded" or "Agentic" with an icon. Distinct by shape and label, not only color. Tokenized per theme, 4.5:1 against its own fill. Kept in a component so a later return to two sections (D2) is a layout change only.

### 9.7 CaseStudyPage (replaces `LongformCard`)
- Header: `h1` title, description, key-facts list (stack, platform, status, role) as a `<dl>`, image with real `alt`, links to repo/live (https only, validated).
- Body: lazy MDX in `<article>`. Reading width capped at about 70ch. The current `max-width: 80%` card layout is replaced.
- Footer nav: previous/next published study and "Back to projects".
- Unknown/draft slug renders `NotFoundPage`.

### 9.8 BioPage (`bio.tsx`, fixes A6)
- Headshot with descriptive `alt`, EXIF stripped (section 13).
- Business section, personal section (personality lives mostly in the opossum theme, D5).
- Contact: email, LinkedIn, GitHub as links. Substack renders only if `bioStats.substack` is a valid `https://` URL; the `'coming soon'` string is removed.

### 9.9 Footer (`Footer.tsx`, fixes A13)
Rendered in `Layout`. Copyright with current year computed at render time, email, LinkedIn, GitHub links, resume link. `<footer>` landmark. Link text is descriptive, not icon-only; if icons are used they are `aria-hidden` beside visible text.

### 9.10 NotFoundPage (new, fixes A12)
`h1` "Page not found", short message, link to Home and Projects. Sets `<meta name="robots" content="noindex">`.

### 9.11 Cleanup
Delete stray Vite-template CSS (A14). Move the global `button` rules out of `ThemeToggle.css` into a scoped `.btn` class (A9).

---

## 10. Accessibility specification (WCAG 2.2 AA)

Applied beyond the audit fixes. Items new in 2.2 are marked.

| Area | Requirement |
|---|---|
| Landmarks | One `<header>`, `<nav aria-label="Primary">`, one `<main id="main">`, `<footer>`. |
| Headings | One `h1` per route; no skipped levels. Enforced by a test. |
| Keyboard | Everything operable by keyboard. Logical tab order. No traps. Escape closes disclosures and the theme panel. |
| Focus visible (2.4.7) | Global `:focus-visible` ring using a `--focus` token with 3:1 against adjacent colors in every theme (the current dark accent fails, see 6.4). |
| Focus not obscured (2.4.11, new) | `scroll-padding-top` equal to header height. |
| Target size (2.5.8, new) | Interactive targets at least 24x24 CSS px; touch controls 44px. |
| Dragging (2.5.7, new) | No drag-only interactions. |
| Consistent help (3.2.6, new) | Contact links appear in the same place (footer) on every page. |
| Contrast (1.4.3, 1.4.11) | Text 4.5:1 (large 3:1); UI components and focus rings 3:1, in all four themes, including glass over its worst-case backdrop. |
| Reflow (1.4.10) | No horizontal scroll at 320px wide or 400% zoom (except code blocks, which scroll in their own region). |
| Text spacing (1.4.12) | Layout survives user-overridden line-height, letter and word spacing. |
| Resize text (1.4.4) | Sizes in `rem`. No fixed-height text containers. |
| Images (1.1.1) | Informative images have real `alt` (required by frontmatter schema and test); decorative images `alt=""`. |
| Links (2.4.4) | Descriptive link text; new-tab links announced. |
| Motion | All animation behind `@media (prefers-reduced-motion: no-preference)`, or disabled under `reduce`. No hover `transform: scale` without that guard (A9). |
| Forced colors | Verified in Windows High Contrast: borders and focus rings still visible; glass falls back to opaque. |
| Language | `<html lang="en">` (present). |
| Page titles (2.4.2) | Unique per route (FR12). |
| Screen reader pass | Manual VoiceOver (macOS and iOS) on `/`, `/bio`, one case study, and the theme picker before launch. |

---

## 11. SEO and sharing **[OPEN O1]**

Recommended approach, pending your decision:

**Do for launch**
1. Per-route `<title>` and `<meta name="description">` rendered from route components (React 19 hoists them). Pattern: `Page name | Seamus Robertson, Front-End Developer`.
2. `<link rel="canonical">`, `<meta name="theme-color">`.
3. Open Graph and Twitter card tags using **one** site-wide 1200x630 image plus per-route title/description. Case-study pages reuse the site image at launch.
4. `robots.txt` and a `sitemap.xml` generated at build from `getPublishedProjects()`.
5. JSON-LD `Person` schema on the home page. Optional but cheap.

**Defer (post-launch)** **[PROPOSED timing]**: do this in December, after the Dec 1 launch and before the January job search begins. A sensible order is: (1) pre-rendering first, since it unlocks per-page previews, about a day of work; (2) per-case-study Open Graph images as each study is finished, which lands around end of December when the studies are complete. Target: all done by **Dec 31**, so every link you send with an application in January previews correctly. No date was set before; this is my recommendation.
- Per-case-study Open Graph images.
- Pre-rendering/SSG. Client-rendered routes mean link-preview scrapers (Slack, LinkedIn) do **not** execute JS and will read only the static `index.html` tags, so per-page previews will not work until pre-rendering exists. Googlebot does render JS, so search indexing is fine. For a portfolio whose links are mostly shared by URL, the site-wide preview is acceptable for launch. Tools to evaluate later: `vite-react-ssg` or a build-time prerender script, which also work with Cloudflare Pages.

---

## 12. Analytics **[OPEN O2]**

**Recommendation: Cloudflare Web Analytics.** It is free, cookieless, collects no personal data, needs no consent banner, and matches the chosen host (D9). Success metric 12.2 (traffic once applications begin) only needs page views, referrers, and top paths.

- Adds one script from `static.cloudflareinsights.com` plus a beacon to `cloudflareinsights.com`, both of which must be allowed in the CSP. This is the single exception to NFR4.
- Because Cloudflare Pages serves the site, the beacon can be enabled in the dashboard without editing code. Prefer that so no analytics token lives in the repo.
- Alternatives if you want custom events: Plausible or Umami (self-hosted). Both add cost or hosting work and are not needed for launch.
- Analytics must not load until the site is otherwise passing Lighthouse. Re-run the audit with it enabled.

---

## 13. Security

I applied the security-review lens (secure-by-default, least privilege, input handling, supply chain, headers) to this static-site context. There is no backend, so most injection classes do not apply. What does apply:

### 13.1 Headers (Cloudflare Pages `public/_headers`)

```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' https://static.cloudflareinsights.com; connect-src 'self' https://cloudflareinsights.com; img-src 'self' data:; style-src 'self'; style-src-attr 'unsafe-inline'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  Cross-Origin-Opener-Policy: same-origin
/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

- HSTS is enabled with HTTPS-only redirects in Cloudflare settings after the custom domain is live (do not enable preload until confirmed stable).
- `style-src-attr 'unsafe-inline'` exists only if React `style={{}}` props are used; remove it if none are. Verify the CSP in the browser console on every route. The glass `backdrop-filter` and the theme init script must work under it (theme init is an external file, 7.2).
- This CSP depends on self-hosted fonts (P2). Google Fonts would need extra allowances, one more reason to self-host.

### 13.2 Content and MDX
- MDX is compiled **at build time from files in this repo**. That is safe. It must never be used to compile content from an external or user-supplied source at runtime (MDX can execute arbitrary JavaScript). Documented in `CONTRIBUTING`-style note in the README.
- `dangerouslySetInnerHTML` is not used anywhere. A lint rule forbids it.
- All outbound links from frontmatter are validated (test) to be `https:` or `mailto:`. `javascript:` and `data:` URLs are rejected. External links use `rel="noopener noreferrer"`.

### 13.3 Personal data
- **Email** is public in source and rendered as `mailto:`. Accepted, since contact is the purpose, but expect scraper spam. A simple mitigation if it becomes a problem: assemble the address client-side. Not required for launch.
- **Resume PDF and headshot:** strip metadata before committing (PDF author/title/producer fields; JPEG EXIF including GPS and device info). Add a short checklist to the README. Use a neutral filename.
- No cookies, no tracking, no third-party fonts.

### 13.4 Storage
`localStorage` holds only the theme string. It is validated against an allow-list on read and never rendered unescaped.

### 13.5 Supply chain and CI
- `npm audit` currently reports 0 vulnerabilities. Run `npm audit --omit=dev --audit-level=high` in CI.
- Commit the lockfile and use `npm ci`.
- npm reported that `fsevents` install scripts are blocked by `allowScripts`. That is a macOS-only optional dep and the block is fine; do not blanket-approve install scripts.
- Dependabot (or Renovate) for weekly updates; group dev dependencies.
- CI workflow permissions: `contents: read` only. No secrets are needed; Cloudflare Pages builds from the repo on its own.
- Dev-only packages (`@lhci/cli`, test libs) stay in `devDependencies` and are not shipped.

### 13.6 Hosting
- Protect `main` (required checks, no force-push). Use Cloudflare Pages preview deployments for branches, and keep previews unindexed (`X-Robots-Tag: noindex` on `*.pages.dev` via `_headers` conditional or Cloudflare setting).
- Two-factor authentication on the GitHub, Cloudflare, and domain registrar accounts. A hijacked domain on a job-search site is the real worst case.

---

## 14. Testing (D10, NFR7)

**Stack:** Vitest + jsdom + Testing Library + `vitest-axe`.

**What it covers**
| Layer | Tests |
|---|---|
| Content | A test loads every project's frontmatter and asserts: slug unique and kebab-case, required fields present, `image.alt` non-empty, links are `https:`, `draft:false` entries meet the publish bar, MDX bodies do not skip heading levels. This is the guard for D3. |
| Components | Render each component under each theme attribute; run `axe` (`vitest-axe`) and assert no violations. Cover Nav disclosure (click, Enter, Escape, route change), ThemeSwitcher (arrow keys, persistence, invalid stored value ignored, OS-change listener), ProjectCard (accessible name is the title), Hero (resume link always present), NotFound. |
| Routing | `MemoryRouter` tests: `/`, `/projects/todo-app`, `/projects/unknown`, `/projects/<draft slug>` shows 404, `/bio`, `*`. |
| Theme logic | Pure functions in `lib/theme.ts` unit-tested: resolve theme from (stored, media query), validate, persist with storage throwing. |
| Contrast | **jsdom does not compute colors, so `axe` cannot check contrast there.** A token test parses `styles/themes/*.css`, resolves each text/background and focus/background pair, and asserts the ratios in 6.4 (4.5:1 text, 3:1 non-text). Glass is tested against its scrim over the lightest and darkest gradient stops. |

**In CI beyond Vitest:** `tsc -b`, `oxlint`, `vite build`, then Lighthouse CI (mobile) on `/`, `/bio`, and one case study asserting each category at or above 0.95. Optional, post-launch: Playwright + `@axe-core/playwright` to check real rendered contrast in all four themes.

**Manual:** VoiceOver pass and keyboard-only walkthrough (section 10), plus 200% and 400% zoom and Windows High Contrast spot-checks.

---

## 15. Performance (NFR2)

- Self-hosted variable fonts via `@fontsource-variable/*`, only weights and the `latin` subset used (Inter 500; Open Sans 300/400). `font-display: swap`; preload the one or two critical files; size-adjust fallback to limit layout shift.
- Images: convert PNG to WebP (AVIF optional), include explicit `width`/`height`, `loading="lazy"` below the fold, `fetchpriority="high"` only on the LCP image, responsive `srcset` at 2 widths. Replace placeholders (D4).
- Route-level code splitting (`React.lazy`) for the case study page and each MDX body.
- `backdrop-filter` only on a small number of surfaces (6.6).
- `<link rel="preload">` for the theme-init script is unnecessary (it is tiny and render-blocking by design); keep it under 1 KB.
- Budget **[PROPOSED]**: JS under 150 KB gzip on the home route (currently ~90 KB gzip), LCP under 2.5s and CLS under 0.1 on a mobile profile.
- Remove unused dependencies and the leftover Vite template assets (`icons.svg` if unused).

---

## 16. Deployment (D9)

- **Cloudflare Pages**, Git integration on `main`. Root directory `portfolio`, build command `npm ci && npm run build`, output directory `dist`.
- **SPA fallback:** Pages serves `index.html` for unknown paths when no top-level `404.html` exists, so react-router deep links work (FR13). Verify with a refresh test on `/projects/todo-app` after the first deploy. A `public/_redirects` line `/* /index.html 200` is the explicit fallback if needed. Real 404 status codes are not possible in a pure SPA; `noindex` on the 404 view covers search.
- Custom domain on Cloudflare (DNS and registration can both live there). Redirect `www` to apex (or the reverse) with one canonical form, matching the `<link rel="canonical">`.
- Preview deploys for the `mdx-experiment` branch and PRs, unindexed.
- Environment: no secrets, no env vars required.

---

## 17. Phasing and schedule

Today is Nov 20; launch is Dec 1. All four themes are a hard requirement (D5), which makes the theme work the critical path. Plan:

| Phase | Dates | Scope | Exit criteria |
|---|---|---|---|
| **0. Foundation** | Nov 20-22 | Token system from Figma (light/dark with AA fixes), theme infra + no-flash script + persistence, a11y fixes A1-A4, A7-A10, A12-A14, routes and layout, skip link, 404, global focus style | Light/dark pass axe + token contrast tests |
| **1. Content and pages** | Nov 22-25 | MDX migration with frontmatter, `projects.ts`, ProjectCard/Badge, CaseStudyPage, Hero, Bio, Footer, resume + headshot + real images | Do Shit and No Guts No Glory published; others draft; no placeholders on public pages |
| **2. Opossum, then glass** | Nov 24-27 | Opossum first (opaque gradient base, text tokens from 6.4), then glass scrim and fallbacks, four-way picker with `enabled` flags | Each theme passes token contrast tests and axe by Nov 27, or is hidden (D16) |
| **3. Infra** | Nov 26-28 | Fonts self-hosted, image optimization, headers/CSP, SEO tags, sitemap, analytics, CI + Lighthouse CI, Cloudflare Pages and domain | Lighthouse 95+ x4 on three routes; CSP clean; deep links work |
| **4. QA and launch** | Nov 28-30 | VoiceOver and keyboard pass, zoom/high-contrast, cross-browser (Safari iOS, Chrome Android, Firefox), launch checklist | Section 18 all green; live Dec 1 |

**Cut line (D16).** Light and dark are the v1 benchmark. On **Nov 27**, any extra theme that does not pass the contrast tests and axe is hidden from the picker and released as soon as it passes. If only one can pass, **opossum ships and glass waits**. Shipping a theme that fails AA would contradict the stated quality bar.

Implementation consequences:
- The theme list is a single array in `lib/theme.ts`, with each theme carrying an `enabled` flag. Hiding a theme is a one-line change, not a refactor.
- A stored or OS-derived value for a disabled theme falls back to light or dark.
- Because opossum is prioritized, build it before glass in Phase 2 (below).

**Order of risk.** Highest: glass contrast (the scrim rule), Lighthouse 95+ with backdrop-filter on mobile, content and images by Dec 1.

---

## 18. Acceptance criteria (definition of done)

**Content and function**
- [ ] `/`, `/projects/<slug>`, `/bio`, and an unknown URL all work on first load and refresh in production.
- [ ] Only published studies appear in cards, nav, sitemap. Draft slugs return the 404 view.
- [ ] Every card has a text badge. Every card heading is the sole link name.
- [ ] Resume PDF downloads from hero, bio, and footer. No conditional rendering remains.
- [ ] Email, LinkedIn, GitHub links work. Substack absent unless it has a real URL.
- [ ] No placeholder images or lorem content on any public page.

**Themes**
- [ ] Four themes selectable by mouse, touch, and keyboard. Default follows OS. Choice persists and syncs across tabs.
- [ ] No flash of wrong theme on reload (verified with throttled network).
- [ ] Every text/background and focus/background pair meets 4.5:1 / 3:1 in all four themes, asserted by the token test.
- [ ] Glass and opossum degrade to opaque under `prefers-reduced-transparency`, `forced-colors`, and no `backdrop-filter`.

**Accessibility**
- [ ] `vitest-axe` clean on every component and route in all four themes.
- [ ] Manual VoiceOver and keyboard-only pass recorded.
- [ ] 320px width and 400% zoom: no horizontal scroll or clipped content.
- [ ] Reduced motion: no animation or transform on hover/open.

**Performance and SEO**
- [ ] Lighthouse mobile at or above 95 in all four categories on `/`, `/bio`, one case study.
- [ ] Unique title and description per route. Canonical, OG tags, `robots.txt`, `sitemap.xml` present.

**Security and ops**
- [ ] CSP and security headers present in production; no CSP violations in the console on any route.
- [ ] Resume and headshot metadata stripped.
- [ ] `npm audit` clean at high severity. CI green. `main` protected. 2FA on accounts.
- [ ] Custom domain live over HTTPS, one canonical host form.

---

## 19. Areas of concern and special consideration

1. **Schedule vs. scope.** Four themes in 11 days, plus MDX migration, tests, and infra, is tight. The agreed cut line (D16, section 17) exists for this reason.
2. **The Figma palette fails AA in several places as drawn** (6.4). The fixes are accepted (D15), but Figma no longer matches the build. Updating the Figma frames to the adjusted tokens would keep them as the reference. Opossum is now a dark theme (6.5), which changes its feel from the light olive wash in the original frame.
3. **Glass is the hardest theme to keep accessible.** Contrast depends on what scrolls behind the surface. The scrim rule (6.6) is what makes it testable. Expect it to look slightly less "clear" than the Figma card.
4. **Light-weight body font.** Open Sans Light looks right in Figma but reads thin at small sizes, particularly on mobile screens and the glass theme. The spec uses Regular below large sizes.
5. **Link previews.** A client-rendered SPA cannot give per-page previews in Slack or LinkedIn. Recruiters often paste links, so this is a real trade-off against the "first impression" goal. Launch with a good site-wide preview, then add pre-rendering.
6. **MDX power.** MDX executes code at build time. Safe for your own files; never wire it to untrusted content (13.2).
7. **Content readiness.** Seven of eight case studies are empty or partial. The site must look complete with two published studies. Consider ordering and copy so two strong studies read as a deliberate "selected work" rather than a thin portfolio, and consider whether the homepage should say "selected projects."
8. **Profanity and tone (D12).** Kept at your direction. For a startup-leaning audience it can read as personality or as a risk depending on the reader; the project title also appears in link previews. Partly resolved: the URL slug is `todo-app`, but the title "Do Shit" is unchanged and still appears on the page and in link previews.
9. **Placeholder personal data in repo.** The bio copy, location, and LinkedIn/GitHub URLs are public by design. Check nothing in the repo or git history contains data you would not publish (the repo is pushed).
10. **Testing limits.** `axe` in jsdom cannot test color contrast or real layout. That is why contrast gets a token-level test, Lighthouse CI, and a manual pass.
11. **Analytics beacon vs. performance.** The one third-party script is allowed by CSP. Re-measure Lighthouse with it enabled.
12. **Backdrop-filter on low-end mobile.** It can be janky and costs GPU. Limited to few surfaces and removed under reduced transparency.
13. **Accessibility of the opossum "personality".** Any playful elements (the opossum illustration, hover effects) must be decorative or labeled and must respect reduced motion.
14. **Unverified assumptions.** Cloudflare Pages SPA fallback behavior and the CSP rules above should be verified with a real deploy early (Phase 3), not assumed. Opossum color candidates and the contrast numbers for estimated backgrounds will be re-measured once the palette is confirmed.

---

## 20. Appendix

### 20.1 Figma nodes read
| Node | Name |
|---|---|
| `11:27` | Light Theme (bg `#FBFBFB`) |
| `11:28` | Dark Theme (bg `#232323`) |
| `11:29` / `11:87` | Glass Theme / glass card |
| `11:41` | Opossum Theme |
| `5:3`, `7:5`, `7:6` | Light accent, primary, secondary swatches |
| `11:17-11:19`, `11:31-11:33`, `11:43-11:45` | Dark, glass, opossum swatches |

Figma has no components, text styles, spacing, or variables defined (the variable lookup returned nothing). This spec therefore defines those as **[PROPOSED]**; adding them to Figma later would make future implementation passes more exact.

### 20.2 File-by-file change list

| File | Change |
|---|---|
| `index.html` | Title, description, OG/Twitter, `theme-color`, theme-init script, remove Google Fonts links |
| `src/index.css`, `src/App.css` | Replace with `styles/` token and theme files; remove template leftovers (A14) |
| `src/App.tsx`, `src/main.tsx` | Layout shell, new routes, lazy routes |
| `components/ThemeToggle/*` | Becomes `ThemeSwitcher` (section 7) |
| `components/Nav/*` | Disclosure menu, landmarks, `--header-h` |
| `components/Hero/*` | Heading fix, always-on resume, real buttons |
| `components/ProjectCard/*` | Heading-link pattern, Badge, image attrs |
| `components/LongformCard/*` | Replaced by `CaseStudyPage` |
| `components/Footer/*` | Real links, mounted in Layout |
| `pages/HomePage.tsx`, `bio.tsx` | Heading levels, data from `projects.ts`, Substack guard |
| `data/CaseStudies.tsx` | Deleted after MDX migration |
| `data/BioStats.tsx` | Becomes `data/site.ts`; Substack optional |
| `vite.config.ts` | Add frontmatter remark plugins; `test` config |
| `package.json` | New deps and scripts (`test`, `typecheck`, `lhci`) |
| `public/` | Resume PDF, OG image, `_headers`, `robots.txt` |
| `.github/workflows/ci.yml` | New (section 14) |
| `README.md` | Authoring guide for MDX, metadata-stripping checklist |

### 20.3 Tooling note
The Figma file was read through the Figma connector (design context, metadata, screenshot). The security section follows the checklist the `security-review` skill applies, adapted to a static site. No separate UX or brand-guidelines skill is installed, so UX standards here come from WCAG 2.2, ARIA Authoring Practices (disclosure and radiogroup patterns), and the existing INTENT requirements.
