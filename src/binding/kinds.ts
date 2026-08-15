import type { RecordPartyKnowledge } from "../contract/types.js";

/**
 * DEC-026 pack bindings onto core generic slots. Not OS types.
 * Person and Household are party kinds.
 * Property, Listing, Requirement, Transaction, Recommendation are record kinds.
 * Property is not a listing. That is a pack rule, not an OS table.
 */
export const RECORD_PARTY_KNOWLEDGE: RecordPartyKnowledge = {
  partyKinds: ["Person", "Household"],
  recordKinds: ["Property", "Listing", "Requirement", "Transaction", "Recommendation"],
  predicates: ["owns", "lives_in", "listed_as", "requires", "party_to", "represents", "refers"],
  corpora: ["listings", "mls", "transaction_docs", "consent_records", "fair_housing"],
  graphNodeKinds: [
    "Person",
    "Household",
    "Property",
    "Listing",
    "Requirement",
    "Transaction",
    "Recommendation",
  ],
  graphEdgeKinds: ["OWNS", "LIVES_IN", "LISTED_AS", "REQUIRES", "PARTY_TO", "REPRESENTS", "REFERS"],
};

export const PROPERTY_IS_NOT_LISTING = true;
