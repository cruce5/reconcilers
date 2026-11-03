PLUMB · fairness

*I let the bob drop through the roster and the review chart, and it settled toward Wakanda, Atlantis and every film with a woman's name on the poster.*

The Cape Index makes no judgement about its readers, but it describes people in two places. The cast roster decides which characters count as heroes and villains, and the §08 chart relays a crowd's verdict on each film. I ran the product's own functions on matched examples: `parseCast`, `codenameOf`, `canonOf` and `lookup`, lifted unchanged from `scripts/scrape-cast.mjs`, and `spotSearch`, lifted unchanged from `src/index.html`. I ran the review numbers in `data/web.json` through regressions and permutation tests. The data was as of the 2026-11-02 refresh: 92 films, 258 roster characters, 93 cached Wikipedia cast pages. Scratch scripts lived outside the repo. Nothing in the repo was changed.

## Critical

None.

## Major

**1. The hand list of single-name characters admits whole cosmic and Eternals ensembles and none of the Wakandan, Atlantean or Amazon ones, contrary to the page's own stated rule.**
- Who: the supporting heroes of Black Panther, Wakanda Forever, Aquaman and Wonder Woman. Most are Black characters played by Black actors, or women. They are dropped from the roster, while characters with the same shape from other films are kept.
- Where: `CODE_KEEP` at `scripts/scrape-cast.mjs:47-69`, consumed by `codenameOf` at `:177-188` and by `CANON_LC` at `:457`. The stated rule is at `src/index.html:1191`: "Plain-name roles are out even when the person is central... A few named antagonists without a codename (Lex Luthor, Zod, Amanda Waller) are admitted by hand." The rule is published as "Every costumed hero and villain" (`:1179`) and "How many heroes and villains each film puts on screen" (`:1199`).
- Matched pairs through `codenameOf` and `canonOf`. Each pair is a single name with no alias and no on-screen codename, credited as a top-billed bullet, in the same universe:
  - Wong (MCU, 6 films) returns "Wong". Okoye (MCU, 4 films, fights in the Infinity War and Endgame battles) returns null.
  - Korg (2 films) is admitted. Heimdall (5 films) returns null.
  - Gamora, Mantis and all ten Eternals (Sersi, Sprite and the rest) are admitted. M'Baku (4 films), Nakia and Sif return null.
  - In Aquaman, Orm and Black Manta are admitted. Mera (3 films, top-billed in all three) and Atlanna return null.
- Not one of the admitted plain names in this list is an antagonist. Wong, Korg, Kraglin, Clea, Ayesha and the Eternals are all allies, so the code's exception is wider than the rule the page prints.
- Counted gap, top-billed single-name credits admitted, per film (data keys `byFilm` in `data/web-cast.json`, `cast[].minor=false` in `data/cast-raw.json`):

  | Film | Admitted | Who is left out |
  |---|---|---|
  | Eternals | 10 of 10 | nobody |
  | Guardians of the Galaxy | 6 of 6 | nobody |
  | Thor: Ragnarok | 4 of 8 | Heimdall, Odin, Skurge, Grandmaster |
  | Black Panther | 0 of 8 | Okoye, Nakia, Shuri, M'Baku, W'Kabi, Ramonda, Zuri, N'Jobu |
  | Wakanda Forever | 2 of 8 | the 2 admitted are both Talokanil (Namor, Namora); 0 of 6 Wakandans |
  | Aquaman, and Lost Kingdom | 0 of 3 each | Mera, Atlanna, Nereus |
  | Wonder Woman | 0 of 5 | includes Hippolyta and Antiope |

  Across every recurring single name (2 or more films): Guardians and cosmic 8 of 9 admitted, Wakanda 0 of 6, Atlantis and Themyscira 0 of 5.
- What it does to the page: Black Panther shows 2 characters in "Codenamed characters per film", tied 11th lowest of 92 films. Heimdall's 5 films equal Gamora's and Mantis's 5. Okoye's and M'Baku's 4 equal Thanos's and Kraglin's 4. None of the four appears in §11 "most-traveled".
- Honest cause, partly: Ramonda, Zuri, N'Jobu and Odin are royals or elders who do not fight. But Okoye, M'Baku, Nakia, Shuri, W'Kabi, Mera, Sif and Heimdall do fight, exactly as Wong, Korg and Gamora do. The only thing separating them is membership in a list someone typed.
- Fix: write the admission test down as a rule (for example, "a single-name character who fights on screen in at least one battle counts") and apply it to every single-name credit, or drop Wong, Korg, Kraglin and the Eternals to match the printed rule.

**2. §08 calls IMDb "the audience", and IMDb rates every women-led film below what its critics' score predicts.**
- Who: the nine films led by a woman: Elektra, Wonder Woman, Wonder Woman 1984, Captain Marvel, The Marvels, Black Widow, Birds of Prey, Madame Web, Supergirl. The page presents IMDb's self-selected raters as the general audience and ranks these films as ones the audience liked less.
- Where: card title "Critics vs audiences" (`src/index.html:1126`), card note "the critics cratered and the audience held up" (`:1127`), design note (`:1135`), the plot label "audience rated higher" (`:3336`), the svg aria-label "audience score" (`:3370`), and the table column "Audience lead", computed as `imdb*10 - rt` (`:3377-3380`). Data keys are `imdb`, `rt` and `mc` in `data/web.json`.
- Evidence: I regressed IMDb on Metacritic score and release year across the page's own film set (`rt != null && imdb != null`, n=91) and measured each film's residual.
  - All 9 women-led films fall below prediction, against 43 of 82 other films. Mean residual is -0.76 IMDb points, against 0.00. One-sided permutation p is under 0.001 (20,000 shuffles).
  - It holds on Metacritic alone (-0.77, 9 of 9 below) and on RT plus year (-0.75, 9 of 9 below). Adding Dark Phoenix it is 10 of 10 below.
  - Matched pairs: each of the 7 women-led films that has films within 3 RT points scores below their median IMDb. Captain Marvel is 6.7 against 7.1. Wonder Woman is 7.3 against 7.8 (n=19). Wonder Woman 1984 is 5.3 against 6.6.
  - On the page's own metric, the women-led median "Audience lead" is -8 points, against -3 for the rest. Wonder Woman ranks 89th of 91 and Birds of Prey 83rd.
  - Supporting, at smaller n: films led by people of colour (n=7) run 6 of 7 below prediction, median residual -0.28, p 0.03, driven by Black Panther (-1.40) and Blue Beetle (-1.03).
- Honest cause? Critic scores are held constant, so "these films are just worse" does not explain the gap. The likely mechanism is who rates on IMDb, a self-selected and largely male crowd, but that is not proven here (see Suspected). The page has no other audience measure, such as CinemaScore or exit polling, to separate the two.
- Fix: call the axis "IMDb user rating" and the column "IMDb lead", not "audience", and add one Watch-for line saying IMDb raters are a self-selected group whose ratings run lower for women-led films at the same critic score.

## Minor

**3. Spotlight search finds names with apostrophes or accents only when they are typed exactly as stored.**
- Who: readers searching for the four characters whose names carry an apostrophe: T'Challa (Black Panther), N'Jadaka (Killmonger), Ra's al Ghul, and Marie D'Ancanto (Rogue). Also readers searching for "Joker: Folie à Deux".
- Where: `spotSearch`, `src/index.html:4624-4636`. Line 4632 folds case only.
- Evidence, through the lifted function:
  - Plain real names ("tony stark", "peter parker", "bruce wayne", "harleen") are found 4 of 4 times.
  - The apostrophe names are found with a straight apostrophe, but miss 8 of 8 times typed with a curly apostrophe or none ("t’challa", "tchalla", "njadaka", "ras al ghul", and so on).
  - "folie a deux" without the accent misses 2 of 2.
- Fix: before comparing, normalise both the query and the indexed text the same way: decompose accents and drop them (NFD, then remove combining marks), and drop apostrophes of every kind.

**4. The roster's case-insensitive name lookup strips apostrophes from the query but not from the keys, so apostrophe names lose their fallback.**
- Who: the only keys affected are T'Challa, N'Jadaka and Kʼukʼulkan (African and Mesoamerican names) and Ra's al Ghul (Arabic).
- Where: `lookup`, `scripts/scrape-cast.mjs:461`. That line strips `'` and `’` from the query, while `CANON_LC` at `:455-457` keeps them in the keys.
- Evidence: I fed `lookup` case variants and curly-apostrophe variants of every `CANON` key.
  - The 949 plain variants resolve 949 of 949 times.
  - The 11 variants of the apostrophe keys resolve 2 times. "t'challa", "T’Challa", "Ra's Al Ghul" and "K'uk'ulkan" all return null, while "BRUCE WAYNE" returns Batman.
  - Latent today: all four current credits resolve through an exact match or the "/" split (checked across `data/cast-raw.json`).
- Fix: build `CANON_LC` with the same normalisation as the query (lower case, apostrophes and quotes removed).

**5. The cast parser recognises unlinked actor names only if every letter is in Latin-1.**
- Who: actors whose names use Polish, Turkish, Vietnamese, Serbo-Croat or Hawaiian letters, or Japanese romanised with macrons.
- Where: the unlinked-actor regex at `scripts/scrape-cast.mjs:103`, and the first-letter check in `addProse` at `:138`. Both use `\w` (ASCII only) and the range `À-ÿ`.
- Evidence: I ran the same bullet, `* <name> as Jane Doe / Night Owl: ...`, with 22 names.
  - All 14 names in ASCII or Latin-1 are kept, including Tenoch Huerta Mejía, Zoë Kravitz and Lupita Nyong'o.
  - All 8 names with a letter outside Latin-1 are dropped: Ōmi Nakamura, Kōji Yakusho, Michał Żebrowski, Łukasz Simlat, Nguyễn Thị Hà, Şebnem Ferah, Đorđe Balašević and ʻIolani Kahale.
  - Linked bullets keep all 22. The prose path drops all 5 names that start outside Latin-1.
  - Latent today: the 93 cached cast sections hold two such actors, Stefan Kapičić and Goran Višnjić, and both are wiki-linked, so 0 credits are lost.
- Fix: use `\p{L}` and `\p{Lu}` with the `u` flag in both places, and allow the okina.

## Suspected, not verified

- **Gender balance of the roster as a whole.** There is no gender field in the data, and a pronoun scan of Wikipedia bullets labelled only 58 of 949 top-billed credits, too few to report a rate. A hand label of the 258 characters would settle it.
- **The mechanism behind Major 2.** That IMDb's raters skew male, and that the shortfall comes from coordinated low ratings, is consistent with the gap but not tested here. IMDb's per-demographic breakdowns were not fetched.
- **Curly apostrophes from phone keyboards.** iOS Smart Punctuation may type ’ into `#spot-input` despite `autocorrect="off"` (`src/index.html:807`), which would turn Minor 3 into the default experience on iPhone. I did not test it on a device.

## Checked clean

- **Pepper Potts and War Machine.** Rhodes counts from Iron Man 2 and Pepper never counts. The honest cause is an on-screen codename: Wikipedia's own comment in the cached Endgame cast section notes she never goes by "Rescue". The rule is applied the same way to both.
- **Pronouns in the cast regexes.** "reprises his / her / their role as" parses alike in bullets (1 row each) and in the prose zip (2 rows each), at `scripts/scrape-cast.mjs:101` and `:146-151`. Non-binary phrasing is not dropped.
- **Plain-name exclusions named on the page.** Nick Fury, Pepper Potts and Alfred are out, as `src/index.html:1191` says.
- **Mantle splits.** The splits that cross gender or race lines are treated the same way: Natasha and Yelena, Steve Rogers and Sam Wilson, T'Challa and Shuri, Carol Danvers and Maria Rambeau (`scripts/scrape-cast.mjs:195-255`).
- **Latin-1 accents and apostrophes in actor names.** They survive to `data/web-cast.json` intact: Zoe Saldaña, Xolo Maridueña, Tenoch Huerta Mejía, María Gabriela de Faría, Meng'er Zhang, Ciarán Hinds, Daniel Brühl. Linked actor names parse identically whatever their script (22 of 22).
- **Page copy.** A sweep of `src/index.html` for othering or exclusionary terms (guys, fanboy, exotic, ethnic, urban, tribe, crazy, lame, mankind and similar) found none in prose.
- **Who the film slate covers.** Not re-run here. Turnstile's September scope check found no missing or wrongly included film.
- **No judgement about readers.** The page scores, filters and recommends nothing about the people reading it, and it collects no reader input beyond the Spotlight query, which never leaves the page.
