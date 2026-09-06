#!/usr/bin/env bash
# Syntax-check every *.sh and *.zsh file under the canonical shell directories.
#
# The historical `find ... | xargs -n1 bash -n` gate only checked the
# directories explicitly listed in package.json, so documented demo scripts
# drifted outside CI. This script owns the directory list so the npm
# `check:syntax` script cannot silently skip a directory again, and it
# reports per-directory counts so coverage stays visible.
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ "$#" -gt 0 ]; then
  dirs=("$@")
else
  dirs=(examples scripts tests/fixtures demo)
fi

failed=0
total=0
for dir in "${dirs[@]}"; do
  case "$dir" in
    /*) search_root="$dir" ;;
    *) search_root="$repo_root/$dir" ;;
  esac
  count=0
  while IFS= read -r -d '' file; do
    count=$((count + 1))
    case "$file" in
      *.zsh) parser=(zsh -n) ;;
      *) parser=(bash -n) ;;
    esac
    if ! "${parser[@]}" "$file"; then
      printf 'syntax error: %s\n' "$file" >&2
      failed=1
    fi
  done < <(find "$search_root" \( -name '*.sh' -o -name '*.zsh' \) -print0 2>/dev/null || true)
  total=$((total + count))
  printf 'syntax ok: %s (%d file(s))\n' "$dir" "$count"
done

if [ "$failed" -ne 0 ]; then
  exit 1
fi

printf 'shell syntax ok: %d file(s) total\n' "$total"
