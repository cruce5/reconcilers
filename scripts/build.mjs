// Build the Reconcilers site into dist/: the home page, the sample episode, the bundle zip, a
// share card, and the static sidecars. Three gates fail the build rather than ship something
// wrong: an em dash anywhere, a speech balloon that is not word for word in its source report,
// and a page that points at an asset that is not there.
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, rmSync, copyFileSync, existsSync } from "node:fs";
import { join, relative, sep, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { deflateRawSync } from "node:zlib";
import { Resvg } from "@resvg/resvg-js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = join(ROOT, "site"), DIST = join(ROOT, "dist"), BUNDLE = join(ROOT, "bundle");
const EP_DIR = join(ROOT, "episodes/cape-index-2026-09-08");
const cfg = JSON.parse(readFileSync(join(ROOT, "site.config.json"), "utf8"));
const fails = [];
const fail = (m) => fails.push(m);

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
// a manifest string: escaped, with `code` spans
const inline = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
const lf = (s) => s.replace(/\r\n/g, "\n");
const write = (p, s) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, lf(s)); };

// empty dist/ rather than delete it: a running `wrangler dev` holds the folder itself open
mkdirSync(DIST, { recursive: true });
for (const n of readdirSync(DIST)) rmSync(join(DIST, n), { recursive: true, force: true });

// ---------- static assets ----------
function copyDir(from, to) {
  mkdirSync(to, { recursive: true });
  for (const n of readdirSync(from)) copyFileSync(join(from, n), join(to, n));
}
copyFileSync(join(SITE, "app.css"), join(DIST, "app.css"));
copyFileSync(join(SITE, "episode.css"), join(DIST, "episode.css"));
copyFileSync(join(SITE, "carousel.js"), join(DIST, "carousel.js"));
copyDir(join(SITE, "portraits"), join(DIST, "portraits"));
copyDir(join(SITE, "fonts"), join(DIST, "fonts"));

// ---------- the bundle zip (ported from capeindex.com's build-bundle.mjs) ----------
// A minimal ZIP writer (deflate via zlib): no dependency, and Windows tar cannot write zip.
// Entries keep the "reconcilers/" prefix so the README's install paths stay true.
const CRC = new Int32Array(256);
for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; CRC[n] = c; }
const crc32 = (buf) => { let c = -1; for (const b of buf) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ -1) >>> 0; };
function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir).sort()) {
    if (/\.(jpe?g|png|webp)$/i.test(name) || name === "cropped") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p)); else out.push(p);
  }
  return out;
}
const dosTime = 0x0000, dosDate = ((2026 - 1980) << 9) | (9 << 5) | 8; // fixed stamp: byte-identical rebuilds
const zipFiles = walk(BUNDLE), locals = [], centrals = [];
let offset = 0;
for (const p of zipFiles) {
  const name = Buffer.from("reconcilers/" + relative(BUNDLE, p).split(sep).join("/"), "utf8");
  const data = readFileSync(p), comp = deflateRawSync(data, { level: 9 }), crc = crc32(data);
  const head = Buffer.alloc(30);
  head.writeUInt32LE(0x04034b50, 0); head.writeUInt16LE(20, 4); head.writeUInt16LE(0x0800, 6); head.writeUInt16LE(8, 8);
  head.writeUInt16LE(dosTime, 10); head.writeUInt16LE(dosDate, 12); head.writeUInt32LE(crc, 14);
  head.writeUInt32LE(comp.length, 18); head.writeUInt32LE(data.length, 22); head.writeUInt16LE(name.length, 26); head.writeUInt16LE(0, 28);
  const cen = Buffer.alloc(46);
  cen.writeUInt32LE(0x02014b50, 0); cen.writeUInt16LE(20, 4); cen.writeUInt16LE(20, 6); cen.writeUInt16LE(0x0800, 8); cen.writeUInt16LE(8, 10);
  cen.writeUInt16LE(dosTime, 12); cen.writeUInt16LE(dosDate, 14); cen.writeUInt32LE(crc, 16); cen.writeUInt32LE(comp.length, 20); cen.writeUInt32LE(data.length, 24);
  cen.writeUInt16LE(name.length, 28); cen.writeUInt32LE(0, 38); cen.writeUInt32LE(offset, 42);
  locals.push(head, name, comp); centrals.push(cen, name);
  offset += head.length + name.length + comp.length;
}
const cdir = Buffer.concat(centrals), end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(zipFiles.length, 8); end.writeUInt16LE(zipFiles.length, 10);
end.writeUInt32LE(cdir.length, 12); end.writeUInt32LE(offset, 16);
const zip = Buffer.concat([...locals, cdir, end]);
writeFileSync(join(DIST, "reconcilers.zip"), zip);
const zipKB = Math.round(zip.length / 1024);
// The zip is reproducible (fixed timestamps, sorted entries), so its SHA-256 is a promise anyone can
// check: download it, or rebuild it from the repo, and the hash matches. Published next to the file in
// the standard sha256sum format, and printed under the download button.
const zipSha = createHash("sha256").update(zip).digest("hex");
writeFileSync(join(DIST, "reconcilers.zip.sha256"), `${zipSha}  reconcilers.zip
`);
const agentCount = zipFiles.filter((p) => /[\\/]agents[\\/].+\.md$/.test(p)).length;

// ---------- share card: real portraits, not a motif ----------
const W = 1200, H = 630, SANS = "Arial, 'Helvetica Neue', Helvetica, sans-serif";
const cardHeroes = ["meld.jpg", "beacon.jpg", "ledger.jpg", "greyscale.jpg", "redline.jpg", "doctor_missedit.jpg"];
const cw = 150, ch = 176, gap = 14, gx = 692, gy = 128;
const tiles = cardHeroes.map((f, i) => {
  const x = gx + (i % 3) * (cw + gap), y = gy + Math.floor(i / 3) * (ch + gap);
  const b64 = readFileSync(join(SITE, "portraits", f)).toString("base64");
  return `<clipPath id="c${i}"><rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="14"/></clipPath>` +
    `<image href="data:image/jpeg;base64,${b64}" x="${x}" y="${y}" width="${cw}" height="${ch}" preserveAspectRatio="xMidYMin slice" clip-path="url(#c${i})"/>`;
}).join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#caa25e"/><stop offset="1" stop-color="#a58cf2"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="#0d0f14"/>
  <rect x="0" y="0" width="${W}" height="6" fill="url(#g)"/>
  <text x="64" y="150" font-family="${SANS}" font-size="21" letter-spacing="4" fill="#8a92a4">AN AUDIT TEAM FOR DATA PRODUCTS</text>
  <text x="60" y="250" font-family="${SANS}" font-size="70" font-weight="800" fill="#f2f3f7" letter-spacing="-2">The Reconcilers</text>
  <rect x="64" y="278" width="540" height="6" rx="3" fill="url(#g)"/>
  <text x="64" y="346" font-family="${SANS}" font-size="30" fill="#a6acbb">They don&#8217;t save the world.</text>
  <text x="64" y="386" font-family="${SANS}" font-size="30" fill="#a6acbb">They check it.</text>
  <text x="64" y="508" font-family="${SANS}" font-size="26" font-weight="700" fill="#f2f3f7">Ten heroes, one villain, your data product.</text>
  <text x="64" y="546" font-family="${SANS}" font-size="21" fill="#8a92a4">A Claude Code skill, with a Codex adapter.</text>
  ${tiles}
</svg>`;
const png = new Resvg(svg, { fitTo: { mode: "width", value: W }, font: { loadSystemFonts: true } }).render().asPng();
const og = `og.${createHash("sha256").update(png).digest("hex").slice(0, 10)}.png`;
writeFileSync(join(DIST, og), png);

const fill = (s) => s.replaceAll("{{ORIGIN}}", cfg.origin).replaceAll("{{OG}}", og).replaceAll("{{GITHUB}}", cfg.github)
  .replaceAll("{{CAPEINDEX}}", cfg.capeindex).replaceAll("{{ZIP_KB}}", String(zipKB)).replaceAll("{{ZIP_SHA}}", zipSha);

// ---------- home ----------
const carousel = readFileSync(join(SITE, "_carousel.html"), "utf8");
const slideCount = (carousel.match(/class="rec-slide[" ]/g) || []).length;
write(join(DIST, "index.html"), fill(readFileSync(join(SITE, "index.html"), "utf8").replace("{{CAROUSEL}}", carousel)));

// ---------- the sample episode, as a comic ----------
// Two voices, kept apart on purpose. Speech balloons are the heroes' own words, and every one must
// be word for word in the report it came from (the build fails otherwise). Yellow captions are the
// narrator, in plain English. The raw reports are not rendered here; they live on GitHub.
const ep = JSON.parse(readFileSync(join(EP_DIR, "episode.json"), "utf8"));
const src = (f) => readFileSync(join(EP_DIR, f), "utf8").replace(/\r/g, "");
const verify = (file, q) => { if (!src(file).includes(q)) fail(`episode quote not verbatim in ${file}: "${q.slice(0, 70)}"`); return q; };
let balloons = 0;
const balloon = (file, b, who, cls = "") => { verify(file, b.q); balloons++;
  return `<p class="balloon${cls}"><span class="sr-only">${esc(who)} says: </span>${esc((b.pre || "") + b.q + (b.post || ""))}</p>`; };
ep.report.stats.forEach((c) => verify(ep.report.file, c.quote));
ep.doctor.score.forEach((c) => verify(ep.doctor.file, c.quote));
verify(ep.doctor.file, ep.doctor.catch);
verify(ep.beacon.file, ep.beacon.cry);

// The team forbids em dashes, and one report on this run used them anyway. The count is computed
// here from the unedited files and told as the last panel's joke, not typed.
const reportFiles = ["context.md", ...ep.heroes.map((h) => `${h.slug}.md`), "REPORT.md", "missedit.md", ep.beacon.file, ep.summon.file];
const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
const NAMES = Object.fromEntries(ep.heroes.map((h) => [`${h.slug}.md`, h.name]));
const dashes = reportFiles.map((f) => ({ who: NAMES[f] || f, n: (src(f).match(/—/g) || []).length })).filter((d) => d.n);
const ps = dashes.length
  ? `P.S. Nobody caught this one, the Doctor included: ${dashes.map((d) => `${d.who}&rsquo;s report broke the team&rsquo;s own no-em-dash rule ${WORDS[d.n] || d.n} time${d.n === 1 ? "" : "s"}`).join("; ")}.`
  : "";

const img = (file, alt) => `<img src="/portraits/${esc(file)}" width="720" height="720" alt="${esc(alt)}" loading="lazy" decoding="async">`;
const sfx = (t, cls = "") => `<span class="sfx${cls}" aria-hidden="true">${esc(t)}</span>`;
const cap = (t, cls = "") => `<p class="cap${cls}">${esc(t)}</p>`;
const heroPanel = (h) => `<figure class="panel hero">
      ${cap(h.cry, " cry")}
      <div class="art">${img(h.portrait, h.name)}${sfx(h.fx)}</div>
      ${balloon(`${h.slug}.md`, h.balloon, h.name)}
      <figcaption class="cap">${esc(h.caught)}</figcaption>
    </figure>`;
const stat = (c, cls = "") => `<div class="stat${cls}"><span class="burst" aria-hidden="true"></span><b>${esc(c.v)}</b><span>${esc(c.k)}</span></div>`;
const cast = ["meld", "beacon", "ledger", "chartjunk", "thumb", "doctor_missedit"];

const episode = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="dark light">
<title>${esc(ep.title)} · The Reconcilers</title>
<meta name="description" content="A real Reconcilers episode, told as a comic: nine heroes audit ${esc(ep.product)}, then Doctor Missedit audits them.">
<link rel="canonical" href="{{ORIGIN}}/episode">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(ep.title)} · a Reconcilers comic">
<meta property="og:description" content="Eight heroes audited ${esc(ep.product)} in parallel. Then the villain audited them.">
<meta property="og:url" content="{{ORIGIN}}/episode">
<meta property="og:image" content="{{ORIGIN}}/{{OG}}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%A6%87%3C/text%3E%3C/svg%3E">
<link rel="preload" href="/fonts/plex-cond-700-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/app.css">
<link rel="stylesheet" href="/episode.css">
</head>
<body class="comic-body">
<main class="wrap comic">
  <a class="back" href="/">&larr; The Reconcilers</a>

  <header class="panel cover">
    <div class="cover-top"><span class="issue">${esc(ep.issue)}</span><span class="brand">The Reconcilers</span><span class="price">${esc(ep.date)}</span></div>
    <h1 class="cover-title">${esc(ep.title)}</h1>
    <div class="cover-cast" aria-hidden="true">${cast.map((c) => `<img src="/portraits/${c}.jpg" width="720" height="720" alt="" decoding="async">`).join("")}</div>
    <p class="cover-tag">Eleven heroes. One box office site. And a villain who audits the auditors!</p>
  </header>
  <p class="indicia">${esc(ep.indicia)}</p>

  <section class="page" aria-label="The call">
    <div class="panel narration">${cap(ep.opening, " big")}</div>
    <figure class="panel hero wide">
      <div class="art">${img("meld.jpg", "Meld")}${sfx(ep.meld.fx)}</div>
      <div class="words">
        ${cap("MELD, to the map!", " cry")}
        ${balloon(ep.meld.file, ep.meld.balloon, "Meld")}
        <figcaption class="cap">${esc(ep.meld.caption)}</figcaption>
      </div>
    </figure>
    <figure class="panel hero wide">
      <div class="art">${img("beacon.jpg", "Beacon")}${sfx(ep.beacon.fx, " violet")}</div>
      <div class="words">
        ${cap("BEACON, across the multiverse!", " cry")}
        ${balloon(ep.beacon.file, ep.beacon.balloon, "Beacon")}
        <figcaption class="cap">${esc(ep.beacon.caption)}</figcaption>
      </div>
    </figure>
  </section>

  <section class="page" aria-label="The team">
    <div class="panel narration">${cap("Meanwhile, in the Hall of Reconciliation...", " big")}${cap(ep.hall)}</div>
    <div class="grid">
    ${ep.heroes.map(heroPanel).join("\n    ")}
    </div>
    <figure class="panel hero wide">
      <div class="art">${img(ep.summon.portrait, ep.summon.name)}${sfx(ep.summon.fx, " violet")}</div>
      <div class="words">
        ${cap(ep.beacon.cry, " cry")}
        ${balloon(ep.summon.file, ep.summon.balloon, ep.summon.name)}
        <figcaption class="cap">${esc(ep.summon.caught)}</figcaption>
      </div>
    </figure>
  </section>

  <section class="page" aria-label="The report">
    <div class="panel splash">
      <h2 class="splash-title">${esc(ep.report.splash)}</h2>
      <div class="stats">${ep.report.stats.map((c) => stat(c)).join("")}</div>
      ${cap(ep.report.caption)}
    </div>
  </section>

  <section class="page villain" aria-label="Hold it">
    <div class="panel narration">${cap(ep.doctor.before, " big")}</div>
    <div class="panel splash hold"><h2 class="splash-title">Hold it!</h2></div>
    <figure class="panel hero wide">
      <div class="art">${img("doctor_missedit.jpg", "Doctor Missedit")}${sfx("MWAH-HA!", " red")}</div>
      <div class="words">
        ${cap("Doctor Missedit, uninvited", " cry")}
        ${ep.doctor.balloons.map((b) => balloon(ep.doctor.file, b, "Doctor Missedit", " villain")).join("\n        ")}
        <figcaption class="cap">${esc(ep.doctor.caption)}</figcaption>
      </div>
    </figure>
    <div class="panel splash">
      <div class="stats">${ep.doctor.score.map((c) => stat(c, " red")).join("")}</div>
      ${cap(ep.doctor.catchCaption)}
    </div>
  </section>

  <section class="page end" aria-label="The end">
    <div class="panel splash theend">
      <h2 class="splash-title">The end?</h2>
      ${cap(ep.credits)}
      <p class="batline">Same Bat-time. Same Bat-channel.</p>
    </div>
    ${ps ? `<div class="panel narration">${`<p class="cap ps">${ps}</p>`}</div>` : ""}
  </section>

  <div class="cta-row endcta">
    <a class="btn primary" href="/reconcilers.zip" download>&darr; Get the team <span class="sub">zip &middot; ${zipKB} KB</span></a>
    <a class="btn" href="/#install">How to run it</a>
    <a class="btn" href="{{GITHUB}}/tree/main/episodes/cape-index-2026-09-08" target="_blank" rel="noopener">The heroes&rsquo; raw reports</a>
  </div>
</main>
<footer class="foot"><div class="wrap">Built by <a href="https://www.linkedin.com/in/billyost/" target="_blank" rel="noopener">🏴&zwj;☠️ Bill Yost</a>. First run on <a href="${esc(ep.productUrl)}" target="_blank" rel="noopener">${esc(ep.product)}</a>. Source and issues on <a href="{{GITHUB}}" target="_blank" rel="noopener">GitHub</a>. More things nobody asked for at <a href="https://billyost.com/">billyost.com</a>.</div></footer>
</body>
</html>
`;
write(join(DIST, "episode.html"), fill(episode));

// ---------- sidecars ----------
const today = new Date().toISOString().slice(0, 10);
write(join(DIST, "_headers"), [
  "/*",
  "  Content-Security-Policy: default-src 'none'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self' data:; connect-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  "  Referrer-Policy: strict-origin-when-cross-origin",
  "  X-Content-Type-Options: nosniff",
  "  Strict-Transport-Security: max-age=31536000",
  "  Permissions-Policy: camera=(), microphone=(), geolocation=()",
  "/fonts/*",
  "  Cache-Control: public, max-age=31536000, immutable",
  "/og.*",
  "  Cache-Control: public, max-age=31536000, immutable",
  "/reconcilers.zip.sha256",
  "  Content-Type: text/plain; charset=utf-8",
  "",
].join("\n"));
write(join(DIST, "robots.txt"), ["User-agent: *", "Allow: /", `Sitemap: ${cfg.origin}/sitemap.xml`, ""].join("\n"));
write(join(DIST, "sitemap.xml"), [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  `  <url><loc>${cfg.origin}/</loc><lastmod>${today}</lastmod></url>`,
  `  <url><loc>${cfg.origin}/episode</loc><lastmod>${today}</lastmod></url>`,
  "</urlset>", "",
].join("\n"));
write(join(DIST, "404.html"), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="dark light"><title>Not found · The Reconcilers</title><link rel="stylesheet" href="/app.css"></head><body><header class="mast"><div class="wrap"><p class="eyebrow">404</p><h1>Missedit.</h1><div class="rule" aria-hidden="true"></div><p class="dek">Nothing lives at this address. The Doctor would like it noted that this was not his doing.</p><div class="cta-row"><a class="btn primary" href="/">&larr; Back to the roster</a><a class="btn" href="https://billyost.com/">billyost.com</a></div></div></header></body></html>\n`);

// ---------- gates ----------
for (const f of ["index.html", "episode.html", "404.html", "app.css", "episode.css", "carousel.js"]) {
  const t = readFileSync(join(DIST, f), "utf8");
  if (t.includes("—")) fail(`em dash in dist/${f}`);
  for (const m of t.matchAll(/(?:src|href)="(\/[^"#?]+)"/g)) {
    const p = m[1] === "/" || m[1] === "/episode" ? null : join(DIST, m[1]);
    if (p && !existsSync(p)) fail(`dist/${f} points at missing ${m[1]}`);
  }
}
for (const p of zipFiles) if (readFileSync(p, "utf8").includes("—")) fail(`em dash in bundle/${relative(BUNDLE, p)}`);
if (slideCount !== 11) fail(`carousel has ${slideCount} slides, expected 11`);
if (agentCount !== 11) fail(`bundle has ${agentCount} agent briefs, expected 11`);

if (fails.length) { console.error("\nBUILD FAILED:\n  " + fails.join("\n  ")); process.exit(1); }
console.log(`dist/ built · index + episode · ${slideCount} slides · reconcilers.zip ${zipFiles.length} files, ${zipKB} KB, sha256 ${zipSha.slice(0, 12)} (${agentCount} agents) · ${og} · episode ${balloons} balloons, every one verbatim`);
