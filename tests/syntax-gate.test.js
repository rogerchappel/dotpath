import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const repoRoot = path.resolve(new URL('..', import.meta.url).pathname);
const gate = path.join(repoRoot, 'scripts', 'check-shell-syntax.sh');

const runGate = (args = [], options = {}) => spawnSync('bash', [gate, ...args], {
  cwd: repoRoot,
  encoding: 'utf8',
  ...options
});

test('shell syntax gate rejects a syntax error in any checked file', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dotpath-syntax-broken-'));
  fs.writeFileSync(path.join(dir, 'ok.sh'), '#!/usr/bin/env bash\nexit 0\n');
  fs.writeFileSync(path.join(dir, 'broken.sh'), '#!/usr/bin/env bash\nif then\n');

  const result = runGate([dir]);

  assert.notEqual(result.status, 0, `gate must fail; stdout=${result.stdout} stderr=${result.stderr}`);
  assert.match(result.stderr, /syntax error: .*broken\.sh/);
  assert.doesNotMatch(result.stderr, /syntax error: .*ok\.sh/);
});

test('shell syntax gate accepts files that all parse cleanly', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dotpath-syntax-clean-'));
  fs.writeFileSync(path.join(dir, 'first.sh'), '#!/usr/bin/env bash\nexit 0\n');
  fs.writeFileSync(path.join(dir, 'second.sh'), '#!/usr/bin/env bash\nexit 0\n');

  const result = runGate([dir]);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /2 file\(s\)/);
});

test('default gate covers the documented demo scripts', () => {
  const result = runGate();

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /demo \(3 file\(s\)\)/);
});