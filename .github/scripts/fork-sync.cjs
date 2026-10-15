// Merges upstream main into the current branch, the same merge the
// fork-release workflow runs. Works on Linux and Windows.
//
// Usage: node .github/scripts/fork-sync.cjs

const { execFileSync } = require("node:child_process");

const UPSTREAM = "https://github.com/pingdotgg/t3code.git";
const git = (...args) =>
  execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] }).trim();

// --no-tags: upstream release tags would collide with the fork's own vX.Y.Z tags.
if (!git("remote").split("\n").includes("upstream")) {
  git("remote", "add", "--no-tags", "upstream", UPSTREAM);
}
git("fetch", "--no-tags", "upstream", "main");
try {
  execFileSync("git", ["merge", "--no-edit", "upstream/main"], { stdio: "inherit" });
} catch {
  console.error("\nUpstream merge conflicts. Resolve them and commit, or run `git merge --abort`.");
  process.exit(1);
}
