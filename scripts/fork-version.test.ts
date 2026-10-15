import { assert, it } from "@effect/vitest";

import { nextForkVersion } from "./fork-version.ts";

it("numbers fork releases above their upstream version", () => {
  assert.strictEqual(nextForkVersion("0.0.45", []), "0.0.45001");
  assert.strictEqual(nextForkVersion("0.0.45", ["v0.0.45", "v0.0.45001", "v0.0.45002"]), "0.0.45003");
  assert.strictEqual(nextForkVersion("0.0.46", ["v0.0.45002", "v0.0.46-nightly.20261016.1"]), "0.0.46001");
  assert.strictEqual(nextForkVersion("0.1.0", ["v0.0.45002"]), "0.1.1");
});
