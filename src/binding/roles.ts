import type { RoleBinding } from "../contract/types.js";

/**
 * Pack-authored org chart (DEC-027). Count is instance data, not a freeze.
 * This authored binding has eight roles. A tenant instance MAY bind four or dozens.
 * Field user SHALL NOT spawn agents, write personas, or add skills.
 * Hidden Real Estate specialists are fine. No Counsel agent (EXC-001).
 */
export const FIELD_MAY_AUTHOR_ORG_CHART = false;

export const AUTHORED_ROLES: RoleBinding[] = [
  {
    name: "Orchestrator",
    persona: "Coordinates one journey goal at a time and dispatches work to specialists.",
    skills: ["dispatch", "freeze"],
    specialties: ["coordination"],
    isOrchestrator: true,
  },
  {
    name: "Follow-up",
    persona: "Drafts follow-up for authorization. Does not send without a card and policy allow.",
    skills: ["draft"],
    specialties: ["communications", "hidden"],
  },
  {
    name: "Listing",
    persona: "Prepares listing journey work. Does not price or guarantee condition.",
    skills: ["prepare", "retrieve"],
    specialties: ["listing", "hidden"],
  },
  {
    name: "Transaction",
    persona: "Tracks dates and documents on a transaction. Does not interpret contracts.",
    skills: ["track", "retrieve"],
    specialties: ["transaction", "hidden"],
  },
  {
    name: "Buyer",
    persona: "Supports a buyer journey. Does not steer or rank by protected class.",
    skills: ["retrieve", "draft"],
    specialties: ["buyer", "hidden"],
  },
  {
    name: "Seller",
    persona: "Supports a seller journey. Does not give unlicensed price advice.",
    skills: ["retrieve", "draft"],
    specialties: ["seller", "hidden"],
  },
  {
    name: "Past-client",
    persona: "Keeps the sphere in view. Does not contact DNC or during quiet hours.",
    skills: ["retrieve", "draft"],
    specialties: ["past-client", "hidden"],
  },
  {
    name: "Review",
    persona: "Challenges unsupported claims. Does not execute external actions.",
    skills: ["review"],
    specialties: ["challenge", "hidden"],
  },
];

export function withRoleCount(count: number, base = AUTHORED_ROLES): RoleBinding[] {
  if (count < 1) {
    throw new Error("roles array is required and must not be empty");
  }
  if (count <= base.length) {
    const sliced = base.slice(0, count);
    if (!sliced.some((r) => r.isOrchestrator)) {
      sliced[0] = { ...sliced[0]!, isOrchestrator: true };
    }
    return sliced;
  }
  const extra: RoleBinding[] = [];
  for (let i = base.length; i < count; i += 1) {
    extra.push({
      name: `Specialist-${i + 1}`,
      persona: "Pack-authored hidden specialist. Field user cannot add this role.",
      skills: ["retrieve"],
      specialties: ["hidden"],
    });
  }
  return [...base, ...extra];
}
