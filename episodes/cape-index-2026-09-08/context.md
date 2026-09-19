*Meld here. Lights on. Every hero read this before they walk in.*

# 1. Identify

The Cape Index. A single-file, dark-first HTML data visualization covering 91 live-action Marvel or DC superhero films from 2000 onward that sit inside a multi-film continuity (MCU, Fox, SSU, DCEU, DCU, Elseworlds). Two holdouts (Avengers: Doomsday, Clayface) are unreleased on Box Office Mojo and carried in metadata only. Live at https://capeindex.com. Grew out of Bill Yost's Tableau Public workbook, then extended in scope and audited against Box Office Mojo. Repo is `cruce5/cape-index` on GitHub. Recent git log confirms an eight-lane audit already ran (commits like "Eight-persona brand audit", "Work through the eight-lane audit: 44 findings, 30 tie-out claims", "Fix the seven fix mismatches Doctor Missedit found"), and the audit team itself has just been packaged as `reconcilers/` and shipped as a downloadable zip.

# 2. The stack

Node 20+ ESM scripts (`"type": "module"`) drive a pipeline that ends in one hand-written HTML file. No framework, no charting library. Every chart is inline `<svg>`. `src/index.html` is a 4,112-line head-plus-body fragment with placeholders `__DATA__` and `__CAST__`; `scripts/build.mjs` inlines the slim JSON and wraps it in a full document at `dist/index.html`. Fonts are self-hosted IBM Plex (`assets/fonts/*.woff2` copied into `dist/fonts/`). Deploy target is Cloudflare Workers static assets (`wrangler.jsonc`, name `cape-index`, custom domains `capeindex.com` and `www.capeindex.com`); `dist/_headers` carries CSP with sha256 script hashes, HSTS preload, and a content-hashed `og.<hash>.png`.

- Build: `npm run build` (chains build-web, build-cast-web, tie-out, check-palette, build, og-image, build-bundle, build-sidecars).
- Full data refresh: `OMDB_KEY=... npm run data`, then `npm run cast`, then `npm run build`.
- Local preview: `node scripts/serve.mjs` serves `dist/` on http://localhost:4599. That dev server is currently running at http://localhost:4599 and returns 200 on `/`.
- Deploy: `npm run deploy` (build then `wrangler deploy`). Do not run it.
- Weekly refresh: `scripts/weekly-rebuild.ps1` (Windows Task Scheduler, Mondays) re-scrapes films inside a ~10 month window, rebuilds, and deploys. Logs at `scripts/weekly-rebuild.log`.

# 3. The data

Canonical dataset: `data/films.json` (5,494 lines, 91 films plus a `meta.held_out` list). Slimmed to `data/web.json` for the page and to `data/web-cast.json` for the roster. Pipeline, in order, per `package.json` `data` script:

1. `data/sheet-baseline.csv` (the legacy Tableau workbook rows) parsed by `scripts/parse-baseline.mjs` into `data/skeleton.json`.
2. `data/additions.json` lists every post-legacy film with a pinned IMDb `tt` id and universe tag.
3. `scripts/scrape-bom.mjs` walks Box Office Mojo one title page at a time (delay `BOM_DELAY`, default 5000 ms; `BOM_REFRESH=1` invalidates the cache for films younger than 300 days). Raw HTML caches to `data/raw/title-<tt>.html`. Output: `data/scraped.json`. Helpers in `scripts/lib-bom.mjs`.
4. `scripts/promote.mjs` merges scraped + additions + skeleton into `data/films.json`. Films with no worldwide gross on BOM are moved to `meta.held_out`. `FINAL_CUTOFF = "2026-07-01"` decides which releases are still climbing and therefore held out of profit tallies.
5. `scripts/enrich-omdb.mjs` fills RT-critic, Metacritic, IMDb scores via OMDb (`OMDB_KEY`), cached to `data/raw/omdb-<tt>.json`.
6. `scripts/enrich-wikipedia.mjs` backfills budgets (with `data/budget-overrides.json` as the last word). Anything not straight from BOM is `budget_estimated: true`. About a third of budgets are estimates.
7. `scripts/derive.mjs` adds `metrics.*`: `pct_domestic`, `pct_international`, `domestic_multiplier` (legs = domestic / opening), `roi_worldwide`, `breakeven_worldwide = round(budget * 2.5)`, `profit_vs_breakeven`, `profitable`, and 2025-dollar equivalents via `scripts/inflation.mjs` (CPI-U, `toReal2025`).
8. `scripts/reconcile.mjs` writes `RECONCILIATION.md` at the repo root: 50 legacy films re-checked (34 exact, 11 minor drift, 5 material), 41 new films verified, 2 held out.
9. Cast: `scripts/scrape-cast.mjs` reads Wikipedia `Cast` sections (list of pages in `data/wiki-pages.json`) into `data/cast-raw.json` and `data/characters.json`; `data/cast-overrides.json` and a hardcoded `CODE_KEEP` set decide which mononyms count as codenames. `scripts/build-cast-web.mjs` slims to `data/web-cast.json`.
10. `scripts/build-web.mjs` slims `films.json` to `data/web.json` with short keys (`t`, `u`, `date`, `wd`, `wi`, `ww`, `open`, `ropen`, `wd`/`wi`/`ww` in 2025 dollars as `rd`/`ri`/`rw`, `budget`, `budgetEst`, `rbudget`, `rt`, `mc`, `imdb`, `pctDom`, `pctIntl`, `mult`, `roi`).
11. `scripts/build.mjs` splices `web.json` and `web-cast.json` into `src/index.html` at `__DATA__` / `__CAST__` and emits `dist/index.html` (standalone doc) plus `build/artifact.html` (the head-plus-body fragment for a claude.ai Artifact host).
12. `scripts/build-sidecars.mjs` writes `dist/robots.txt`, `dist/sitemap.xml`, `dist/404.html`, and `dist/_headers` (CSP built from sha256 of each inline script; content-hashes `og.png`).
13. `scripts/build-bundle.mjs` zips `reconcilers/` to `dist/reconcilers.zip` (byte-stable timestamps).

Hand-typed numbers to watch: every hand-written figure in prose is enumerated in `scripts/tie-out.mjs` (CLAIMS list, ~30 entries) and compared to values recomputed from `web.json`; the build fails on any drift. Everything else (masthead totals, ledger cell values, chart marks) is computed at runtime from the inlined `DB.films`. `data/budget-overrides.json` and `data/cast-overrides.json` are the two files where a human number can enter without an audit trail; both are read by their respective enrich scripts.

# 4. The surfaces

One page, one URL. `src/index.html` builds a masthead, a tab strip, and sixteen numbered sections (`§01`..`§16`) grouped into six tabs via `data-tab`: `act1`, `act2`, `act3`, `act4`, `mistakes`, `ledger`, `ref`. Sections and their `id`s:

- `§01 v-scorecard` Marvel v DC scorecards, headline "Marvel Studios has out-grossed every DC film combined, nearly three to one" (`renderScorecards`, `renderThesis`, `renderYear`).
- `§02 v-treemap` universe treemap.
- `§03 v-beeswarm` bubbles by release date, own $ toggle.
- `§04 v-scatter` billion-dollar-club scatter.
- `§05 v-budget` five-year rolling-median budget band.
- `§06 v-profit` profit vs 2.5x break-even.
- `§07 v-legs` domestic multiplier.
- `§08 v-reviews` reviews vs revenue (scatter with median quadrant lines).
- `§09 v-split` domestic vs overseas.
- `§10 v-roster` who appears in which film (ensemble grid).
- `§11 v-footprint` most-traveled characters.
- `§12 v-antipatterns` (tab `mistakes`) built-from-real-data anti-patterns.
- `§13 v-data` (tab `ledger`) the full sortable table.
- `§14 v-method` how it was built.
- `§15 v-process` the build log (see below).
- `§16 v-reconcilers` the Reconcilers roster and download.

All rendering is client-side from the inlined `DB` (`DATA` script tag). Renderers named `render*` (see `renderAll` at line 3697). State: `STATE = { unis, money: "nominal"|"real", lens: "universe"|"brand", outlierHide, splitSort, sort, expand }`. Theme is dark-first with a pre-paint script that reads `localStorage.capeindex-theme`. Every chart carries a plain-number data table (called out as the accessibility backbone in §13's note).

Build time only: `dist/og.<hash>.png` (via `scripts/og-image.mjs`, `@resvg/resvg-js`), `dist/reconcilers.zip`, `dist/_headers`, `robots.txt`, `sitemap.xml`, `404.html`.

# 5. The checks

- `scripts/tie-out.mjs` (~30 claims) recomputes every hand-typed number and every load-bearing sentence in `src/index.html` from `data/web.json` and `data/web-cast.json`. Fails the build on drift. Wired into `npm run build` and the weekly rebuild.
- `scripts/check-palette.mjs` validates the two light theme blocks agree token-for-token, that every categorical pair stays separable in OKLab under normal / protanopia / deuteranopia (gated) and tritanopia (reported), and that every ink token clears WCAG AA on every surface it prints on.
- `scripts/validate-matches.mjs` sanity-checks scraper title matches.
- `scripts/build-sidecars.mjs` refuses to write `_headers` if it finds any inline `on*` handler or `javascript:` URL (a hashed CSP would break the page).
- No unit tests, no linter, no CI. The gates are the two check scripts and the build itself. `npm run check` runs tie-out and palette without a full rebuild.

# 6. The conventions

- Dark mode is the primary target, not an afterthought. Light is a strict mirror in a second `:root` block and a `[data-theme="light"]` override.
- Palette is CVD-safe (Paul Tol "bright" plus gray), one categorical hue per universe, mark shape as a backstop. Marvel v DC lens uses red/blue only because two categories have room for it.
- Three faces, one job each: IBM Plex Sans Condensed for headings and hero numbers, Sans for prose, Mono for figures. Declared once as CSS variables with real fallbacks.
- Section headlines state the finding, never the axis (Redline territory). Deks say what the chart cannot tell you. Median over mean; small-n gate is `MIN_N = 4`.
- Currency is USD nominal by default; `STATE.money = "real"` swaps to 2025 dollars via `toReal2025` (CPI-U in `scripts/inflation.mjs`).
- Numbers under 21 are spelled out in prose via `NUM` / `WORDS` arrays; charts and tables show digits.
- Every encoded value must be a plain sortable number in §13.
- `budget_estimated: true` films must be marked `est.` in any budget surface; in-release films (`is_final: false`) are held out of profit / legs / ROI / reviews and included in totals / medians / club counts.
- House voice is dry, deadpan, specific. **No em dashes anywhere.** This is a hard rule in the skill card, the README, the build log, and the user's own memory; every audit report the heroes write must also contain none.

# 7. Cold-start traps

1. **`src/index.html` is a fragment, not a document.** No `<!doctype>`, `<html>`, `<head>`, `<body>`. `scripts/build.mjs` wraps it. Editing `dist/index.html` directly is throwaway.
2. **The page is built with placeholders.** `__DATA__` and `__CAST__` are the only two seams; if either goes missing `build.mjs` throws. `dist/*` is generated: everything you see there came from `src/index.html` plus `data/web.json` plus `data/web-cast.json`.
3. **Two light-theme blocks must stay in sync.** There is an `@media (prefers-color-scheme: light)` block and a `:root[data-theme="light"]` block. `check-palette.mjs` gates that they match token-for-token; do not edit one without the other.
4. **`data/raw/` is gitignored on purpose.** BOM HTML, OMDb JSON, and Wikipedia wikitext caches. They are regenerable from the scripts plus `additions.json`. Deleting a file forces a re-scrape. `BOM_REFRESH=1` invalidates the cache only for films younger than 300 days; older films stay frozen.
5. **`data/films.json` looks hand-authored but is not.** `metrics.*` is regenerated by `derive.mjs` and `meta.generated` is overwritten every run. Do not edit metrics directly; change the source (budget override, additions entry) and rebuild. `FINAL_CUTOFF = "2026-07-01"` in `scripts/promote.mjs` controls which films count as done, and moves manually.
6. **CSP is a script-sha256 whitelist.** Any change to either inline `<script>` block (the theme pre-paint one at line 31, or the page script at line 1484) requires rebuilding `dist/_headers`. `build-sidecars.mjs` does it. Add an `on*` handler and the sidecar build throws before deploy.
7. **`OMDB_KEY` is required.** `scripts/local.env.ps1` is gitignored; copy from `local.env.example.ps1`. The weekly rebuild throws if `$env:OMDB_KEY` is unset. `wrangler` deploys need Cloudflare auth already in place; do not attempt one.

# 8. Note on §15

`§15 v-process` in `src/index.html` (lines 1198 to 1398) is the running build log: the brief, every follow-up (hand-typed count kept honest by tie-out), every bug and every design call. This site has already had audit passes. Anything the log records as fixed is not what a new audit should hunt for; the audit hunts for what is there now. Consult it, do not re-summarise it. `RECONCILIATION.md` is the sign-off doc for the BOM re-check against the legacy Tableau sheet.

# Per-hero notes

**Ledger** (data integrity). Your files: `data/films.json`, `data/web.json`, `data/budget-overrides.json`, `data/additions.json`, `RECONCILIATION.md`. Every hand-typed number that lives in prose is enumerated in `scripts/tie-out.mjs` CLAIMS; run `node scripts/tie-out.mjs` first to see what the build already gates, then look for the numbers it does not (in `§14`, `§15`, `§16`, and captions inside `§12`). ~30% of budgets are `budget_estimated:true`; the estimate share is claimed as "A third" in `§14` and gated by tie-out. Rule of thumb baked in: `breakeven_worldwide = budget * 2.5`. In-release films (`is_final:false`) are held out of profit tallies and the ledger's opening / multiplier medians; check that rule holds anywhere a completed-slate number appears. Do not waste time re-scraping BOM.

**Doppel** (entities and consistency). Your files: `data/additions.json` (pinned IMDb `tt` ids, the canonical join key), `data/characters.json`, `data/cast-raw.json`, `data/cast-overrides.json`, `data/web-cast.json`. Watch: `CANON_TITLE` in `scripts/promote.mjs` (currently only `"Joker: Folie a Deux"` -> `"Joker: Folie à Deux"`), the `CODE_KEEP` mononym set in `scripts/scrape-cast.mjs`, `primaryUniverse` tiebreak in `build-cast-web.mjs`. Recasts collapse to one character (`.actors`, `.fa`). Cross-check: every title in `web-cast.byFilm` must exist in `web.json.films[].t`, and every character's film list is filtered against that set. `Elseworlds` label appears as a "universe" but the roster treats it as a bucket; Marvel v DC lens (`BRAND`, `BRANDVAR`) maps universes to brands. Do not spend time on IMDb id verification (already done by the scraper's title match).

**Median** (statistics). Your files: `scripts/derive.mjs`, the `median`, `quantile`, `MIN_N` block in `src/index.html` around line 1513 and 1626. `MIN_N = 4` is the small-n floor; tie-out asserts it is referenced at least six times so nobody hard-codes a threshold again. Look for means presented where the slate is skewed (a prior audit caught §01 leading with four averages; check it did not come back), for medians of two or three films a year (see the §05 five-year rolling median with middle-50% band), for correlations without a plotted line where §12 says do not plot one, and for any n printed without its denominator. Denominators: many charts filter to `is_final && f.budget` or `f.rt != null && f.final`.

**Chartjunk** (visualization craft). Your files: `src/index.html` `<svg>` blocks (every renderer named `render*` at lines 1810 to 3552), `§12 v-antipatterns` (already an eight-item catalogue with "instead" prescriptions), `scripts/check-palette.mjs`. No charting library. All axes hand-drawn. Dark first, mirrored to light. Six categorical hues plus a lens that collapses to two. Look for: an anti-pattern in a chart that is not in §12, a legend hue that is not paired with a shape backstop (see `BRAND_SHAPE`), a dual axis (banned), a trend line the data does not support (banned), and any chart lacking a data table (§13's note calls the tables the accessibility backbone and eleven of fourteen had one before an audit; check the count still balances).

**Thumb** (UX, mobile). Your files: the running dev server at http://localhost:4599 (front the browser pane; Greyscale should prefer the DOM tree and take the pane only after you finish). Every chart measures its own container; nothing should render under 12px on a phone. The filter bar collapses to a one-row summary on mobile. Look for tap targets under 44px, horizontal scroll traps in `§13` (ledger), the mobile tab-strip fade at the edges, Back / Next pager row that must not wrap, and hovercards that assume a mouse. Do not audit the desktop layout the log already fixed (side-by-side scorecards, freeze-first-column ledger, etc.).

**Greyscale** (accessibility). Your files: `scripts/check-palette.mjs` (WCAG AA is gated on ink-on-surface pairs and OKLab separation on hue pairs; run it), keyboard navigation across the tab strip and every `<details>` in `§15`. Every chart must be tab-reachable and have a data table. Look for SVG marks without an accessible name, images without alt text (there are none; assert it stays true), `aria-expanded` on the collapse toggles (see `collapseChart` and `foldToggle`), and focus visibility on the pager. Prefer the accessibility tree; front the browser pane only if Thumb is done.

**Redline** (editorial). Your files: `src/index.html` prose (every `.dek`, `<h3>`, `.card-title`, and the build-log `<li>` items in §15), `scripts/tie-out.mjs` for what is already gated. House voice: dry, deadpan, no em dashes ever. Section headlines state the finding, not the axis; the "no em dashes" rule is called out in the log and the skill card and must hold in every file the team writes. Look for a claim that has quietly rotted out from under its chart (a prior audit found eight), for "nearly" / "roughly" hedges the data can name precisely, for any place a label doubles as a headline, and for anywhere the copy mentions a toolbar or a position on the page that has since moved.

**Payload** (engineering, security, performance). Your files: `wrangler.jsonc`, `scripts/build-sidecars.mjs`, `dist/_headers` (generated; do not edit), the two inline `<script>` blocks in `src/index.html` (theme pre-paint at line 31, page script at line 1484), `scripts/build.mjs` (its `esc()` guards `</...>` in inlined JSON). CSP is `default-src 'none'` plus a sha256 whitelist for each inline script; `not_found_handling: "404-page"`. Cloudflare Web Analytics beacon at `static.cloudflareinsights.com` is the only third-party script. Look for `innerHTML` sinks that could ingest data from the JSON payload, `on*` handlers that would trip the CSP guard, unbounded `requestAnimationFrame` loops, listeners never released, `fetch` calls (there should be none client-side), and any font or image not self-hosted. Do not audit the deployment: read-only.
