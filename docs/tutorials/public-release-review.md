# Public Release Review

This recipe creates a local evidence bundle for reviewing public dotfiles before
publishing or promoting them.

## Run it

```sh
bash demo/public-release-review.sh
```

The script writes review artifacts under `.dotpath-release-review/`:

- `install-plan.txt` captures the dry-run symlink plan against a temporary HOME.
- `examples-secret-scan.txt` confirms the public example snippets pass the
  repository scanner.
- `repo-secret-scan.txt` confirms the full checkout passes the same scanner.

The temporary HOME is removed after the run. The dry-run install should not
create `.zshrc.d` or any other dotpath-managed files unless `--apply` is used.

## Review points

- Confirm the plan only links the documented public examples.
- Confirm the scanner reports no obvious secrets in `examples`.
- Confirm the repository-wide scanner also passes before turning the result
  into a screenshot, post, or release note.
