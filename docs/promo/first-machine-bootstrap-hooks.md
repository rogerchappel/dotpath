# First-Machine Bootstrap Hooks

- Public dotfiles should show the install plan before they touch `$HOME`.
- `dotpath` makes the first-machine story boring on purpose: dry-run symlink
  plan, rollback notes, and a secret scan of the public examples.
- Demo angle: run the bootstrap review in a temporary HOME and prove no files
  were created.
- Best clip: the dry-run plan and rollback notes side by side, followed by
  "No obvious secrets found" for the example tree.

