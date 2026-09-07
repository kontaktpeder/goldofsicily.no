import assert from "node:assert/strict";
import test from "node:test";
import { formatGoldLotCode } from "./gold-lot.ts";

test("Pilot Core uses the same Gold-LOT master format as the portal", () => {
  assert.equal(formatGoldLotCode("2026-09-07", "t", 1), "L-20260907-T-01");
});
