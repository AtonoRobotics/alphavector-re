import type { JourneyKindBinding } from "../contract/types.js";

/** Pack journey kinds (DEC-001-B / DEC-002). Not OS types (CS-021). */
export const JOURNEY_KINDS: JourneyKindBinding[] = [
  { id: "buyer", label: "Buyer" },
  { id: "seller", label: "Seller" },
  { id: "listing", label: "Listing" },
  { id: "transaction", label: "Transaction" },
  { id: "past-client", label: "Past client" },
];

export const REQUIRED_JOURNEY_IDS = ["buyer", "seller", "listing", "transaction", "past-client"] as const;
