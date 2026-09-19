# GREYSCALE · accessibility

I ran the page in monochrome and by keyboard. Most of the backstops hold. Two labels miss their contrast threshold and a handful of names could carry more context.

Method note. Every check below is DOM-observed on http://localhost:4599/?grey-fresh (my own tab, background). Contrast pairs are computed live in the page with parsed rgb() and the WCAG relative-luminance formula, then re-verified against the blended cell fill (token drawn at fill-opacity 0.88 over --surface). Keyboard operation is scripted focus() plus .click() with document.activeElement compared before and after, not real keydowns. Nothing was fronted.

Findings

Major

1. Light-theme treemap value labels on MCU cells fail AA 4.5:1 for normal text.
   - Where: `section#v-treemap svg` cells with fill `var(--mcu)`; in light theme --mcu is `#277a38`. The cells carry the largest values on the page ($2.80B Endgame, plus every $1B+ MCU film).
   - Evidence: `getComputedStyle(rect).fill = rgb(39,122,56)`, text fill `rgb(18,21,27)`. Raw CR 3.42. Blended over --surface `#ffffff` at fill-opacity 0.88 the effective fill is ~rgb(65,138,79) and CR to `#12151b` = ~4.37. Text is 16px regular (Plex Mono) so this is "normal text", threshold 4.5. The comment at src/index.html:111 (`--mcu: #277a38; /* darkened from #2c8a3f so treemap labels clear AA */`) states the intent; the current value does not meet it. A 3.5px white halo (`paint-order="stroke"`) mitigates in practice but WCAG does not credit halos.
   - WCAG 1.4.3 Contrast (Minimum), AA.
   - Fix: nudge light `--mcu` a step darker (~#226b31 lifts blended CR past 4.5 with `#12151b`) and re-run scripts/check-palette.mjs.

Minor

2. The 91-row ledger table has no caption or other accessible name.
   - Where: `section#v-data table.data` (the second table in the section; the first table, "By universe", carries `<caption>Data table: summary by universe</caption>`).
   - Evidence: DOM `hasCaption:false`, `aria-label:null`, `aria-labelledby:null`, `attributes:['class=data']`. Every other data table on the page has a sr-only caption; §15 records "captions and row headers on every table" as fixed. This one is the exception.
   - WCAG 1.3.1 Info and Relationships (indirect; heading context is available but not associated with the table element itself).
   - Fix: add `<caption class="sr-only">The ledger, 91 films, sortable</caption>` to match the sibling.

3. Fourteen chart toggles share the identical accessible name "Show data".
   - Where: `#v-scorecard`, `#v-treemap`, `#v-beeswarm`, ... every chart's `button[aria-expanded][aria-controls]`. All read "Show data"; only `aria-controls` differs, and that does not feed the button's accessible name.
   - Evidence: enumerated three, all `textContent = "Show data"`, `aria-label = null`. A screen reader users' rotor listing shows fourteen indistinguishable buttons.
   - WCAG 2.4.6 Headings and Labels, AA.
   - Fix: `aria-labelledby` each button to the chart's h3/h4, or add `aria-label="Show data table for [chart title]"`.

4. `summary` elements are not covered by the site's `:focus-visible` outline rule.
   - Where: src/index.html:304 sets `button:focus-visible, a:focus-visible, [tabindex]:focus-visible { outline: 2px solid var(--dceu); ... }`. The four `<details>` in Reference (Contents, Every follow-up, The bugs, The design calls) fall outside that.
   - Evidence: `getComputedStyle(summary).outline` returns `"rgb(75, 81, 94) none 3px"`; `outline-style: none` means the site paints nothing. The browser's default UA `:focus-visible` ring still shows on real Tab, so this satisfies WCAG 2.4.7 in practice, but the focus indicator does not match the DCEU token used on every other interactive element.
   - WCAG 2.4.7 Focus Visible (met by UA default); consistency finding.
   - Fix: append `, summary:focus-visible` to the selector at src/index.html:304.

5. On mobile (375 CSS px), the masthead byline link "🏴‍☠️ Bill Yost" measures 75x18 px, under WCAG 2.2's 24x24 minimum.
   - Where: `header.masthead .byline a` at viewport 375.
   - Evidence: `getBoundingClientRect()` = {w:75, h:18}.
   - WCAG 2.5.8 Target Size (Minimum), AA. The "inline text link inside a sentence" exception may apply here; the byline reads as prose. Footer links at 32-146x37 clear 24x24.
   - Fix: none required if you rely on the inline-text exception; otherwise pad the anchor's line-height on mobile.

Not reported (verified clean)

- Every interactive control has a non-empty accessible name across all seven tabs (Scoreboard 41, Over time 43, Beyond the gross 48, Roster 43, Mistakes 38, Ledger 52, Reference 48; zero empties).
- Heading outline is H1 > h2 acts > h3 sections > h4 cards on every tab, no skips.
- Roman-numeral and glyph prefixes on tab buttons and the pager are wrapped in `<span class="tn" aria-hidden="true">`, so screen readers hear "Scoreboard", "Next Over time", not "IScoreboard" or "NextIIOver time→".
- All 14 real charts have a data table in the same section; §12 anti-patterns intentionally have none. Two-svg sections (Scorecard, Reviews, Roster) each carry two tables, one per chart.
- Ledger sort restores focus to the same-named sort button after re-render (aria-sort transitions none -> descending; activeElement is the new "Worldwide" button).
- "Show data" toggles keep focus on the button and use aria-expanded/aria-controls correctly.
- Treemap data table encodes Film + Universe + Worldwide for all 91 rows, backstopping the sub-$1B cells that carry only a film title in the SVG.
- Beeswarm and scatter carry per-universe shape (circle/rect/path) alongside hue; grayscale filter preserves category identity.
- Profit v break-even (§06) encodes profit/loss by bar direction across zero as well as fill, so category survives grayscale.
- Prefers-reduced-motion is respected on `html { scroll-behavior }`, the spectrum-bar fill, the scroll-hint nudge animation, and the contents/details/chevron transforms.
- Tooltip (`#tip`, role=status aria-live=polite) sets aria-hidden on hide and clears it on re-show, so re-hover announces again and stale numbers do not linger.
- Filter pills use aria-pressed. The visible `<p role="status">Showing 91 films · All universes · Nominal · Design notes on</p>` announces state changes (role=status is implicitly polite).
- Ledger table's first cell per row is `<th scope="row">` with the film title. Column headers are `<th scope="col">` with `aria-sort`.
- Ink token contrasts (ink, ink-2, ink-muted) on page/surface/surface-2 clear 4.5:1 in both themes; ink-muted on surface-2 measures 5.04 dark / 4.77 light.
- No horizontal scroll on `<html>` at 640 CSS px on any tab; the ledger overflows inside its own `overflow-x:auto` container as designed.
- Tab strip buttons are 45px tall at 375 CSS px (meets 44x44).
- Reconcilers download link reads "Download the bundle (zip)".

Checked clean.
