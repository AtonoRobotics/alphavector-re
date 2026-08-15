import { describe, expect, it } from "vitest";
import { ASK_CEILINGS } from "../src/binding/ask.js";
import { assertAskAllowed } from "../src/field/ask.js";
import { SurfaceViolationError } from "../src/errors.js";

describe("Ask ceilings", () => {
  it("forbids licensed judgment, prohibited, governance, material state", () => {
    expect([...ASK_CEILINGS]).toEqual([
      "licensed_judgment",
      "prohibited",
      "governance",
      "material_state",
    ]);
    for (const action of ASK_CEILINGS) {
      expect(() => assertAskAllowed(action, "please do this")).toThrow(SurfaceViolationError);
    }
  });

  it("allows a follow-up ask that is not a ceiling", () => {
    expect(() => assertAskAllowed("communicate", "Send this follow-up")).not.toThrow();
  });

  it("rejects architecture-console asks", () => {
    expect(() => assertAskAllowed("communicate", "pick a model")).toThrow(SurfaceViolationError);
    expect(() => assertAskAllowed("communicate", "edit prompt")).toThrow(SurfaceViolationError);
    expect(() => assertAskAllowed("communicate", "inspect Temporal")).toThrow(SurfaceViolationError);
    expect(() => assertAskAllowed("communicate", "configure tool")).toThrow(SurfaceViolationError);
  });
});
