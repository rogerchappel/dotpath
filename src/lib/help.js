export function printHelp() {
  console.log(`dotpath 🧭 secret-safe dotfiles starter

Usage:
  dotpath install [--dry-run] [--home PATH] [--repo PATH] [--apply] [--uninstall] [--rollback-plan]
  dotpath scan [--path PATH]
  dotpath help

Defaults are safe: install is a dry-run planner unless --apply is passed.`);
}
