import fs from 'node:fs';
import path from 'node:path';

export function pathExists(filePath) {
  try {
    fs.lstatSync(filePath);
    return true;
  } catch (error) {
    if (error && error.code === 'ENOENT') return false;
    throw error;
  }
}

export function ensureInsideHome(home, target) {
  const relative = path.relative(path.resolve(home), path.resolve(target));
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Refusing to plan outside HOME: ${target}`);
  }
}

export function mkdirpFor(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}
