#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp_home="$(mktemp -d "${TMPDIR:-/tmp}/dotpath-apply-home.XXXXXX")"
out_dir="${1:-"$repo_root/.dotpath-apply-cycle"}"
trap 'rm -rf "$tmp_home"' EXIT

cd "$repo_root"
mkdir -p "$out_dir"

node bin/dotpath.js install --home "$tmp_home" >"$out_dir/01-preview.txt"
grep -q "Dry-run only" "$out_dir/01-preview.txt"
test ! -e "$tmp_home/.zshrc.d"

node bin/dotpath.js install --home "$tmp_home" --apply >"$out_dir/02-apply.txt"
test -L "$tmp_home/.zshrc.d/00-path.zsh"
test -L "$tmp_home/.config/git/aliases.dotpath"

node bin/dotpath.js install --home "$tmp_home" --uninstall >"$out_dir/03-uninstall-preview.txt"
grep -q "Dry-run only" "$out_dir/03-uninstall-preview.txt"
test -L "$tmp_home/.zshrc.d/00-path.zsh"

node bin/dotpath.js install --home "$tmp_home" --uninstall --apply >"$out_dir/04-uninstall-apply.txt"
test ! -e "$tmp_home/.zshrc.d/00-path.zsh"
test ! -e "$tmp_home/.config/git/aliases.dotpath"

echo "dotpath temp HOME apply cycle wrote $out_dir"
