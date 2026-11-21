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
