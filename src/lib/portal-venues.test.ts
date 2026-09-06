import assert from "node:assert/strict";
import test from "node:test";
import { isMenuImageUrl, isPublicMenuUrl } from "./portal-venues.ts";

test("homepage only links http(s) menu files", () => {
  assert.equal(isPublicMenuUrl("https://example.com/meny.pdf"), true);
  assert.equal(isPublicMenuUrl("file:///Users/pedaar/Downloads/OBB MENY.png"), false);
  assert.equal(isPublicMenuUrl(""), false);
});

test("menu images can be shown inline", () => {
  assert.equal(isMenuImageUrl("https://cdn.example.com/obb-meny.png"), true);
  assert.equal(isMenuImageUrl("https://cdn.example.com/meny.JPEG?v=1"), true);
  assert.equal(isMenuImageUrl("https://cdn.example.com/meny.pdf"), false);
  assert.equal(isMenuImageUrl("file:///Users/pedaar/Downloads/OBB MENY.png"), false);
});
