import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { scanPath } from '../src/lib/scanner.js';
import { scanText } from '../src/lib/scanner.js';

test('scanner allows ordinary public examples', () => {
  assert.deepEqual(scanText('alias gs="git status"\\nDOTPATH_THEME=compass'), []);
});

test('scanner catches SSH private keys', () => {
  const marker = ['-----BEGIN OPENSSH', ' PRIVATE KEY-----'].join('');
  const findings = scanText(`${marker}\\nabc`);
  assert.equal(findings[0].rule, 'ssh-private-key');
});

test('scanner catches GitHub-shaped tokens', () => {
  const synthetic = ['ghp_', 'abcdefghijklmnopqrstuvwxyzABCDE12345'].join('');
  const findings = scanText(`token=${synthetic}`);
  assert.ok(findings.some((finding) => finding.rule === 'github-token'));
});

test('scanner catches private paths', () => {
  const syntheticPath = ['/Users/roger/', '.ssh/config'].join('');
  const findings = scanText(syntheticPath);
  assert.equal(findings[0].rule, 'private-home-path');
});


test('scanPath scans files inside the root but ignores file and directory symlinks', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dotpath-scan-'));
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'dotpath-outside-'));
  t.after(() => { fs.rmSync(root, { recursive: true, force: true }); fs.rmSync(outside, { recursive: true, force: true }); });

  fs.writeFileSync(path.join(root, 'ordinary.txt'), 'api_key=ordinary_public_value_1234567890');
  fs.writeFileSync(path.join(outside, 'secret.txt'), 'api_key=outside_secret_value_1234567890');
  fs.symlinkSync(path.join(outside, 'secret.txt'), path.join(root, 'linked-file.txt'));
  fs.symlinkSync(outside, path.join(root, 'linked-directory'));

  const findings = scanPath(root);
  assert.deepEqual(findings.map(({ file }) => file), ['ordinary.txt']);
});
