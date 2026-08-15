import { describe, expect, it } from "vitest";
import { MemoryPackRegistry, PackLoader } from "../src/contract/loader.js";
import { signPack } from "../src/contract/signing.js";
import { unsignedRePack } from "../src/binding/pack.js";
import { loadUnsignedFixture, makeAnchors, signedRePack } from "./helpers.js";

describe("pack load DEC-019", () => {
  it("refuses an unsigned pack", async () => {
    const { anchors } = signedRePack();
    const loader = new PackLoader(new MemoryPackRegistry(), anchors);
    const unsigned = await loadUnsignedFixture();
    const result = loader.load({ tenantId: "t1", binding: unsigned, actor: "architect" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("PACK_UNSIGNED");
  });

  it("refuses a pack signed only by architect", async () => {
    const keys = makeAnchors();
    const unsigned = unsignedRePack();
    const half = signPack(unsigned, keys.architectPrivate, keys.counselPrivate);
    half.signatures = { architect: half.signatures!.architect, counselEval: "" };
    const loader = new PackLoader(new MemoryPackRegistry(), keys.anchors);
    const result = loader.load({ tenantId: "t1", binding: half, actor: "architect" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("PACK_UNSIGNED_OWNER");
  });

  it("refuses an incomplete pack", () => {
    const { anchors, binding } = signedRePack();
    const loader = new PackLoader(new MemoryPackRegistry(), anchors);
    const { roles: _r, ...incomplete } = binding;
    const result = loader.load({ tenantId: "t1", binding: incomplete, actor: "architect" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("PACK_INCOMPLETE");
  });

  it("refuses field-user load", () => {
    const { anchors, binding } = signedRePack();
    const loader = new PackLoader(new MemoryPackRegistry(), anchors);
    const result = loader.load({ tenantId: "t1", binding, actor: "field" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("FIELD_CANNOT_LOAD_PACK");
  });

  it("loads a signed complete fixture pack", async () => {
    const keys = makeAnchors();
    const fixture = await loadUnsignedFixture();
    const binding = signPack(fixture, keys.architectPrivate, keys.counselPrivate);
    const loader = new PackLoader(new MemoryPackRegistry(), keys.anchors);
    const result = loader.load({ tenantId: "t1", binding, actor: "architect" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.loaded.binding.identity.packId).toBe("alphavector-re");
      expect(result.loaded.binding.identity.displayName).toBe("AV Dev");
    }
  });

  it("committed fixture matches unsignedRePack", async () => {
    const fixture = await loadUnsignedFixture();
    expect(fixture).toEqual(unsignedRePack());
  });

  it("rejects invented T0-T3 numbers on action-class verbs", () => {
    const { anchors } = makeAnchors();
    const unsigned = unsignedRePack();
    const poisoned = {
      ...unsigned,
      actionClassVerbs: unsigned.actionClassVerbs.map((v) => ({ ...v, tier: "T0" })),
    };
    const loader = new PackLoader(new MemoryPackRegistry(), anchors);
    const result = loader.load({ tenantId: "t1", binding: poisoned, actor: "architect" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("PACK_INVALID");
  });
});
