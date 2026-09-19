# THUMB · UX

*Opened this on a train once. Shrank shortly after.*

Notes about the pane: I opened my own tab (tab-108) at http://localhost:4599/?thumb-fresh, fronted it via tabs_select, and worked mostly at 375x812. The pane was fronted for the first pass but went hidden mid-session (Greyscale was sharing it). While hidden the pane drops smooth scroll and swallows real click/hover through the computer tool, so every scroll, click and hover measurement in this report was dispatched from JavaScript (or scroll with behavior:'instant'). Every Critical/Major finding was re-verified with the pane fronted and with 3s waits to rule out smooth-scroll timing, and I say so per finding.

## What I had to guess (in order)

- Two of the three sentences at the top are also buttons ("Design notes" and "Marvel v DC"). They sit inline in prose. I nearly walked past them.
- The tab strip shows three tabs. The right side softens to nothing. I guessed there was more. There is, but I had to try scrolling to prove it.
- To filter to just DC I had to open a "FILTERS" pill. From the collapsed summary I could not tell there were universe pills inside.
- A thin gradient bar sits under the tab strip. Watched it flicker between 1% and 28% while scrolling. Still do not know what it is measuring.
- I tapped a mark in the beeswarm. Nothing visibly happened. I could not tell if the chart was interactive.

## Critical

1. **Contents pill jumps to the top of the destination tab, not to the section.** Where: masthead CONTENTS pill, any cross-tab link (e.g. §04, §11) and even same-tab links (§03 from §02). Reproduce: tap CONTENTS, tap "§ 04 Marvel Studios has cleared…", land at scrollY 0 on Over time with the target section 3379px below. Pane fronted, waited 3 seconds. Fix: on the click handler that switches tab, follow up with scrollIntoView (or wait for the tab-swap paint and then set scrollTop) for the anchored section.

2. **Deep links land at the masthead, not the section.** Where: any URL with a hash, cold load. Reproduce: navigate to /?thumb=1#v-data or #v-roster or #v-method, wait 2 seconds; correct tab is active, scrollY is 0, section is at y 787. Pane fronted. A person opening a shared link sees the masthead and has to hunt. Fix: on load, if location.hash names a section, scroll it into view after the tab switch (same fix as #1).

3. **Filter, lens and 2025$ state do not survive reload.** Where: filter panel on any tab. Reproduce: open filters, deselect MCU, toggle 2025$, reload; MCU is pressed again, summary says "All universes · Nominal". Only `capeindex-theme` and `capeindex-notes` are in localStorage. Pane fronted, JS-checked storage. Rotation without reload keeps state fine. Fix: persist STATE.unis, STATE.money and STATE.lens the same way theme and notes are persisted.

## Major

4. **Open filter panel eats two thirds of a landscape viewport, half of portrait.** Where: filter pill, at 812x375 and 375x812. Reproduce: at 812x375, tap FILTERS; panel expands to 241px (64% of viewport). At 375x812 it is 399px (49%). Pane fronted, JS measured getBoundingClientRect on `.controls`. Fix: cap the open panel with max-height: min(60vh, 420px), overflow-y: auto so the panel scrolls inside itself instead of pushing the page down.

5. **Sorting the ledger resets horizontal scroll to 0.** Where: §13 Ledger, films table. Reproduce: from ledger tab, scroll the films table right to scrollLeft 200 to see OS%/OPEN/MULT columns, tap the WW header; scroll snaps back to 0 and the column you were reading is off-screen. Pane fronted, JS dispatched a click on the header button and read scrollLeft on `.tablewrap` before and after. Fix: capture `tablewrap.scrollLeft` before the sort re-render and restore it after.

6. **Chart marks have no tooltip visible on touch, and no title, and no aria label.** Where: §03 beeswarm (and by inspection §04, §06 which use the same `.tip` machinery). Reproduce (JS-dispatched, pane hidden at the moment of test): dispatch pointerover on a `.beeDot`; the `.tip` container populates ("Iron Man MCU · 2008 Worldwide $586M") and receives inline `opacity:1`, but computed opacity is 0 in the emulated-mobile pane (matchMedia('(hover: none)') is true). The mark carries no `<title>` and no aria-label. I could not confirm what a real finger does on a real phone from this pane. Fix, regardless: add a `<title>` child to each mark so keyboard and screen-reader users get the same content the tooltip has, and add an on-page "tap for details" hint under any chart whose only tooltip trigger is hover.

## Minor

7. **The spectrum bar under the tab strip is unlabeled and its fill is unpredictable.** Where: sits at the top of every tab. Reproduce: sample `.spectrum-bar i` width at scrollY 0, 500, 1500, 3000, 5000; on Scoreboard it read 1.09% flat until 4000 then jumped to 27.91%; opening a fresh tab it flashed 81% then settled to 1.09%. Pane fronted. First-time visitor has no anchor for what it means. Fix: label it ("Progress through this tab") or drop it. If it stays, throttle without the initial-frame jump.

8. **Tab strip fades only on the right.** Where: `.tabs-inner` mask is `linear-gradient(to right, black calc(100% - 48px), transparent)`. When scrolled to scrollLeft 400 (near max 414) the right shows a fade but the left edge is a hard cut with no cue that there is more back that way. Pane fronted, JS read computed style. Fix: symmetric mask that toggles based on scrollLeft (fade left when > 0, fade right when < scrollWidth - clientWidth).

9. **The two inline controls in the intro paragraph are small and touching.** Where: masthead prose, "Design notes" (97x24) and "Marvel v DC" (78x44) sit at hgap 0, vgap 0. Reproduce: measure rects at 375. Pane fronted. Fix: promote both to a small "chips" row under the paragraph at 44 tall each with 8px gap; or, keep them inline but pad vertically to 44.

10. **Multiple non-inline touch targets under 44 minimum.** At 375x812, pane fronted, visible tap-target measurement pass:
    - "🏴‍☠️ Bill Yost" byline link, masthead: 75x18.
    - Colophon "🏴‍☠️ Bill Yost" 68x37, "Tableau Public workbook" 146x37, "GitHub" 41x37, "Open an issue" 82x37, "email" 32x37.
    - §15 build-log `<details>` summaries ("The bugs, 8 caught", "The design calls, 9 calls"): 309x27.
    Fix: min-height 44 on `.notes-link`, colophon `<a>`, and `#v-process details > summary`; add horizontal padding so "GitHub" and "email" clear 44 wide.

11. **Contents pill rows are 4px apart.** Where: expanded CONTENTS list. Reproduce: open pill, list items 35px tall for the short titles (§10, §13, §14, §15) with 4px between rows. Pane fronted. Fix: gap 8 minimum, or make every row 44 tall so misses fall on the row below.

12. **First-time visitor cannot tell there are seven tabs, and the tab-swap does not reveal the tab strip when it lands.** Where: any cross-tab navigation. Reproduce: from Scoreboard tap "III Beyond the gross" in the CONTENTS pill; you land in that tab and the tab strip is off-screen (scrollY 0, tab strip y 622 at 375). No affordance says "you switched, tap here to move again". Pane fronted. Fix: make the tab strip sticky (it already is), but on tab-swap scroll the section to the top of the visible area under the tab strip, not to document top (see #1 and #2).

## Checked clean

- Filter summary reflects selection ("Fox, Sony, DCEU, DCU, Elseworlds · 2025 $").
- Filter state survives a rotation with no reload (deselected MCU stayed off after 812x375 -> 375x812).
- Frozen first column of the ledger works; the FILM cell is sticky left: 0 with a solid background, verified by scrolling `.tablewrap` to 400 and re-reading rects (first td stayed at x 34, next cell went to x -248).
- Sort direction is shown via CSS `::after " ▲"` on the sorted th, plus aria-sort ascending/descending. Header buttons are 45 tall.
- "SWIPE FOR THE REST OF THE COLUMNS →" scroll hints sit on both ledger tables. Discoverable.
- No horizontal document overflow at 320, 375 or 812x375. No visible element wider than the viewport outside a scroll container.
- Roster tab labels are 13px, readable at 375. Footprint SVG is 3182 tall but wraps to width.
- Pager row does not wrap at 320: at ledger, "BACK ← ✗ The mistakes" and "NEXT § Reference →" render at 138x85 side by side under a grid layout.
- Reference-tab `<details>` fold-outs open and close (verified programmatically).
- Show-all-N collapse keeps scroll position: expanded, scrolled +100, collapsed; scrollY held at 2586.
- Browser back after a deep link goes to the previous hash correctly.
- Theme toggle Auto/Dark/Light buttons are all 44 tall, ~54 wide.
