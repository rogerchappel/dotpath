import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const repoRoot = path.resolve(new URL('..', import.meta.url).pathname);
const bin = path.join(repoRoot, 'bin', 'dotpath.js');

test('CLI dry-run does not mutate temp HOME', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'dotpath-smoke-'));
  const result = spawnSync(process.execPath, [bin, 'install', '--home', home], { cwd: repoRoot, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Dry-run only/);
  assert.equal(fs.existsSync(path.join(home, '.zshrc.d')), false);
});

test('CLI apply then uninstall works in temp HOME', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'dotpath-smoke-'));
  const apply = spawnSync(process.execPath, [bin, 'install', '--home', home, '--apply'], { cwd: repoRoot, encoding: 'utf8' });
  assert.equal(apply.status, 0, apply.stderr);
  assert.equal(fs.lstatSync(path.join(home, '.zshrc.d', '00-path.zsh')).isSymbolicLink(), true);
  const uninstall = spawnSync(process.execPath, [bin, 'install', '--home', home, '--uninstall', '--apply'], { cwd: repoRoot, encoding: 'utf8' });
  assert.equal(uninstall.status, 0, uninstall.stderr);
  assert.equal(fs.existsSync(path.join(home, '.zshrc.d', '00-path.zsh')), false);
});
