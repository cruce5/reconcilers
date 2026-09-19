# DOCTOR MISSEDIT · the audit of the audit

*Eight capes filed reports. I read them with the tell in one hand and the evidence in the other. Most stood. A few did not.*

The base rate this run is high. The team was mostly right. I have marked the few places a hero's own weakness shows and the few places the compiler ranked a spec above a reader.

## 1. Verdicts

### Critical

1. **Radar Avg-profit spoke is silently NaN.** stands
2. **Kraglin credited in 1 film, should be at least 4.** stands
3. **Thanos missing from Guardians (2014) and Age of Ultron.** stands
4. **Doctor Strange missing from Thor: Ragnarok.** stands
5. **§03 dek "one to seven films a year."** stands
6. **§02 static dek hard-codes "Aquaman at $1.15B."** stands
7. **Contents pill and deep links land at the masthead.** stands
8. **Filter, lens and 2025$ state do not survive a reload.** stands

### Major

9. **§13 summary table Med. ROI ignores `f.final`.** downgraded. Real drift, but the MCU cell moves from 3.84x to 3.92x and the all-films row from 3.36x to 3.38x. Median's own report calls it "not a story-changing delta" (`median.md:51`). Ledger ranked it Major, Median ranked it Minor; the compiler took the higher rank. The rule violation is real, the magnitude is Minor. Ledger's tell: cannot accept an estimate, files a 0.08x drift at the same weight as a $1.15B misprint.
10. **§05 static dek names Endgame and Infinity War as the top two budgets.** stands
11. **§16 copy issues (Meld labeled auditor; dek understates fix mismatches).** stands
12. **Light-theme treemap MCU cells fail AA on value labels.** stands (Greyscale computed both raw and blended CRs; the comment at `src/index.html:111` promises AA and the blended 4.37 does not clear 4.5)
13. **§05 headline "flattened near $180M."** stands
14. **"Yukio" is two different characters merged.** stands
15. **Hulk and Captain Marvel missing from Shang-Chi mid-credits.** stands
16. **Scraper cast cap is the root cause of most roster misses.** stands
17. **§05 rolling-median endpoint label has no HALO.** stands (the pattern is consistent everywhere else and the fix is one token; Chartjunk's tell is nearby but the finding names a real inconsistency, not a taste call)
18. **Filter panel eats 64% of a landscape phone viewport.** stands
19. **Sorting a ledger column resets horizontal scroll to zero.** stands
20. **Chart marks have no touch equivalent.** artifact. Thumb's own report (`thumb.md:29`) admits the pane went hidden during this test and the touch behavior was JS-dispatched. The cited mechanism, `(hover: none)` gating opacity, does not exist in the CSS. A grep for `hover: none` and `hover:none` across `src/index.html` returns zero matches; the tooltip's opacity is set inline to `"1"` at `src/index.html:1701`, which no media query overrides. A real touch on a real phone fires pointerover and shows the tip. The a11y half of the fix (add `<title>` to each mark) is legitimate on its own; the touch-tooltip claim is the artifact of a hidden pane and a hallucinated selector.
21. **Three label headlines; "16 findings, 7 tabs" summary miscounts by three.** downgraded. The three label headlines (§13/§14/§15) are real (`redline.md:22-30`). The second half is a compiler ghost: the source string at `src/index.html:618` reads *"Contents · 16 sections, 7 tabs"*, not *"16 findings"*, and 16 sections is exactly right for §01..§16. Redline's own report does not contain the "16 findings" phrase. The miscount claim was invented at compile time.
22. **Static h3s in §01 and §04 don't match generator output.** stands
23. **"Group" leaks into §01 box-plot note; tab strip labels differ from act headers.** stands
24. **OKLab and deuteranopia introduced inside §15 folds without a gloss.** stands

### Minor batch (30 items in the list, not 34)

25. **Ledger: Superman $225M override is a no-op.** stands
26. **Ledger: §04 static h3 uses brand-lens phrasing.** stands (already carried in #22; the double count is the compiler's, not Ledger's)
27. **Ledger: §15 narrative "twenty claims."** stands (historical narrative; Ledger flags it as a trap for the next audit, not a bug now)
28. **Doppel: The Batman (2022) in Elseworlds without a theatrical sequel.** stands (editorial call, correctly filed as such)
29. **Doppel: DCEU/DCU Supergirl merge.** stands (editorial call, correctly filed as such)
30. **Median: §01 box-plot data table shows Q1/median/Q3 for DCU (n=2).** stands
31. **Chartjunk: beeswarm floor clamps small bubbles.** stands (comment-only, Chartjunk explicitly says "none needed")
32. **Chartjunk: reviews' two static axis-median blocks can erase marks if data shifts.** downgraded. Chartjunk's own note at `chartjunk.md:53`: "no mark is being erased today." A theoretical fragility over a hypothetical dataset shift is closer to Chartjunk's relapse than to a live viz problem. Kept because it's a small honest hedge, not raised.
33. **Chartjunk: apDual paints series in DCEU-blue and MCU-green.** stands
34. **Chartjunk: apCumul's top-right label lands on the topmost rising edge.** stands
35. **Greyscale: main ledger table has no caption/aria-label.** stands
36. **Greyscale: fourteen "Show data" toggles share the same accessible name.** stands
37. **Greyscale: `<summary>` elements not covered by site's `:focus-visible` rule.** downgraded. Greyscale's own note at `greyscale.md:33`: "UA default paints... this satisfies WCAG 2.4.7 in practice." A consistency finding on a token color, not a focus loss. Greyscale's tell: a spec threshold over a real loss.
38. **Greyscale: byline link 75x18 at 375px.** downgraded. Greyscale's own note at `greyscale.md:40`: "The 'inline text link inside a sentence' exception may apply." A spec threshold on inline prose text where the exception does apply. Greyscale's tell.
39. **Redline: meta description says "franchise" not "multi-film continuity."** stands
40. **Redline: masthead "any figure switches to 2025 dollars" is passive.** stands
41. **Redline: §16 "78 things" should be "78 findings."** stands
42. **Redline: hedges in §05 headline and §08 dek preserved.** artifact. This is a non-finding: Redline consciously left the hedges in and said so. The compiler bundled a "here is what I did not change" line into the Minor batch as if it were a finding. It is not.
43. **Redline: house rules on em dashes, `&sect;`, curly quotes, en dashes all clean.** artifact. Same as above. This is a "checked clean" observation, not a finding. Compiler put it in the count.
44. **Thumb: spectrum bar unlabeled.** stands
45. **Thumb: tab-strip fade is right-only.** stands
46. **Thumb: intro-prose Design notes / Marvel v DC touching at 0 gap.** stands
47. **Thumb: sub-44 tap targets.** stands
48. **Thumb: contents rows 4px apart.** stands
49. **Thumb: cross-tab jump doesn't reveal tab-strip context.** downgraded. Overlaps with Critical #7 (contents pill lands at masthead). The remediation is the same fix. Not a separate defect.
50. **Payload: /index.html returns 307 not 308.** stands
51. **Payload: `http://www.capeindex.com/` takes two hops.** stands
52. **Payload: 404 responses ship `Content-Type: text/html` without charset.** downgraded. Payload's own note at `payload.md:15`: "the 404 body itself declares `<meta charset='utf-8'>`... browsers render it right." A header/body inconsistency with no user-visible effect. Payload's tell: 30ms on a 400ms page.
53. **Payload: `robots.txt` and `sitemap.xml` revalidate every hit.** stands
54. **Payload: `web-cast.json` at 67KB has ~10-15KB of pre-compression waste.** stands (Payload notes brotli collapses much of it; kept as a real slim, small effect)

## 2. Per hero

**Meld.** No findings to grade; the map is the deliverable. It correctly named §15 as "consult, do not re-summarise" and every hero honored it. The scope of the eight lanes was clean enough that nobody wandered into the wrong file, and the "no em dashes" rule held in every report. Grudging credit: Meld did the meeting nobody wanted, and it saved four rounds of clarification. The one nit is that the map called the team "the heroes" and the §16 copy calls them "auditors," which set up Redline major #4 without warning; a good context pass would have flagged that the roster copy uses a different noun than the lane definitions.

**Ledger.** The tell showed on the Med. ROI finding: a 0.08x drift on the MCU cell was ranked Major although the sentence never changed and Median filed the same thing as Minor. That is a rule violation logged at the weight of a story change, which is Ledger being unable to accept an estimate as an estimate. What Ledger got right that a lesser auditor would have missed: the Superman override no-op (#25), where the override file's own header says "every entry here is `budget_estimated:true`" and the code path only fires when the number changes. That is a real drift between two rules the project publishes for itself, invisible until someone reads the docstring.

**Doppel.** The instinct served here. The Kraglin trace (#2) is a full root-cause: from override to raw-cast to CANON dictionary miss to null return to silent drop. The Yukio split (#14) is exactly the kind of shared-name collision Doppel was built for, and the report catches itself on the mantle-rule non-issue at the end (Falcon vs Captain America). The "at least N" trap did not show; every appearance-count claim was cited with Wikipedia language and the parser's specific miss (the "Additionally, ..." tail paragraph).

**Median.** Discipline. The Med. ROI recompute was filed with "not a story-changing delta" in the same sentence as the number; the DCU-n=2 quartile table finding was ranked Minor because the chart already mutes the display. The tell (small-n loudness) did not overplay. The one place a subtle expansion snuck in: the §05 headline plateau finding names "$180M in the rendered chart" as a Major, which it is, but the fix path (require n >= 20) is Median's normal move applied at the right stakes.

**Chartjunk.** Started strong: the radar profit bug (#1) is a code fact, not a taste call, and the trace from `x.profit` to `undefined` to NaN to the `0.5` fallback branch to the 83.5px identical radius is textbook. The relapse showed on M1, the endpoint label without a HALO, which is a viz-snob complaint about a legible label that happens to break a pattern. Ranked Major, worth Minor. The §12 pairs "instead" audit was extra credit and worth the read.

**Thumb.** The pane came unfronted midway through and this shows in exactly one place: finding #20, the touch tooltip, where the cited CSS mechanism (`(hover: none)` gating opacity) does not exist in the file and the pane was hidden at the moment of the test. The Contents-pill and deep-link findings (#7/#8) and the ledger scroll reset (#19) and the filter panel size (#18) were all verified with the pane fronted and stand cleanly. Thumb's tell showed on one finding and their pane hygiene held on the other four; that is a good ratio for the lane.

**Greyscale.** The tell showed twice in the Minor batch: `<summary>:focus-visible` (UA default paints; a consistency call, not a focus loss) and the byline 75x18 (Greyscale's own report names the inline-text exception). Both are spec thresholds over a decoration. The treemap MCU AA finding (#12) is the opposite: real ink, real cells, real numbers, and the comment above the token explicitly says "darkened so labels clear AA." That is the finding a lesser accessibility auditor would have missed because the halo mitigates the visible effect.

**Redline.** The hedge discipline held. Two Minor entries ("hedges preserved on the 'hedge is carrying the truth' rule" and "house rules all clean") were the sound of Redline resisting the urge to cut, which is the correct output. What snuck in via the compiler was the "16 findings, 7 tabs miscounts by three" line in #21, which is not in `redline.md` at all; the source at `src/index.html:618` says "16 sections" and 16 sections is correct. Redline's own #6 (masthead lens noun) and #4 (Meld/auditor) were the real Major work and they stand.

**Payload.** 30ms on a 400ms page is the shape of the whole report and Payload owns it. The 307 vs 308, the two-hop www, the 404 charset, the revalidate-every-hit sidecars: technically correct, individually cheap. The real find was probably the `web-cast.json` waste (10-15KB pre-compression) and Payload flagged it correctly as low-urgency. The "checked clean" list is where the value is: 43 innerHTML sinks enumerated, CSP round-tripped, no third-party network beyond the beacon. That is the audit that lets an owner sleep.

## 3. The consistency check

- **Weight disagreement on Med. ROI**: Ledger filed it Major (`ledger.md:8`), Median filed it Minor (`median.md:49`). Compiler took the higher rank. Median was right on the weight.
- **Duplicate ranking of §04 static h3**: Redline filed as Major (Redline #7 in `redline.md:40`), Ledger filed as Minor (`ledger.md:21`). The compiler kept both, once as Major #22 (correctly merged with §01) and once again as Minor #26. That is one defect counted twice.
- **Compiler embellishment on #21**: The "16 findings, 7 tabs" phrase is not in any hero report and does not exist in the source. The source string is "16 sections, 7 tabs" (`src/index.html:618`). The miscount claim is a compile-time invention.
- **Radar critique vs Chartjunk's own tolerance**: Chartjunk C1 (radar profit NaN) is filed Critical although §12 is deliberately the anti-pattern gallery; Chartjunk's own dek says the exercise is meant to be broken. The fix here (`profitOf(x)`) is not "make the radar honest," it's "make the demonstrated dishonesty run on real numbers." Correctly ranked, but the owner should not be confused into thinking the radar is supposed to work as a decision aid.
- **Fix for #7/#8 satisfies #12 and #49**: the same scrollIntoView-after-tab-swap change lands three findings, which the compiler filed as one Critical and two others.
- **Median #4 filter and Ledger #1 filter**: same code line (`src/index.html:2391`), same fix, one entry in the compiled list; correctly deduplicated.

## 4. Noticed, not filed

- The Minor batch in `REPORT.md` includes two non-findings from Redline (hedges preserved; house rules clean). Both are "checked clean" style observations that Redline chose not to change, and both were counted in the Minor total. This is why the compiler's 34-count does not tie out to the 30 items actually in the list.
- Ledger's "Suspected, not verified" on Spider-Man: Brand New Day's pace (`ledger.md:33`) is a real number worth an outside check: `ww = $2.408B` and `open = $360M` five weeks after opening would be historically unprecedented. The film is non-final so it stays out of the ranking charts, but the ratio-pair sentence in §14 (§14 line 1186) is exactly the place where a hand-set or bad-scrape number would leak into the copy. Meld did not send anyone to BOM to spot-check this specific film.
- The tie-out CLAIMS list gates 31 entries per Ledger and Median. Both `ledger.md:28` and `median.md` refer to it, but neither pinned the top-two budgets (Median's own worth-adding #1) or the current 2026 year totals, both of which appeared in the Critical findings this run. That is one hero's number contradicting a rule another hero passed clean.

## 5. Score

Of 54 items in the compiled list (Critical 8 + Major 16 + Minor 30 = 54; REPORT.md called it 55 and counted 34 minors when the list contains 30):

- **Stands: 46**
- **Downgraded: 6** (#9 Med. ROI weight; #21 miscount half; #32 axis-median fragility; #37 summary focus-visible; #38 byline; #49 cross-tab overlap; #52 404 charset)
- **Artifact: 3** (#20 chart marks touch; #42 hedges preserved as a finding; #43 house rules clean as a finding)

(That is 46 + 7 + 3 = 56 across 54 items because #21 splits: the three label headlines stand and the miscount line is a compiler ghost. Count as 46 stands, 6 downgrades, 3 artifacts if you refuse the split; count as 45 stands, 7 downgrades, 3 artifacts if you allow it. Either way the team was mostly right.)

REPORT.md's own totals do not reconcile to its own list. It declares "Critical 8, Major 13, Minor 34, total 55" (`REPORT.md:65-69`), but the Major section holds 16 items (#9..#24) and the Minor batch holds 30 items (per hero: Ledger 3 + Doppel 2 + Median 1 + Chartjunk 4 + Greyscale 4 + Redline 5 + Thumb 6 + Payload 5 = 30). Actual list: 8 + 16 + 30 = 54. The compiler counted 13 Majors where 16 appear and 34 Minors where 30 appear. The dedup line ("Raw findings across eight reports: 65, Deduplicated: 55") is the number the report keeps citing, and it is not the number that survives to the ranked list.
