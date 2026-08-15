import { describe, expect, it } from "vitest";
import { PROPERTY_IS_NOT_LISTING, RECORD_PARTY_KNOWLEDGE } from "../src/binding/kinds.js";

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
});
