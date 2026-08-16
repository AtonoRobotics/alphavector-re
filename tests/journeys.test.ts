import { describe, expect, it } from "vitest";
import { JOURNEY_KINDS, REQUIRED_JOURNEY_IDS } from "../src/binding/journeys.js";
import { MemoryPackRegistry, PackLoader } from "../src/contract/loader.js";
import { signedRePack } from "./helpers.js";

describe("five pack journeys", () => {
  it("binds buyer, seller, listing, transaction, past-client", () => {
    expect(JOURNEY_KINDS.map((j) => j.id)).toEqual([...REQUIRED_JOURNEY_IDS]);
    expect(JOURNEY_KINDS).toHaveLength(5);
    for (const journey of JOURNEY_KINDS) {
      expect(journey.REQUIRES?.length, journey.id).toBeGreaterThan(0);
    }
  });

  it("loaded pack exposes the five journey kinds", () => {
    const { anchors, binding } = signedRePack();
    const loader = new PackLoader(new MemoryPackRegistry(), anchors);
    const result = loader.load({ tenantId: "t1", binding, actor: "architect" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.loaded.binding.journeyKinds.map((j) => j.id)).toEqual([
        "buyer",
        "seller",
        "listing",
        "transaction",
        "past-client",
      ]);
      expect(result.loaded.binding.journeyKinds[0]?.REQUIRES).toEqual(["journey.buyer"]);
    }
  });
});
