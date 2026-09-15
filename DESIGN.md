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
On screens below 768px, use 1.0625rem (17px) body text, 1.25rem quotes, and smaller heading tokens. Desktop retains its existing sizes. Metadata is limited to short labels; paragraphs always use Body or Lead.
Use Fraunces for headings and quotes, Space Mono for short technical labels.
Use rem values so browser zoom and user text preferences remain effective.

Page eyebrows share 14px Space Mono, 1.6 leading, .12em tracking and secondary
text color, without decorative prefixes. Section labels use the same scale.
Section headings share Fraunces at the Section token; card titles use Title.
Navigation controls use the UI token; section navigation uses sentence-case
Montserrat with normal word spacing. The main navigation keeps its animated
underline on hover only; the active page uses copper text and keyboard focus
uses an outline.

The hero forecast separates equally above and below its stationary middle plane.
Its title sits on the left and a visible copper-outlined "Explore the diagram"
action with an expand icon sits on the right, in one row below the diagram inside
the same native button. Allow the text to wrap within the row on narrow screens.
Interactive diagrams must communicate their action before hover, including on touch
screens; use a readable action label, pointer cursor, and visible keyboard focus. Keep the hero copy vertically centered with the illustration
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
main navigation, direct anchor links, and copper text for the section in
view. Links and text actions underline on hover, with visible keyboard focus. Overflow scrolls horizontally without wrapping. Projects defaults to category grouping, with a Category / Year control at the right of the
sticky section navigation. Section links scroll horizontally while the control
stays visible, separated by a thin vertical divider. Year view groups by starting year, newest first; ongoing
projects retain their starting-year placement and visible date range/status.
The navigation follows the chosen grouping. A half-second GSAP transition moves
the original rows and fades section/nav labels; reduced motion switches instantly.
Project anchors and dossiers remain stable across views.
Experiences groups by company, with placements newest first within each company.
Keep role and reference anchors stable when adding placements.

Project cards group dossier, repository, website, and related experience links in
an action area below the content, separated by a thin divider. Category / Year
selection uses copper text and weight; underlines appear only on hover. Section
spacing counts visible groups so the first heading stays aligned across views.


Section navigation on Projects and Experiences and project Highlights share the
same 550ms eased anchor scrolling. Preserve the URL hash and sticky-header offset,
move keyboard focus to the destination without another jump, and let wheel,
touch, or navigation keys interrupt the animation. Reduced motion navigates
immediately. Initialize this behavior through SectionNav so pages stay consistent.

Text links and text actions have no underline at rest, including section links,
Category / Year, dossier actions, and reference collapse controls. Underline on
hover only; keyboard focus uses a visible outline. Indicate the current section
or selected grouping with copper color and weight, without a persistent underline.
Keep inline links identifiable before hover using copper emphasis, with an
external arrow where appropriate. Verify resting, hover, keyboard, reduced-motion,
and mobile states when adding or changing interactive elements.


Primary navigation lists Home, Projects, and Experiences in that order. The name
also links home. On narrow screens, place the name above the three visible links
and update the shared navbar-height token so sticky navigation and anchor offsets
remain correct. Keep the current-page copper treatment and hover-only underline.

## Mobile layout (below 768px)

These mobile rules supersede the wider-screen arrangements described above.
Hide the header name and keep Home, Projects, and Experiences in one 3.75rem row.
Testimonials show one quote without arrows or side previews. Retain swipe and
keyboard selection. Mobile selectors retain compact placement and full designation
on two lines, with an accent underline on the active choice. A separate draggable
scrollbar below the labels stays permanently visible and in sync with horizontal
swiping. The copper thumb shows the scroll position. Keep accessible names
and generous touch areas without visible instructions or counters. Quotes use
1.25rem type.
Place Category / Year above the full-width project section links. Account for
both rows when scrolling to project anchors.
The forecast explorer retains layer selection and presents a static explanation
for each layer with a note to explore the full animation on desktop. Do not run
the detailed animation while the mobile layout is active.
Preserve all desktop layouts, typography, and interactions.

## Responsive units

Root text uses 100% to respect the browser default. Use rem for content limits,
text-related sizes, spacing, minimum touch targets, and header offsets. Standard
controls have a 2.75rem minimum target; navigation heights are 5rem on desktop
and 3.75rem on mobile. Use percentages, grid fractions, and minmax for reflow;
use dvh for viewport-bound dialogs and page height.
Breakpoints use em based on the browser initial font size. Preserve the existing
thresholds at the default 16px size; the mobile threshold is 47.9375em. Keep CSS
and JavaScript media queries identical. Changing the author root size does not
change an em media query; changing the browser default font size does.
Keep px for fine borders/outlines, SVG viewBox coordinates and diagram text,
decorative effects, and browser-measured animation values. Those are not
text-layout constraints. Let long text wrap and grids shrink; navigation may
scroll horizontally when enlarged text no longer fits.
Validate default-size layout equivalence and 200% text reflow on all pages,
including dialogs and sticky anchor navigation.

Project navigation measures its rendered height for the mobile anchor offset,
so wrapped controls at enlarged text sizes cannot cover destination headings.
