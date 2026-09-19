# The Reconcilers · The Cape Index Cover-Up! · 2026-09-08

Eight heroes, one villain, all Opus 4.7. Meld's map: `context.md`. Per-hero reports: `ledger.md · doppel.md · median.md · chartjunk.md · thumb.md · greyscale.md · redline.md · payload.md`. Doctor Missedit's verdicts: `missedit.md` (arrives next).

Raw findings across the eight: 65. Deduplicated (with corroboration counts): 55. Verified in source or data by the compiler before ranking: 8 of the top ten (marked **✓ verified**).

## Critical

1. **§12 radar's Avg-profit spoke is silently NaN; all six universes render at the same radius.** ✓ verified. `src/index.html:3501` reads `x.profit`, a field `data/web.json` does not carry (fields are `t u date wd wi ww open ropen final rd ri rw budget budgetEst rbudget rt mc imdb pctDom pctIntl mult roi`; `build-web.mjs` never emits `profit`). The teardown claims "reorder the axes and the winner changes"; one axis literally cannot. One-line fix: `profitOf(x)`. **Chartjunk.**
2. **Kraglin credited in 1 film, should be at least 4.** ✓ verified. `data/cast-overrides.json:133` adds Sean Gunn for Love and Thunder; `data/cast-raw.json` records `fromOverride:true`; the row drops at canonicalization because `scripts/scrape-cast.mjs` CANON has `"Kraglin"` but not `"Kraglin Obfonteri"`. Vol. 1 and Vol. 2 also missing (scraper cap). **Doppel.**
3. **Thanos missing from Guardians of the Galaxy (2014) and Age of Ultron.** Both Brolin, both speaking, both flagged as reprisals in Wikipedia's Cast section. Current row shows only IW / Endgame. **Doppel.**
4. **Doctor Strange missing from Thor: Ragnarok.** Wikipedia calls it a "brief appearance" (speaks). Parser missed the "Additionally, ..." tail paragraph. **Doppel.**
5. **§03 dek runtime reads "one to seven films a year" instead of "four to seven".** Corroborated by Median + Redline. `renderClubCopy` (`src/index.html:3617`) counts `f.final` per year since 2021, and 2026 has only Supergirl (Brand New Day held out), so the current partial year contributes a spurious "1". Fix: exclude the current in-progress year the way the `n-year` card already does. **Median + Redline.**
6. **§02 static dek hard-codes "Aquaman at $1.15B" and "ten separate Marvel films".** ✓ verified. Falsified by the 2025$ toggle (DC ceiling becomes TDKR $1.52B, above only nine Marvel films). Same class §15 records as fixed for §02/§04 headlines; this static dek was missed. **Redline.**
7. **Contents pill and deep links (`#v-data`, `#v-roster`, `#v-method`) land at the masthead, not the section.** ✓ verified in source. `goToHash` calls `scrollIntoView` immediately after un-hiding the target tab; the smooth-scroll misses on the newly-laid-out section. **Thumb (pane fronted).**
8. **Filter, lens and 2025$ state do not survive a reload.** Only theme and notes persist to localStorage. **Thumb (pane fronted).**

## Major, corroborated by two or more lanes

9. **§13 summary table's Med. ROI does not filter to `f.final`; §14 promises the ROI ranking holds in-release films out.** ✓ verified. `src/index.html:2390` reads `f.roi` unfiltered while adjacent lines 2388–89 filter opening and multiplier to `f.final`. MCU row prints 3.92× vs the correct 3.84×; all-films row 3.38× vs 3.36×. **Ledger + Median.**
10. **§05 static dek names the top-two budgets as Endgame ($356M) and Infinity War ($350M).** Data now says Deadpool & Wolverine is #1 at $429M, Endgame #2 at $356M. `renderBudgetCopy` overwrites at runtime; the no-JS fallback and the editor-facing source are wrong. **Median + Redline.**
11. **§16 (Reconcilers) copy issues: the headline calls Meld an auditor (Context lane); the dek states the Doctor's fix mismatches backwards.** **Redline** (Chartjunk agrees Meld is Context, not an audit lane).

## Major, single lane (verified where the report cites a line)

12. **Light-theme treemap MCU cells fail WCAG AA on the value labels.** ✓ verified. Raw 3.42:1; blended over surface at 0.88 alpha ≈ 4.37:1. Source comment at `src/index.html:111` claims the color was darkened specifically to clear AA. It doesn't. **Greyscale.**
13. **§05 headline renders "flattened near $180M".** The 2026 rolling window (n=11) has dropped below the 2021–2025 plateau ($200M, n≥27). Fix: pull the last stable point (n ≥ 20). **Median.**
14. **"Yukio" is two different characters merged into one row.** Rila Fukushima's Wolverine-era Yukio and Shioli Kutsuna's Deadpool-era Yukio; Wikipedia flags them as distinct. Also missing Deadpool 2 from Kutsuna. **Doppel.**
15. **Hulk and Captain Marvel missing from Shang-Chi's mid-credits scene** (Ruffalo and Larson, both speak). **Doppel.**
16. **Scraper cast cap (~12–20 entries per film) is the root cause of most of the roster misses.** **Doppel.**
17. **§05 rolling-median endpoint label is the only in-chart callout on the page without the HALO stroke.** `src/index.html:2704`. **Chartjunk.**
18. **Filter panel eats 64% of a landscape phone viewport** (241px on 812×375; 399px on 375×812). **Thumb.**
19. **Sorting a ledger column resets horizontal scroll to zero**, throwing you off the columns you were reading. **Thumb.**
20. **Chart marks have no touch equivalent** (tooltip content populates but computed opacity stays 0 under `(hover:none)`; Thumb marks: JS-dispatched, could not confirm real touch because pane went hidden). **Thumb.**
21. **Three label headlines**: §13 ("The whole thing, sortable"), §14 ("How this was built"), §15 ("How this actually went"). "16 findings, 7 tabs" summary miscounts by three. **Redline.**
22. **Static h3s in §01 and §04 don't match their default-mode generator output.** **Redline.**
23. **"Group" leaks into the §01 box-plot note** (universe everywhere else); tab strip labels differ from act headers ("The mistakes" vs "The tempting mistakes"). **Redline.**
24. **OKLab and deuteranopia introduced inside §15 folds without a gloss.** **Redline.**

## Minor batch (35)

- **Ledger**: Superman $225M override is a no-op (BOM has the same number, `budget_estimated:true` never fires); §04 static `<h3>` uses brand-lens phrasing that only passes because Fox and SSU sit at zero today; §15 narrative still says "twenty claims" (now 31).
- **Doppel**: The Batman (2022) sits in Elseworlds without a theatrical sequel (see decisions); DCEU/DCU Supergirl merge is arguable given other continuity-crossing dual identities are split.
- **Median**: §01 box-plot data table publishes Q1/median/Q3 for DCU (n=2) although the chart mutes it to a median tick and dots.
- **Chartjunk**: beeswarm floor clamps small bubbles below 2% of maxWW to identical size (comment-only); reviews' two static axis-median blocks can erase marks if data shifts; apDual paints series in DCEU-blue and MCU-green (universe tokens carrying series-identity meaning); apCumul's top-right label lands on the topmost rising edge.
- **Greyscale**: main ledger table has no caption/aria-label (summary table beside it does); fourteen "Show data" toggles share the same accessible name; `<summary>` elements not covered by the site's `:focus-visible` rule (UA default paints); byline link 75×18 at 375px (inline-text exception likely applies).
- **Redline**: meta description still says "franchise" not "multi-film continuity"; masthead "any figure switches to 2025 dollars" is passive; §16 "78 things" should be "78 findings"; hedges in §05 headline and §08 dek preserved on the "hedge is carrying the truth" rule; house rules on em dashes, `&sect;`, curly quotes, en dashes: all clean.
- **Thumb**: spectrum bar unlabeled; tab-strip fade is right-only; intro-prose Design notes / Marvel v DC touching at 0 gap; sub-44 tap targets (byline, footer links, details summaries); contents rows 4px apart; cross-tab jump doesn't reveal tab-strip context.
- **Payload**: `/index.html` returns 307 not 308 (Wrangler default); `http://www.capeindex.com/` takes two hops; 404 responses ship `Content-Type: text/html` without charset; `robots.txt` and `sitemap.xml` revalidate every hit; `web-cast.json` at 67 KB has ~10–15 KB of pre-compression waste from film-title key duplication.

## Decisions for the owner

- **Radar (#1) fix mechanism**: use `profitOf(x)` in-place (simpler; keeps `web.json` slim) or emit `profit` from `build-web.mjs` and update `check` scripts.
- **The Batman (2022)** in Elseworlds: no theatrical sequel yet. Keep on the "banner DC now uses for standalones" logic, or move to a holdout until one lands.
- **Supergirl** as one character split across DCEU (2026) and DCU (2026): consistent with other continuity crossings (Batman is one row across three), but the split's mantle rule would say two rows. Owner's call.
- **Static-vs-generated deks (#6, #10, #22)**: either generate every dek that a toggle can move, or gate the static forms with a build check that fails when the runtime string diverges. The second is cheaper.

## Not counted

- Thumb's touch-tooltip finding (#20 tail) was measured with the pane hidden midway. The mechanism is plausible (`(hover:none)` gate on the CSS `:hover` opacity), but real-touch confirmation didn't run. Kept as Major with the caveat; flag for the villain.
- Thumb's Brand New Day scrape being internally consistent but unprecedented in pace: filed by Ledger as "Suspected, not verified"; kept out of the ranking.

## Counts

- Raw findings across eight reports: **65**
- Deduplicated: **55**
- Critical: **8** (three corroborated across lanes)
- Major: **13**
- Minor: **34**
- Verified in source or data by the compiler: **8 of the top ten**
- Lanes reporting: **8 of 8**. Meld's map: 1.

Full per-hero reports in this directory. Doctor Missedit's verdicts arriving next.
