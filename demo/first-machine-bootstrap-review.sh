#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp_home="$(mktemp -d "${TMPDIR:-/tmp}/dotpath-first-machine-home.XXXXXX")"
out_dir="${1:-"$repo_root/.dotpath-first-machine-review"}"
trap 'rm -rf "$tmp_home"' EXIT

cd "$repo_root"
mkdir -p "$out_dir"

node bin/dotpath.js install --home "$tmp_home" > "$out_dir/01-install-preview.txt"
node bin/dotpath.js install --home "$tmp_home" --rollback-plan > "$out_dir/02-rollback-plan.txt"
node bin/dotpath.js scan --path examples > "$out_dir/03-example-secret-scan.txt"

grep -q "Dry-run only" "$out_dir/01-install-preview.txt"
grep -q "rollback-note" "$out_dir/02-rollback-plan.txt"
grep -q "No obvious secrets found" "$out_dir/03-example-secret-scan.txt"
test ! -e "$tmp_home/.zshrc.d"

echo "dotpath first-machine bootstrap review wrote $out_dir"

