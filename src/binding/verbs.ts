import type { ActionClassVerb } from "../contract/types.js";
import { PACK_CONDITIONS } from "./predicates.js";

/**
 * Real Estate binding of the generic action-class dimension.
 * A0-A6 meanings are pack verbs, not OS law.
 * No T0-T3 numbers (DEC-017 is not accepted).
 * Authorization is the default (DEC-010). EXC-008: class does not grant execution.
 * Communicate requires a consented follow-up purpose and avoids DNC, quiet hours,
 * and assumed autonomy for comms / recovery / scheduling. Internal write avoids
 * assumed CRM autonomy.
 */
export const ACTION_CLASS_VERBS: ActionClassVerb[] = [
  {
    id: "read",
    label: "Read",
    externalEffect: false,
    startRequiresAuthorization: false,
    mayGraduate: true,
    ceiling: "bounded_autonomy",
  },
  {
    id: "internal_write",
    label: "Internal write",
    externalEffect: true,
    startRequiresAuthorization: true,
    mayGraduate: true,
    ceiling: "bounded_autonomy",
    AVOIDS: [PACK_CONDITIONS.CONSENT_CRM_UPDATE, PACK_CONDITIONS.CONSENT_ASSUMED_AUTONOMY],
  },
  {
    id: "communicate",
    label: "Communicate",
    externalEffect: true,
    startRequiresAuthorization: true,
    mayGraduate: true,
    ceiling: "bounded_autonomy",
    REQUIRES: [PACK_CONDITIONS.PURPOSE_FOLLOW_UP],
    AVOIDS: [
      PACK_CONDITIONS.CONSENT_DNC,
      PACK_CONDITIONS.CONSENT_QUIET_HOURS,
      PACK_CONDITIONS.CONSENT_ASSUMED_AUTONOMY,
      PACK_CONDITIONS.CONSENT_RECOVERY,
      PACK_CONDITIONS.CONSENT_SCHEDULING,
    ],
  },
  {
    id: "material_state",
    label: "Material client state",
    externalEffect: true,
    startRequiresAuthorization: true,
    mayGraduate: true,
    ceiling: "authorization_required",
  },
  {
    id: "licensed_judgment",
    label: "Licensed judgment",
    externalEffect: true,
    startRequiresAuthorization: true,
    mayGraduate: false,
    ceiling: "human_decision",
  },
  {
    id: "prohibited",
    label: "Prohibited",
    externalEffect: true,
    startRequiresAuthorization: true,
    mayGraduate: false,
    ceiling: "prohibited",
  },
  {
    id: "governance",
    label: "Governance",
    externalEffect: true,
    startRequiresAuthorization: true,
    mayGraduate: false,
    ceiling: "governance",
  },
];
