# INTENT.md
> Created: 2026-11-20
> Last Updated: 2026-11-20


## Product
**Seamus Robertson's Front-End Dev Portfolio Site**

This is the first impression to potential interviewers for front-end development employment. This portfolio introduces Seamus, key projects and their process, provides contact information and is itself a development portfolio project (inecption!).


## Audience
Recruiters/hiring managers and engineers/interviewers equally. The site needs a quick-skim layer (role fit, top projects, resume, contact within a scroll or two) with depth (process, code, case studies) available on demand.


## Key Considerations
 - Mobile first, responsive design for quick responsiveness, easy info digestion, intuitive navigation (but also beautiful and elegant on desktop)
 - Prioritizes key projects and contact info
 - Accessible for screen readers, tab through navigation, contrast, font size, readable fonts
 - Quality bar: WCAG 2.2 AA and Lighthouse 95+
 - Hand-coded vs. agentic (AI-assisted) projects are distinguished by a small badge/tag on the card. Process is explained in the longform case study content. May later return to two distinct sections (as currently built).
 - Incomplete case studies are hidden until complete (matches the existing longform filter).


## Launch Requirements
- Real project images (replace placeholders, optimized)
- Complete case studies (any incomplete ones stay hidden)
- Deployed with a custom domain
- Resume attached, and the conditional resume button removed

**Timeline:** Site live by **Dec 1, 2026**. Case studies may not all be finished until end of Dec. Job search begins January 2027.


## Potential Problems
- Currently missing assets or have placeholders (resume missing, project images placeholders)
- Not all case studies have complete text information. Current site logic handles empty entries but that may need to be refactored or otherwise updated if other structures change.
- Dec 1 launch with case studies still in progress: the site must look complete with only the finished studies visible.

## Scope and Content
1. **Contact:** no contact form for now only
   1. email
   2. linkedIn
   3. Github
2. **Roles:** remote React/TypeScript, preferably startup or even smaller businesses that are not startups. Will consider enterprise roles if mentorship is on the table. Home page copy and project ordering should lean toward startup and React/TypeScript work.
3. **Bio:** Headshot, business section, personal section, contact info

## Technical
4. **Hosting and Routing:** May host on Vercel but may also look into an independent option (Cloudfare) with custom domain. This is currently undecided.
5. **SEO and Sharing:** OPEN, needs discussion and research. Considerations: per-route titles/descriptions, Open Graph image for link previews (recruiters paste links into Slack/LinkedIn), and whether a client-rendered SPA needs pre-rendering.
6. **Analytics:** OPEN, needs discussion and research. Need some way to review site traffic (supports the success metrics). Should be simple and privacy-focused (cookieless, no consent banner). Candidates: the host's built-in analytics once hosting is decided (Cloudflare Web Analytics or Vercel Web Analytics), or Plausible/Umami.
7. **Dependencies:** Keep with React/Vite unless mobile experience suffers. Vitest for testing, with `vitest-axe` for automated accessibility checks. Site should remain testable and hold for quality regardless of size or traffic.

## Design Risks
8. **Glassmorphism:** Will address this further in DESIGN.md. Depending on the time requirements to stand up v1, all four themes (light, dark, glass, opossum) should meet basic AA requirements.
9. **Themes:** The toggle will eventually become a four-way picker (light, dark, glass, opossum). It should respect `prefers-color-scheme` by default (light or dark) and remember the user's choice. Most of the site's personality lives in the opossum theme.
10. **Motion:** in alignment with other accessibility intents, `prefers-reduced-motion` should be applied when using animations on site components.

## Process
11. **Data Model:** Right now case study data is in tsx. Research and revisit MDX for case-study longform content. An `mdx-experiment` branch converts one case study (Do Shit) to compare the approaches. Card metadata (title, tagline, stack, image) would stay structured either way.
12. **Success:** 
    1.  Site finished and live, meeting all design, data, and accessibility requirements.
    2.  Once applications begin, site traffic will be a secondary success metric