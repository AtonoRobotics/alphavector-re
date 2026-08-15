import { describe, expect, it } from "vitest";
import { unsignedRePack } from "../src/binding/pack.js";
import { FORBIDDEN_PRODUCT_TYPE_STRINGS, isForbiddenProductType } from "../src/identity.js";

describe("no Mission Control product types", () => {
  it("does not use MC type strings as product types", () => {
    const pack = unsignedRePack();
    const kinds = [
      ...pack.recordPartyKnowledge.partyKinds,
      ...pack.recordPartyKnowledge.recordKinds,
      ...pack.recordPartyKnowledge.graphNodeKinds,
      ...pack.recordPartyKnowledge.graphEdgeKinds,
      ...pack.journeyKinds.map((j) => j.id),
      ...pack.roles.map((r) => r.name),
      ...pack.actionClassVerbs.map((v) => v.id),
      ...pack.connectors.map((c) => c.id),
      pack.identity.packId,
      pack.identity.displayName,
    ].map((s) => s.toLowerCase());
    for (const word of FORBIDDEN_PRODUCT_TYPE_STRINGS) {
      expect(kinds, word).not.toContain(word);
      expect(isForbiddenProductType(word)).toBe(true);
    }
  });
});
