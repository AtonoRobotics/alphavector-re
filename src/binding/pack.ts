import type { PackBinding, RoleBinding } from "../contract/types.js";
import { PACK_IDENTITY } from "./identity.js";
import { AUTHORED_ROLES } from "./roles.js";
import { JOURNEY_KINDS } from "./journeys.js";
import { ACTION_CLASS_VERBS } from "./verbs.js";
import { POLICY } from "./policy.js";
import { CONNECTORS } from "./connectors.js";
import { RECORD_PARTY_KNOWLEDGE } from "./kinds.js";
import { EVIDENCE_EVAL_FIXTURES } from "./evidence.js";
import { ASK_CEILINGS } from "./ask.js";
import { FIELD_LANGUAGE_MAP } from "./language.js";

export function unsignedRePack(roles: RoleBinding[] = AUTHORED_ROLES): Omit<PackBinding, "signatures"> {
  return {
    identity: PACK_IDENTITY,
    roles,
    journeyKinds: JOURNEY_KINDS,
    actionClassVerbs: ACTION_CLASS_VERBS,
    policy: POLICY,
    connectors: CONNECTORS,
    recordPartyKnowledge: RECORD_PARTY_KNOWLEDGE,
    evidenceEvalFixtures: EVIDENCE_EVAL_FIXTURES,
    askCeilings: [...ASK_CEILINGS],
    fieldLanguageMap: FIELD_LANGUAGE_MAP,
  };
}
