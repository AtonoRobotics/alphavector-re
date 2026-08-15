import type { RecordPartyKnowledge } from "../contract/types.js";
import { WRITTEN_GRAPH_PREDICATES } from "./predicates.js";

/**
 * DEC-026 pack bindings onto core generic slots. Not OS types.
 * Person and Household are party kinds.
 * Property, Listing, Requirement, Transaction, Recommendation are record kinds.
 * Property is not a listing. That is a pack rule, not an OS table.
 *
 * Graph predicates thicken to the written names (DEC-026 / D08 / rev-1.1/03):
 * REQUIRES, PREFERS, AVOIDS. Other written edges (LIKED, REJECTED, …) are
 * not bound here. Existing invented edges stay; this is not a rewrite.
 */
export const RECORD_PARTY_KNOWLEDGE: RecordPartyKnowledge = {
  partyKinds: ["Person", "Household"],
  recordKinds: ["Property", "Listing", "Requirement", "Transaction", "Recommendation"],
  predicates: [
    "owns",
    "lives_in",
    "listed_as",
    "requires",
    "party_to",
    "represents",
    "refers",
    ...WRITTEN_GRAPH_PREDICATES,
  ],
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
  graphEdgeKinds: [
    "OWNS",
    "LIVES_IN",
    "LISTED_AS",
    "REQUIRES",
    "PARTY_TO",
    "REPRESENTS",
    "REFERS",
    "PREFERS",
    "AVOIDS",
  ],
};

export const PROPERTY_IS_NOT_LISTING = true;
