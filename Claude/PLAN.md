# PLAN.md: Implementation Plan
> Created: 2026-11-20
> Inputs: `Claude/intent.md`, `Claude/SPEC.md` (requirement IDs FR/NFR, decisions D1-D18, findings A/P are defined there)
> App root: `portfolio/` (all paths below are relative to it unless prefixed `Claude/` or `.github/`)

## 0. How we work

**Loop for every step (S#):**
1. Write the tests listed for the step. Run them. Confirm they fail for the right reason.
2. Implement until they pass.
3. Run the gate: `npm run typecheck && npm run lint && npm test && npm run build`. All must pass.
4. Commit (one commit per step, message `S#: <summary>`). Never leave the branch red.

**Conventions**
- Branch: continue on `mdx-experiment` (it already holds the MDX work). Rename not needed. Merge to `main` at each phase gate so Cloudflare deploys prove infra early.
- Match the file being edited (this repo mixes tabs and 4-space indent; follow the file, do not reformat).
- Components use semantic tokens only, never raw hex. Plain CSS, no new styling libraries.
- Tests live beside the code: `X.test.tsx`; shared setup in `src/test/`.
- A step is not done until its **Proof** column passes. Do not start a step whose predecessor's proof is red.

**Blocked on you (needed inputs), updated 2026-11-20**

| Input | Needed by | Blocks |
|---|---|---|
| Resume PDF (export with "Save as PDF", metadata stripped, email only; checklist in SPEC 13.3) | Nov 24 | S1.5 real assets, `npm run prelaunch` |
| Headshot (EXIF stripped) and alt text | Nov 24 | same |
| Real project screenshots + alt text for Shelby, SimpleSet, Do Shit (and later the drafts) | Nov 24 | same, S3.2 |
| Hero and bio copy review (startup + React/TS lean, D13) | Nov 24 | S1.5 |
| Review of the two reworded Shelby sentences (`Claude/notes.md`) | Nov 24 | content sign-off |
| Tech stack for No Guts No Glory (publishes it); content for Scream Recorder and Scavenger Hunt (or leave as drafts) | Nov 25 | Gate G1 content |
| Substack URL, or leave hidden; confirm LinkedIn and GitHub URLs in `src/data/site.ts` | Nov 24 | S1.5 |
| **Decision:** opossum accent (D17 vs D18 conflict, see S2.1 below) | Nov 24 | S2.1 |
| Check CI and the Cloudflare preview on PR #3, then merge at G1 | Nov 21 | everything after |
| Domain name and registrar/DNS access | Nov 26 | S4.1 |
| Open Graph image (1200x630) | Nov 27 | S3.3 |
| Enable Cloudflare Web Analytics in the dashboard (no repo token) | Nov 28 | S3.5 |

## Progress and divergences (as of 2026-11-20)

PR #1 (MDX experiment) and #2 (accessibility audit) are merged; **PR #3 (S1.1-S1.5 plus design rounds) is open**. 262 tests pass.

| Step | Status | What diverged from the plan |
|---|---|---|
| S0.1 tooling and CI | Done | Added `src/test/axe.ts` (axe with color-contrast off, since jsdom cannot compute colors) and `vitest-axe.d.ts`; `node` types in `tsconfig.app.json`. The smoke accessibility test started as `it.fails` (two real violations) and became a plain `it` at G0. MDX/remark build packages moved to `devDependencies`. |
| S0.2 early deploy | Done (no code) | Hosting is Cloudflare through `portfolio/wrangler.jsonc` (`assets.not_found_handling: single-page-application`) on `main`, not a `_redirects` file. Deep-link refresh confirmed on the live deploy. |
| S0.3 theme logic | Done | Registry also carries each theme's `color` for the `theme-color` meta tag. An extra test proves `theme-init.js` agrees with `resolveTheme` for every theme and OS setting. |
| (unplanned) toggle fix | Done | The old toggle always started as light and never saved the choice; fixed before S0.6. |
| S0.4 tokens and base CSS | Done | Tests read theme CSS with `fs` (Vitest `css:false` returns empty for `?raw`). New tokens beyond the plan: `--award`, `--accent-fill-hover`, `--radius-button` (12px), `--space-section` (3rem), plus `.btn-secondary`. Old variable names are aliased and the old glass styles live in `legacy-glass.css` until S2.2. Added `contrast.ts` and `tokens.test.ts`. |
| S0.5 layout, routes, 404 | Done | Added focus-to-`<main>` on route change. Footer takes no props. The case study `h1` landed in S1.4 as planned. |
| S0.6 theme picker | Done | State lives in `src/lib/useTheme.ts`. An explicit re-click on the checked option counts as a choice (stops the OS overriding it). |
| S0.7 nav menu | Done | Opens-at-pathname pattern closes it on route change; `NavLink` supplies `aria-current`. |
| G0 | Met | CI green and deep links confirmed by the owner. The home page heading fix (Hero `h3` to `p`, section `h3` to `h2`) was pulled forward from S1.3/S1.5. |
| (decision) slug | Done | Do Shit's URL is `/projects/todo-app`, title unchanged (D12 amended). |
| S1.1 content model | Done, wider than planned | Also switched Nav, home, and the case study page to `projects.ts` and deleted `CaseStudies.tsx` (planned for S1.4). MDX loads **eagerly**: a lazy body glob next to the frontmatter glob split nothing (about 11 KB in the main bundle). Published: Shelby, SimpleSet, Do Shit. Drafts: No Guts No Glory (no stack), Scream Recorder, Scavenger Hunt. Entries 2 and 3 had no title and were dropped. Added `getAdjacentProjects`, `getProjectBody`, `getProjectImageUrl`. Frontmatter has no `thumb` field yet. |
| S1.2 MDX components | Done | Added `Decision` and a `tradeoff` Callout; heading components split into their own file for the Fast Refresh lint rule; content test forbids raw `<a>`/`<img>` etc. in MDX, because MDX only maps Markdown-generated elements. |
| S1.3 Badge, card, home | Done | One grid under a single `h2` "Selected projects". Removed the hover-only card image and the `imageUrl` prop (card thumbnails return once real images exist). |
| S1.4 case study page | Done | `CaseStudyView` (presentational, testable with fixtures) plus a thin `CaseStudyPage`. Pager is two columns with "All projects" below (option 2). Role added to the facts list. |
| S1.5 hero, bio, footer, assets | **Partial** | Code is done with placeholders. New and unplanned: `npm run prelaunch` gate (fails until placeholders are replaced), visually hidden "(PDF)" on resume links. **Open:** real resume, headshot, screenshots; copy review; Substack; visible card thumbnails; `Figure` is built but unused. |
| Design feedback rounds | Done | Logged in `Claude/notes.md`: longform spacing, `Decision` blocks, button radius and hover, unitless line-height fix, one accent per theme (D18), link styles. |
| Phases 2, 3, 4 | Not started | See the changes below. |

**Changes to later steps**
- **S2.1 opossum, needs your decision.** D18 says one accent per theme (fill, text, ring, border all equal), enforced by `contrast.test.ts`. D17 set opossum's accent to `#FF914E`, which is only 3.69:1 to 4.52:1 on the gradient, so it cannot be small text. Options: (a) one opossum accent `#FFB080` everywhere (4.62:1 at the worst stop, dark `#232323` label, about 7:1); (b) keep `#FF914E` for fills and rings and exempt opossum's `--accent-text` from the single-accent test. Recommendation: (a), because it matches how dark was solved.
- **S3.2 images:** the image glob ships every file in `src/assets/project-img/`, including five `thumb-*.png` files nothing uses (about 130 KB in `dist`). Delete the unused thumbs or narrow the glob, and convert to WebP.
- **S3.4 and S4.1 hosting:** the deploy is Cloudflare static assets via `wrangler.jsonc`. Confirm the `_headers` file is honored by that deploy path before relying on it for the CSP; if it is not, set headers in `wrangler.jsonc` or a Worker.
- **S3.6 bundle:** JS is 94 KB gzip against the 150 KB budget. If it grows, extract frontmatter at build time (a small Vite plugin with a virtual module) so MDX bodies can lazy-load.
- **S4.4:** `npm run prelaunch` must pass.

---

## Phase 0: Foundation (Nov 20-22)

| Step | Work | Files | Proof (tests) |
|---|---|---|---|
| **S0.1** Test + CI tooling | Add vitest, jsdom, Testing Library, jest-dom, user-event, vitest-axe. Configure `test` (jsdom, setup file, globals off). Scripts `test`, `typecheck`. CI runs lint, typecheck, test, build, `npm audit --omit=dev --audit-level=high`; `permissions: contents: read`. | `package.json`, `vite.config.ts`, `tsconfig.app.json`, `src/test/setup.ts` (jest-dom + `expect.extend(vitest-axe)`), `.github/workflows/ci.yml` | `src/App.smoke.test.tsx` renders `<App/>` in `MemoryRouter` with no axe violations. CI green on push. |
| **S0.2** Early deploy | Connect Cloudflare Pages (you). Add minimal `_redirects` only if deep links 404. | `public/_redirects` (if needed) | Manual: preview URL loads `/bio` directly and after refresh (FR13). Records whether SPA fallback works unaided (SPEC 16). |
| **S0.3** Theme logic | Pure module: `THEMES = [{id, label, enabled}]` (light, dark, opossum, glass; only light/dark enabled for now), `isTheme`, `resolveTheme(stored, prefersDark)`, `readStored`/`writeStored` (try/catch, allow-list), `applyTheme(id)` sets `data-theme`, `color-scheme`, `theme-color` meta. External no-flash script. | `src/lib/theme.ts`, `src/lib/theme.test.ts`, `public/theme-init.js`, `public/theme-init.test.ts` (or `src/lib/theme-init.test.ts`), `index.html` | Unit: stored valid wins; invalid ignored; no stored follows OS; disabled theme falls back to light/dark; storage that throws does not crash. `theme-init.js` executed in jsdom with mocked `matchMedia`/`localStorage` sets `data-theme` before any render. |
| **S0.4** Tokens + base CSS | Semantic token file, per-theme files for light and dark from SPEC 6.2/6.4, base reset, type scale, fonts stack for Inter/Open Sans (fallbacks until S3.1), global `:focus-visible` using `--focus`, `scroll-padding-top: var(--header-h)`, `.btn` class, reduced-motion rules. Delete Vite-template leftovers and the global `button {}` rules (A8, A9, A14). Opossum defines `--bg-start`/`--bg-end` so tests can read both stops. | `src/styles/tokens.css`, `src/styles/base.css`, `src/styles/themes/light.css`, `src/styles/themes/dark.css`, `src/main.tsx` (imports), delete `src/index.css`, trim `src/App.css`, `src/components/ThemeToggle/ThemeToggle.css` | `src/styles/contrast.test.ts` imports theme CSS via `?raw`, resolves tokens, asserts SPEC 6.4 pairs: text 4.5:1, non-text and focus 3:1 (light/dark: primary, secondary, accent-text, focus, accent fill vs its label). Write first, expect fail. |
| **S0.5** Layout, routes, 404 | `Layout` (SkipLink, Nav, `<main id="main">`, Footer). Routes `/`, `/projects/:slug`, `/bio`, `*`. `NotFoundPage` with `h1`, links, `noindex`. Footer mounted with real links (A13). | `src/app/Layout.tsx`, `src/components/SkipLink/SkipLink.tsx`+css, `src/pages/NotFoundPage.tsx`, `src/App.tsx`, `src/main.tsx`, `src/components/Footer/Footer.tsx`+css, `src/pages/bio.tsx` (rename to `BioPage.tsx` at your option) | `routes.test.tsx` (MemoryRouter): each route renders one `h1`; unknown path shows 404; skip link is first tab stop and moves focus to `#main`; landmarks present; axe clean on Layout. |
| **S0.6** ThemeSwitcher | Replace `ThemeToggle` with `ThemeSwitcher`: button + `radiogroup`, labels and icons, arrow-key nav, Esc closes and restores focus, persists, syncs across tabs, OS listener only while nothing stored. Lists only `enabled` themes. | `src/components/ThemeSwitcher/ThemeSwitcher.tsx`+css+test, delete `src/components/ThemeToggle/` | `userEvent` tests: keyboard selection, `aria-expanded`/`aria-checked`, persistence, `storage` event, invalid stored value, Escape focus return, axe clean. Accessible name present (A1). |
| **S0.7** Nav disclosure | `Projects` becomes a `button aria-expanded aria-controls` (not `Link to="#"`); opens on click/Enter/Space; closes on Esc, outside click, route change; in-flow panel under 640px; `aria-current`; exposes `--header-h`. Lists published studies via a temporary adapter until S1.1. | `src/components/Nav/Nav.tsx`, `Nav.css`, `Nav.test.tsx` | Tests: open/close by keyboard and click, Esc, route change closes, `aria-current`, no hover dependence (A3), axe clean. |

**Gate G0 (Nov 22):** light and dark pass axe and the contrast test; CI green; preview deploy serves deep links; merge to `main`. Requirements covered: FR7 (light/dark), FR9-FR11, NFR1 (partial), NFR7.

---

## Phase 1: Content and pages (Nov 22-25)

| Step | Work | Files | Proof (tests) |
|---|---|---|---|
| **S1.1** Content model (**done**; also did the wiring of S1.4 except polish) | Add `remark-frontmatter`, `remark-mdx-frontmatter`; MDX typings for `frontmatter`. Frontmatter schema (SPEC 8.1) as a TS type + runtime validator. `lib/projects.ts`: `getPublishedProjects()` (draft + publish bar + order), `getProject(slug)`. Create `src/content/projects/todo-app.mdx` (move from `src/content/todo-app.mdx`, add frontmatter with `slug: todo-app`) and `no-guts-no-glory.mdx` (JSX bold lead-ins become Markdown). Entries 2 and 3 have no title, so no files are created for them; they are dropped when `CaseStudies.tsx` is deleted in S1.4. Shelby, SimpleSet, Scream Recorder, and Scavenger Hunt have titles and partial content, so each gets a `draft: true` MDX file carrying what exists. The interim `SLUG_OVERRIDES` map in `CaseStudies.tsx` is replaced by the frontmatter `slug`. Replace Nav adapter with `getPublishedProjects`. | `vite.config.ts`, `package.json`, `src/mdx.d.ts`, `src/lib/projects.ts`, `src/lib/projects.test.ts`, `src/content/projects/*.mdx`, `src/content/content.test.ts`, `src/components/Nav/Nav.tsx` | `content.test.ts` globs every frontmatter and asserts: slug kebab-case and unique; required fields; `image.alt` non-empty; links `https:` only; `draft:false` meets publish bar; MDX headings do not skip levels. `projects.test.ts`: drafts excluded, ordering, unknown slug returns undefined. A fixture draft proves D3. |
| **S1.2** MDX components | `mdx-components.tsx`: heading shift (`###` renders `h2`), external links get `rel`/`target` + hidden "(opens in new tab)", `Figure` (alt required), `Callout` (text label), `CodeBlock` (focusable when overflowing). | `src/components/mdx/*` (+ tests) | Tests: heading mapping, link attributes, Figure throws/omits without alt (typed required), Callout label present, axe clean. |
| **S1.3** Badge + ProjectCard + Home | `Badge` (text + icon, tokenized). `ProjectCard` heading-link pattern with stretched link (A11); thumbnail `alt=""`, `width/height`, `loading="lazy"`. `HomePage` renders one grid from `getPublishedProjects`, fixes heading levels (A4). Order startup/React-TS first (D13). | `src/components/Badge/*`, `src/components/ProjectCard/*`, `src/pages/HomePage.tsx`, `HomePage.css` | Tests: card link accessible name equals title; badge text "Hand-coded"/"Agentic"; draft studies absent; heading outline `h1` then `h2` then `h3`; axe clean. |
| **S1.4** CaseStudyPage (**partly done in S1.1**: MDX body, frontmatter header, real image alt, 404 for unknown/draft, old data deleted) | Remaining: rename `LongformCard` to `CaseStudyPage`; title becomes the `h1`; facts as a `dl`; validated repo/live links; prev/next. MDX loads eagerly (see SPEC 8.2). | `src/pages/CaseStudyPage.tsx`+css+test, delete `src/components/LongformCard/`, `src/data/CaseStudies.tsx` | Tests: `/projects/todo-app` renders title and body; `/projects/unknown` and a draft slug render 404; one `h1`; axe clean. `grep` confirms deleted symbols are gone (typecheck proves it). |
| **S1.5** Hero, Bio, Footer, assets (**code done with placeholders; real files still needed**; `npm run prelaunch` fails until they are swapped) | Hero: `h1` name, role as `<p>`, always-on resume and email CTAs (delete conditional, A10 fixed with `.btn`). `data/BioStats.tsx` becomes `data/site.ts` (Substack optional, `https` guard, A6). BioPage: headshot, business, personal, contact links. Footer: year at render, email, LinkedIn, GitHub, resume. Add resume PDF, headshot, real project images (blocked on you). | `src/components/Hero/*`, `src/data/site.ts`, `src/pages/BioPage.tsx`, `src/components/Footer/*`, `public/resume/seamus-robertson-resume.pdf`, `src/assets/...` | Tests: resume link present on Hero, Bio, Footer and points to the PDF; Substack hidden unless valid `https` URL; all external links `rel="noopener noreferrer"`; no `alt` missing on informative images; test asserts referenced asset files exist. |

**Gate G1 (Nov 25):** two published studies, no placeholders on public pages, FR1-FR6, FR8, FR10 and D4 content items met; CI green; merge.

---

## Phase 2: Opossum, then glass (Nov 24-27)

| Step | Work | Files | Proof (tests) |
|---|---|---|---|
| **S2.1** Opossum | `opossum.css`: `--bg: linear-gradient(180deg, #505200, #5E3A00)` from `--bg-start`/`--bg-end`; text `#FBFBFB`, secondary `#F5B94A`, accent `#FF914E`, accent-text `#FFB080`, button label `#232323`; `color-scheme: dark`; fixed-attachment gradient. Set `enabled: true`. | `src/styles/themes/opossum.css`, `src/lib/theme.ts`, `src/styles/contrast.test.ts` | Contrast test: every text/focus token against **both** stops (4.5 text, 3 ring); `#232323` on `#FF914E` 7.04. ThemeSwitcher and axe tests re-run with `data-theme='opossum'`. |
| **S2.2** Glass | `glass.css`: Figma gradient, 22px radius, blur 40px, sheens, rims; text on a scrim; fallbacks for no `backdrop-filter`, `prefers-reduced-transparency`, `forced-colors`; `backdrop-filter` only on cards and nav. Set `enabled: true` only if it passes. | `src/styles/themes/glass.css`, `src/lib/theme.ts`, `src/styles/contrast.test.ts` | Contrast test: text vs scrim over the lightest and darkest gradient stops; accent-text `#A9B4FF`. CSS test asserts the three fallback blocks exist. axe re-run under `data-theme='glass'`. |

**Gate G2 = Nov 27 cut line (D16):** any theme failing its contrast test or axe keeps `enabled: false`. Light and dark are the v1 benchmark. If only one passes, it is opossum. Update INTENT/SPEC decision log with the outcome.

---

## Phase 3: Infrastructure (Nov 26-28)

| Step | Work | Files | Proof (tests) |
|---|---|---|---|
| **S3.1** Self-hosted fonts | `@fontsource-variable/inter`, `@fontsource-variable/open-sans`; weights Inter 500, Open Sans 300/400; remove Google links; update `--sans`/`--heading`; preload critical files; metric-adjusted fallback. | `package.json`, `src/main.tsx`, `src/styles/tokens.css`, `index.html` | Test reads `index.html`: no `googleapis`/`gstatic`. Build output contains woff2 files. Body text uses weight 400 below large sizes (token test). |
| **S3.2** Images | Convert PNG to WebP, set `width/height` in frontmatter, lazy loading, `fetchpriority` on LCP image only. | `src/assets/project-img/*`, `src/content/projects/*.mdx` | `content.test.ts` extension: each `image.file` exists, dimensions present, not PNG. Lighthouse CLS under 0.1 (S3.6). |
| **S3.3** SEO | `Seo` component (React 19 hoisted `<title>`/`<meta>`), pattern `Page | Seamus Robertson, Front-End Developer`, canonical, OG/Twitter, `theme-color`; `robots.txt`; build script writing `sitemap.xml` from published projects; `og-image.png`; JSON-LD `Person`. | `src/lib/seo.tsx`+test, `index.html`, `public/robots.txt`, `scripts/generate-sitemap.ts`+test, `package.json` (build step), `public/og-image.png` | Tests: each route sets a unique title and description; 404 has `noindex`; sitemap lists exactly published slugs and excludes drafts. |
| **S3.4** Headers/CSP | `public/_headers` per SPEC 13.1; drop `style-src-attr 'unsafe-inline'` if no inline styles remain. | `public/_headers`, `public/_headers.test.ts` | Test parses `_headers`: CSP contains `default-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'`, `base-uri 'self'`, no `unsafe-eval`, no wildcard script sources; `nosniff`, referrer, permissions headers present. Manual: no CSP violations in the console on every route in the preview. |
| **S3.5** Analytics | Enable Cloudflare Web Analytics from the dashboard (no repo token). CSP already allows the beacon. | none (dashboard) | Manual: beacon request succeeds, no CSP error; Lighthouse re-run with it enabled. |
| **S3.6** Lighthouse CI | `lighthouserc.json` (mobile) on `/`, `/bio`, `/projects/todo-app`, asserting each category at or above 0.95, LCP under 2.5s, CLS under 0.1; CI job. Route-level code splitting verified. If the JS budget is tight, extract frontmatter at build time so MDX bodies can lazy-load (SPEC 8.2). | `lighthouserc.json`, `.github/workflows/ci.yml`, `src/app/routes.tsx` | CI Lighthouse job green on the preview build. |
| **S3.7** Docs | README: MDX authoring guide (frontmatter, draft flag, publish bar), metadata-stripping checklist, "never compile untrusted MDX" note, theme enable flags. | `README.md` | Reviewed by you; the checklist is used for the Phase 1 assets. |

**Gate G3 (Nov 28):** Lighthouse 95+ in all four categories on the three routes, CSP clean, deep links work, sitemap and OG verified, merge.

---

## Phase 4: QA and launch (Nov 28-Dec 1)

| Step | Work | Proof |
|---|---|---|
| **S4.1** Domain | Attach custom domain in Cloudflare Pages; one canonical host (www to apex or reverse); enable HTTPS-only and HSTS (no preload yet); 2FA on GitHub, Cloudflare, registrar; protect `main`. | `curl -I` shows HTTPS redirect, HSTS, security headers; canonical tag matches host. |
| **S4.2** Manual accessibility | VoiceOver (macOS and iOS) on `/`, `/bio`, one study, theme picker; keyboard-only walkthrough; 320px width and 400% zoom; text-spacing override; Windows High Contrast / forced colors; reduced motion and reduced transparency on. | Checklist recorded in `Claude/qa-log.md` with date and findings; all fixed or consciously deferred. |
| **S4.3** Cross-browser | Safari iOS, Chrome Android, Firefox, Safari macOS, each with every enabled theme. | Same log. |
| **S4.4** Final audit | Run `npm run prelaunch` (must pass: no placeholder resume, headshot, or screenshots). Re-run CI, Lighthouse (live URL), `npm audit`, resume and headshot metadata check, link check, all SPEC section 18 boxes ticked. | Section 18 checklist fully green; live on Dec 1. |

---

## Test inventory (what proves what), 262 tests in 19 files

| Test file | Proves |
|---|---|
| `src/lib/theme.test.ts`, `theme-init.test.ts` | FR7, D6: default, persistence, validation, fallback, no flash; init script agrees with `resolveTheme` |
| `src/styles/contrast.test.ts` | NFR1: AA text and non-text contrast per theme; one accent color per theme (D18); hover fill; award chip |
| `src/styles/tokens.test.ts` | Unitless root line-height; button radius at most 12px; section spacing token |
| `src/content/content.test.ts` | D3, FR2: every project file valid; slug matches file; image exists; https links; headings start at `###` without skips; no raw HTML in MDX; published projects have a section |
| `src/lib/projects.test.ts` | Validator, publish bar (each missing field), ordering, adjacent projects, unknown and draft slugs |
| `src/routes.test.tsx` | FR9, FR11, FR13: routes, 404s (including old URLs), landmarks, skip link, focus after navigation |
| Component tests (`Nav`, `ThemeSwitcher`, `ProjectCard`, `Badge`, `Hero`, `Footer`, `mdx`) | FR1-FR3, FR6, FR8, FR10, NFR1, NFR8, each with `vitest-axe` |
| `src/pages/HomePage.test.tsx`, `BioPage.test.tsx`, `CaseStudyPage.test.tsx` | Heading outline, card list, bio contact links and Substack guard, case study facts, links, pager, real studies |
| `src/data/site.test.ts` | Site data sanity, `httpsUrl` guard |
| `src/prelaunch.test.ts` (run with `npm run prelaunch`, not in CI) | No placeholder resume, headshot, or screenshots at launch |
| Not yet written | `src/lib/seo.test.tsx`, sitemap test, `public/_headers.test.ts`, Lighthouse CI (Phase 3); manual log `Claude/qa-log.md` (Phase 4) |

**Known limit:** jsdom cannot compute real colors or layout, so contrast is proven at the token level plus Lighthouse and manual checks, and CSS-only changes (spacing, radius, hover, mobile layouts) need a look in a browser. Optional after launch: Playwright + `@axe-core/playwright`.

## Requirement coverage

| Requirement | Step(s) |
|---|---|
| FR1, FR3 | S1.3, S1.5 |
| FR2, FR4, FR9 | S1.1, S1.4, S0.5 |
| FR5, FR6, FR8 | S1.5 |
| FR7 | S0.3, S0.6, S2.1, S2.2 |
| FR10, FR11 | S0.5, S0.7 |
| FR12 | S3.3 |
| FR13 | S0.2, S4.1 |
| NFR1, NFR8 | S0.4, S2.x, S4.2 |
| NFR2 | S3.1, S3.2, S3.6 |
| NFR3 | S0.4, S4.2 |
| NFR4 | S3.1, S3.4 |
| NFR5 | S3.4, S4.1 |
| NFR6 | S1.1, S3.7 |
| NFR7 | S0.1 |

## Risks to watch while building (updated 2026-11-20)
1. **Opossum and glass vs the Nov 27 cut line.** Opossum needs the accent decision above; glass contrast is still the most likely miss. The `enabled` flags make dropping either cheap.
2. **Content and asset blockers** (resume, headshot, screenshots, copy) sit on the Nov 24 path, and Gate G1 needs real assets.
3. **A placeholder could ship.** The placeholder resume and headshot are committed. `npm run prelaunch` catches them but is not part of CI, so run it before every merge that goes live until the real files are in.
4. **CSS cannot be fully tested here.** Spacing, hover, radius, and the mobile layouts depend on your visual checks each round.
5. **Tooling versions** (Vite 8, TypeScript 7, React 19, react-router 8, Vitest 5) have worked without trouble so far.
6. **Unverified assumptions** to test early: the `_headers` file under the wrangler deploy (S3.4), CSP with the theme-init script and analytics, and `backdrop-filter` cost on mobile (S3.6).
7. **Reversibility:** each step is its own commit, so a bad step reverts alone.
