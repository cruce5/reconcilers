# LEDGER · data integrity

I ran a receipt on every derived cell in `web.json`, spot-checked ten films against Box Office Mojo, walked every hand-typed dollar in the prose past the source, and re-scored the summary table against §14's own rules; the arithmetic is clean, the scrape ties out to the dollar, and there is exactly one place a live filter has drifted from the rule the page publishes for it.

## Findings

### Major

1. **§13 summary table computes Med. ROI over every film, ignoring the `final` filter §14 promises.**
   - Where: `src/index.html:2391`, `fmtX(med(fs, function (f) { return f.roi; }))`, contrast with the sibling rows on lines 2388 and 2389 which do filter to `f.final`.
   - Evidence: with Spider-Man: Brand New Day (in-release, roi = 10.72) included, the "All 91 films" row prints Med. ROI 3.38x; filtered to final it is 3.36x. The MCU row prints 3.92x; filtered to final it is 3.84x. §14 line 1186 lists "the ROI ranking" among the things in-release films must be held out of.
   - Fix: `med(fs.filter(function (f) { return f.final; }), function (f) { return f.roi; })`.

### Minor

2. **`data/budget-overrides.json` lists Superman, but the enrich step does not treat it as an estimate.**
   - Where: `data/budget-overrides.json:31` (Superman: 225000000, source noted as "Wikipedia infobox, $225M") vs. `scripts/enrich-wikipedia.mjs:127` which only marks a film estimated if the override changes the value.
   - Evidence: BOM already carries $225M for Superman (`data/scraped.json` superman-2025 record, and the film's page: https://www.boxofficemojo.com/title/tt5950044/). The override entry is a no-op; the override file's own header says "Every entry here is budget_estimated:true", so the two disagree on whether Superman's $225M is a filed/BOM number or a Wikipedia estimate. Wikipedia's current infobox is $225M, so the number itself is fine.
   - Fix: drop the Superman entry from `budgets` (BOM has it), or, if the intent is to declare it an estimate regardless, `f.budget_estimated = true` unconditionally for any title listed in the overrides file.

3. **The static `#h-scatter` H3 mixes the two lenses' phrasing.**
   - Where: `src/index.html:796`, `<h3 id="h-scatter">Marvel has cleared $1 billion twelve times. DC four times, Fox and Sony never</h3>`.
   - Evidence: the default (universe) render at line 3631 writes "Marvel Studios has cleared…"; the brand-lens render at 3627 writes "Marvel has cleared…" and omits the Fox/Sony tail. The static text is the brand-lens phrasing with the universe-lens tail glued on. Tie-out passes only because MCU $1B count equals the Marvel-brand $1B count today (both are 12; Fox and SSU each stand at 0). If any Fox or SSU film clears $1B, the two counts diverge and the static text becomes wrong until JS runs.
   - Fix: write the static text to match the default render, "Marvel Studios has cleared $1 billion twelve times. DC four times, Fox and Sony never", so the pre-JS state matches what mounts.

4. **§15 fold-out narrative says the tie-out watches twenty claims (or "went from twenty to thirty").**
   - Where: `src/index.html:1263` ("recomputes twenty claims") and `src/index.html:1315` ("the tie-out went from twenty claims to thirty").
   - Evidence: `node scripts/tie-out.mjs` reports "tie-out OK, 31 claims verified against 91 films". CLAIMS in `scripts/tie-out.mjs` counts 31 entries.
   - Fix: it is a build-log narrative and describes a moment in time, but if you want it to age with the code, replace the trailing count with a placeholder that CLAIMS.length rewrites on build, or add a tie-out claim that gates the exact wording.

## Suspected, not verified

- Spider-Man: Brand New Day carries `ww = $2.408B`, `wd = $923M`, `open = $360M`, all as of `verified_at: 2026-09-07`, five weeks after a `2026-07-31` opening. That would put it ahead of Infinity War's five-week domestic and inside striking distance of Endgame's worldwide, faster than any film has ever cleared that pace. Internally the number is consistent (wd + wi = ww to the dollar, mult, pctIntl, roi all match). I did not fetch the BOM page to confirm this scrape; if the number came off the page as-is it is correct as reported and out of scope for this audit; if it was hand-set at any layer it is worth a second look. Either way, its non-final status pulls it out of every ranking chart, so the impact on the site's headlines is contained.
- Aquaman is listed with `budget = $160M`, the lower bound of Wikipedia's "$160 to 200 million" range, per `budget-overrides.json` rule. BOM's title page does not carry a budget for it. The rule is declared and consistent; the choice of the lower bound is a policy call, not an error.

## Checked clean

- Derived fields for all 91 films tie out: `ww = wd + wi` to the dollar, `pctDom` and `pctIntl` match `wd/ww` and `wi/ww`, `mult = wd/open`, `roi = ww/budget`, and every `r*` column matches `toReal2025(nominal, year)` to within one dollar of rounding. No `open > wd`, no `wd > ww`, no `budget > 3 * ww`.
- CPI-U covers every release year 2000 through 2026. The 2008 to 2009 dip (215.303 to 214.537) is real deflation, not a bug; every other adjacent pair is monotone. `dist` renders use `val(f, key)` which honors `STATE.money`, so `open`, `wd`, `wi`, `ww`, and `budget` all switch to their `r*` twin in 2025-dollar mode.
- Spot-check of ten films against Box Office Mojo, all matched to the dollar on ww / wd / wi / open: Spider-Man (2002 tt0145487), Batman Begins (2005 tt0372784), The Avengers (2012 tt0848228), X-Men: Days of Future Past (2014 tt1877832), Guardians of the Galaxy (2014 tt2015381), Aquaman (2018 tt1477834), The Marvels (2023 tt10676048), Deadpool & Wolverine (2024 tt6263850), Venom: The Last Dance (2024 tt16366836), Superman (2025 tt5950044).
- Budget spot-checks vs Wikipedia: The Marvels ($307.3M net, matches override), Deadpool & Wolverine ($429M net of tax credits, matches override; BOM shows $537M all-in, page's own rule prefers the net filing), Aquaman ($160 to 200M range, lower bound, matches override rule), Superman ($225M, matches Wikipedia infobox and BOM).
- The six non-Fri/Sat release dates are all legitimate holiday openings that Wikipedia and BOM confirm: Spider-Man 2 (Wed 2004-06-30, July 4 play), Batman Begins (Wed 2005-06-15), The Amazing Spider-Man (Tue 2012-07-03, July 4 play), Spider-Man: Far From Home (Tue 2019-07-02, July 4 play), Aquaman and the Lost Kingdom (Wed 2023-12-20, Christmas play), Madame Web (Wed 2024-02-14, Valentine's play).
- `final` flag: 1 non-final film (Spider-Man: Brand New Day, released 39 days before today's `2026-09-08`), correctly held out of the reviews scatter (`src/index.html:2897`, `f.rt != null && f.final`), the legs chart (`src/index.html:2822`, `f.mult != null && f.final`), the top-15 ROI ranking (`src/index.html:3480`, `f.roi != null && f.final`), and the profit chart (`src/index.html:2731`). No stale finals, no missed non-finals given the run lengths in this dataset. The tie-out claim "in-release films are held out of the reviews scatter and the legs chart" continues to hold.
- `meta.held_out` (Doomsday, Clayface) is documented in-page: the small-print at `src/index.html:1804` writes them in from `DB.meta.held_out`, and Clayface's `2026-09-11` date is three days after today so its held-out status is correct.
- Estimated budgets: 30 of 91 films (33.0%), none before 2010 (earliest is The Amazing Spider-Man 2, 2014-05-02), 24 of 30 films released since 2021 are estimates (80%, "four in five" holds). §14's "four recent Marvel Studios films, $307M to $429M" is exact: The Marvels ($307.3M), Ant-Man and the Wasp: Quantumania ($330.1M), Doctor Strange in the Multiverse of Madness ($350.6M), Deadpool & Wolverine ($429M).
- §14 headline arithmetic: MCU total $34.914B, DC (DCEU+DCU+Elseworlds) total $12.487B, ratio 2.80x with Brand New Day and 2.60x without, matching the "reads 2.60 rather than 2.80" line at `src/index.html:1186`.
- Every prose figure I re-ran matched the data: $6.82B / $6.76B (2018, 2019 year totals), $2.50B (2023 total), $1.94B (2025 total), Aquaman $1.15B, 10 Marvel films above Aquaman, seven $1B films in 2018 + 2019, $110M rolling-5 median (2002), $200M rolling-5 median (2021), X-Men $75M, Endgame $356M and Infinity War $350M, The Marvels widest miss at -$562M, Endgame widest hit at +$1.91B, Joker $55M / roi 19.62x ("nearly 20x"), $9.0M gross per RT critic point (n=90, r=0.484), top RT quartile median WW / bottom quartile median WW = 2.52x ("roughly two and a half to one"), overseas split 43% to 75%, Supergirl / Superman / Daredevil at 43% overseas and Venom at 75%, brand-lens totals $48.37B across 68 vs $12.49B across 23, lens ratio 3.87x, MCU vs DCEU average ratio 1.91x, Aquaman legs 4.94x, Folie à Deux legs 1.55x.
- Summary table (§13 above the ledger) recomputed for the "All 91 films" row: films 91, total $60.85B, Med. WW $618.7M, Med. open (final) $86.9M, Med. mult (final) 2.56x, Med. budget $175M, Med. RT 77%, Med. MC 61. All match the code's calls; only Med. ROI carries the filter bug flagged above.
- Palette check (`scripts/check-palette.mjs`) runs at build time and is out of my lane, but the six universes render distinguishable in the data and the ledger is not colouring anything I can trip.

## Worth adding to tie-out.mjs

The prose block-by-block matches today, but a good half of these numbers live only in the prose and would drift silently the next time the data refreshes. Adding claims for them costs a line each and closes the gap:

- **§01 year note trend**: the "$3.86B rebound" (mean of 2021 and 2022 year totals), "$2.50B" (2023 year total), "$1.94B" (latest year total, currently 2025). Pattern: recompute yearGross[y] for each year in the prose and grab the string.
- **§02 treemap dek**: "Aquaman at $1.15B" and "ten separate Marvel films" above it. Both are trivially derivable from `F` and would catch a future re-rank.
- **§03 bee dek**: "seven billion-dollar films" for 2018 + 2019 combined.
- **§05 budget dek**: the rolling-5 medians at 2002 and 2021 (both $110M / $200M today), the first X-Men budget ($75M) and year (2000), and the two largest budgets on the page (Endgame $356M, Infinity War $350M).
- **§06 profit dek**: Joker budget ($55M) and its "nearly 20x" ROI. The widest-miss and widest-hit dollar figures are already covered.
- **§08 reviews dek**: "$9M of worldwide gross per point of critic score" (recompute a simple linear regression on `rt` vs `ww` over final films) and "roughly two and a half to one" (top-quartile median WW / bottom-quartile median WW).
- **§09 split dek**: the three "most domestic" names (Supergirl, Superman, Daredevil) and the "furthest-traveled" name (Venom), plus their pctIntl values. Also a claim that the min and max pctIntl round to the same numbers named in the headline.
- **§12 antipatterns dek**: the "1.9x" real MCU-vs-DCEU ratio (`mean(MCU.ww) / mean(DCEU.ww)`).
- **§14 sources**: "four recent Marvel Studios films, $307M to $429M" (count the overrides that carry a "UK filing" or "Disney filing" note, min/max of their values) and "four in five since 2021" (share of budgetEst among films released 2021 or later).
- **§14 definitions**: "the Marvel-to-DC ratio reads 2.60 rather than 2.80" with `sum(MCU.ww) / sum(DC.ww)` and its non-Brand-New-Day counterpart, both to two decimals.
- **Summary table Med. ROI final-only guard**: once Finding #1 is fixed, add a claim that the `renderSummary` string in `src/index.html` includes `med(fs.filter(function (f) { return f.final; }), function (f) { return f.roi; })` (or, equivalently, a fixture that recomputes the "All films" Med. ROI and matches the rendered value from a smoke-tested run of `renderSummary`). This is the sibling of the existing "reviews scatter and legs chart" filter claim, and would have caught the current drift.
- **§15 build-log counts**: the two "twenty claims" strings and the "twenty to thirty" one, tied to `CLAIMS.length` (either freeze the historical numbers as narrative or gate them to today's count).
