# dotpath 🧭

Secret-safe public dotfiles for an agentic dev workflow.

Dotpath is not a dump of a real home directory. It is a curated, boring-on-purpose starter kit: zsh snippets, git aliases, editor/env examples, bootstrap checks, a dry-run symlink planner, and a scanner that yells before private material gets published.

## Why

Public dotfiles are a nice signal of craft, but accidental secrets are not cute. Dotpath keeps the good part — repeatable setup and taste — while making the risky parts explicit.

## Quickstart

```bash
npm ci
npm run release:check
node bin/dotpath.js install --dry-run
```

The `dotpath` name on npm belongs to an unrelated project. This repository is
therefore not published under that name. To install this CLI globally from a
verified checkout:

```bash
git clone https://github.com/rogerchappel/dotpath.git
cd dotpath
npm install
npm run release:check
npm install -g .
dotpath install --dry-run
```

`install` is dry-run by default. It prints the symlinks it would create and does not mutate your HOME unless you pass `--apply`.
It fails before rendering a plan when neither `--home PATH` nor a non-empty
`HOME` environment variable provides the destination; the current directory is
never used as an implicit home. An explicit `--home PATH` takes precedence over
`HOME` and is useful for safe previews and temporary apply/uninstall cycles.
The CLI uses the examples bundled with its installation by default, regardless
of the directory where it is launched. Pass `--repo PATH` only to plan against
a different dotpath checkout.
Options are strict: unknown options, missing option values, duplicate options,
and contradictory modes such as `--dry-run --apply` exit with an error before
the install plan can change any files.

## Usage

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

Dotpath refuses to overwrite existing real files. Conflicts are reported in the
plan. Before apply mode changes anything, it checks the complete plan for
conflicts and missing sources. Apply mode only creates symlinks for missing
targets or removes symlinks that point back to this repo during uninstall.

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

For a promotion-ready release review that captures the dry-run install plan and
scanner output:

```bash
bash demo/public-release-review.sh
```

See [docs/tutorials/public-release-review.md](docs/tutorials/public-release-review.md)
for the generated evidence files.

To demonstrate apply and uninstall without touching your real HOME:

```bash
bash demo/run-temp-home-apply-cycle.sh
```

See [docs/tutorials/temp-home-apply-cycle.md](docs/tutorials/temp-home-apply-cycle.md)
for the reversible temp-HOME flow.

For a first-machine bootstrap review that records a dry-run install plan,
rollback notes, and an example-tree secret scan in a temporary HOME:

```bash
bash demo/first-machine-bootstrap-review.sh
```

See
[`docs/tutorials/first-machine-bootstrap-review.md`](docs/tutorials/first-machine-bootstrap-review.md)
for the artifact checklist.

These demos run from a source checkout and are not shipped in the published
npm package; clone the repository and run `bash demo/<name>.sh` there. Each
demo writes its evidence files into the checkout (`.dotpath-release-review/`,
`.dotpath-apply-cycle/`, or `.dotpath-first-machine-review/`) and never touches
your real HOME.

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
