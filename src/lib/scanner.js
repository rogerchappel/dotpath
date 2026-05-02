import fs from 'node:fs';
import path from 'node:path';

const denyPatterns = [
  { name: 'ssh-private-key', pattern: /-----BEGIN (?:OPENSSH|RSA|DSA|EC|ED25519) PRIVATE KEY-----/ },
  { name: 'github-token', pattern: /\bgh[pousr]_[A-Za-z0-9_]{30,}\b/ },
  { name: 'generic-api-key', pattern: /\b(?:api[_-]?key|secret|token|password)\s*=\s*['\"]?[A-Za-z0-9_\-]{24,}/i },
  { name: 'aws-access-key', pattern: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'private-home-path', pattern: /\/Users\/roger\/(?:\.ssh|\.aws|\.config\/gh|Library\/Keychains|Developer\/private)\b/ },
  { name: 'ssh-config-host', pattern: /^\s*Host\s+(?!github\.com\b|example\b|\*)[A-Za-z0-9_.-]+/m }
];

const ignoredDirs = new Set(['.git', 'node_modules', '.DS_Store']);
const ignoredExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.pdf']);

export function scanText(text, file = '<inline>') {
  const findings = [];
  for (const rule of denyPatterns) {
    const match = rule.pattern.exec(text);
    if (match) findings.push({ file, rule: rule.name, preview: redact(match[0]) });
  }
  return findings;
}

export function scanPath(root) {
  const resolved = path.resolve(root);
  const findings = [];
  walk(resolved, (file) => {
    if (ignoredExtensions.has(path.extname(file).toLowerCase())) return;
    const buffer = fs.readFileSync(file);
    if (buffer.includes(0)) return;
    findings.push(...scanText(buffer.toString('utf8'), path.relative(resolved, file)));
  });
  return findings;
}

function walk(dir, visit) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, visit);
    else if (entry.isFile()) visit(full);
  }
}

function redact(value) {
  if (value.length <= 16) return '[redacted]';
  return `${value.slice(0, 6)}…${value.slice(-4)}`;
}
