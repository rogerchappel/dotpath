import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs, flagPath } from '../lib/args.js';
import { applyPlan, createInstallPlan, renderPlan } from '../lib/planner.js';

const packagedRepoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export async function runInstall(argv) {
  const { flags } = parseArgs(argv, {
    command: 'install',
    boolean: ['apply', 'dry-run', 'uninstall', 'rollback-plan'],
    value: ['home', 'repo']
  });
  if (flags.has('apply') && flags.has('dry-run')) {
    throw new Error('Options --apply and --dry-run cannot be used together.');
  }
  if (flags.has('apply') && flags.has('rollback-plan')) {
    throw new Error('Option --rollback-plan cannot be used with --apply.');
  }
  const apply = flags.has('apply');
  const dryRun = flags.has('dry-run') || !apply;
  const plan = createInstallPlan({
    repoRoot: flagPath(flags, 'repo', packagedRepoRoot),
    home: flagPath(flags, 'home', process.env.HOME),
    uninstall: flags.has('uninstall'),
    rollbackPlan: flags.has('rollback-plan')
  });
  console.log(renderPlan(plan));
  if (dryRun) {
    console.log('\nDry-run only. Re-run with --apply to make symlink changes.');
    return plan;
  }
  const applied = applyPlan(plan);
  console.log(`\nApplied ${applied.length} safe action(s).`);
  return plan;
}
