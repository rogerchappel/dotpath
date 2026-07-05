# Temporary HOME Apply Cycle

This recipe demonstrates the full install and uninstall cycle against a
throwaway HOME directory. It is useful for demos because it proves the apply path
without touching the real user account.

## Run it

```sh
bash demo/run-temp-home-apply-cycle.sh
```

The script writes evidence under `.dotpath-apply-cycle/`:

- `01-preview.txt` captures the default dry-run plan.
- `02-apply.txt` captures symlink creation against the temporary HOME.
- `03-uninstall-preview.txt` captures the dry-run uninstall plan.
- `04-uninstall-apply.txt` captures removal of dotpath-owned symlinks.

The script asserts that preview mode does not create managed files, apply mode
creates expected symlinks, uninstall preview leaves them in place, and uninstall
apply removes them.

## Demo note

Use this alongside `demo/public-release-review.sh`: the release review shows the
public evidence bundle, while this apply-cycle demo shows the reversible install
contract in a disposable environment.
