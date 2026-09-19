# CHARTJUNK · visualization craft

Meld: read the file. I found one live encoding lie that has been shipping under a chart whose whole job is to teach lying, plus a handful of small honesty compromises worth naming. Fourteen real charts checked in source; §12's eight anti-patterns checked as taught anti-patterns, and against the "instead" copy prescribes for each.

## Inventory (real charts, then §12)

| § | Chart | Render | src line |
| --- | --- | --- | --- |
| 01 | Scorecards (Marvel v DC totals) | renderScorecards | 1810 |
| 01 | Stacked worldwide by year | renderYear | 1887 |
| 01 | Box plot, gross by universe | renderBox | 1961 |
| 02 | Treemap, film by WW | renderTreemap | 2061 |
| 03 | Beeswarm by release date | renderBeeswarm | 2159 |
| 04 | Scatter, WW by date, $1B/$2B rules | renderScatter | 2222 |
| 05 | Budget dots + 5-yr rolling median band | renderBudget | 2662 |
| 06 | Diverging profit-vs-breakeven | renderProfit | 2729 |
| 07 | Dumbbell legs, log domestic axis | renderLegs | 2820 |
| 08 | RT vs WW scatter (quadrants) | renderReviews | 2892 |
| 08 | Critic vs audience parity | renderParity | 2947 |
| 09 | Domestic/overseas split rows | renderSplit | 2289 |
| 10 | Roster grid, character × film | renderRoster | 3035 |
| 10 | Codenamed characters per film | renderEnsemble | 3129 |
| 11 | Most-traveled lollipop | renderFootprint | 3234 |
| 12 | Dual axis, Pie, Trunc, Cumul, Trend, ROI, Radar, Rainbow | apDual/apPie/apTrunc/apCumul/apTrend/apRoi/apRadar/apRainbow | 3314-3550 |

Plus §01 scorecards, §13 ledger + §13 summary table, §15/§16 log lists.

## Findings

### Critical

**C1. §12 radar's "Avg profit" spoke is dead data. Every universe pins at r = 83.5px.**
Where: src/index.html:3501 (renderer at 3496).
Evidence: the metric callback reads `x.profit`, but no film in `DB.films` has that key. `build-web.mjs` slims films to `t, u, date, wd, wi, ww, open, ropen, final, rd, ri, rw, budget, budgetEst, rbudget, rt, mc, imdb, pctDom, pctIntl, mult, roi` (verified in data/web.json first three rows). `x.profit` is `undefined`. The reduce seeds with `0`, so `0 + undefined` is `NaN`, then divides by `v.length` to `NaN`. In the norm block at 3508-3512, `Math.min.apply(null, [NaN,...])` and `Math.max.apply(null, [NaN,...])` both return `NaN`, `NaN > NaN` is `false`, so the ternary returns the else branch `0.5` for every universe. I read the polygon coords out of the live DOM: spoke-1 radius is `83.5` for MCU, Fox, SSU, DCEU, DCU and Elseworlds - identical to the pixel. The radar is a §12 anti-pattern, granted, but one axis that literally cannot change any ranking undercuts the tear-down's own claim ("Reorder the axes and the 'winner' changes"). Six spokes were selected for the demo; five are doing the work.
Fix: substitute `profitOf(x)` (defined at line 2728), or drop the spoke and rename the exercise to five metrics.

### Major

**M1. renderBudget end-of-line "median $XXX" label is the one in-chart callout on the page without a HALO.**
Where: src/index.html:2704 (§05).
Evidence: every other in-chart annotation on the page passes the `HALO` const (defined at 2125: `stroke="var(--surface)" stroke-width="3.5" paint-order="stroke"`) - scatter's "$1B club" (2249), reviews' "median score" and "median gross" (2917-2918), parity's "audience/critics rated higher" (2966-2967). renderBudget's `median $200M` label at (`xS(last.yr) - 4`, `yS(last.med) - 12`) with `class="lbl lbl-strong"` has no stroke at all. It sits above the median line, inside the 14%-opacity middle-50% band, and on some filters directly over the last dot. Legibility of `lbl-strong` ink over a 14% band on --surface is fine, but a dot with color-mix behind a plain glyph edge is not, and it makes the label the visual outlier when your eye moves down the chart column.
Fix: append `HALO` to the label's markup, as everywhere else.

### Minor

**m1. Beeswarm bubbles below 2% of maxWW are all identical size.**
Where: src/index.html:2169-2172 (§03).
Evidence: `rS = sqrt(max(v/maxWW, 0.02)) * k`. Any film under $56M when Endgame anchors max at ~$2.79B is drawn at the same radius as a $10M film. The comment ("smallest floored at 2% so they stay visible") declares the compromise. Roughly 8 films land at that floor. Not an additive constant, not a violation of the stated "r = k·sqrt(v)" rule; just worth naming that "area = value" is not strictly true at the bottom of the range. The tooltip and table carry the exact number, so the honesty escape hatch exists.
Fix: none needed; if you ever want it exact, drop the floor and let the smallest films be 3px dots.

**m2. renderReviews' two axis-median labels are `place.block()`-registered, not `place.place()`-managed, so their HALO can erase marks that happen to sit under them.**
Where: src/index.html:2917-2929 (§08).
Evidence: `place.block(...)` tells the placer where a label WILL land, so other labels dodge it. But the block'd label itself does not move to dodge marks. HALO stroke-width 3.5 paints a surface-colored ring around the glyphs; a data mark of r=5.5 sitting under one is visibly erased. The comment at 2130-2132 warns of exactly this and says "sizes passed in must be the RENDERED size (the CSS sets .lbl to 16px desktop / 13px phone whatever the attribute says)". In practice both label positions (top-of-chart near max, hard-left near medWW at RT 0.5-11) tend to be empty corners on the current data - Elektra (RT 10, WW $56M) and the widest-miss Sony films sit low, not near medWW. So no mark is being erased today. It is fragile: swap the dataset or narrow the filter and a mark starts hiding behind a static label.
Fix: register both labels with `place.mark(...)` too and let them fall back to a nearby empty band via `place.place`, or accept the compromise and leave it - the fragility is small.

**m3. §12 apDual paints bars in `var(--dceu)` and the line in `var(--mcu)` - universe hues carrying a series identity meaning they never do anywhere else on the page.**
Where: src/index.html:3336, 3343, 3346-3349 (§12/dual).
Evidence: site-wide the palette rule is "identity gets a hue, magnitude gets position or length" (paraphrased in the §12/rainbow copy, 1137). The rest of the anti-pattern gallery uses per-universe hues for identity as normal (via `apHue`). apDual repurposes DCEU-blue and MCU-green as series colors for budget and gross. A reader who has spent Act I learning "green = MCU, blue = DCEU" gets a subliminal semantic hit here that the chart is not about. The dual-axis anti-pattern's tempting-honest look is intact, but the palette borrows meaning it does not intend to spend. Small.
Fix: use two neutral series colors (e.g. `--ink` and `--ink-2`, or the profit chart's `--pl-clear` pair) so the demonstrated sin stays "two scales" and does not also read "Marvel vs DC".

**m4. §12 apCumul's "…and only ever up" label sits 2px below the top of the plotting area, and on a phone lands right on the topmost stacked area's rising edge at the right margin.**
Where: src/index.html:3441 (§12/cumul).
Evidence: `y = yS(max) + 2`. `max = niceMax(totals.at(-1))`, so the plot top and the last data point are close. The label is text-anchor="end" at `W - m.r`, meaning it sits right where the Elseworlds top edge lands. Anti-pattern chart, so gilding it is not the mission, but a label crossing the very line the chart is supposed to show is a minor own-goal.
Fix: `y = yS(totals.at(-1)) + 14` and text-anchor start from x = m.l + iw/2, or drop the label into the always-empty lower-right corner.

### §12 pairs (the "instead" audit)

For each anti-pattern, the "instead" copy prescribes a real chart on the page. Actual practice on that chart:

- Dual axis → "two panels" / "index both to year 2000". §05 renderBudget: single series, one axis. ✓
- Pie → "sorted bar" / treemap. §02 renderTreemap sorts films WW-desc, area proportional to WW, labels only where they fit. ✓
- Truncated axis → "bars start at zero". renderYear (1931) and renderProfit (2793) both draw the zero baseline; renderBox axis includes 0. ✓
- Cumulative → "each year's value". renderYear stacks per-year, not per-cumulative. ✓
- Trend line → "no line, let the scatter be a scatter". renderScatter (§04) and renderReviews (§08): neither draws a fit. ✓ (renderReviews design note at 908-911 explicitly names the omission.)
- Ratio ranking → "rank by absolute profit". §06 renderProfit sorts by `profitOf`, not roi. ✓
- Radar → "small multiples, one bar per metric". §13 summary table (renderSummary, 2378) is the small-multiples equivalent: one row per universe, one column per metric, same scale down the column. ✓ (No dedicated small-multiples chart; the table plays the role.)
- Rainbow ramp → "one hue, light-to-dark, or identity as hue". Nothing on the real site uses a value ramp; all hues are identity. ✓

Consistency of the pairs holds.

## Checked clean

- §01 renderYear: stack order stated (design note 714), zero baseline drawn, legend order matches stack order under both lens states.
- §01 renderBox: MIN_N gate on the quartile box (line 1983), individual dots keep every film on the chart, whiskers min-to-max, median line thicker than whiskers.
- §01 renderScorecards: median under MIN_N is muted (1837), median-profit under MIN_N shown as n/a (1842).
- §02 renderTreemap: area proportional (squarified), label ink chosen at render time by contrast against the actual filled color (2076-2078), clipped titles suppressed rather than truncated (2085).
- §03 renderBeeswarm: `r = k * sqrt(max(v, floor))`, no additive constant, $1B ring is a note channel and legend calls that out; shape backstop present via uniMark.
- §04 renderScatter: log-free linear axes, reference-line labels sit in hard-left empty corner with HALO and are registered with the placer (2266). Only top-N films labeled, short-title rule applied.
- §05 renderBudget: rolling window is centered ±2 years, band = middle 50 (band is drawn, not implied), 5-yr window gate = MIN_N. Headline is written from the data and swings shape under 2025$ (renderBudgetCopy).
- §06 renderProfit: diverging bar anchored at 0 (2764, 2793), color = outcome only (no universe hue collision with MCU green), universe held in tooltip and table.
- §07 renderLegs: log x-axis declared in legend (2885) and in the design note (883), multiplier value printed at row-end so the log distortion cannot mislead.
- §08 renderReviews: dashed median rules, HALO on all callouts, correlation stated in the dek (0.48) and gated by tie-out territory.
- §08 renderParity: 0-100 on both axes, true diagonal, "they agree" arrow labels the line, not a quadrant.
- §09 renderSplit: two sorts stated; "solid = domestic / pale = overseas" appended to the legend at 2349-2350.
- §10 renderRoster: presence grid, columns = release order (called out on the chart at 3079).
- §10 renderEnsemble: mobile switches to ranked-with-fold, desktop stays chronological - both preserve "which film has the most codenamed characters" as the finding.
- §11 renderFootprint: lollipop, dot at count, colored by primary universe.
- §12 apPie / apTrunc / apCumul / apTrend / apRoi / apRainbow render as the tear-down describes; apTrunc's dynamic "3.6× vs 1.9×" callouts recompute from real data (3396-3397).
- Read-progress bar is section-weighted (SEC_IN / SEC_TOTAL, 3871-3873, 3965), not tab-weighted. 16 sections total, matches counts by data-tab in source (2 + 3 + 4 + 2 + 1 + 1 + 3).
- Masthead spectrum gradient order (line 88) is fox → else → dceu → dcu → mcu → ssu; ends are the two furthest-apart hues in OKLab per the annotation. Under the Marvel v DC lens, both the masthead rule and the read line collapse to red / blue via one --spectrum token (198-199).
- Mobile forms preserve findings: split's overseas-share vs total-gross switch, ensemble's ranked-with-fold, roster's fold to `>= ROSTER_MIN`.
