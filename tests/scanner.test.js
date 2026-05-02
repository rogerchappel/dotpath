import assert from 'node:assert/strict';
import test from 'node:test';
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
