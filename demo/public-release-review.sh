#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp_home="$(mktemp -d "${TMPDIR:-/tmp}/dotpath-release-home.XXXXXX")"
out_dir="${1:-"$repo_root/.dotpath-release-review"}"
trap 'rm -rf "$tmp_home"' EXIT

cd "$repo_root"
mkdir -p "$out_dir"

node bin/dotpath.js install --dry-run --home "$tmp_home" > "$out_dir/install-plan.txt"
node bin/dotpath.js scan --path examples > "$out_dir/examples-secret-scan.txt"
node bin/dotpath.js scan --path . > "$out_dir/repo-secret-scan.txt"

grep -q "Dry-run only" "$out_dir/install-plan.txt"
grep -q "No obvious secrets found" "$out_dir/examples-secret-scan.txt"
grep -q "No obvious secrets found" "$out_dir/repo-secret-scan.txt"
test ! -e "$tmp_home/.zshrc.d"

echo "dotpath public release review wrote $out_dir"
