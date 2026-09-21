#!/usr/bin/env bash
# Installs The Reconcilers into the CURRENT directory.
# Usage: bash <path-to-bundle>/install.sh [--platform claude|codex]
#   default: claude (copies to .claude/skills and .claude/agents)
#   codex:   copies adapters/codex/AGENTS.md to AGENTS.md at the current directory
set -euo pipefail

platform="claude"
while [[ $# -gt 0 ]]; do
  case "$1" in
    --platform) platform="$2"; shift 2 ;;
    --platform=*) platform="${1#*=}"; shift ;;
    -h|--help) sed -n '3,7p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "unknown flag: $1" >&2; exit 2 ;;
  esac
done

bundle="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
target="$(pwd)"

case "$platform" in
  claude)
    mkdir -p "$target/.claude/agents" "$target/.claude/skills/reconcilers"
    cp "$bundle"/agents/*.md "$target/.claude/agents/"
    cp "$bundle/SKILL.md" "$target/.claude/skills/reconcilers/SKILL.md"
    cat <<EOF

  THE RECONCILERS are on call in $target
  Eleven agents in .claude/agents, the skill in .claude/skills/reconcilers.

  Start Claude Code here and type:  /reconcilers
  Same Bat-time. Same Bat-channel.

EOF
    ;;
  codex)
    # AGENTS.md is read at startup by Codex and, since 2.1.277, by Claude Code in any folder with no
    # CLAUDE.md. So the episode does not live in it: the root file gets five lines pointing at the
    # script, and the script sits beside it until somebody asks for an episode.
    cp "$bundle/adapters/codex/EPISODE.md" "$target/reconcilers-episode.md"
    if grep -q "reconcilers-episode.md" "$target/AGENTS.md" 2>/dev/null; then
      echo "  AGENTS.md already points at the episode; left it alone"
    elif [[ -e "$target/AGENTS.md" ]]; then
      printf '\n' >> "$target/AGENTS.md"
      cat "$bundle/adapters/codex/AGENTS.snippet.md" >> "$target/AGENTS.md"
      echo "  Added a Reconcilers section to the AGENTS.md that was already here"
    else
      cp "$bundle/adapters/codex/AGENTS.snippet.md" "$target/AGENTS.md"
    fi
    cat <<EOF

  THE RECONCILERS are on call in $target (AGENTS.md adapter)
  The episode is reconcilers-episode.md. AGENTS.md carries five lines pointing at it,
  so nothing heavy loads into an ordinary session.

  Start Codex here and say:  run the Reconcilers episode against this repo
  Same Bat-time. Same Bat-channel.

EOF
    ;;
  *)
    echo "unknown platform: $platform (use 'claude' or 'codex')" >&2
    exit 2
    ;;
esac
