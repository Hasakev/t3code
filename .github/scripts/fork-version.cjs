// Next fork release version: upstream X.Y.Z ships as X.Y.(Z*1000 + n), so every
// fork release sorts above the upstream build it is based on and above earlier
// fork releases, which is all electron-updater needs to offer it.
// ponytail: n caps at 999 fork releases per upstream version.
//
// Usage: node .github/scripts/fork-version.cjs   (prints the version for HEAD)

const { execFileSync } = require("node:child_process");
const { readFileSync } = require("node:fs");

function nextForkVersion(upstreamVersion, tags) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(upstreamVersion);
  if (!match) throw new Error(`Unsupported upstream version: ${upstreamVersion}`);
  const [, major, minor, patch] = match;
  const base = Number(patch) * 1000;
  let n = 0;
  for (const tag of tags) {
    const m = /^v(\d+)\.(\d+)\.(\d+)$/.exec(tag);
    if (!m || m[1] !== major || m[2] !== minor) continue;
    const p = Number(m[3]);
    if (p > base && p < base + 1000) n = Math.max(n, p - base);
  }
  if (n >= 999) throw new Error(`Fork release numbers exhausted for ${upstreamVersion}`);
  return `${major}.${minor}.${base + n + 1}`;
}

if (require.main === module) {
  const { version } = JSON.parse(readFileSync("apps/desktop/package.json", "utf8"));
  const tags = execFileSync("git", ["tag", "--list", "v*"], { encoding: "utf8" }).split("\n");
  console.log(nextForkVersion(version, tags));
}

module.exports = { nextForkVersion };
