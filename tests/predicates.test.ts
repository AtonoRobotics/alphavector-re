import { describe, expect, it } from "vitest";
import { ACTION_CLASS_VERBS } from "../src/binding/verbs.js";
import { JOURNEY_KINDS } from "../src/binding/journeys.js";
import { evaluateDeclaredPredicates } from "../src/binding/predicates.js";
import type { ActionClassVerb, JourneyKindBinding } from "../src/contract/types.js";

/** Pack-local condition ids. Not brokerage, counsel, MLS, or tenant instance data. */
const REQUIRED = "condition.required";
const PREFERRED = "condition.preferred";
const AVOIDED = "condition.avoided";

function buyerWithPredicates(extra: Partial<JourneyKindBinding> = {}): JourneyKindBinding {
  const buyer = JOURNEY_KINDS.find((j) => j.id === "buyer");
  if (!buyer) throw new Error("buyer journey missing");
  return { ...buyer, ...extra };
}

function communicateWithPredicates(extra: Partial<ActionClassVerb> = {}): ActionClassVerb {
  const verb = ACTION_CLASS_VERBS.find((v) => v.id === "communicate");
  if (!verb) throw new Error("communicate verb missing");
  return { ...verb, ...extra };
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

  it("authored five journeys without declarations still pass the check", () => {
    for (const journey of JOURNEY_KINDS) {
      const decision = evaluateDeclaredPredicates(journey, []);
      expect(decision.allowed, journey.id).toBe(true);
      expect(decision.recordedPrefers, journey.id).toEqual([]);
    }
  });
});
