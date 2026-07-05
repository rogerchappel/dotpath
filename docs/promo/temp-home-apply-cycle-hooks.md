# Temporary HOME Apply Cycle Hooks

## Short post options

1. `dotpath` install demos do not need to touch your real HOME. The apply-cycle
   script creates a temporary HOME, previews symlinks, applies them, previews
   uninstall, then removes only dotpath-owned links.
2. Public dotfiles are easier to trust when the install path is reversible and
   testable. `dotpath` now has a temp-HOME demo for that exact flow.
3. The interesting part of a dotfiles CLI is not a flashy install. It is a
   boring preview, explicit apply, and clean uninstall against known symlinks.

## Clip beats

1. Show the temporary HOME path.
2. Run `bash demo/run-temp-home-apply-cycle.sh`.
3. Open `01-preview.txt` and point at `Dry-run only`.
4. Open `02-apply.txt` and show the created symlink actions.
5. Open `04-uninstall-apply.txt` and show the reversible cleanup.

## Grounding facts

- `install` is dry-run by default.
- `--apply` is required before symlink changes are made.
- `--uninstall --apply` removes dotpath-owned symlinks, not arbitrary files.
- The demo verifies `.zshrc.d/00-path.zsh` and `.config/git/aliases.dotpath`
  inside a temporary HOME.
