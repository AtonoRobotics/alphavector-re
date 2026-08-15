import type { ActionClassVerb } from "../contract/types.js";

/**
 * Real Estate binding of the generic action-class dimension.
 * A0-A6 meanings are pack verbs, not OS law.
 * No T0-T3 numbers (DEC-017 is not accepted).
 * Authorization is the default (DEC-010). EXC-008: class does not grant execution.
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
  },
  {
    id: "communicate",
    label: "Communicate",
    externalEffect: true,
    startRequiresAuthorization: true,
    mayGraduate: true,
    ceiling: "bounded_autonomy",
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
