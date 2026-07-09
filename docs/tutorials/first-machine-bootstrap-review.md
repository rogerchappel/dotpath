# First-Machine Bootstrap Review

Use this recipe before trying public dotfiles on a fresh laptop, devcontainer,
or throwaway VM. It shows the install plan, records the rollback notes, and
checks the public examples for obvious secret shapes without mutating the real
home directory.

## Run it

```sh
bash demo/first-machine-bootstrap-review.sh
```

The script creates a temporary HOME, writes review artifacts under
`.dotpath-first-machine-review/`, and verifies that dry-run mode did not create
`.zshrc.d` in the temporary HOME.

## Artifacts

- `01-install-preview.txt` shows the symlink plan.
- `02-rollback-plan.txt` records how dotpath-owned links can be removed.
- `03-example-secret-scan.txt` confirms the public examples pass the scanner.

This is useful PR evidence for a README or launch post because it demonstrates
the default safety posture without asking readers to apply dotfiles.

