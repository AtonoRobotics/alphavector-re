import type { PredicateDeclaration } from "../contract/types.js";

/**
 * Written pack graph relationships bound in this slice.
 * SoT also names LIKED, REJECTED, and others — do not invent a merge.
 */
export const WRITTEN_GRAPH_PREDICATES = ["REQUIRES", "PREFERS", "AVOIDS"] as const;
export type WrittenGraphPredicate = (typeof WRITTEN_GRAPH_PREDICATES)[number];

/**
 * Pack-local condition ids a licensed field agent can record on the existing
 * fact path. Ids match field-language keys and policy purpose keys where those
 * already exist. Consent denies use the consent.* namespace (policy consent body).
 * Not brokerage, counsel, MLS, or tenant-instance data.
 */
export const PACK_CONDITIONS = {
  PURPOSE_FOLLOW_UP: "purpose.follow-up",
  PURPOSE_SHOWING: "purpose.showing",
  PURPOSE_LISTING: "purpose.listing",
  PURPOSE_TRANSACTION: "purpose.transaction",
  JOURNEY_BUYER: "journey.buyer",
  JOURNEY_SELLER: "journey.seller",
  JOURNEY_LISTING: "journey.listing",
  JOURNEY_TRANSACTION: "journey.transaction",
  JOURNEY_PAST_CLIENT: "journey.past-client",
  SUBJECT_LISTING: "subject.listing",
  SUBJECT_PROPERTY: "subject.property",
  CONSENT_DNC: "consent.dnc",
  CONSENT_QUIET_HOURS: "consent.quiet-hours",
  CONSENT_ASSUMED_AUTONOMY: "consent.assumed-autonomy",
  CONSENT_RECOVERY: "consent.recovery",
  CONSENT_CRM_UPDATE: "consent.crm-update",
  CONSENT_SCHEDULING: "consent.scheduling",
} as const;

export type PackConditionId = (typeof PACK_CONDITIONS)[keyof typeof PACK_CONDITIONS];

export interface PredicateDecision {
  allowed: boolean;
  reason: string;
  recordedPrefers: string[];
  closed: boolean;
}

function listed(values: string[] | undefined): string[] {
  return Array.isArray(values) ? values.filter((v) => typeof v === "string" && v.length > 0) : [];
}

/**
 * Pack-side check for journey/action bindings that declare written predicates.
 * REQUIRES fails closed when the required condition is missing.
 * AVOIDS fails closed when the avoided condition is present.
 * PREFERS is recorded, not forced — unmet prefers do not fail closed.
 */
export function evaluateDeclaredPredicates(
  binding: PredicateDeclaration,
  presentConditions: readonly string[] = [],
): PredicateDecision {
  const present = new Set(presentConditions);
  const requires = listed(binding.REQUIRES);
  const avoids = listed(binding.AVOIDS);
  const recordedPrefers = listed(binding.PREFERS);

  const missingRequires = requires.filter((condition) => !present.has(condition));
  if (missingRequires.length > 0) {
    return {
      allowed: false,
      reason: `REQUIRES missing: ${missingRequires.join(", ")}; fail closed`,
      recordedPrefers,
      closed: true,
    };
  }

  const presentAvoids = avoids.filter((condition) => present.has(condition));
  if (presentAvoids.length > 0) {
    return {
      allowed: false,
      reason: `AVOIDS present: ${presentAvoids.join(", ")}; fail closed`,
      recordedPrefers,
      closed: true,
    };
  }

  return {
    allowed: true,
    reason: "declared predicates passed",
    recordedPrefers,
    closed: false,
  };
}
