import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { applyPlan, createInstallPlan } from '../src/lib/planner.js';

const repoRoot = path.resolve(new URL('..', import.meta.url).pathname);

test('install plan defaults to safe link actions in empty temp HOME', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'dotpath-home-'));
  const plan = createInstallPlan({ repoRoot, home });
  assert.equal(plan.dryRunDefault, true);
  assert.ok(plan.actions.every((action) => action.type === 'link'));
});

test('apply is idempotent and converts second run to noop', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'dotpath-home-'));
  applyPlan(createInstallPlan({ repoRoot, home }));
  const second = createInstallPlan({ repoRoot, home });
  assert.ok(second.actions.every((action) => action.type === 'noop'));
});

test('existing real file is reported as conflict', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'dotpath-home-'));
  fs.mkdirSync(path.join(home, '.config', 'git'), { recursive: true });
  fs.writeFileSync(path.join(home, '.config', 'git', 'aliases.dotpath'), 'mine');
  const plan = createInstallPlan({ repoRoot, home });
  assert.ok(plan.actions.some((action) => action.type === 'conflict' && action.reason === 'target-exists'));
});

test('a late conflict prevents every planned filesystem mutation', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'dotpath-home-'));
  const conflict = path.join(home, '.config', 'git', 'aliases.dotpath');
  fs.mkdirSync(path.dirname(conflict), { recursive: true });
  fs.writeFileSync(conflict, 'mine');

  const plan = createInstallPlan({ repoRoot, home });
  assert.throws(() => applyPlan(plan), /Refusing to apply unsafe action: conflict/);
  assert.equal(fs.existsSync(path.join(home, '.zshrc.d', '00-path.zsh')), false);
  assert.equal(fs.readFileSync(conflict, 'utf8'), 'mine');
});

test('a missing source prevents every planned filesystem mutation', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'dotpath-home-'));
  const incompleteRepo = fs.mkdtempSync(path.join(os.tmpdir(), 'dotpath-repo-'));
  fs.mkdirSync(path.join(incompleteRepo, 'examples', 'git'), { recursive: true });
  fs.copyFileSync(
    path.join(repoRoot, 'examples', 'git', 'gitconfig.aliases'),
    path.join(incompleteRepo, 'examples', 'git', 'gitconfig.aliases')
  );

  const plan = createInstallPlan({ repoRoot: incompleteRepo, home });
  assert.throws(() => applyPlan(plan), /Refusing to apply unsafe action: missing-source/);
  assert.equal(fs.existsSync(path.join(home, '.config', 'git', 'aliases.dotpath')), false);
});

test('uninstall removes only dotpath-owned symlinks', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'dotpath-home-'));
  applyPlan(createInstallPlan({ repoRoot, home }));
  const uninstall = createInstallPlan({ repoRoot, home, uninstall: true });
  assert.ok(uninstall.actions.every((action) => action.type === 'unlink'));
});
