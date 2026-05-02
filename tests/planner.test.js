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

test('uninstall removes only dotpath-owned symlinks', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'dotpath-home-'));
  applyPlan(createInstallPlan({ repoRoot, home }));
  const uninstall = createInstallPlan({ repoRoot, home, uninstall: true });
  assert.ok(uninstall.actions.every((action) => action.type === 'unlink'));
});
