import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import { createServer } from "vite";

let server;
let createNodesFromStatuses;
before(async () => {
  server = await createServer({
    configFile: false,
    server: { middlewareMode: true, ws: false, watch: null },
    appType: "custom",
  });
  ({ createNodesFromStatuses } = await server.ssrLoadModule("/src/utils/nodeUtils.ts"));
});
after(async () => { await server?.close(); });

const status = (name, people = []) => ({
  name, description: `${name} description`, people,
});

test("empty statuses produce no nodes, and omitted surveys default to empty", () => {
  assert.deepEqual(createNodesFromStatuses({}), []);
  const nodes = createNodesFromStatuses({ "146": status("Attending") });
  assert.deepEqual(nodes[0].data.surveys, []);
});

test("node construction preserves status IDs, people and survey data without mutating inputs", () => {
  const people = Object.freeze([
    Object.freeze({ id: 1, fullName: "Synthetic Person", connectionStatusValueId: 146 }),
  ]);
  const surveys = Object.freeze([Object.freeze({ personId: "1", formId: "example-form" })]);
  const statuses = Object.freeze({
    "146": Object.freeze(status("Attending", people)),
    "1229": Object.freeze(status("Growing")),
  });
  const nodes = createNodesFromStatuses(statuses, surveys);
  assert.deepEqual(nodes, [
    {
      id: "146", type: "teamNode", position: { x: 0, y: 0 },
      data: { label: "Attending", description: "Attending description", people, surveys },
    },
    {
      id: "1229", type: "teamNode", position: { x: 0, y: 0 },
      data: { label: "Growing", description: "Growing description", people: [], surveys },
    },
  ]);
});

test("test statuses are filtered case-insensitively alongside Prospect and Community", () => {
  const nodes = createNodesFromStatuses({
    "test-upper": status("TEST Group"),
    "test-mixed": status("Internal tEsT"),
    "prospect": status("Prospect"),
    "community": status("Community"),
    "visiting": status("Visiting"),
    "growing": status("Growing"),
  });
  assert.deepEqual(nodes.map(node => [node.id, node.data.label]), [
    ["visiting", "Visiting"], ["growing", "Growing"],
  ]);
});

test("invalid status values are skipped without preventing valid nodes", (t) => {
  const warnings = t.mock.method(console, "warn", () => {});
  const nodes = createNodesFromStatuses({
    "null": null,
    "undefined": undefined,
    "number": 42,
    "string": "Attending",
    "missing-name": {},
    "invalid-name": { name: 42 },
    "valid": status("Joining"),
  });
  assert.deepEqual(nodes.map(node => node.id), ["valid"]);
  assert.equal(warnings.mock.callCount(), 6);
});
