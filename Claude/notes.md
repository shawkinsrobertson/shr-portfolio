# notes.md: Design notes and open items
> Created: 2026-11-20
> Running list of visual and UX feedback from reviewing the build. Items are marked **Done**, **Open**, or **Idea**. Nothing here is a requirement until it is moved into SPEC.md.

## Round 1 (after S1.4)

### Longform spacing
**Done.** Case study bodies had no room between sections or bullets. Now (`src/pages/CaseStudyPage.css`):
- Section headings (`h2`): 2.5rem above, 0.75rem below. The first element in the body has no top margin.
- Paragraphs: 1rem below (they had 8px, which came from a card-wide rule).
- Lists: 1rem below, indented 1.25rem, with 0.5rem between bullets.

Needs a look in a browser at phone and desktop widths. Easy to tune: these are the four values above.

### "What I Did" styling review and change
**What I found.**
- Each decision was one paragraph that started with a bold phrase, and its trade-off was a second paragraph starting "**Trade Off**:". The trade-off had the same visual weight as the decision, so the two blurred together.
- Decisions were separated only by the ordinary paragraph gap (8px), so a section with two decisions read as four loose paragraphs.
- The bold lead-in is a sentence fragment ("Used a flat basal insulin calculation when modifying ..."), not a title, so it does not scan as a heading.

**Done.**
- New `Decision` MDX component groups one decision with its trade-off. It is a plain group (no heading, no landmark), so the page outline is unchanged. Decisions are 2rem apart.
- Trade-offs are now `<Callout type="tradeoff">` under their decision, with a visible "Trade-off" label (text, not color alone), 0.75rem below the decision text. The old "Trade Off:" prefix is gone because the label says it.
- Migrated in `shelby.mdx` (two decisions with trade-offs) and `simpleset.mdx` (two decisions, no trade-offs). A test checks Shelby renders two decisions each with a callout.
- Authoring pattern for new studies:
  ```mdx
  <Decision>

  **What I chose** and why.

  <Callout type="tradeoff">

  What it costs.

  </Callout>

  </Decision>
  ```
  (Blank lines inside the tags are needed so the Markdown is parsed.)

**Done.** Each decision now has a short `####` title (rendered h3) instead of a bold sentence fragment, in Shelby, SimpleSet, and No Guts No Glory. Because the bold text was the start of a sentence, a few sentences were lightly reworded so they stand alone under their heading. **Please review these edits** (they are my wording): Shelby's two decisions, where "CGM ingestion via local inter-app broadcast (requires ...) instead of follower account allows for ..." became "Uses a local inter-app broadcast (requires ...) instead of a follower account, which allows for ...", and "Used a flat basal insulin calculation when modifying the algorithm" became "When modifying the algorithm, I used a flat basal insulin calculation ...". SimpleSet and No Guts only moved their lead-in phrase into the heading.

**Idea (not done).**
- Trade-off callouts currently share the accent tint with the other callout types. A distinct treatment (icon or different tint) could separate them from plain notes.

### Mobile: title and achievement
**Done.** On phones the project title and achievement stack with an 8px gap (was 2px).

### Mobile: footer
**Done.** Under 640px the footer stacks and centers (copyright, then the links). Before, the links wrapped to the left on their own line.

### Mobile: bottom navigation on project pages wraps
**Done (option 2).** Previous and Next now sit in two fixed columns (titles wrap inside their own column), with "All projects" centered underneath, at every width. A missing neighbour leaves its column empty instead of shifting the other link, and no empty list items are rendered. DOM order matches the visual order (Previous, Next, All projects). Original analysis: The previous / all projects / next row is a flex row with `space-between` and wrapping. With long titles ("Previous: SimpleSet", "Next: No Guts No Glory") the three items do not fit on one line at phone width, so they wrap unevenly.

Options:
1. **Stack vertically under 640px.** Three full-width rows, each a 44px-tall target, in the order Previous, Next, All projects. Simple and predictable; uses more height.
2. **Two columns.** Previous and Next side by side as two blocks (titles wrap inside their block), with "All projects" as a centered link underneath. Keeps the pair together; long titles wrap within their own column.
3. **Drop the words, keep arrows.** "← SimpleSet" and "Shelby →" with `aria-label`s that still say "Previous: ..." and "Next: ...". Shortest, but loses the visible "Previous/Next" cue.
4. **Truncate titles with an ellipsis.** Not recommended: it hides the project name from sighted users and zoomed users.

My lean is option 2 for the nicest result, option 1 for the least risk. Neither is built yet.

## Resume format (question from round 2)
**Decision: PDF only for launch.** It is the standard for a reason: it looks identical everywhere, applicant-tracking systems and recruiters expect it, and a tagged PDF is accessible. Nothing about a single PDF is a security risk beyond file hygiene (metadata, embedded content), which is in SPEC 13.3.

**More formats.** Cheap to serve, but the cost is keeping them in step: every résumé edit means regenerating each file, and a stale DOCX that disagrees with the PDF is worse than no DOCX. If you want it later, the safe way is one source file (a `resume.json` or MDX) that a build script turns into each format, with a test that checks they contain the same text.
- Cheap and low risk: plain text, Markdown, JSON Resume (a known schema). All are just text generated from the source.
- Moderate: DOCX (needs a library such as `docx`; never macro-enabled `.docm`).
- Heavier: generating the PDF itself from the source (needs a headless browser or PDF library in the build).
- A web résumé page (`/resume`) with print CSS is the nicest "fun" option: it is the most accessible and parseable format, it is itself portfolio work, and "Print to PDF" gives a PDF from the same source. Worth considering after launch.

**Security.** The format is not the risk. The risks are: leaking metadata (author, tool, file paths), embedded scripts or files in the PDF, a public phone number or address getting scraped, and macro-enabled Office formats. Generating files from visitor input would be a real risk, and nothing here does.

## Round 2 (S1.5 placeholders)
- **Placeholders in place:** `public/resume/seamus-robertson-resume.pdf` (a one-page stub containing the text RESUME-PLACEHOLDER), `src/assets/headshot-placeholder.svg`, and the placeholder project screenshots. Replace the files and update `site.ts` (headshot alt) and each project's frontmatter `image`.
- **Launch gate:** `npm run prelaunch` fails until all three are replaced. It is excluded from `npm test` and CI.
- **Substack:** hidden. Set `substack` in `src/data/site.ts` to the real https URL when it exists.
