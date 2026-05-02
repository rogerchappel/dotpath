# Orchestration

Dotpath is designed for humans and coding agents that share a machine but should
not share secrets.

## Operating rules

1. Start with `dotpath install --dry-run`.
2. Review every target path before applying.
3. Never overwrite a real dotfile; conflicts are reported, not changed.
4. Keep public examples generic and put private machine setup elsewhere.
5. Run `dotpath scan --path .` before publishing.

## Agent workflow

- Work in an isolated git worktree.
- Add public-safe examples only.
- Use fixtures and temp HOME tests for install behavior.
- Prefer rollback plans over destructive cleanup.

## Release gates

```bash
npm test
npm run check:syntax
npm run check:secrets
```
