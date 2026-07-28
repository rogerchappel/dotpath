export function parseArgs(argv, { command = 'command', boolean = [], value = [] } = {}) {
  const booleanFlags = new Set(boolean);
  const valueFlags = new Set(value);
  const flags = new Map();
  const positionals = [];
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (!item.startsWith('--')) {
      positionals.push(item);
      continue;
    }
    const [key, inlineValue] = item.slice(2).split('=', 2);
    if (!key || (!booleanFlags.has(key) && !valueFlags.has(key))) {
      throw new Error(`Unknown option for ${command}: --${key || '(empty)'}\nRun: dotpath help`);
    }
    if (flags.has(key)) {
      throw new Error(`Option --${key} may only be specified once.`);
    }
    if (booleanFlags.has(key)) {
      if (inlineValue !== undefined) {
        throw new Error(`Option --${key} does not accept a value.`);
      }
      flags.set(key, true);
      continue;
    }
    if (inlineValue !== undefined) {
      if (inlineValue.length === 0) {
        throw new Error(`Option --${key} requires a value.`);
      }
      flags.set(key, inlineValue);
      continue;
    }
    const next = argv[index + 1];
    if (next && !next.startsWith('--')) {
      flags.set(key, next);
      index += 1;
    } else {
      throw new Error(`Option --${key} requires a value.`);
    }
  }
  if (positionals.length > 0) {
    throw new Error(`Unexpected argument for ${command}: ${positionals[0]}\nRun: dotpath help`);
  }
  return { flags, positionals };
}

export function flagPath(flags, name, fallback) {
  const value = flags.get(name);
  return typeof value === 'string' ? value : fallback;
}
