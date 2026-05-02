import assert from 'node:assert/strict';
import test from 'node:test';
import { scanText } from '../src/lib/scanner.js';

test('scanner allows ordinary public examples', () => {
  assert.deepEqual(scanText('alias gs="git status"\nDOTPATH_THEME=compass'), []);
});

test('scanner catches SSH private keys', () => {
  const findings = scanText('-----BEGIN OPENSSH PRIVATE KEY-----\nabc');
  assert.equal(findings[0].rule, 'ssh-private-key');
});

test('scanner catches GitHub-shaped tokens', () => {
  const findings = scanText('token=ghp_abcdefghijklmnopqrstuvwxyzABCDE12345');
  assert.ok(findings.some((finding) => finding.rule === 'github-token'));
});

test('scanner catches private paths', () => {
  const findings = scanText('/Users/roger/.ssh/config');
  assert.equal(findings[0].rule, 'private-home-path');
});
