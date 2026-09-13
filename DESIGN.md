# Portfolio design system

## Direction

Warm editorial portfolio: charcoal surfaces, copper accent, readable sans-serif
content and serif headings. Preserve the existing page structure and interactions.
This document adapts the named typography hierarchy from the local Awesome
DESIGN.md collection, particularly `design-md/claude/DESIGN.md`. It uses this
portfolio's existing brand and a larger reading baseline.

## Typography

Tokens live in `src/styles/global.css`; semantic assignments live in
`src/styles/typography.css`. Use these levels for new or edited UI.

| Level | Token | Size at a 16px root | Use |
| --- | --- | --- | --- |
| Metadata | `--text-meta` | 14px | Dates, category labels, attribution roles |
| UI | `--text-ui` | 16px | Navigation, buttons, author names |
| Body | `--text-body` | Fluid 20-22px (1.25-1.375rem) | All descriptions, project summaries, reference letters, explanatory captions |
| Lead | `--text-lead` | 24px | Testimonial quotes, lead copy |
| Title | `--text-title` | 32px | Project and subsection titles |
| Section | `--text-section` | 32-48px | Section headings |
| Page | `--text-page` | 48-80px | Page titles |
| Hero | `--text-hero` | 80-144px | Portfolio name |

Body content uses Montserrat at weight 400 with 1.7 line height. All descriptions
share the same fluid body token as the landing page's On my own time content: `clamp(1.25rem, 1.125rem + 0.25vw, 1.375rem)`. The rem bounds preserve a readable minimum and limit growth; the viewport term adds gentle scaling on larger screens.
Keep the 1.25rem minimum on mobile; body text reaches 1.375rem on wide screens. Make the layout wrap or stack instead of shrinking
content. Metadata is limited to short labels; paragraphs always use Body or Lead.
Use Fraunces for headings and quotes, Space Mono for short technical labels.
Use rem values so browser zoom and user text preferences remain effective.

Page eyebrows share 14px Space Mono, 1.6 leading, .12em tracking and secondary
text color, without decorative prefixes. Section labels use the same scale.
Section headings share Fraunces at the Section token; card titles use Title.
Navigation controls use the UI token; section navigation uses sentence-case
Montserrat with normal word spacing. The main navigation keeps its animated
underline as its only hover underline.

The hero forecast separates equally above and below its stationary middle plane.
Its centered title and a small expand icon sit below the diagram inside the same
button, without a separate invitation or divider. Keep the hero copy vertically centered with the illustration
and the transition into the experience summary compact.

## Color and layout

Use existing theme tokens: charcoal `#181918`, text `#EDE5D8`, secondary text
`#B7B4A9`, copper `#D7A184`. Use thin dividers and restrained surfaces.
Keep readable prose around 42-68 characters per line. Allow cards to grow with
content; collapse columns when available width becomes too narrow.

## Interaction and verification

Use native links, buttons, dialogs and blockquotes. Preserve visible keyboard
focus and reduced-motion behavior. Testimonials remain manual: one centred quote with smaller side previews,
smooth slide-and-scale transitions, swipe support, and two-line selectors showing placement and the reviewer's actual designation.
Place the carousel below the experience summary. Keep labels fully visible; use
four columns on desktop and two on mobile. Show a copper underline for the active
placement and directional arrows on the clickable side previews.
Keep the carousel height stable across selections and honour reduced motion. Check computed body sizes on landing, projects,
experience and project dialogs, plus mobile overflow, after typography changes.

During horizontal dragging, cards follow the pointer directly; release eases
into the selected position. Short or cancelled drags return to the current quote.
Vertical scrolling and pinch zoom remain native.

Projects and Experiences share SectionNav: a sticky horizontal row below the
main navigation, direct anchor links, and a copper underline for the section in
view. Overflow scrolls horizontally without wrapping. Projects groups by category;
Experiences groups by company, with placements newest first within each company.
Keep role and reference anchors stable when adding placements.
