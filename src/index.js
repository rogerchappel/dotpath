import { runInstall } from './commands/install.js';
import { runScan } from './commands/scan.js';
import { printHelp } from './lib/help.js';

export async function main(argv = []) {
  const [command = 'help', ...rest] = argv;
  if (command === 'help' || command === '--help' || command === '-h') {
    printHelp();
    return;
  }
  if (command === 'install') return runInstall(rest);
  if (command === 'scan') return runScan(rest);
  if (command === 'version' || command === '--version') {
    console.log('dotpath 0.1.0');
    return;
  }
  throw new Error(`Unknown command: ${command}\nRun: dotpath help`);
}

export { createInstallPlan } from './lib/planner.js';
export { scanPath, scanText } from './lib/scanner.js';
