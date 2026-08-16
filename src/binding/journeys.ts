import type { JourneyKindBinding } from "../contract/types.js";
import { PACK_CONDITIONS } from "./predicates.js";

/**
 * Pack journey kinds (DEC-001-B / DEC-002). Not OS types (CS-021).
 * Authored REQUIRES / PREFERS / AVOIDS match the written field workflow.
 * Property is not a listing: listing requires journey.listing and prefers
 * subject.listing — subject.property does not satisfy that require.
 */
export const JOURNEY_KINDS: JourneyKindBinding[] = [
  {
    id: "buyer",
    label: "Buyer",
    REQUIRES: [PACK_CONDITIONS.JOURNEY_BUYER],
    PREFERS: [PACK_CONDITIONS.PURPOSE_SHOWING],
    AVOIDS: [PACK_CONDITIONS.CONSENT_DNC, PACK_CONDITIONS.CONSENT_QUIET_HOURS],
  },
  {
    id: "seller",
    label: "Seller",
    REQUIRES: [PACK_CONDITIONS.JOURNEY_SELLER],
    PREFERS: [PACK_CONDITIONS.PURPOSE_LISTING],
    AVOIDS: [PACK_CONDITIONS.CONSENT_DNC, PACK_CONDITIONS.CONSENT_QUIET_HOURS],
  },
  {
    id: "listing",
    label: "Listing",
    REQUIRES: [PACK_CONDITIONS.JOURNEY_LISTING],
    PREFERS: [PACK_CONDITIONS.PURPOSE_LISTING, PACK_CONDITIONS.SUBJECT_LISTING],
    AVOIDS: [PACK_CONDITIONS.CONSENT_ASSUMED_AUTONOMY],
  },
  {
    id: "transaction",
    label: "Transaction",
    REQUIRES: [PACK_CONDITIONS.JOURNEY_TRANSACTION],
    PREFERS: [PACK_CONDITIONS.PURPOSE_TRANSACTION],
    AVOIDS: [PACK_CONDITIONS.CONSENT_ASSUMED_AUTONOMY],
  },
  {
    id: "past-client",
    label: "Past client",
    REQUIRES: [PACK_CONDITIONS.JOURNEY_PAST_CLIENT],
    PREFERS: [PACK_CONDITIONS.PURPOSE_FOLLOW_UP],
    AVOIDS: [PACK_CONDITIONS.CONSENT_DNC, PACK_CONDITIONS.CONSENT_QUIET_HOURS],
  },
];

export const REQUIRED_JOURNEY_IDS = ["buyer", "seller", "listing", "transaction", "past-client"] as const;
