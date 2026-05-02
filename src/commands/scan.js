import { parseArgs, flagPath } from '../lib/args.js';
import { scanPath } from '../lib/scanner.js';

export async function runScan(argv) {
  const { flags } = parseArgs(argv);
  const target = flagPath(flags, 'path', process.cwd());
  const findings = scanPath(target);
  if (findings.length === 0) {
    console.log(`No obvious secrets found in ${target}`);
    return findings;
  }
  console.error(`Secret scan found ${findings.length} issue(s):`);
  for (const finding of findings) console.error(`- ${finding.file}: ${finding.rule} (${finding.preview})`);
  process.exitCode = 2;
  return findings;
}
