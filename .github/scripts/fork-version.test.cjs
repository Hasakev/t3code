const assert = require("node:assert/strict");
const test = require("node:test");
const { nextForkVersion } = require("./fork-version.cjs");

test("numbers fork releases above their upstream version", () => {
  assert.equal(nextForkVersion("0.0.45", []), "0.0.45001");
  assert.equal(nextForkVersion("0.0.45", ["v0.0.45", "v0.0.45001", "v0.0.45002"]), "0.0.45003");
  assert.equal(nextForkVersion("0.0.46", ["v0.0.45002", "v0.0.46-nightly.20261016.1"]), "0.0.46001");
  assert.equal(nextForkVersion("0.1.0", ["v0.0.45002"]), "0.1.1");
});
