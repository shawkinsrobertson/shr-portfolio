# daily-notes.md
> One entry per working day, newest at the bottom. Each day has the same six sections: build, decisions, trade-offs, bugs, test-outputs, still-need. The last section is a to-do for the *current phase* (what is needed to keep going), not a history.
> Related: `intent.md` (what and why), `SPEC.md` (design and requirements), `PLAN.md` (ordered work and status), `notes.md` (visual feedback backlog).

# 2026-11-20

Day 1. Started from "review INTENT.md and ask questions" and ended with Phase 0 and Phase 1 built, 262 tests passing, and PR #3 open. 29 commits, 95 files changed (+8,877 / -1,621).

## build

**Planning (morning to mid-afternoon)**
- `intent.md` finished through Q&A (audience, launch bar, resume, themes, hosting, timeline), then re-applied after an editor save overwrote it (`d613bde`).
- `SPEC.md`: 20 sections, built from a code audit (14 accessibility findings A1-A14, 7 performance/tech findings), a read of the Figma file ("FED-Portfolio", four theme frames), and a computed contrast audit of every token pair. `3a6a87f`.
- `PLAN.md`: 25 ordered steps with files and test proofs, gates G0-G3, and a Nov 27 cut line. `ea8b148`. Docs moved into `Claude/` (`4c1dc12`).

**Phase 0, foundation** (`a9d1929` to `fc5e870`)
- S0.1 Vitest, Testing Library, `vitest-axe`, CI workflow. S0.3 theme logic plus a no-flash init script. Toggle bug fix.
- S0.4 Figma-based tokens for light and dark, base styles, focus ring, `.btn`, contrast test harness.
- S0.5 layout shell: skip link, `<main>`, footer on every page, routes `/`, `/projects/:slug`, `/bio`, 404.
- S0.6 four-way-ready theme picker (light and dark enabled). S0.7 keyboard and touch nav menu with live header-height tracking.
- G0: home page heading order fixed so it passes axe. Do Shit's URL changed to `/projects/todo-app`.

**Phase 1, content and pages** (`6cc310a` to `d267dff`)
- S1.1 MDX content model: one file per project, YAML frontmatter, validator, publish bar, `projects.ts`. Old data file deleted.
- S1.2 MDX components: heading shift, safe links, `Figure`, `Callout`, `CodeBlock`, `Decision`.
- S1.3 `Badge` and accessible `ProjectCard`; single "Selected projects" grid. S1.4 case study page (h1, facts list, safe links, pager).
- S1.5 site data, always-on resume button, bio headshot and contact list, footer resume link, `npm run prelaunch` gate.

**Design feedback rounds** (`119df6e`, `317f55b`, `7ef77ad`, `af577ad`, `66d23ed`)
- Mono badge and shared gold `--award` token; longform spacing; `Decision` blocks with trade-off callouts and `####` titles; pager as two columns.
- Fixed overlapping heading lines; 12px buttons with hover; hero-to-projects spacing; one accent color per theme; standalone link styles; screen-reader-only "(PDF)".

**Repo and deploy:** PR #1 and #2 merged earlier in the day; **PR #3 open** (S1.1-S1.5 plus design rounds). `wrangler.jsonc` added by the owner for Cloudflare; the live site deploys from `main`.

## decisions

**Made by you**
| Decision | Notes |
|---|---|
| Audience is recruiters and engineers equally | Skim layer plus depth on demand |
| Hand-coded vs agentic shown as a badge on the card | Two sections may return later |
| Launch bar: real images, complete case studies, custom domain, resume attached | Resume is a blocker; conditional button removed |
| Quality bar WCAG 2.2 AA and Lighthouse 95+; incomplete case studies hidden | Enforced by tests and the publish bar |
| All four themes by Dec 1, with a Nov 27 cut line | If only one extra theme passes, opossum ships and glass waits (D16) |
| Opossum base is an opaque `#505200` to `#5E3A00` gradient; accent `#FF914E` (D14, D17) | Accent conflict still open, see still-need |
| Accept the AA contrast fixes to the Figma palette (D15) | Light secondary `#6A6A6A`, dark accent changes |
| Cloudflare hosting; MDX for case studies now; `vitest-axe`; no root `package.json` | |
| Slug `todo-app` for Do Shit; title and profanity stay (D12) | |
| Pager option 2; decision titles as `####`; trade-offs as callouts | Logged in `notes.md` |
| 12px max button radius; lift and fill on hover; drop "(PDF)" from visible resume text, keep for screen readers | |
| One accent color per theme, from the "Download resume" button (D18) | |
| PDF-only resume for launch | Other formats only from one source file, later |
| Footer links match bio links: bold, no underline | |

**Made by me, for your review**
| Decision | Why |
|---|---|
| Single project grid under one `h2`, ordered startup/React-TS first (Shelby, SimpleSet, Do Shit) | PLAN and D13 |
| Removed the hover-only card image | Touch and keyboard users could not see it |
| Load MDX eagerly | Lazy loading did nothing; about 11 KB cost |
| Publish bar requires a tech stack, so No Guts No Glory is hidden | SPEC 8.3; stack matters for the React/TS audience |
| Dark theme button label is dark `#232323` on a brighter blue `#6B95FF` | One color cannot be both a white-label fill and readable text on `#232323` |
| `npm run prelaunch` gate for placeholders, outside CI | A placeholder resume or headshot must not reach Dec 1 |
| Resume link uses the `download` attribute | Avoids navigating away from the site |
| Hover underline on standalone links; inline prose links keep their underline | Pointer cue; inline links need more than color |
| Root line-height unitless `1.45` | Root cause of the overlapping name (see bugs) |
| Reworded two Shelby sentences to stand under their headings | **Please review** (before and after in `notes.md`) |

## trade-offs

| Choice | What we gain | What it costs |
|---|---|---|
| Bright blue dark accent with a dark button label | One color for fill, text, ring, outline, callouts; passes AA | Dark primary button looks different from Figma (deep blue, white text) |
| Eager MDX loading | Simple code, no Suspense, no build warning | About 11 KB more in the main bundle; grows with content (fix noted for S3.6) |
| Strict publish bar | Nothing incomplete can go live (D3) | No Guts No Glory disappeared until it has a stack |
| Single grid with badges | Simpler page, one list to navigate | Hand-coded and agentic are no longer visually separated (reversible) |
| `Decision` wrapper component in MDX | Clear grouping and spacing per decision/trade-off | Authors must remember blank lines inside the tags |
| Placeholder resume and headshot committed | Whole flow built and tested now | Risk of shipping a placeholder; mitigated by the prelaunch gate, which is not in CI |
| PDF only | Simple, universal, secure | No DOCX or plain-text option |
| Hidden "(PDF)" for screen readers only | Cleaner visible text, file type still announced | Sighted users do not see the file type |
| Contrast proven at token level, axe contrast rule off in jsdom | Fast, deterministic tests | Real rendered contrast still needs Lighthouse and manual checks |
| `legacy-glass.css` kept until S2.2 | Dark cards keep working while tokens change | Old blue glass values sit beside the new system for now |
| Light accent unchanged (`#0019D2`), dark changed | Keeps your chosen button color in light | Light and dark blues differ in hue (233° vs 223°) |
| Pulled S1.4 wiring into S1.1, G0 heading fix forward | One source of truth at every commit | PLAN step boundaries blurred (documented in PLAN) |

## bugs

**Found in the existing code, fixed**
- Theme toggle started as "light" regardless of OS, needed two clicks, never saved the choice, and had no accessible name (A1, A2).
- Heading levels skipped on home (A4); the Projects menu was a link to `#` that opened on hover only (A3).
- Hover-only content: card image `visibility: hidden` until hover; project dropdown.
- Global `button {}` and `button:hover` rules leaked onto every button; hover scale ignored reduced motion (A9).
- `liquid-glass` class used but never defined, so hero buttons were unstyled (A10).
- About 150 lines of unused Vite-template CSS (A14); no global focus style (A8).
- Substack "link" was the string `coming soon` (A6); case study stats used a `<blockquote>` for non-quotes; case study image had `alt=""` (A5); missing case study showed a bare `<div>` (A12).
- Achievement chip: page-background text on goldenrod, about 2:1 in the light theme.

**Found while building, fixed**
- Percentage root line-height (`145%`) is inherited as a fixed 26px, so the 48px name overlapped itself when it wrapped on mobile. Now unitless; a test guards it.
- Dark theme's pale periwinkle accent read as purple in callouts and clashed with the deep-blue button; unified to one blue per theme.
- Clicking an already-selected theme did not save the choice, so the OS could override it later.
- Pager rendered empty list items for a missing neighbour and wrapped unevenly on mobile.
- MDX only maps Markdown-generated elements, so a hand-written `<a>` would bypass the safe-link rules. Added a content test that forbids raw HTML.
- "(opens in new tab)" lost its space in the accessible name ("Oref0(opens...)").
- Lazy MDX bodies did nothing (Rollup warned `INEFFECTIVE_DYNAMIC_IMPORT`).

**My mistakes (test and process)**
- Contrast and token tests first read CSS with `?raw`, which Vitest returns empty when `css: false`; switched to `fs`.
- A test that deleted `window.localStorage` broke later tests; a Markdown `data:` URL test input was malformed; a list count included nested stack items. All test bugs, not product bugs.
- `pkill -f vite` to stop my dev server could have killed a server of yours; disclosed and I will stop servers by process ID.
- I overstated that a neutral slug made link previews neutral (the title still shows), and wrote in PLAN that studies 2-7 were empty (only 2 and 3). Both corrected.

**Open, not fixed**
- Five unused `thumb-*.png` files ship in `dist` (about 130 KB) via the image glob (S3.2).
- The published studies still use placeholder images; the case study header image and bio headshot are placeholders.
- CSS-only changes (spacing, hover, mobile layouts) are not verified by tests; the light-theme callouts may still read slightly purple at 8% tint.
- CI on PR #3 and its Cloudflare preview not yet checked.

## test-outputs

**End of day (`npm test`):** 19 files, **262 tests, 262 passed, 0 failed**.

```
 Test Files  19 passed (19)
      Tests  262 passed (262)
```

| Step | Tests passing | Notes |
|---|---|---|
| S0.1 | 1 (+1 expected fail) | smoke test; axe found 2 real violations |
| S0.3 | 21 (+1) | theme logic and init script |
| Toggle fix | 24 (+1) | 3 new, failed first |
| S0.4 | 37 (+1) | contrast tests; mutation check below |
| S0.5 | 56 (+1) | 16 failed before implementation |
| S0.6 | 67 (+1) | 14 picker tests |
| S0.7 | 84 (+1) | 16 failed before implementation |
| G0 | 88 | expected-fail removed |
| Slug change | 92 | |
| S1.1 | 156 | 65 content and projects tests |
| S1.2 | 183 | 27 MDX tests |
| S1.3 | 200 | |
| S1.4 | 217 | |
| Spacing and decisions | 223 | |
| S1.5 | 252 | |
| Hover, radius, line-height | 257 | |
| Accent unification | 262 | |

**Per file:** content 44, projects 29, mdx 24, contrast 21, CaseStudyPage 18, routes 18, Nav 17, theme 15, ThemeSwitcher 14, site 12, BioPage 11, ProjectCard 9, Hero 6, Badge 5, Footer 5, theme-init 5, HomePage 4, tokens 3, smoke 2.

**Mutation check (S0.4):** temporarily restoring the dark theme's old failing accent made 3 contrast tests fail, so the contrast test can fail; values restored.

**Other gates (all green at last run):** `tsc -b` clean; `oxlint` clean; `npm run build` succeeds with no warnings; `npm audit` 0 vulnerabilities.

**Build size:** JS 298.89 kB (94.41 kB gzip), CSS 15.46 kB (3.89 kB gzip). Budget is 150 KB gzip JS. Images in `dist` include five unused `thumb-*.png` (about 130 KB, see bugs).

**Launch gate (`npm run prelaunch`), failing on purpose:**
```
 × has a real resume PDF
 × has a real headshot
 × has real screenshots on every published project
 Tests  3 failed | 1 passed (4)
```

**Not run today:** CI on PR #3 (first full run after the push), Lighthouse, VoiceOver and keyboard pass, cross-browser checks. Visual review is done by you each round.

## still-need

*Current phase: end of Phase 1 (Gate G1) and the start of Phase 2. Needed dates are from PLAN.*

**Assets and content from you** (Nov 24; these also make `npm run prelaunch` pass)
- Resume PDF: export with "Save as PDF", strip metadata, email only (checklist in SPEC 13.3). Goes at `portfolio/public/resume/seamus-robertson-resume.pdf`.
- Headshot (square, EXIF stripped) and alt text for `src/data/site.ts`.
- Real screenshots with alt text for Shelby, SimpleSet, and Do Shit (3200x1800 ideal; placeholders are 3200x1800 PNG). Later: No Guts No Glory, Scream Recorder, Scavenger Hunt.
- Hero tagline and bio copy review (business and personal paragraphs) for the startup and React/TypeScript lean.
- Review the two reworded Shelby sentences (`notes.md`).
- Tech stack for No Guts No Glory (publishes it); content for Scream Recorder and Scavenger Hunt, or keep them as drafts.
- Substack URL or leave hidden; confirm LinkedIn and GitHub URLs.

**Decisions from you**
- **Opossum accent (Nov 24):** one accent `#FFB080` everywhere (my recommendation, passes AA), or keep `#FF914E` for fills and rings with an exception for small text. Details in PLAN S2.1.
- Whether the hover underline on standalone links stays.
- Whether the light theme needs a slightly bluer accent if callouts still look purple.

**Checks only you can do**
- Check CI on PR #3 and the Cloudflare preview (`/`, `/bio`, `/projects/shelby`, `/projects/todo-app`, refresh on each), then merge at G1.
- Visual pass at phone and desktop widths, light and dark: hero name and spacing, button hover, card grid, case study spacing, pager, footer, callouts.
- Keyboard walkthrough: skip link, nav menu, theme picker, card focus ring.

**Later in the schedule**
- Domain name and registrar/DNS access (Nov 26); Open Graph image 1200x630 (Nov 27); enable Cloudflare Web Analytics (Nov 28).

**Next for me:** S2.1 opossum (after the accent decision), then S2.2 glass, ahead of the Nov 27 cut line. Then Phase 3: self-hosted fonts, image optimization (including the unused thumbs), SEO tags and sitemap, headers and CSP, Lighthouse CI.

# 2026-11-23

Day 2 (resumed after the weekend). Owner added real case study images, card thumbnails, and headshots; I tested those changes and fixed the tests they broke. Opossum (S2.1) is next and waits on the accent decision.

## build

**Done by you (uncommitted on `mdx-experiment` at start of day)**
- Real screenshots in `src/content/projects/case-study-img/` for Shelby (4), SimpleSet (3 + desktop builder), No Guts No Glory (3); a thumbnail for each of the three.
- `ProjectCard` renders an optional `thumbnail` (`.card-thumbnail`, max 300px, `object-fit: cover`); `HomePage` passes it through.
- `projects.ts`: new optional `thumbnail` frontmatter field, validated like `image`; `meetsPublishBar` now requires `thumbnail.alt`. Image glob and `getProjectImageUrl` moved from `src/assets/project-img/` to `src/content/projects/case-study-img/`.
- Case study header image: `object-fit: contain`, `max-height: 800px` (portrait phone shots no longer cropped).
- `site.ts` headshot is now `headshot.jpg`. `headshot-glass.png` and `headshot-opossum.png` added to `src/assets/` (not wired yet).
- No Guts No Glory: stack `[Kotlin]`, `draft: false`, so it now publishes.

**Done by me**
- Ran tsc, oxlint, tests, build, prelaunch against your changes (results below).
- Fixed 8 stale tests and fixtures broken by the image move and the new thumbnail requirement (see test-outputs). Corrected the thumbnail validation message (it said "image needs..."). Updated the `Figure` doc comments to the new image folder.

## decisions

**Made by you**
| Decision | Notes |
|---|---|
| Card thumbnails are required to publish | `meetsPublishBar` checks `thumbnail.alt` |
| Case study images live beside the content in `case-study-img/` | Replaces `src/assets/project-img/` |
| Three headshots: `headshot.jpg` (light/dark), `-glass`, `-opossum` | Per-theme swap still to build |
| No Guts No Glory publishes with stack `[Kotlin]` | |

**Made by me, for your review**
| Decision | Why |
|---|---|
| Test fixtures use Shelby's files and the Shelby page for route tests | Do Shit no longer publishes, so it cannot be the example |
| Left 4 content tests failing on purpose | They report Do Shit, Scavenger Hunt, Scream Recorder still use placeholder images (see bugs) |

## trade-offs

| Choice | What we gain | What it costs |
|---|---|---|
| Thumbnail required to publish | No card goes live with an empty image box | Do Shit disappeared from the site until it has a thumbnail |
| Card thumbnail `object-fit: cover` with 300px cap | Even card heights | Crops tall or wide shots; use purpose-made square thumbnails |
| Images beside content instead of `src/assets` | Easy to find with the case study | Vite hashes and ships every file in the folder, used or not |

## bugs

**Found, open**
- **Do Shit disappeared from the home page and `/projects/todo-app` 404s.** `draft: false` but no `thumbnail`, so it misses the publish bar. Add a thumbnail or set `draft: true`.
- `ngng-thumbnail.png` is 3600x4500 and **6.3 MB** in `dist`; it is displayed at 300x300. Resize to about 600x600 (or 2x of the display size), ideally WebP/AVIF.
- `headshot.jpg` is 2121x1414 (not square), 765 KB, and its EXIF contains a photographer copyright string (`@LeannCrosby allrightsreserved`). SPEC wants a square, EXIF-stripped headshot. Check licence and credit, then crop, resize to about 800 px, strip metadata.
- Thumbnail `alt` text is "shelby thumbnail" style. The card heading already names the project, so these should probably be `alt=""` (decorative) or describe the image. The validator currently forces non-empty alt.
- Case study image dimensions in frontmatter (400x800, 450x800) do not match the files (1236x2745, 945x2048). Aspect ratios are close but not exact (about 0.45 vs 0.5), which can cause layout shift. `simpleset-thumbnail.png` is 300x400, not square like its declared 300x300.
- Old `src/assets/project-img/` (11 placeholders) is no longer read by the glob, but Do Shit, Scavenger Hunt, and Scream Recorder still reference those files.
- The `ProjectCard` import line has a stray leading space (cosmetic).

## test-outputs

**Before my fixes:** 12 failed, 250 passed (262).
```
 Test Files  5 failed | 14 passed (19)
      Tests  12 failed | 250 passed (262)
```
Causes: the moved image folder (Figure, content, route and CaseStudyPage fixtures), the thumbnail requirement (fixtures, Do Shit hidden), No Guts No Glory now published (route test expected a 404).

**After my fixes:** 4 failed, 257 passed (261). All 4 failures are real content problems, not test bugs:
```
 content > scavenger-hunt > points at an image file that exists
 content > scream-recorder > points at an image file that exists
 content > todo-app > points at an image file that exists
 content > todo-app > has at least one section when published
```
`tsc -b` clean, `oxlint` clean, `npm run build` succeeds. Build: JS 301.03 kB (95.10 kB gzip), CSS 15.67 kB. `dist` now holds about 9 MB of images (mostly the one 6.3 MB thumbnail).
`npm run prelaunch`: still 3 failing on purpose (resume PDF, headshot and screenshots checks).

**Not run today:** Lighthouse, screen reader, visual check in the browser, CI on PR #3.

## still-need

*Current phase: Gate G1 content, then Phase 2 (opossum, glass).*

**From you**
- **Opossum accent decision** (PLAN S2.1): one accent `#FFB080` everywhere (recommended) or keep `#FF914E` for fills/rings with a small-text exception.
- Do Shit: thumbnail and real screenshot (or set to draft). Scavenger Hunt and Scream Recorder: keep as drafts or supply content.
- Resume PDF (`public/resume/seamus-robertson-resume.pdf`), still a placeholder.
- Headshot: confirm the photo licence, then crop square and strip metadata. Provide real alt text.
- Decide where the extra screenshots go in each case study (design guidance given in chat; see PLAN S1.5 note).
- Resize `ngng-thumbnail.png`.

**Next for me**
- Opossum theme (S2.1) once the accent is chosen; wire per-theme headshot (`headshot-opossum`, later `headshot-glass`); then glass (S2.2).

### Update, later 2026-11-23

- **Done by me:** card thumbnails fixed-square (160px beside text above 600px, up to 240px stacked on phones) with new alt text; cards stack vertically at full width; thin border and shadow on case study images; `Figure frame="browser"` (CSS-only window bar); **opossum theme built and enabled** (`themes/opossum.css`, `theme-init.js` allow-list, picker), per-theme headshot on the bio page (`themeHeadshots`).
- **Decision (you):** opossum accent option (b): `#FF914E` for fills, rings, borders; small text uses a lighter tint. D17/D18 exception recorded in `opossum.css` and `contrast.test.ts`.
- **Deviation (me):** planned small-text accent `#FFB080` measured 3.92:1 on the 12% tinted stack pills at the dark-olive gradient stop, so I used `#FFC8A4` (4.68:1 worst case). Plain text on the gradient passed either way.
- **Bug fixed:** `Nav.css` used `background-color: var(--bg)`, which cannot hold a gradient, so the sticky header would have been transparent in opossum. Now `background`, with `background-attachment: fixed` so header, cards and page share one gradient.
- **Tests:** 277 total, 273 pass; the same 4 content failures (backstage projects: Do Shit, Scavenger Hunt, Scream Recorder). New: opossum contrast against both stops, picker, headshot swap, browser frame, stacked cards.
- **Open:** `headshot-opossum.png` is 2.4 MB (glass 1.1 MB); opossum visuals not yet checked in a browser or with Lighthouse; opossum `--border` is about 1.9:1 to 2.4:1 on the gradient (decorative, like light's border); glass still disabled.

### Update, end of 2026-11-23: glass built (S2.2)

- **Done by me:** `themes/glass.css` (Figma gradient over a solid `#00052F`, 22px radius, 40px blur, scrim plus sheen on cards, header, nav and theme panel only; fallbacks for no `backdrop-filter`, `prefers-reduced-transparency`, `forced-colors`); glass enabled in the picker and the no-flash script; glass headshot wired. All four themes are now enabled (the cut line was Nov 27).
- **Also today:** opossum icon (PNG on a light chip) in the picker; `useTheme` now reads `<html data-theme>` through `useSyncExternalStore` so the bio headshot changes the moment the theme does (it kept separate state per component before); project cards are two equal halves above 600px (thumbnail up to 600px tall), stacked below.
- **Deviation (me):** SPEC 6.2 proposed glass text tokens `#8D8D8D` (secondary) and `#A9B4FF` (accent text). Against the Figma orange stop `#9F3501` they measure about 2.7:1 and 4.2:1, so they fail on the bare gradient. Used `#DADDF0` (5.22:1 worst case) and `#DCE1FF` (5.45:1; 4.65:1 on the 10% tinted pills). Text now passes directly on the gradient; the scrim is extra margin. Glass accent: fill `#0019D2` with a white label (9.81:1), light tint for text, links, rings and borders, same pattern as opossum.
- **Tests:** 298 total, 294 pass; the same 4 content failures (backstage projects). New glass tests: three text tokens on scrim plus sheen over each of three stops, on the opaque fallback, accent split, backdrop-filter limited to cards/nav, fallbacks present.
- **Open:** glass not yet checked in a browser (the Figma gradient plus the 40px blur on a long page is the likeliest visual and Lighthouse miss on mobile); jsdom cannot compute contrast, so the real rendered check is still manual; `headshot-glass.png` (1.1 MB) and `headshot-opossum.png` (2.4 MB) need resizing; the card border in glass is solid `#FBFBFB` per Figma and may look heavy.
- **Next:** your image resize and replace (tomorrow), then Phase 3: self-hosted fonts, image optimization, SEO tags, headers/CSP, Lighthouse.

### Update, late 2026-11-23: glass disabled, mobile menu fix

- **Decision (you):** glass is disabled (`enabled: false`, removed from the no-flash allow-list) while you revisit the Figma. `glass.css`, its tests and the glass headshot stay in the repo. Opossum is the only extra theme live. D16 outcome: light, dark, opossum ship; glass waits.
- **Notes for the glass revisit:** the header had a border (the glass rule gave `.site-header` a bottom rim) and the dropdown reused the page gradient instead of a frosted surface; neither is fixed because glass is off. Contrast results and the lighter text tokens are in the entry above.
- **Bug fixed:** on phones the project dropdown sat in the page flow, so opening it grew the sticky header and pushed the whole page down. It now floats full-width under the header (`position: absolute` anchored to the header), so nothing moves. Not checked in a browser or on a device yet. Side effect: the open list now covers content instead of displacing it, which is how the desktop dropdown already works.
- **Tests:** 296 total, 292 pass; the same 4 content failures (backstage projects). Removed the glass picker and glass portrait tests, since the theme is off.

