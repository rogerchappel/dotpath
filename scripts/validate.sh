#!/usr/bin/env bash
set -euo pipefail

npm test
npm run check:syntax
npm run check:secrets

if command -v shellcheck >/dev/null 2>&1; then
  shellcheck scripts/*.sh examples/.zshrc.d/*.zsh demo/*.sh
else
  echo "shellcheck not found; bash syntax checks completed instead"
fi
