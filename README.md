# The Reconcilers

*They don't save the world. They check it.*

Ten heroes and one villain that audit any data product before you launch it: numbers, joins, statistics, charts, UX, accessibility, copy and wiring, plus a specialist Beacon summons for your subject. A Claude Code skill, with a Codex adapter and a porting guide for everything else.

- **Site:** https://reconcilers.williamfyost.workers.dev
- **Sample episode:** https://reconcilers.williamfyost.workers.dev/episode (the real first run, against [The Cape Index](https://capeindex.com))
- **Download:** https://reconcilers.williamfyost.workers.dev/reconcilers.zip

## Install

**Import it into Claude.** Download [reconcilers.zip](https://reconcilers.williamfyost.workers.dev/reconcilers.zip), then in Claude open Customize, Skills, Import skill, and pick it. Open the folder you want audited and say `/reconcilers`.

**As a plugin, in Claude Code.** This repo is its own marketplace:

```
/plugin marketplace add cruce5/reconcilers
/plugin install reconcilers@reconcilers
```

**Into one project.** Unzip the bundle and run `bundle/install.sh` (or `install.ps1`) from the folder that holds your product. It only copies files: the skill to `.claude/skills/reconcilers/`, the eleven briefs to `.claude/agents/`.

**Anywhere else.** `install.sh --platform codex` writes an `AGENTS.md` that runs the episode in one agent. [PORTING.md](bundle/adapters/PORTING.md) covers Cursor, Aider, Cline or a shell script.

## What is in this repo

| Path | What it is |
|---|---|
| `bundle/` | The skill itself: `SKILL.md`, eleven agent briefs, installers, adapters. This is what the zip contains. Start with [bundle/README.md](bundle/README.md). |
| `site/` | The website: page template, styles, carousel, portraits, fonts. |
| `episodes/` | Real episode runs, unedited. The episode page quotes them verbatim. |
| `scripts/build.mjs` | Builds `dist/`: zips the bundle, renders the share card and the episode page, writes headers, and fails on any em dash, missing asset, or quote that is not verbatim in its source report. |

## Build and deploy

```bash
npm install
npm run build
npm run deploy
```

Hosted as static assets on Cloudflare Workers (`wrangler.jsonc`).

## House rules

Read-only: the team never edits, commits or deploys the product it audits. Only verified findings get ranked. Every finding cites a location. No em dashes.

Built by Bill Yost.
