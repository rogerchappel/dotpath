# dotpath

Status: in-progress

## Scorecard

Total: 80/100
Band: strong
Last scored: 2026-05-02
Scored by: Neo

| Criterion | Points | Notes |
|---|---:|---|
| Problem pain | 16/20 | Public dotfiles show professional taste and help bootstrap repeatable dev environments. |
| Demand signal | 16/20 | Dotfiles repos are common among senior developers; steipete/dotfiles is one example. |
| V1 buildability | 18/20 | A sanitized template/bootstrap repo is easy to build safely. |
| Differentiation | 12/15 | Agentic-dev shell profile with secret-safe install and previews. |
| Agentic workflow leverage | 11/15 | Improves repeatable dev/agent machine setup. |
| Distribution potential | 7/10 | Great GitHub profile artifact if polished and personal. |

## Pitch

A secret-safe public dotfiles starter for Roger's agentic dev workflow: zsh, git, aliases, bootstrap checks, and tasteful docs without leaking private machine config.

## Why It Matters

Dotfiles signal craft. The safe version is not a dump of Roger's real home directory; it's a curated public toolkit with clear install/preview/uninstall behavior.

## Attribution / Inspiration

Inspired by the broad dotfiles tradition and steipete/dotfiles. Do not copy files or personal settings. Do not inspect/publish Roger's real dotfiles unless explicitly approved.

## V1 Scope

- Public-safe dotfiles repo with `.zshrc.d`, git aliases, editor/env examples, and bootstrap script.
- `install --dry-run` default and idempotent symlink manager.
- Secret scanner/denylist for common private tokens/paths.
- README with personality, screenshots/asciinema-style examples, and uninstall instructions.
- Test fixtures for symlink planning.

## Out of Scope

- Copying Roger's actual home dotfiles.
- Storing secrets, hostnames, private paths, SSH config, or credentials.
- Destructive overwrites.

## Verification

- Unit tests for install planner and secret scanner.
- Smoke test in temp HOME.
- `shellcheck` where available or bash syntax checks.

## Agent Prompt

Build `dotpath` as a sanitized public dotfiles toolkit inspired by the dotfiles tradition, not copied from steipete. Avoid private data. Use StackForge, docs, tests, smoke in temp HOME, publish to GitHub, set metadata, protect main.
