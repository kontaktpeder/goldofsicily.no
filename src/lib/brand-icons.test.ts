import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const publicDir = join(dirname(fileURLToPath(import.meta.url)), "../../public");

function pngSize(path: string) {
  const buf = readFileSync(path);
  assert.equal(buf.subarray(1, 4).toString(), "PNG");
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

test("public app icons are the Gold drawing set, not a redrawn logo", () => {
  assert.deepEqual(pngSize(join(publicDir, "favicon-16x16.png")), { width: 16, height: 16 });
  assert.deepEqual(pngSize(join(publicDir, "favicon-32x32.png")), { width: 32, height: 32 });
  assert.deepEqual(pngSize(join(publicDir, "apple-touch-icon.png")), { width: 180, height: 180 });
  assert.deepEqual(pngSize(join(publicDir, "android-chrome-192x192.png")), { width: 192, height: 192 });
  assert.deepEqual(pngSize(join(publicDir, "android-chrome-512x512.png")), { width: 512, height: 512 });
  const ico = readFileSync(join(publicDir, "favicon.ico"));
  assert.equal(ico[0], 0);
  assert.equal(ico[2], 1);
});

test("root head and manifest point at the restored icon files", () => {
  const root = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "../routes/__root.tsx"),
    "utf8",
  );
  const manifest = readFileSync(join(publicDir, "site.webmanifest"), "utf8");
  assert.match(root, /href: "\/favicon.ico"/);
  assert.match(root, /href: "\/favicon-16x16.png"/);
  assert.match(root, /href: "\/favicon-32x32.png"/);
  assert.match(root, /href: "\/apple-touch-icon.png"/);
  assert.match(root, /href: "\/android-chrome-192x192.png"/);
  assert.match(root, /href: "\/android-chrome-512x512.png"/);
  assert.match(root, /href: "\/site.webmanifest"/);
  assert.match(manifest, /android-chrome-192x192\.png/);
  assert.match(manifest, /android-chrome-512x512\.png/);
});
