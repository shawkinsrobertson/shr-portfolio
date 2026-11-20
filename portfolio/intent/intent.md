# INTENT.md
> Created: 2026-11-20
> Last Updated: 2026-11-20


## Product
**Seamus Robertson's Front-End Dev Portfolio Site**

This is the first impression to potential interviewers for front-end development employment. This portfolio introduces Seamus, key projects and their process, provides contact information and is itself a development portfolio project (inecption!).


## Key Considerations
 - Mobile first, responsive design for quick responsiveness, easy info digestion, intuitive navigation (but also beautiful and elegant on desktop)
 - Prioritizes key projects and contact info
 - Accessible for screen readers, tab through navigation, contrast, font size, readable fonts


## Potential Problems
- Currently missing assets or have placeholders (resume missing, project images placeholders)
- Not all case studies have complete text information. Current site logic handles empty entries but that may need to be refactored or otherwise updated if other structures change.

## Scope and Content
1. **Contact:** no contact form for now only
   1. email
   2. linkedIn
   3. Github
2. **Roles:** remote React/TypeScript, preferably startup or even smaller businesses that are not startups. Will consider enterprise roles if mentorship is on the table
3. **Bio:** Headshot, business section, personal section, contact info

## Technical
4. **Hosting and Routing:** May host on Vercel but may also look into an independent option (Cloudfare) with custom domain. This is currently undecided.
5. **SEO and Sharing:** 
6. **Analytics:**
7. **Dependencies:** Keep with React/Vite unless mobile experience suffers. Vitest for testing. Site should remain testable and hold for quality regardless of size or trafficf.

## Design Risks
8. **Glassmorphism:** Will address this further in DESIGN.md. Depending on the time requirements to stand up v1, all four themes (light, dark, glass, opossum) should meet basic AA requirements.
9. **Dark/light theme:** Toggle should respect `prefers-color-scheme` by default and remember choice.
10. **Motion:** in alignment with other accessibility intents, `prefers-reduced-motion` should be applied when using animations on site components.

## Process
11. **Data Model:** Right now case study data is in tsx. Research and revisit MDX for case-study longform content. 
12. **Success:** 
    1.  Site finished and live, meeting all design, data, and accessibility requirements.
    2.  Once applications begin, site traffic will be a secondary success metric