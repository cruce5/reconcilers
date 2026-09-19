# REDLINE · editorial

The Red Pen is out. The site's biggest problems are two static fallbacks that quietly went stale under a Marvel Studios chart the audit team never wired to tie-out, and three headlines still doing their job as labels.

Scope: every headline, dek, note, scorecard string and generator template in `src/index.html`; the meta tags at the top; the footer; the §16 copy; the term glossary across the file. Verified against `data/web.json` (91 films, meta.generated 2026-09-08). Read-only; nothing edited.

## Critical (false claim)

1. **The two biggest budgets on the page are wrong in the static fallback.**
   `src/index.html:821`: the §05 dek says: "the two biggest budgets on the page are <em>Avengers: Endgame</em> at $356M and <em>Avengers: Infinity War</em> at $350M." Data says the top two are now <em>Deadpool & Wolverine</em> at $429M and <em>Avengers: Endgame</em> at $356M; <em>Infinity War</em> is third. `renderBudgetCopy` overwrites this at runtime with the correct pair, so users of the live page see it right; the tie-out doesn't gate the film names inside this dek, so the source-of-truth prose an editor reads (and a no-JS crawler ingests) is false. Rewrite the fallback to match the current data, and add a tie-out claim on the top two names:
   > the two biggest budgets on the page are <em>Deadpool &amp; Wolverine</em> at $429M and <em>Avengers: Endgame</em> at $356M.

2. **§03 dek's "four to seven films a year" is stale, and the runtime override reads worse.**
   `src/index.html:772`: the static dek says: "Since 2021 the count has held up, four to seven films a year." `renderClubCopy` (`src/index.html:3617`) now writes "one to seven films a year" because Supergirl is 2026's only `final` release (Brand New Day is still in release), so the year 2026 counts as 1 in the min. The rendered sentence tells a reader the slate cratered to one film in a year that hasn't finished. Constrain the generator to years whose slate is complete, and rewrite the dek to match:
   > Since 2021 the count has held up, four to seven films a year in every finished year, but the films are smaller and the big bubbles thin out to one a year at most.

3. **§02 dek's "Aquaman at $1.15B" is a static line under a chart that swaps to 2025 dollars.**
   `src/index.html:745`: reads: "DC's ceiling, Aquaman at $1.15B, sits below ten separate Marvel films." Under 2025$ the ceiling and the count both move (Marvel films above Aquaman's real-terms gross change), and the generator does not rewrite this dek at all. Either move the sentence into `renderClubCopy` alongside the other treemap copy, or drop the dollar figure from the static line so the two universes agree:
   > DC's ceiling, <em>Aquaman</em>, sits below ten separate Marvel films.

## Major (label headlines, drift, undefined terms)

1. **§13 headline is a label.** `src/index.html:1149`: "The whole thing, sortable" tells the reader what the section is, not what it says. The dek already carries the definitions. Rewrite:
   > Every value a chart shows is a plain sortable number here.

2. **§14 headline is a label.** `src/index.html:1175`: "How this was built" is a card title. The section's finding is that three rules do all the work. Rewrite:
   > One rule for scope, one for break-even, one for what's still moving.

3. **§15 headline is a label.** `src/index.html:1202`: "How this actually went" is fine as house style for a log, but a Redline pass has to note it. If you want a finding-headline here, the file's own thesis is on the tin:
   > The useful part is the part nobody publishes.

4. **§16 headline calls Meld an auditor.** `src/index.html:1404`: "Nine auditors and a villain" reads as nine lane-owners plus Doctor Missedit. Meld's own card (`src/index.html:1419-22`) sets him as "Context · goes in first"; §15 line 1315 counts "eight auditors, one lane each"; the numbers 8 (audit lanes) and 9 (heroes) reference two different things and a reader will bounce off it. Rewrite:
   > Nine heroes and a villain, in a folder you can point at any data product.

5. **§16 dek "seven places the fixes had missed" understates the finding.** `src/index.html:1405`: the phrase reads as "the fixes missed things", which is almost the opposite of what happened. §15 line 1316 says "seven where the hero was right and the fix was not"; the audit shorthand in the commit log is "fix mismatches". Rewrite:
   > On this site they found 78 findings, 55 after the overlaps merged; he flagged seven fix mismatches on top.

6. **§01 static h3 doesn't hold under the Marvel v DC lens.** `src/index.html:696`: the static line "Marvel Studios has out-grossed every DC film combined, nearly three to one" is right at 2.80×, but the moment the lens is on the generator writes "Marvel has out-grossed every DC film combined, nearly four to one" (3.87×). The tie-out gates the ratio phrase, not the noun, so a no-JS reader always sees the six-universe framing. Consider hoisting the static text into the default the generator prints and letting the lens rewrite it, so the source and the runtime match on load.

7. **§04 static h3 drops "Studios" that the generator restores.** `src/index.html:796`: "Marvel has cleared $1 billion twelve times" is the lens-mode phrasing; the default renders as "Marvel Studios has cleared $1 billion twelve times." Match the default (or generalise on load) so the fallback isn't a lens the user hasn't switched on yet.

8. **"Group" and "universe" both name the same thing in the §01 box-plot note.** `src/index.html:733-734`: "Any group under four films", "With this few films per group". Every other note calls it a universe. Rewrite both to "universe" / "per universe" so the term stays one term.

9. **Tab strip label doesn't match the act header.** `src/index.html:631`: the tab says "The mistakes"; the act header at `src/index.html:1026` reads "The tempting mistakes". Also `src/index.html:627` says "Scoreboard"; the act at `src/index.html:690` says "The scoreboard." Pick one form per section. The full form ("The tempting mistakes", "The scoreboard") reads better in a tab too.

10. **"OKLab" and "deuteranopia" appear before they're introduced.** `src/index.html:1361` (§15 design-call fold), `src/index.html:1311` (§15 li). Both are inside collapsed cards a reader can drop into cold, and neither is defined near where it's used. Add a five-word gloss the first time each appears in a fold ("OKLab, a perceptual color space" / "deuteranopia, red-green color blindness").

11. **§14 uses "Still in release" as a defined term but §01's box note calls the same thing "in release."** `src/index.html:1186` names "**Still in release** films (marked ◉)"; the ledger legend at `src/index.html:2812` says "still in release, held out"; §14's ratio-pair paragraph says "still in release" too. The code comment at `src/index.html:2730` uses "still in theaters", the outlier. Not user-facing, but it's a clue the term slipped once. Grep and normalize.

12. **§15 line 1263 still says the tie-out recomputes "twenty claims" and the fold summary at 1219 says "98 asks".** `src/index.html:1263`: the retrospective in §15 line 1315 already updates the count to thirty; the older entry at 1263 stays at twenty for the historical narrative (fine). The fold summary needs to keep saying whatever tie-out counts today (`CLAIMS.length` in `scripts/tie-out.mjs` is thirty). Log entries are a story, not a running count; §15's structure treats them right. Leaving this in as a Major only to note the trap the next audit will hit.

## Minor (mechanics, voice)

1. **Meta description is one revision behind the scope rule.** `src/index.html:2`: "Every live-action Marvel and DC superhero film since 2000 that's in a franchise" says "franchise" while §14 calls the rule a "multi-film continuity". Same for `src/index.html:9` and `src/index.html:16`. Rewrite:
   > Every live-action Marvel or DC superhero film since 2000 in a multi-film continuity, and what each made.

2. **Masthead dek's second sentence is passive.** `src/index.html:614`: "any figure switches to 2025 dollars" reads as if the figure switches itself. Rewrite:
   > Every figure toggles to 2025 dollars.

3. **§16 dek "they found 78 things" is casual.** `src/index.html:1405`: "things" understates the work. Use "findings" (matches §15 line 1315 exactly).

4. **§05 h3 has a "roughly" that carries the truth.** `src/index.html:820`: "Production budgets roughly doubled over the 2000s, then flattened near $200M." $110M in 2002 → $200M by 2021 is 1.82×; the hedge is holding a real fact together. Keep. (Weakness-check: nearly and roughly here are not filler.)

5. **§08 dek "roughly two and a half to one" runs on a ratio of 2.43.** `src/index.html:895`: 2.43 rounds nearer to two and a half than two, so the hedge is honest. Keep.

6. **§07 dek uses "×" via `&times;` correctly**; §11 dek uses "&ndash;" for the small-integer range. Both consistent. Zero em dashes and zero `&mdash;` in the file, verified. Zero `&sect;` (all § are literal, 81 of them). Straight-vs-curly quote check: apostrophes are `&rsquo;` throughout the prose (199 instances); the straight apostrophes that remain are inside code, class strings and JS. Fine.

7. **`$1B` vs `$1 billion` is split.** 12 uses of `$1B`, 6 uses of `$1 billion` / `$1&nbsp;billion`, 11 uses of `billion-dollar`. The pattern in the file is: `$1B` in prose about the club, `$1 billion` when the sentence is the finding ("cleared $1 billion twelve times"). Consistent with intent, no change needed.

8. **§01 note's "roughly seven of every ten DC films" is exact-rounded from 16/23 (69.6%).** `src/index.html:723` / generator at `src/index.html:1786`. Rounds to seven; "roughly" is honest. Keep.

9. **§16 line 1465 has "the theatre" (British) inside a US-English page.** Style: British-vs-American English mixes elsewhere are minimal; this one is the show-business "theatre" spelling used as metaphor and reads as a choice. Flag, do not force. If you want to normalise: "the show" or "the routine" fits.

10. **The 404 (dist/404.html) has one dek: "That page is not part of The Cape Index."** Fine. Consider a link to the Contents pill as well; a stray inbound link often wants the ledger or a specific section. Not a copy problem, an affordance one.

11. **Footer sentence is a run-on but reads OK.** `src/index.html:1478`: five ideas separated by periods; the "Spotted a wrong number?" pivot is the funniest line on the page and I want to protect it. No change.

12. **§12 dek's "quietly useless" is the second-best line on the page.** `src/index.html:1033`. Protected; noting so future edits don't smooth it out.

## Tightest masthead first-screen

Current (`src/index.html:611-615`):
> The Cape Index
> Every live-action Marvel and DC superhero film since 2000 that's in a franchise, and what each made. Grosses come straight from Box Office Mojo; any figure switches to 2025 dollars.
> It doubles as a set of worked examples: turn on Design notes and every chart explains why it's built the way it is. Marvel v DC collapses the six universes back to the two the project started as.

Tightest that keeps every fact and every affordance:
> The Cape Index
> Every live-action Marvel or DC superhero film since 2000 in a multi-film continuity, and what each made. Grosses from Box Office Mojo; every figure toggles to 2025 dollars.
> Every chart carries its own note on why it's built the way it is (Design notes). Marvel v DC collapses the six universes back to the two the project started as.

Savings: one clause and one adverb; substitutes the site's own scope word ("multi-film continuity") for the looser "franchise"; makes the toggle verb active. Preserves the two button hooks and the count.

## Glossary

| Term (concept) | Variants in file (counts) | Recommendation |
|---|---|---|
| A "universe" bucket | universe/universes 91, group/groups 17 (mostly aria-labels and code), continuity/continuities 10 | Prose: **universe**. §01 box note is the only place "group" leaks into copy; fix it. |
| Marvel Studios' MCU | Marvel Studios 10 (in default-lens headlines and §14), MCU 35 (everywhere else) | Prose in headlines and lens-toggling copy: **Marvel Studios**. Elsewhere and in charts: **MCU**. Current split is deliberate; hold it. |
| 2025-dollars mode | 2025&nbsp;$ 7 (buttons/legends), 2025 $ 4 (headings), 2025 dollars 13 (prose), real terms 1, real-dollar 1 | Buttons: **2025 $**. Prose: **2025 dollars**. Retire "real terms" and "real-dollar" (§14 and one code label). |
| Films still climbing | still in release 12, in release 18, in theaters 3 | **still in release** everywhere user-facing; §15 quotes and one code comment excepted. Fix the code comment at `src/index.html:2730`. |
| Domestic multiplier | multiplier(s) 11, legs 27 | Chart title / column header: **multiplier**. Prose about the phenomenon: **legs**. Current split is right; keep. |
| Domestic vs overseas | worldwide 38, global 0 | **worldwide** and **overseas** everywhere. Clean already. |
| Opening | opening weekend 13, opening (alone) 26 | On first reference: **opening weekend**. After that: **opening**. Current usage is fine. |
| Finished-run flag | final 37 (mostly `f.final` in code), completed 9 (all prose) | Prose: **completed** ("median completed film"). Code: **final**. Do not rename `f.final` to match; the divergence is fine as long as the prose never says "final". Check the two places in prose that say "final" instead of "completed". |
| Section marker | literal § 81, `&sect;` 0 | Clean. |
| Ordinal/spelled numbers | NUM/WORDS arrays cap at 20; prose spells one through twenty and digits everything else | Consistent already; keep. |
| Elseworlds | 27 uses; defined at `src/index.html:1191` and design-call fold at 1364 | One canonical definition in §14 scope. §15 fold acknowledges Nolan's trilogy predates the banner. Consistent. |

## Checked clean

- Zero em dashes anywhere in `src/index.html`. Zero `&mdash;`. Zero `&sect;` (all § are literal). Verified.
- The masthead ratio phrase "nearly three to one" ties to 2.80× (tie-out gates this). Under Marvel v DC lens the generator writes "nearly four to one" for 3.87×.
- Every $1B/$2B count in a headline is dynamically generated; the tie-out CLAIMS gate the counts under both lenses.
- §14 "four in five since 2021" ties out: 24 of 30 films since 2021 with a budget are estimates (80%).
- §14 "four recent Marvel Studios films, $307M to $429M" ties out: The Marvels, Multiverse of Madness, Quantumania, Deadpool & Wolverine all carry disclosed net-of-rebate filings.
- §14 "none before 2010" ties out (gated).
- §11 headline / dek: Spider-Man 12, next three at 10 (Iron Man, Professor X, Wolverine), three at 9 (Black Widow, Captain America, Thor), Batman 8, 152 singletons. All match the roster and the tie-out gates.
- Ensemble note "Endgame tops out at 34" matches the roster.
- The contents-list uses the section h3 innerHTML verbatim, so the contents version is always the section version.
- Tabs and section IDs: 16 sections, 7 tabs. Contents pill copy matches.
- No "as you can see", no "recent" in prose (only in code variables), no "this year" / "last year" in prose.
- Footer's "read September 2026" is JS-updated from `meta.generated` (2026-09-08); static matches.
- Meta title, OG title, Twitter title all say "The Cape Index" / "The Cape Index: Marvel v DC at the box office, 2000 on." Consistent.
- 404 page is one line, on brand, self-hosted colors, dark-first with a light block. Clean.
- README first paragraph says "multi-film franchise", which matches the site's scope wording well enough given "franchise" is used in the masthead dek too. Rewrite together if you rewrite the masthead.
