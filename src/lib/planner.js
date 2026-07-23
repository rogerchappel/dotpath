import fs from 'node:fs';
import path from 'node:path';
import { manifest } from './manifest.js';
import { ensureInsideHome, mkdirpFor, pathExists } from './fs-safe.js';

export function createInstallPlan({ repoRoot, home, uninstall = false, rollbackPlan = false } = {}) {
  const resolvedRepo = path.resolve(repoRoot ?? process.cwd());
  const resolvedHome = path.resolve(home ?? process.env.HOME ?? process.cwd());
  const actions = [];
  for (const entry of manifest) {
    const source = path.join(resolvedRepo, entry.source);
    const target = path.join(resolvedHome, entry.target);
    ensureInsideHome(resolvedHome, target);
    if (!pathExists(source)) {
      actions.push({ type: 'missing-source', source, target, entry });
      continue;
    }
    if (uninstall) actions.push(planUninstall(source, target, entry));
    else if (rollbackPlan) actions.push(planRollback(source, target, entry));
    else actions.push(planInstall(source, target, entry));
  }
  return { repoRoot: resolvedRepo, home: resolvedHome, dryRunDefault: true, actions };
}

function planInstall(source, target, entry) {
  if (!pathExists(target)) return { type: 'link', source, target, entry };
  const stat = fs.lstatSync(target);
  if (stat.isSymbolicLink()) {
    const current = fs.readlinkSync(target);
    const absoluteCurrent = path.resolve(path.dirname(target), current);
    if (absoluteCurrent === source) return { type: 'noop', reason: 'already-linked', source, target, entry };
    return { type: 'conflict', reason: 'symlink-points-elsewhere', source, target, current, entry };
  }
  return { type: 'conflict', reason: 'target-exists', source, target, entry };
}

function planUninstall(source, target, entry) {
  if (!pathExists(target)) return { type: 'noop', reason: 'target-missing', source, target, entry };
  const stat = fs.lstatSync(target);
  if (!stat.isSymbolicLink()) return { type: 'skip', reason: 'not-a-symlink', source, target, entry };
  const current = path.resolve(path.dirname(target), fs.readlinkSync(target));
  if (current !== source) return { type: 'skip', reason: 'foreign-symlink', source, target, current, entry };
  return { type: 'unlink', source, target, entry };
}

function planRollback(source, target, entry) {
  return { type: 'rollback-note', source, target, entry, note: `To roll back ${entry.target}, remove only if it links to ${source}. Existing real files are never touched.` };
}

export function applyPlan(plan) {
  const unsafeAction = plan.actions.find(
    (action) => action.type === 'conflict' || action.type === 'missing-source'
  );
  if (unsafeAction) {
    throw new Error(`Refusing to apply unsafe action: ${unsafeAction.type} ${unsafeAction.target}`);
  }

  const applied = [];
  for (const action of plan.actions) {
    if (action.type === 'link') {
      mkdirpFor(action.target);
      fs.symlinkSync(action.source, action.target);
      applied.push(action);
    } else if (action.type === 'unlink') {
      fs.unlinkSync(action.target);
      applied.push(action);
    }
  }
  return applied;
}

export function renderPlan(plan) {
  const lines = [`dotpath plan`, `home: ${plan.home}`, `repo: ${plan.repoRoot}`, ''];
  for (const action of plan.actions) {
    const icon = iconFor(action.type);
    lines.push(`${icon} ${action.type.padEnd(14)} ${action.entry.target}`);
    if (action.reason) lines.push(`   reason: ${action.reason}`);
    if (action.current) lines.push(`   current: ${action.current}`);
    if (action.type === 'link') lines.push(`   ${action.target} -> ${action.source}`);
    if (action.note) lines.push(`   ${action.note}`);
  }
  return lines.join('\n');
}

function iconFor(type) {
  return ({ link: '➕', unlink: '➖', noop: '✅', conflict: '⚠️', skip: '↩️', 'missing-source': '❌', 'rollback-note': '🧯' })[type] ?? '•';
}
