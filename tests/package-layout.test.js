import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

 test("npm package includes declared bin and src entrypoints", () => {
  const manifest = JSON.parse(readFileSync("package.json", "utf8"));
  const [packument] = JSON.parse(
    execFileSync("npm", ["pack", "--dry-run", "--json"], { encoding: "utf8" }),
  );
  const packed = new Set(packument.files.map(({ path }) => path));
  const binValues = typeof manifest.bin === "string"
    ? [manifest.bin]
    : Object.values(manifest.bin ?? {});
  const entrypoints = [manifest.main, manifest.exports?.["."], ...binValues]
    .filter(Boolean)
    .map((path) => path.replace(/^\.\//, ""));
  assert.ok(entrypoints.length > 0, "package declares at least one entrypoint");
  assert.deepEqual(entrypoints.filter((path) => !packed.has(path)), []);
});
