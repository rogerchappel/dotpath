#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp_home="$(mktemp -d "${TMPDIR:-/tmp}/dotpath-home.XXXXXX")"
trap 'rm -rf "$tmp_home"' EXIT

node "$repo_root/bin/dotpath.js" --help | grep -q 'Usage:'
test "$(node "$repo_root/bin/dotpath.js" --version)" = "dotpath 0.1.0"

node "$repo_root/bin/dotpath.js" install --dry-run --home "$tmp_home" > "$tmp_home/plan.txt"
grep -q 'Dry-run only' "$tmp_home/plan.txt"
test ! -e "$tmp_home/.zshrc.d"

node "$repo_root/bin/dotpath.js" scan --path "$repo_root/examples" > "$tmp_home/scan.txt"
grep -q 'No obvious secrets found' "$tmp_home/scan.txt"

printf 'dotpath smoke passed\n'
