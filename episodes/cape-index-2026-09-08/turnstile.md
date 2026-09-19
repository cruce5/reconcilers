TURNSTILE · Box-office conventions

*Ten years of Monday mornings taught me one question, and I asked it of every number here: was it measured the same way as the number it sits beside?*

Scope of this pass: all 91 films in `data/films.json`, the cached BOM title pages in `data/raw/title-<tt>.html`, the Wikipedia cache `data/raw/wiki-*.txt`, and nine targeted Box Office Mojo lookups (one release-group page for The Avengers, four release-group pages and five daily pages for the mid-week openers). Nothing was edited, rebuilt or re-scraped. Nothing below repeats a finding from the 2026-09-08 reports or anything §15 records as fixed.

## Critical

None.

## Major

### 1. §07 ranks mid-week openers on a different window, and they hold four of its top six places

- **Where:** `data/web.json` > `mult` for Spider-Man 2, Batman Begins, The Amazing Spider-Man, Spider-Man: Far From Home and Madame Web. `data/films.json` > `<film>.box_office.opening_weekend_domestic` is BOM's "Domestic Opening" (`scripts/lib-bom.mjs:125`). The ranking is sorted at `src/index.html:3176`, shown in the §13 `Mult.` column (`src/index.html:2697`), and fed into the §13 `Med. mult.` summary (`src/index.html:2718`).
- **Trade convention:** "Opening weekend" means Friday to Sunday. When a film opens on a Tuesday or Wednesday, the days before that Friday count toward its lifetime total but not toward its opening. Divide one by the other and the multiplier comes out too high. Comparing like with like means using the cumulative gross through the first Sunday.
- **What the site does:** It divides lifetime domestic by the three-day figure for every film. I confirmed the windows against the BOM daily pages. Each three-day figure is exactly Friday plus Saturday plus Sunday. For example, Far From Home's $92,579,212 is $32,680,863 + $34,222,790 + $25,675,559, and Madame Web's $15,335,860 is $4,284,961 + $6,401,225 + $4,649,674.

| Film | Opened | Mult. now | §07 rank now | Through first Sunday (BOM daily) | Like-for-like mult. | Rank |
|---|---|---|---|---|---|---|
| Spider-Man 2 | Wed 2004-06-30 | 4.25x | 3 | $152,411,751 (5 days) | 2.46x | 52 |
| Batman Begins | Wed 2005-06-15 | 4.24x | 4 | $72,896,986 (5 days) | 2.84x | 21 |
| The Amazing Spider-Man | Tue 2012-07-03 | 4.24x | 5 | $137,022,258 (6 days incl. Mon previews) | 1.92x | 84 |
| Spider-Man: Far From Home | Tue 2019-07-02 | 4.23x | 6 | $185,063,062 (6 days) | 2.11x | 78 |
| Madame Web | Wed 2024-02-14 | 2.86x | 25 | $23,540,479 (5 days) | 1.86x | 88 of 90 |

- **What it moves on the page:** The desktop chart shows 12 rows before the fold (`src/index.html:3181`), and four of them are this artifact. The film ranked 7th today (Wonder Woman, 4.00x) is really third. In §13's summary table, the median multiplier moves from 2.55x to 2.34x for SSU, 3.08x to 2.81x for Elseworlds and 2.63x to 2.57x for MCU. Fox, DCEU and DCU do not change. Both examples in the §07 dek (`src/index.html:1082`) still hold on the corrected window: Aquaman stays top at 4.9x and Joker: Folie à Deux stays bottom at 1.5x. The page never tells the reader about this. The §07 Watch-for (`src/index.html:1095`) warns only about platform releases.
- **Fix:** For non-Friday openers, carry an opening through the first Sunday (or at least flag them) and use it in `mult`, or footnote those five rows in §07 and §13.

### 2. §06's widest miss compares a filed actual cost with press-release budgets

- **Where:** `data/budget-overrides.json` > `note` and `sources`. `data/films.json` > `budget` and `budget_estimated`. The §06 dek generator is at `src/index.html:4068` to `4078` and the static dek at `src/index.html:1058`. The §05 "two biggest budgets" line is at `src/index.html:3013`.
- **Trade convention:** A studio's filed production cost, net of rebates, usually comes in well above the figure the trade press printed before release. Setting one against the other decides who "lost money".
- **Budget regimes by universe** (filed actual net of rebates / filed gross / BOM figure / pre-release press figure / low end of a range):

| Universe | Filed net | Filed gross | BOM | Press figure | Range, low end |
|---|---|---|---|---|---|
| MCU (38) | 6 | 0 | 25 | 6 | 1 |
| DCEU (15) | 0 | 0 | 7 | 4 | 4 |
| SSU (13) | 0 | 0 | 7 | 5 | 1 |
| Fox (17) | 0 | 0 | 16 | 1 | 0 |
| Elseworlds (6) | 0 | 0 | 5 | 1 | 0 |
| DCU (2) | 0 | 0 | 1 | 0 | 1 |

The six filed-net films are Deadpool & Wolverine, Multiverse of Madness, Quantumania, The Marvels, Black Widow and Eternals. That makes six rather than four, per the override note's own "six MCU films" (see Minor 5). No DC or Sony film is on a filed figure.
- **What the site does:** It ranks the six filed MCU costs against DCEU and SSU press figures. The override note says the six sat at $200M pre-release figures until 2026-09-08, which gives the same-regime comparison directly.
- **Recompute with the six at $200M:** No profit verdict flips. It is still 31 losses among 90 finished films (34.4%), so the §06 h3 "A third of these films never cleared their break-even point" (`src/index.html:1057`) holds. **The dek does move.** "The Marvels is the widest miss at -$562M" becomes Wonder Woman 1984 at -$330M, and The Marvels drops to third at -$294M. Today the three widest misses on the chart (The Marvels -$562M, Quantumania -$349M, Black Widow -$341M) are all filed-net films. §05 also names Deadpool & Wolverine ($429M) as the biggest budget on the page. That holds only because a filed cost is ranked against BOM and press figures. On its old $200M figure, Endgame ($356M) and Infinity War ($350M) lead. §05's rolling median is unaffected: the plateau is $200M either way.
- **Fix:** Say in the §06 dek (and at §05's "two biggest") that the named film is on a filed net cost while most of its peers are on press figures, or mark the filed-cost rows in §06 and §13.

### 3. §06 ranks day-and-date streaming releases against theatrical-only runs without a note

- **Where:** `data/films.json` > `Black Widow`, `Wonder Woman 1984` and `The Suicide Squad` (`.box_office.worldwide`, `.budget`). §06 chart and dek at `src/index.html:1053` to `1075`.
- **Evidence they were day-and-date:** Black Widow's BOM page carries a "Streaming - PVOD" release group dated July 9, 2021 (`data/raw/title-tt3480822.html`). The Wikipedia cache records Wonder Woman 1984 as "streaming on HBO Max in the United States ... the same day" (`data/raw/wiki-Wonder_Woman_1984.txt`) and The Suicide Squad as released "simultaneously in theaters and on the streaming service HBO Max" (`data/raw/wiki-The_Suicide_Squad_film_.txt`).
- **What the site does:** Three of §06's six widest misses are these films: Black Widow -$341M (3rd), Wonder Woman 1984 -$330M (4th) and The Suicide Squad -$294M (6th). On the same-budget regime in Major 2, Wonder Woman 1984 becomes the film the dek names. The only nearby caveat is the Watch-for at `src/index.html:1071`, which says streaming revenue is left out of break-even. That covers missing revenue, not a theatrical run that was capped. Nowhere does the page mention day-and-date releases, pandemic capacity limits or markets closed to a film (a full-text search for streaming, HBO Max, Disney+, pandemic, China, holiday and Christmas finds only lines 1071, 1169 and 1397). The "a third" h3 survives dropping the 2020 to 2021 capped films: 26 of 82 (31.7%).
- **Fix:** Footnote the three day-and-date rows in §06, plus the dek if it ever names one.

## Minor

### 4. Three release dates are not the domestic wide-release date

All three come from the legacy sheet.

| Film | Stored (`data/films.json` > `release_date`) | Domestic wide release | Evidence | Source of stored value |
|---|---|---|---|---|
| The Avengers | 2012-05-12 (a Saturday) | 2012-05-04 | BOM release group gr1911837189, Domestic row "May 4, 2012", opening $207,438,708 | `data/sheet-baseline.csv:7` |
| Aquaman and the Lost Kingdom | 2023-12-20 (Wed) | 2023-12-22 (Fri) | Domestic row in `data/raw/title-tt9663764.html`; wiki infobox `2023|12|22|United States` | `data/sheet-baseline.csv:48` |
| The Suicide Squad | 2021-08-05 (Thu) | 2021-08-06 (Fri) | Domestic row in `data/raw/title-tt6334354.html`; wiki infobox `2021|8|6|United States` | `data/sheet-baseline.csv:43` |

- **What it moves:** None of the three changes a year bucket, a CPI year, the §05 rolling window or its `FINAL_CUTOFF` status. The §03 beeswarm positions shift by 8, 2 and 1 days. The dates also misstate each film's opening day. Aquaman and the Lost Kingdom reads as a Wednesday opener with a 4.5x multiplier, but it opened on a Friday and its window is standard. Its multiplier is the Christmas-corridor case in Minor 7, not the mid-week artifact in Major 1.
- **Fix:** Correct the three dates in the baseline, or add a date override in `additions.json`.

### 5. §14 says four MCU budgets come from filings; the override note says six

- **Where:** `src/index.html:1392` reads "four recent Marvel Studios films, $307M to $429M". `data/budget-overrides.json` > `note` reads "six MCU films pinned to $200M pre-release guesses while filings showed $236M to $534M; those now carry the filed net figure". `sources` labels Black Widow ($288.5M) and Eternals ($236.2M) as "Wikipedia infobox", and both infoboxes cite `ForbesBudget` (`data/raw/wiki-Black_Widow_2021_film_.txt`, `data/raw/wiki-Eternals_film_.txt`).
- **Why it matters:** The regime count in Major 2 depends on which it is. Prior lanes tied the "four" out against the source labels only.
- **Fix:** Pick one count and use it in both places. If it is six, the range becomes $236M to $429M.

### 6. The §06 budget rule is broken for five films

§14 (`src/index.html:1392`) and the override note set the order: the studio filing net of rebates where one exists, then BOM, then the widely cited figure, taking the lower bound of any range.

| Film | Stored | Cache says | Rule gives |
|---|---|---|---|
| The Fantastic Four: First Steps | $200M | "$229.6 million (gross) / $181 million (net)" (`wiki-The_Fantastic_Four_First_Steps.txt`) | $181M filed net |
| Shazam! Fury of the Gods | $125M | "$110 to 125 million" | $110M |
| Joker: Folie à Deux | $200M | "$190 to 200 million" | $190M |
| Blue Beetle | $120M | "$104 to 125 million" | $104M |
| Venom: The Last Dance | $120M | "$110 to 120 million" | $110M |

- **What it moves:** No verdict flips. Shazam 2, Folie à Deux and Blue Beetle stay losses, and Venom 3 and First Steps stay profits. No headline moves either: the widest miss, the widest hit and the "a third" count are unchanged. Only bar lengths in §06 and the ROI and budget cells in §13 shift.
- **Fix:** Apply the stated rule to these five entries in `data/budget-overrides.json`.

### 7. Aquaman's 4.9x, the §07 dek's example of legs, is a Christmas-corridor run

- **Where:** `src/index.html:1082` and `data/web.json` > `Aquaman.mult` (4.94).
- **What I found:** Aquaman's window is a standard Friday opening (2018-12-21, BOM "Domestic Opening" $67.9M), so it is measured the same way as the rest. Its multiplier and Lost Kingdom's 4.50x (ranks 1 and 2) come from holiday weekdays that play like weekends, and the page doesn't say so. The New Mutants (3.39x, 12th, inside the visible top 12) opened 2020-08-28 during pandemic reopenings, and that isn't noted either.
- **Fix:** Add a clause to §07's Watch-for naming holiday corridors and 2020 reopenings next to the platform-release caveat.

### 8. Re-release groups inside the lifetime totals

The site declares "nominal lifetime worldwide gross" (`data/films.json` > `meta.grosses`), so bundling re-release groups follows its own rule. Two cases still mix measures.

- **Deadpool 2** (`data/raw/title-tt5463162.html`) includes "Once Upon a Deadpool", the PG-13 recut (Dec 2018 to Jan 2019): $51,349,833 worldwide and $6,100,309 domestic. Original run: $734.55M worldwide and $318.49M domestic, against $785.90M and $324.59M stored. That ordering puts Deadpool 2 ($785.90M) above Deadpool ($782.84M) as Fox's top grosser. On original runs, Deadpool ($782.61M) leads. No prose names Fox's top film, so nothing printed moves. Its multiplier is 2.59x stored and 2.54x on the original run, because a different cut's domestic money sits in the numerator.
- **Spider-Man: No Way Home** includes the "2022 Re-release" ($9,621,980 worldwide, $9,321,593 domestic). The original-run domestic is $804.79M, giving a multiplier of 3.09x against 3.13x stored.
- **Stored worldwide minus BOM's "Original Release" group, where the gap is over $1M:** Spider-Man +$6.42M; Spider-Man 2 +$1.83M; Batman Begins +$2.15M; Spider-Man 3 +$1.58M; The Dark Knight +$4.64M; The Avengers +$1.73M; The Amazing Spider-Man 2 +$7.95M; Age of Ultron +$2.21M; Civil War +$1.75M; Wonder Woman +$1.01M; Thor: Ragnarok +$1.32M; Black Panther +$3.01M; Infinity War +$4.06M; Deadpool 2 +$51.35M; Captain Marvel +$3.14M; Shazam! +$1.83M; No Way Home +$10.44M. Not all of this is re-release money (see Suspected).
- **Downstream:** No change to the $1B or $2B clubs, the §04 headline, any universe total named in prose, or any `is_final`. On original runs The Dark Knight is still $1,003.85M, and Aquaman, Joker, The Dark Knight Rises, Infinity War and Endgame all stay in their clubs.
- **Fix:** Carry the Original Release group as `worldwide_original` and use it for `mult`. At minimum, footnote Deadpool 2.

### 9. Re-release dollars are deflated at the original year's CPI

- **Where:** `scripts/promote.mjs:72` to `74` and `scripts/build-web.mjs:19` call `toReal2025(x, release_year)` on the whole lifetime figure.
- **Effect:** Money a re-release earned years later gets the older year's larger multiplier. The Dark Knight's $4.64M of 2012 to 2026 money is scaled at 1.496x (2008) instead of 1.00x to 1.40x. No Way Home's 2022 money is scaled at 1.189x instead of 1.101x. The overstatement is under $1M for every film I could decompose, so no 2025-dollar ranking or headline moves.
- **Fix:** Deflate each release group at its own year once group-level grosses are carried.

### 10. `universe_label` calls The Amazing Spider-Man films "Sony's Spider-Man Universe"

- **Where:** `data/films.json` > `The Amazing Spider-Man.universe_label` and `The Amazing Spider-Man 2.universe_label`.
- **Trade convention:** Sony's Spider-Man Universe is the slate from Venom (2018) onward. The Webb films are their own continuity.
- **What the page does:** The page itself labels the `SSU` bucket "Sony" / "Sony's Marvel films (Spider-Man, Venom, Ghost Rider)" (`src/index.html:866`, `:1714`), and the §14 scope card lists Raimi, the Amazing films and "the Venom-led SSU" separately (`src/index.html:1404`). So every prose total ("Sony's 13 at ...", "Fox and Sony never") is a studio total, and no printed median or total rests on the continuity label. The only exposure is the data key, plus "six universes" (`src/index.html:1423`) counting two studio buckets that each hold several continuities.
- **Fix:** Relabel those two rows' `universe_label` "Sony Pictures (Webb)".

## Suspected, not verified

- **33 release dates** are unchecked against BOM. The multi-group title pages carry no Domestic row, so I could confirm only 58 of 91 (53 from cached Domestic rows plus 5 from lookups). I don't suspect any of the 33.
- **No Way Home and Black Widow in China.** Their cached pages list release groups but no market table, so I could not confirm the absence of a China release from the cache. (Shang-Chi, Eternals, Multiverse of Madness and Love and Thunder are confirmed: their full market tables have no China row.) This doesn't affect any conclusion, because §09's named extremes are uncapped films and §08's claims survive without the capped films (see Checked clean).
- **Ant-Man and the Wasp at $162M** has no `sources` entry. The cached infobox gives "$130 to 195 million", which would give $130M under the rule, unless $162M is a filing. It is a profit either way ($622.7M against $405M or $325M).
- **Stored worldwide exceeds the Original Release group by more than the listed re-release groups** for Infinity War (+$4.06M against a $3,795 re-release), Age of Ultron, Civil War, Ragnarok, Captain Marvel and The Avengers. That looks like BOM's title total and group total disagreeing, not re-release money. I couldn't resolve it from the cache.
- **The Endgame "2026 Re-release"** (Domestic, 2026-09-25) is on the cached page with no gross yet. Endgame is older than the 300-day `BOM_REFRESH` window, so the weekly rebuild will probably never pick that money up. That keeps it out of the original-run figure, but the stored lifetime will drift from BOM's.
- **The "Columbia 100th Anniversary Series" group** ($6.36M) appears on six Sony title pages. Each page seems to attribute roughly $0.75M of it. I couldn't confirm the allocation from the cache.

## Checked clean

- **Opening window:** For every film I could check (5 daily pages plus The Avengers), `opening_weekend_domestic` is BOM's Friday-to-Sunday "Domestic Opening". The window is the same across the slate. Only the numerator differs for the mid-week openers in Major 1.
- **The brief's Endgame example is not contaminated today.** The stored $2,799,439,100 worldwide and $858,373,000 domestic equal the Original Release group exactly. The 2026 re-release has no gross yet.
- **Club counts, rankings and `is_final` all hold on original-run figures.** $1B club, $2B club, the §04 headline counts, the treemap top three: none depends on re-release money. No re-release group falls inside the `FINAL_CUTOFF` logic.
- **Both §07 dek examples** (Aquaman 4.9x top, Folie à Deux 1.5x bottom) survive the like-for-like recompute. `renderLegs` holds in-release films out (`src/index.html:3176`).
- **§06's h3 "A third"** holds on both tests: 31 of 90 on the current budgets or with the six MCU films on $200M, and 26 of 82 with the 2020 to 2021 capped films removed. The widest hit (Endgame) doesn't move under any regime test.
- **§05's rolling median plateau** is $200M from 2021 to 2025 under either budget regime.
- **§08:** Removing the eight capped films (New Mutants, WW84, Black Widow, The Suicide Squad, Shang-Chi, Venom 2, Eternals, No Way Home) leaves r = 0.49 (0.48 with them), the slope at $8.8M per point ($9.0M with them) and the top-to-bottom quartile ratio at 2.52 either way. The dek holds.
- **§09:** The named extremes (Supergirl, Superman and Daredevil at 43% overseas; Venom at 75%) are not capped films. The Watch-for already names China's swing.
- **The lower-bound rule holds** for Aquaman ($160M), Black Adam ($190M), Supergirl ($170M), The Flash ($200M), Aquaman and the Lost Kingdom ($205M), Shang-Chi ($150M) and The Amazing Spider-Man 2 ($200M).
- **Where BOM carries a budget** (Multiverse of Madness $414.9M, Deadpool & Wolverine $537M), the site's stated preference for the filed net figure is applied consistently.
- **Scope:** The MCU (38), DCEU (15) and Fox (17) slates are complete against the rule at `src/index.html:1403` and `:1643`. Every live-action theatrical Marvel or DC exclusion I could name since 2000 is either listed at `src/index.html:1406` or fails the rule on its face. That includes Blade II and Trinity (continuity began 1998), Superman Returns, Catwoman, Constantine, Green Lantern, Jonah Hex, Watchmen, Hulk (2003), Fantastic Four (2015), both Punishers, Kick-Ass and Kick-Ass 2 (creator-owned), and RED and RED 2 (DC-published, but not a superhero film). I found no missing film and no included film that fails the rule.
- **Continuity tags follow the trade:** Deadpool & Wolverine as MCU; Homecoming, Far From Home, No Way Home and Brand New Day as MCU despite Sony distribution; Elektra as part of the Daredevil continuity.
- **Held out correctly:** Avengers: Doomsday and Clayface have no BOM gross and sit in `meta.held_out`.
