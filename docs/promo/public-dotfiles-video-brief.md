# Public Dotfiles Review Video Brief

## Hook

Public dotfiles are useful only when the release review is boring: dry-run the
install, scan the examples, scan the repo, and keep private host details out.

## Demo flow

1. Show `examples/.zshrc.d/` and the documented example files.
2. Run `bash demo/public-release-review.sh`.
3. Open `.dotpath-release-review/install-plan.txt`.
4. Open `.dotpath-release-review/examples-secret-scan.txt`.
5. Close on the README safety model: dry-run by default, no overwrite of real
   files, and a scanner for obvious secret patterns.

## Short Posts

1. A public dotfiles repo should make the safe path easy: preview symlinks,
   avoid real HOME mutations, and scan for private material before publishing.
2. `dotpath` now has a release-review demo that writes the dry-run plan and
   scanner output as local evidence.
3. The demo is intentionally small: no telemetry, no remote calls, no apply
   mode, just files you can attach to a PR.

## Caption

`dotpath` packages public dotfiles with a dry-run install plan and secret-scan
evidence before anything is promoted.
