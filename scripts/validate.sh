#!/usr/bin/env bash
set -euo pipefail

test -f package-lock.json
grep -Eq '^[[:space:]]*run: npm ci[[:space:]]*$' .github/workflows/ci.yml
if grep -Eq '^[[:space:]]*run: npm install[[:space:]]*$' .github/workflows/ci.yml; then
  echo "CI must install dependencies with npm ci" >&2
  exit 1
fi

npm test
npm run check:syntax
npm run check:secrets

if command -v shellcheck >/dev/null 2>&1; then
  shellcheck scripts/*.sh examples/.zshrc.d/*.zsh demo/*.sh
else
  echo "shellcheck not found; bash syntax checks completed instead"
fi
