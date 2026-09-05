import assert from "node:assert/strict";
import test from "node:test";
import { isPublicMenuUrl } from "./portal-venues.ts";

test("homepage only links http(s) menu files", () => {
  assert.equal(isPublicMenuUrl("https://example.com/meny.pdf"), true);
  assert.equal(isPublicMenuUrl("file:///Users/pedaar/Downloads/OBB MENY.png"), false);
  assert.equal(isPublicMenuUrl(""), false);
});
