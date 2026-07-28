import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const repoRoot = path.resolve(new URL('..', import.meta.url).pathname);
const bin = path.join(repoRoot, 'bin', 'dotpath.js');
const run = (args) => spawnSync(process.execPath, [bin, ...args], {
  cwd: repoRoot,
  encoding: 'utf8'
});

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

test('CLI rejects unknown and contradictory install options before mutation', () => {
  for (const args of [
    ['--dryrun', '--apply'],
    ['--wat', '--apply'],
    ['--dry-run', '--apply'],
    ['--rollback-plan', '--apply']
  ]) {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), 'dotpath-smoke-'));
    const result = run(['install', '--home', home, ...args]);
    assert.equal(result.status, 1, `${args.join(' ')}\n${result.stderr}`);
    assert.match(result.stderr, /Unknown option|cannot be used together|cannot be used with/);
    assert.equal(fs.existsSync(path.join(home, '.zshrc.d')), false);
  }
});

test('CLI rejects malformed value options and duplicate options', () => {
  for (const args of [
    ['install', '--home'],
    ['install', '--repo='],
    ['install', '--home', '/tmp/one', '--home', '/tmp/two'],
    ['scan', '--path'],
    ['scan', '--path='],
    ['scan', '--unknown']
  ]) {
    const result = run(args);
    assert.equal(result.status, 1, `${args.join(' ')}\n${result.stderr}`);
    assert.match(result.stderr, /requires a value|only be specified once|Unknown option/);
  }
});

test('documented dry-run, rollback, repo, and scan options remain functional', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'dotpath-smoke-'));
  const dryRun = run(['install', '--home', home, '--repo', repoRoot, '--dry-run']);
  assert.equal(dryRun.status, 0, dryRun.stderr);
  assert.match(dryRun.stdout, /Dry-run only/);
  assert.equal(fs.existsSync(path.join(home, '.zshrc.d')), false);

  const rollback = run(['install', '--home', home, '--rollback-plan']);
  assert.equal(rollback.status, 0, rollback.stderr);
  assert.match(rollback.stdout, /rollback-note/);

  const scan = run(['scan', '--path', path.join(repoRoot, 'examples')]);
  assert.equal(scan.status, 0, scan.stderr);
  assert.match(scan.stdout, /No obvious secrets found/);
});
