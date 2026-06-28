# dotpath 🧭

Secret-safe public dotfiles for an agentic dev workflow.

Dotpath is not a dump of a real home directory. It is a curated, boring-on-purpose starter kit: zsh snippets, git aliases, editor/env examples, bootstrap checks, a dry-run symlink planner, and a scanner that yells before private material gets published.

## Why

Public dotfiles are a nice signal of craft, but accidental secrets are not cute. Dotpath keeps the good part — repeatable setup and taste — while making the risky parts explicit.

## Quick start

```bash
npm install
npm run release:check
node bin/dotpath.js install --dry-run
```

Install the CLI from npm after release:

```bash
npm install -g dotpath
dotpath install --dry-run
```

`install` is dry-run by default. It prints the symlinks it would create and does not mutate your HOME unless you pass `--apply`.

```bash
# preview
node bin/dotpath.js install

# apply reviewed symlinks
node bin/dotpath.js install --apply

# preview uninstall
node bin/dotpath.js install --uninstall

# remove only dotpath-owned symlinks
node bin/dotpath.js install --uninstall --apply

# explain rollback without touching files
node bin/dotpath.js install --rollback-plan

# print CLI version
node bin/dotpath.js --version
```

## What it installs

- `.zshrc.d/00-path.zsh` — tiny PATH helpers
- `.zshrc.d/10-agentic.zsh` — generic agentic-dev aliases and helpers
- `.zshrc.d/20-safety.zsh` — interactive guardrails
- `.config/git/aliases.dotpath` — portable git aliases
- `.editorconfig` — sane editor defaults
- `.config/dotpath/env.example` — example env file with no real secrets

## Safety model 🧯

Dotpath refuses to overwrite existing real files. Conflicts are reported in the plan. Apply mode only creates symlinks for missing targets or removes symlinks that point back to this repo during uninstall.

The scanner blocks common hazards:

- SSH private keys
- GitHub token shapes
- generic `api_key`, `token`, `secret`, and `password` assignments
- AWS access key IDs
- private Roger home paths such as SSH/AWS/GitHub credential locations
- host-specific SSH config stanzas

Run it before publishing:

```bash
node bin/dotpath.js scan --path .
```

## Agent-friendly workflow 🤖

1. Work in an isolated git worktree.
2. Keep public snippets generic.
3. Put private hostnames, tokens, paths, and SSH config somewhere else.
4. Test with temp HOME fixtures, not your actual HOME.
5. Commit small, reviewable changes.

## Local verification

```bash
npm test
npm run check
npm run check:syntax
npm run check:secrets
npm run smoke
npm run package:smoke
npm run release:check
npm run validate
npm pack --dry-run
```

`check` runs the shell syntax checks and repository secret scan. `release:check`
runs the test suite, `check`, the fixture-backed CLI smoke script, package
dry-run output, and the broader validation script. `shellcheck` is used when
available; otherwise syntax checks still run.

## Inspiration

Inspired by the broad public dotfiles tradition and polished repos like steipete/dotfiles, without copying files, code, aliases, docs, or personal settings.

## License

MIT
