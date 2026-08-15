import { describe, expect, it } from "vitest";
import { PROPERTY_IS_NOT_LISTING, RECORD_PARTY_KNOWLEDGE } from "../src/binding/kinds.js";
import { WRITTEN_GRAPH_PREDICATES } from "../src/binding/predicates.js";

describe("DEC-026 pack kinds", () => {
  it("binds Person Household Property Listing Requirement Transaction onto generic slots", () => {
    expect(RECORD_PARTY_KNOWLEDGE.partyKinds).toEqual(["Person", "Household"]);
    expect(RECORD_PARTY_KNOWLEDGE.recordKinds).toEqual(
      expect.arrayContaining(["Property", "Listing", "Requirement", "Transaction"]),
    );
    expect(PROPERTY_IS_NOT_LISTING).toBe(true);
    expect(RECORD_PARTY_KNOWLEDGE.partyKinds).not.toContain("Property");
    expect(RECORD_PARTY_KNOWLEDGE.recordKinds).not.toContain("Person");
  });

  it("binds written REQUIRES PREFERS AVOIDS on predicates and graph edges", () => {
    expect(WRITTEN_GRAPH_PREDICATES).toEqual(["REQUIRES", "PREFERS", "AVOIDS"]);
    for (const kind of WRITTEN_GRAPH_PREDICATES) {
      expect(RECORD_PARTY_KNOWLEDGE.predicates, kind).toContain(kind);
      expect(RECORD_PARTY_KNOWLEDGE.graphEdgeKinds, kind).toContain(kind);
    }
    expect(RECORD_PARTY_KNOWLEDGE.predicates).not.toContain("LIKED");
    expect(RECORD_PARTY_KNOWLEDGE.predicates).not.toContain("REJECTED");
    expect(RECORD_PARTY_KNOWLEDGE.graphEdgeKinds).not.toContain("LIKED");
    expect(RECORD_PARTY_KNOWLEDGE.graphEdgeKinds).not.toContain("REJECTED");
  });
});
