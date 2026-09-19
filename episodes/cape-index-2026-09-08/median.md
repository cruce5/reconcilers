# MEDIAN · statistics

*Meld left a map with n on every road. Read that first. The five that follow are what the data does not yet forgive.*

Read-only pass against `data/web.json` (91 films, generated 2026-09-08). Recomputed every hand-typed and JS-emitted number outside the 30 claims `scripts/tie-out.mjs` already gates. MIN_N=4 verified in six places; means-vs-medians rule respected in the scorecards; §08 r=0.484 and §06 dek confirmed. The findings below are what still moves under a check.

## Critical

**1. §03 dek renders "one to seven films a year," not "four to seven."**
Static (`src/index.html:772`): *"Since 2021 the count has held up, four to seven films a year"*
JS overwrite (`src/index.html:3612-3619` in `renderClubCopy`):
```js
FILMS.filter(f => yearOf(f) >= 2021 && f.final)
     .forEach(f => { perYear[yearOf(f)] = (perYear[yearOf(f)] || 0) + 1; });
var counts = Object.keys(perYear).map(y => perYear[y]);
// ... num(Math.min(...counts)) + " to " + num(Math.max(...counts)) + " films a year"
```
Recomputed: perYear = {2021:6, 2022:6, 2023:7, 2024:5, 2025:4, **2026:1**}. Min=1, max=7. The rendered sentence at runtime is *"one to seven films a year"* — because Supergirl (marked `final:true`, 2026-06-26) counts and Brand New Day (`final:false`) is filtered out, so a mid-year 2026 contributes a spurious "1." That is exactly the small-n edge the copy set out to smooth over.

Fix: exclude the current partial year the same way `n-year` does (`done` = years whose every film is final; 2026 has an in-release film and drops out). Rendered sentence then becomes *"four to seven films a year"* — matching the static text.

## Major

**2. §05 dek claims the two biggest budgets are Endgame and Infinity War. They're not.**
Static (`src/index.html:821`): *"the two biggest budgets on the page are Avengers: Endgame at $356M and Avengers: Infinity War at $350M"*
Recomputed top-two by budget across all 91 films:
- Deadpool & Wolverine — $429M (est.)
- Avengers: Endgame — $356M
- Doctor Strange in the Multiverse of Madness — $350.6M (est.)
- Avengers: Infinity War — $350M
The JS overwrite at `src/index.html:2653-2659` in `renderBudgetCopy` picks `top2 = byB.slice(0, 2)` from budget descending and correctly renders *"Deadpool & Wolverine at $429M and Avengers: Endgame at $356M"* at runtime, so a JS-enabled reader sees the truth. The no-JS fallback and the source an editor reads still says Endgame/Infinity War. Fix the static to match, or add both to `scripts/tie-out.mjs`.

**3. §05 headline plateau is $180M in the rendered chart, $200M in the static — and the visual plateau is $200M.**
Static (`src/index.html:820`): *"Production budgets roughly doubled over the 2000s, then flattened near $200M"*
JS overwrite (`src/index.html:2637-2639`): `flattened near " + usd(last.med)`
Recomputed rolling median (5-yr window, MIN_N=4):
- 2021: $200M (n=28)
- 2022: $200M (n=27)
- 2023: $200M (n=28)
- 2024: $200M (n=24)
- 2025: $200M (n=18)
- 2026: **$180M (n=11)**
Runtime headline: *"flattened near $180M."* The chart's own design note warns *"the curve's ends lean on a shorter window"* — the headline is now reading off that shorter window and calling the plateau by its edge point. The 2021–2025 plateau is $200M solid; only the truncated 2026 window drops.

Fix: pick the last window whose n meets a stability floor (e.g. take `last` = the most recent `roll` entry with `n >= 20`), or write *"flattened near $200M"* from that plateau. Static text is also arguably wrong at $200M given the last data point, but at least matches the visible plateau; either way the two should agree with the chart.

## Minor

**4. §13 summary table's Med. ROI leaks in-release films; §14 says it shouldn't.**
`src/index.html:2391` computes `fmtX(med(fs, function (f) { return f.roi; }))` without `.filter(f => f.final)`. §14 (`src/index.html:1186`): *"held out of anything that needs a finished number (profit, break-even, the ROI ranking, the reviews scatter, the legs chart, and the ledger's opening and multiplier medians)."*
Recomputed MCU row: Med. ROI includes Brand New Day (roi=10.7) and reads **3.92**; final-only reads **3.84**. Not a story-changing delta — the sentence still holds — but the summary table announces itself as running on the same rule as the rest of the ledger, and Med. ROI is the one column that quietly doesn't.

Fix: apply `f.final` to the ROI cell the same way opening and multiplier already do (`src/index.html:2388-2389`). Med. RT / MC follow the same argument but move by <0.5 pp and round to the same integer today — worth filtering for consistency, not for the number.

**5. §01 box-plot data table shows Min/Q1/Median/Q3/Max for DCU (n=2). Chart mutes it, table doesn't.**
`src/index.html:2005-2009` writes all five quantiles for every universe regardless of n. The visual side (line 1983) correctly falls back to a median tick plus dots below MIN_N; the accessibility table — the "accessibility backbone" per §13 — publishes a 25th and 75th percentile of two numbers as if they carried the same weight. The design note at `src/index.html:733` promises *"any group under four films gets dots and a median tick only; a quartile box on a handful of films is theater."* The table should mirror the chart's honesty.

Fix: for groups with `a.length < MIN_N`, print `min` and `max` for the two-film group and dash out `25th / Median / 75th`, or tag the row with an `n=2, midpoint` flag the way the summary table already does (line 2399).

## Checked clean

| Where | Claim | My number | Delta |
|---|---|---|---|
| §01 h3 | "nearly three to one" | MCU/DC = 2.796 | ratioPhrase → "nearly three to one" ✓ |
| §01 h3 brand lens | (JS: ratioPhrase(3.87)) | Marvel-3 / DC = 3.87 | → "nearly four to one" ✓ |
| §01 n-year | 2018/2019 peaks $6.82B and $6.76B | $6.82B and $6.76B | ✓ (both tied) |
| §01 n-year | "2021–22 rebound stopped around $3.86B" | avg(3.81, 3.91) = 3.86 | ✓ |
| §01 n-year | "2023 onward slid from $2.50B to $1.94B" | 2023–25: 2.50/2.19/1.94 | ✓ (2026 correctly excluded via `done`) |
| §01 n-year | "roughly a third of the peak" | 2.21/6.82 = 0.324 | fracWord → "a third" ✓ |
| §01 d-scorecard | median DC completed profit ≈ +$1M | median = $1M (mean = $97M) | ✓ (the mean/median gap the log warns about) |
| §01 n-box | "seven of every ten DC films" | 16/23 DC below MCU median = 69.6% | round → 7 ✓ |
| §01 n-box (brand lens) | (JS re-writes) | 13/23 below Marvel-3 median = 56.5% | round → 6 ✓ (lens-adaptive) |
| §02 dek | Aquaman ceiling $1.15B, ten Marvel above | Aquaman $1.15B, 10 Marvel > it | ✓ |
| §03 dek | 2018-19 had "seven billion-dollar films between them" | 7 | ✓ |
| §04 dek | four DC $1B (Aquaman, Joker, TDK, TDKR) | 4, exactly those | ✓ |
| §05 dek | $110M in 2002, $200M by 2021 | 2002=$110M, 2021=$200M | ✓ |
| §05 dek | X-Men $75M in 2000 | $75M | ✓ |
| §06 h3 | "A third of these films never cleared break-even" | 31/90 completed = 34% | ✓ |
| §06 dek | Marvels –$562M, Endgame +$1.91B, Joker nearly 20× on $55M | –$562M, +$1.91B, 19.62×, $55M | ✓ (all JS-generated) |
| §07 dek | Aquaman 4.9×, Folie 1.5× | 4.94, 1.55 | ✓ (tied) |
| §08 h3/dek | ~$9M/pt, r=0.48, best-quarter ~2.5× worst | slope=$9.03M/pt, r=0.484, ratio 2.52 | ✓ |
| §08 anti-pattern | R² ≈ 0.23, survives dropping top 10 | r²=0.234; r=0.490 after top-10 drop | ✓ |
| §09 dek | Supergirl/Superman/Daredevil at 43%, Venom 75% | 42.7/42.8/42.8 → 43; 75.1 → 75 | ✓ (tied via bounds) |
| §11 dek | Iron Man/Prof X/Wolverine at 10; three at 9; Batman at 8 tops DC | exactly | ✓ |
| §12 apTrunc | fake 3.6×, real 1.9× | (918.8-310)/(480.8-310) = 3.56; 918.8/480.8 = 1.91 | ✓ |
| §14 | "four in five since 2021" est. | 24/30 = 80% | ✓ |
| §14 | studio filings $307M to $429M for four MCU films | Deadpool 429 / DrS2 350.6 / A-M3 330.1 / Marvels 307.3 | ✓ (range holds; note: those four are still `budgetEst:true` in `web.json` — Ledger's yard) |
| §14 ratio-pair | 2.60 without in-release, 2.80 with | 2.6033, 2.7961 | ✓ (tied) |
| §15 log | brand-lens ratio "2.80× to 3.87×" | 2.7961, 3.8734 | ✓ |
| §15 log | Marvel v DC totals "$48.4B across 68 vs $12.5B across 23" | $48.37B/68, $12.49B/23 | ✓ |
| MIN_N | one constant, ≥6 references | 6 refs at 1513/1837/1842/1983/2397/2678 | ✓ |
| Scorecard median row | muted under MIN_N | DCU (n=2) muted at line 1837 | ✓ |
| Box plot | boxes only when n ≥ MIN_N | line 1983 falls back to tick+dots | ✓ (chart only; see finding 5 for the table) |
| §05 rolling median | window ±2 years, MIN_N=4 | line 2678 skips <4 | ✓ |
| Anti-pattern radar | (deliberate anti-pattern; MIN_N not applied) | DCU n=2 across six metrics | intentional context |
| 2025 $ base-invariance | multiplier `open`→`mult` unchanged in real mode | `f.mult` computed from wd/open in derive.mjs; both scale together | ✓ |

## Worth adding to `scripts/tie-out.mjs`

1. §05 dek "two biggest budgets" — pin the top-two by `budget` descending, both names and both dollar figures, so a Deadpool-sized outlier can't stealth past the editor read. Add both `nominal` and `real` variants (real-dollar top-two moves).
2. §03 dek "N to M films a year since 2021" — assert the min/max are computed against complete years (exclude the current in-progress year the way the year-card does). Ties out the fix in Finding 1.
3. §05 h3 "flattened near $X" — assert `X` comes from a stable window (n ≥ 20), not from the last edge point that MIN_N alone lets through.
4. §13 summary table — assert Med. ROI (and, if you want to be strict, Med. RT / Med. MC) filter to `f.final`, matching the §14 rule the way opening and multiplier already do.
5. §01 box plot data table — assert that rows with `n < MIN_N` publish only `min`/`max` and blank the quartiles, mirroring the chart's own muting.
