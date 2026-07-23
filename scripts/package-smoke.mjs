#!/usr/bin/env node

import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
const output = execFileSync("npm", ["pack", "--dry-run", "--json"], {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "inherit"],
});

const [packument] = JSON.parse(output);
const packedFiles = new Set(packument.files.map((file) => file.path));
const requiredFiles = new Set(["README.md", "LICENSE"]);

if (packageJson.main) {
  requiredFiles.add(packageJson.main.replace(/^\.\//, ""));
}

const binEntries =
  typeof packageJson.bin === "string"
    ? [packageJson.bin]
    : Object.values(packageJson.bin ?? {});

for (const binEntry of binEntries) {
  requiredFiles.add(binEntry.replace(/^\.\//, ""));
}

const missing = [...requiredFiles].filter((file) => !packedFiles.has(file));

if (missing.length > 0) {
  console.error(`${packageJson.name} package smoke failed; missing packed file(s):`);
  for (const file of missing) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

console.log(`${packageJson.name} package smoke passed with ${packument.files.length} packed file(s).`);

const sandbox = mkdtempSync(path.join(tmpdir(), "dotpath-package-smoke-"));
const packDir = path.join(sandbox, "pack");
const prefix = path.join(sandbox, "prefix");
const unrelatedCwd = path.join(sandbox, "cwd");
const home = path.join(sandbox, "home");
for (const directory of [packDir, unrelatedCwd, home]) {
  mkdirSync(directory, { recursive: true });
}

const packed = execFileSync("npm", ["pack", "--json", "--pack-destination", packDir], {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "inherit"],
});
const [{ filename }] = JSON.parse(packed);
execFileSync("npm", ["install", "--prefix", prefix, path.join(packDir, filename)], {
  stdio: "inherit",
});

const cli = path.join(prefix, "node_modules", ".bin", "dotpath");
const result = spawnSync(cli, ["install", "--home", home], {
  cwd: unrelatedCwd,
  encoding: "utf8",
});
if (result.status !== 0) {
  process.stderr.write(result.stderr ?? result.error?.message ?? "Packed CLI failed.\n");
  process.exit(result.status ?? 1);
}
if (/missing-source/.test(result.stdout) || !/link/.test(result.stdout)) {
  console.error("Packed CLI did not plan links from its packaged examples.");
  process.stderr.write(result.stdout);
  process.exit(1);
}
const repoLine = result.stdout.split("\n").find((line) => line.startsWith("repo: "));
const installedPackageRoot = path.join(prefix, "node_modules", packageJson.name);
if (!repoLine || path.resolve(repoLine.slice(6)) !== installedPackageRoot) {
  console.error(`Packed CLI selected the wrong repo root: ${repoLine ?? "missing repo line"}`);
  process.exit(1);
}
if (readFileSync(path.join(installedPackageRoot, "examples", "editor", "editorconfig"), "utf8").length === 0) {
  console.error("Packed example fixture is unexpectedly empty.");
  process.exit(1);
}

console.log("Packed CLI install passed from an unrelated working directory.");
