import { describe, expect, it } from "vitest";
import { AUTHORED_ROLES, FIELD_MAY_AUTHOR_ORG_CHART, withRoleCount } from "../src/binding/roles.js";
import { MemoryPackRegistry, PackLoader } from "../src/contract/loader.js";
import { signedRePack } from "./helpers.js";

describe("roles count is data", () => {
  it("does not freeze 13", () => {
    expect(AUTHORED_ROLES).not.toHaveLength(13);
    expect(FIELD_MAY_AUTHOR_ORG_CHART).toBe(false);
  });

  it("loads the authored org chart", () => {
    const { anchors, binding } = signedRePack();
    const loader = new PackLoader(new MemoryPackRegistry(), anchors);
    const result = loader.load({ tenantId: "t1", binding, actor: "architect" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.loaded.binding.roles.length).toBeGreaterThanOrEqual(4);
      expect(result.loaded.binding.roles.some((r) => r.isOrchestrator)).toBe(true);
    }
  });

  it("loads a four-role binding", () => {
    const { anchors, binding } = signedRePack(withRoleCount(4));
    const loader = new PackLoader(new MemoryPackRegistry(), anchors);
    const result = loader.load({ tenantId: "t1", binding, actor: "architect" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.loaded.binding.roles).toHaveLength(4);
  });

  it("loads a dozens-role binding", () => {
    const { anchors, binding } = signedRePack(withRoleCount(24));
    const loader = new PackLoader(new MemoryPackRegistry(), anchors);
    const result = loader.load({ tenantId: "t1", binding, actor: "architect" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.loaded.binding.roles).toHaveLength(24);
  });
});
