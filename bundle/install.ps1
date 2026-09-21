# Installs The Reconcilers into the CURRENT directory.
# Usage: & "<path-to-bundle>\install.ps1" [-Platform claude|codex]
#   default: claude (copies to .claude\skills and .claude\agents)
#   codex:   writes reconcilers-episode.md and points AGENTS.md at it
param(
  [ValidateSet("claude","codex")]
  [string]$Platform = "claude"
)
$ErrorActionPreference = "Stop"
$bundle = Split-Path -Parent $MyInvocation.MyCommand.Path
$target = Get-Location

switch ($Platform) {
  "claude" {
    New-Item -ItemType Directory -Force -Path (Join-Path $target ".claude\agents") | Out-Null
    New-Item -ItemType Directory -Force -Path (Join-Path $target ".claude\skills\reconcilers") | Out-Null
    Copy-Item -Path (Join-Path $bundle "agents\*.md") -Destination (Join-Path $target ".claude\agents") -Force
    Copy-Item -Path (Join-Path $bundle "SKILL.md") -Destination (Join-Path $target ".claude\skills\reconcilers\SKILL.md") -Force
    Write-Host ""
    Write-Host "  THE RECONCILERS are on call in $target"
    Write-Host "  Eleven agents in .claude\agents, the skill in .claude\skills\reconcilers."
    Write-Host ""
    Write-Host "  Start Claude Code here and type:  /reconcilers"
    Write-Host "  Same Bat-time. Same Bat-channel."
    Write-Host ""
  }
  "codex" {
    # AGENTS.md is read at startup by Codex and, since 2.1.277, by Claude Code in any folder with no
    # CLAUDE.md. So the episode does not live in it: the root file gets five lines pointing at the
    # script, and the script sits beside it until somebody asks for an episode.
    $agents = Join-Path $target "AGENTS.md"
    $snippet = Get-Content (Join-Path $bundle "adapters\codex\AGENTS.snippet.md") -Raw
    Copy-Item -Path (Join-Path $bundle "adapters\codex\EPISODE.md") -Destination (Join-Path $target "reconcilers-episode.md") -Force
    if ((Test-Path $agents) -and (Select-String -Path $agents -Pattern "reconcilers-episode.md" -Quiet)) {
      Write-Host "  AGENTS.md already points at the episode; left it alone"
    } elseif (Test-Path $agents) {
      Add-Content -Path $agents -Value ("`n" + $snippet) -Encoding utf8
      Write-Host "  Added a Reconcilers section to the AGENTS.md that was already here"
    } else {
      Set-Content -Path $agents -Value $snippet -Encoding utf8
    }
    Write-Host ""
    Write-Host "  THE RECONCILERS are on call in $target (AGENTS.md adapter)"
    Write-Host "  The episode is reconcilers-episode.md. AGENTS.md carries five lines pointing at it,"
    Write-Host "  so nothing heavy loads into an ordinary session."
    Write-Host ""
    Write-Host "  Start Codex here and say:  run the Reconcilers episode against this repo"
    Write-Host "  Same Bat-time. Same Bat-channel."
    Write-Host ""
  }
}
