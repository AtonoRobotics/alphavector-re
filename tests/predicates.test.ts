import { describe, expect, it } from "vitest";
import { ACTION_CLASS_VERBS } from "../src/binding/verbs.js";
import { JOURNEY_KINDS, REQUIRED_JOURNEY_IDS } from "../src/binding/journeys.js";
import { PROPERTY_IS_NOT_LISTING } from "../src/binding/kinds.js";
import { FIELD_LANGUAGE_MAP } from "../src/binding/language.js";
import { evaluateDeclaredPredicates, PACK_CONDITIONS } from "../src/binding/predicates.js";
import type { ActionClassVerb, JourneyKindBinding, PredicateDeclaration } from "../src/contract/types.js";

/** Overlay ids for engine-shape tests. Not brokerage, counsel, MLS, or tenant instance data. */
const REQUIRED = "condition.required";
const PREFERRED = "condition.preferred";
const AVOIDED = "condition.avoided";

function journeyById(id: string): JourneyKindBinding {
  const journey = JOURNEY_KINDS.find((j) => j.id === id);
  if (!journey) throw new Error(`${id} journey missing`);
  return journey;
}

function verbById(id: string): ActionClassVerb {
  const verb = ACTION_CLASS_VERBS.find((v) => v.id === id);
  if (!verb) throw new Error(`${id} verb missing`);
  return verb;
}

function buyerWithPredicates(extra: Partial<JourneyKindBinding> = {}): JourneyKindBinding {
  const buyer = journeyById("buyer");
  return { id: buyer.id, label: buyer.label, ...extra };
}

function communicateWithPredicates(extra: Partial<ActionClassVerb> = {}): ActionClassVerb {
  const verb = verbById("communicate");
  return {
    id: verb.id,
    label: verb.label,
    externalEffect: verb.externalEffect,
    startRequiresAuthorization: verb.startRequiresAuthorization,
    mayGraduate: verb.mayGraduate,
    ceiling: verb.ceiling,
    ...extra,
  };
}

/** Journey plus its communicate binding — the authored field progress step. */
function journeyStep(journeyId: string): PredicateDeclaration[] {
  return [journeyById(journeyId), verbById("communicate")];
}

function evaluateStep(bindings: PredicateDeclaration[], present: readonly string[]) {
  const decisions = bindings.map((binding) => evaluateDeclaredPredicates(binding, present));
  const closed = decisions.find((d) => !d.allowed);
  return closed ?? decisions[decisions.length - 1]!;
}

describe("REQUIRES PREFERS AVOIDS on journey and action bindings", () => {
  it("journey and action bindings can declare the three written predicates", () => {
    const journey = buyerWithPredicates({
      REQUIRES: [REQUIRED],
      PREFERS: [PREFERRED],
      AVOIDS: [AVOIDED],
    });
    const action = communicateWithPredicates({
      REQUIRES: [REQUIRED],
      PREFERS: [PREFERRED],
      AVOIDS: [AVOIDED],
    });
    expect(journey.REQUIRES).toEqual([REQUIRED]);
    expect(journey.PREFERS).toEqual([PREFERRED]);
    expect(journey.AVOIDS).toEqual([AVOIDED]);
    expect(action.REQUIRES).toEqual([REQUIRED]);
    expect(action.PREFERS).toEqual([PREFERRED]);
    expect(action.AVOIDS).toEqual([AVOIDED]);
  });

  it("REQUIRES fails closed when the required condition is missing", () => {
    const journey = buyerWithPredicates({ REQUIRES: [REQUIRED] });
    const action = communicateWithPredicates({ REQUIRES: [REQUIRED] });
    for (const binding of [journey, action]) {
      const decision = evaluateDeclaredPredicates(binding, []);
      expect(decision.allowed).toBe(false);
      expect(decision.closed).toBe(true);
      expect(decision.reason).toMatch(/REQUIRES missing/i);
      expect(decision.reason).toMatch(/fail closed/i);
    }
    const met = evaluateDeclaredPredicates(journey, [REQUIRED]);
    expect(met.allowed).toBe(true);
    expect(met.closed).toBe(false);
  });

  it("AVOIDS fails closed when the avoided condition is present", () => {
    const journey = buyerWithPredicates({ AVOIDS: [AVOIDED] });
    const action = communicateWithPredicates({ AVOIDS: [AVOIDED] });
    for (const binding of [journey, action]) {
      const decision = evaluateDeclaredPredicates(binding, [AVOIDED]);
      expect(decision.allowed).toBe(false);
      expect(decision.closed).toBe(true);
      expect(decision.reason).toMatch(/AVOIDS present/i);
      expect(decision.reason).toMatch(/fail closed/i);
    }
    const clear = evaluateDeclaredPredicates(journey, []);
    expect(clear.allowed).toBe(true);
    expect(clear.closed).toBe(false);
  });

  it("PREFERS is recorded not forced when unmet", () => {
    const journey = buyerWithPredicates({ PREFERS: [PREFERRED] });
    const action = communicateWithPredicates({ PREFERS: [PREFERRED] });
    for (const binding of [journey, action]) {
      const unmet = evaluateDeclaredPredicates(binding, []);
      expect(unmet.allowed).toBe(true);
      expect(unmet.closed).toBe(false);
      expect(unmet.recordedPrefers).toEqual([PREFERRED]);
      const met = evaluateDeclaredPredicates(binding, [PREFERRED]);
      expect(met.allowed).toBe(true);
      expect(met.recordedPrefers).toEqual([PREFERRED]);
    }
  });
});

describe("authored journey and action predicate bindings", () => {
  it("keeps the five authored journey ids", () => {
    expect(JOURNEY_KINDS.map((j) => j.id)).toEqual([...REQUIRED_JOURNEY_IDS]);
  });

  it("buyer journey step fails closed without journey.buyer and passes after that fact exists", () => {
    const step = journeyStep("buyer");
    const missing = evaluateStep(step, []);
    expect(missing.allowed).toBe(false);
    expect(missing.closed).toBe(true);
    expect(missing.reason).toMatch(/REQUIRES missing: journey\.buyer/i);
    const stillMissingPurpose = evaluateStep(step, [PACK_CONDITIONS.JOURNEY_BUYER]);
    expect(stillMissingPurpose.allowed).toBe(false);
    expect(stillMissingPurpose.reason).toMatch(/REQUIRES missing: purpose\.follow-up/i);
    const present = evaluateStep(step, [
      PACK_CONDITIONS.JOURNEY_BUYER,
      PACK_CONDITIONS.PURPOSE_FOLLOW_UP,
    ]);
    expect(present.allowed).toBe(true);
    expect(present.closed).toBe(false);
  });

  it("past-client journey step fails closed without journey.past-client and passes after that fact exists", () => {
    const step = journeyStep("past-client");
    const missing = evaluateStep(step, [PACK_CONDITIONS.PURPOSE_FOLLOW_UP]);
    expect(missing.allowed).toBe(false);
    expect(missing.closed).toBe(true);
    expect(missing.reason).toMatch(/REQUIRES missing: journey\.past-client/i);
    const present = evaluateStep(step, [
      PACK_CONDITIONS.JOURNEY_PAST_CLIENT,
      PACK_CONDITIONS.PURPOSE_FOLLOW_UP,
    ]);
    expect(present.allowed).toBe(true);
    expect(present.closed).toBe(false);
  });

  it("listing journey step fails closed without journey.listing; subject.property is not a substitute", () => {
    expect(PROPERTY_IS_NOT_LISTING).toBe(true);
    const listing = journeyById("listing");
    expect(listing.REQUIRES).toEqual([PACK_CONDITIONS.JOURNEY_LISTING]);
    expect(listing.REQUIRES).not.toContain(PACK_CONDITIONS.SUBJECT_PROPERTY);
    expect(listing.PREFERS).toContain(PACK_CONDITIONS.SUBJECT_LISTING);
    const propertyOnly = evaluateDeclaredPredicates(listing, [PACK_CONDITIONS.SUBJECT_PROPERTY]);
    expect(propertyOnly.allowed).toBe(false);
    expect(propertyOnly.reason).toMatch(/REQUIRES missing: journey\.listing/i);
    const present = evaluateDeclaredPredicates(listing, [PACK_CONDITIONS.JOURNEY_LISTING]);
    expect(present.allowed).toBe(true);
  });

  it("communicate fails closed without purpose.follow-up and passes after that fact exists", () => {
    const communicate = verbById("communicate");
    const missing = evaluateDeclaredPredicates(communicate, []);
    expect(missing.allowed).toBe(false);
    expect(missing.closed).toBe(true);
    expect(missing.reason).toMatch(/REQUIRES missing: purpose\.follow-up/i);
    const present = evaluateDeclaredPredicates(communicate, [PACK_CONDITIONS.PURPOSE_FOLLOW_UP]);
    expect(present.allowed).toBe(true);
    expect(present.closed).toBe(false);
  });

  it("communicate and past-client fail closed on DNC and quiet hours", () => {
    const communicate = verbById("communicate");
    const pastClient = journeyById("past-client");
    const required = [PACK_CONDITIONS.PURPOSE_FOLLOW_UP, PACK_CONDITIONS.JOURNEY_PAST_CLIENT];
    for (const avoided of [PACK_CONDITIONS.CONSENT_DNC, PACK_CONDITIONS.CONSENT_QUIET_HOURS]) {
      for (const binding of [communicate, pastClient]) {
        const decision = evaluateDeclaredPredicates(binding, [...required, avoided]);
        expect(decision.allowed, `${binding === communicate ? "communicate" : "past-client"} ${avoided}`).toBe(
          false,
        );
        expect(decision.reason).toMatch(/AVOIDS present/i);
      }
    }
  });

  it("communicate and internal_write fail closed on EXC-008 assumed autonomy", () => {
    const communicate = verbById("communicate");
    const write = verbById("internal_write");
    const commDenied = evaluateDeclaredPredicates(communicate, [
      PACK_CONDITIONS.PURPOSE_FOLLOW_UP,
      PACK_CONDITIONS.CONSENT_ASSUMED_AUTONOMY,
    ]);
    expect(commDenied.allowed).toBe(false);
    expect(commDenied.reason).toMatch(/consent\.assumed-autonomy/i);
    const recovery = evaluateDeclaredPredicates(communicate, [
      PACK_CONDITIONS.PURPOSE_FOLLOW_UP,
      PACK_CONDITIONS.CONSENT_RECOVERY,
    ]);
    expect(recovery.allowed).toBe(false);
    const scheduling = evaluateDeclaredPredicates(communicate, [
      PACK_CONDITIONS.PURPOSE_FOLLOW_UP,
      PACK_CONDITIONS.CONSENT_SCHEDULING,
    ]);
    expect(scheduling.allowed).toBe(false);
    const crm = evaluateDeclaredPredicates(write, [PACK_CONDITIONS.CONSENT_CRM_UPDATE]);
    expect(crm.allowed).toBe(false);
    expect(crm.reason).toMatch(/consent\.crm-update/i);
    const writeOk = evaluateDeclaredPredicates(write, []);
    expect(writeOk.allowed).toBe(true);
  });

  it("condition ids match field-language or consent policy keys and invent no brokerage facts", () => {
    const declared = new Set<string>();
    for (const binding of [...JOURNEY_KINDS, ...ACTION_CLASS_VERBS]) {
      for (const id of [...(binding.REQUIRES ?? []), ...(binding.PREFERS ?? []), ...(binding.AVOIDS ?? [])]) {
        declared.add(id);
      }
    }
    for (const id of declared) {
      const known = id in FIELD_LANGUAGE_MAP || id.startsWith("consent.");
      expect(known, id).toBe(true);
      expect(id).not.toMatch(/brokerage|counsel|mls|tenant-instance/i);
    }
    expect(declared.has(PACK_CONDITIONS.PURPOSE_FOLLOW_UP)).toBe(true);
    expect(declared.has(PACK_CONDITIONS.CONSENT_DNC)).toBe(true);
    expect(declared.has(PACK_CONDITIONS.JOURNEY_BUYER)).toBe(true);
  });
});
