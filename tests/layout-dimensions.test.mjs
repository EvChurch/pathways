import assert from "node:assert/strict";
import { test } from "node:test";
import { createServer } from "vite";

test("dimension changes notify once; repeats and detached callbacks remain safe", async () => {
  const server = await createServer({ configFile: false,
    server: { middlewareMode: true, ws: false, watch: null }, appType: "custom" });
  try {
    const { updateNodeDimensions, setDimensionsChangeCallback } =
      await server.ssrLoadModule("/src/utils/layoutUtils.ts");
    const changed = [];
    setDimensionsChangeCallback((id) => changed.push(id));
    updateNodeDimensions("synthetic-node", 0, 0);
    assert.deepEqual(changed, ["synthetic-node"]);
    updateNodeDimensions("synthetic-node", 0, 0);
    assert.equal(changed.length, 1);
    updateNodeDimensions("synthetic-node", 100, 0);
    updateNodeDimensions("synthetic-node", 100, 50);
    assert.equal(changed.length, 3);
    setDimensionsChangeCallback(null);
    updateNodeDimensions("synthetic-node", 200, 50);
    assert.equal(changed.length, 3);
  } finally { await server.close(); }
});
