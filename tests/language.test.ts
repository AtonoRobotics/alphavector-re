import { describe, expect, it } from "vitest";
import { FIELD_LANGUAGE_MAP, FORBIDDEN_FIELD_LANGUAGE_KEYS } from "../src/binding/language.js";
import { assertFieldSafe, fieldLabel } from "../src/field/language.js";
import { SurfaceViolationError } from "../src/errors.js";

describe("field language", () => {
  it("uses business words", () => {
    expect(fieldLabel("approve")).toBe("Approve");
    expect(fieldLabel("deny")).toBe("Deny");
    expect(fieldLabel("journey.buyer")).toBe("Buyer");
    expect(fieldLabel("purpose.follow-up")).toBe("Send this follow-up");
  });

  it("has no model prompt Temporal or tool config", () => {
    const blob = Object.entries(FIELD_LANGUAGE_MAP)
      .flat()
      .join(" ")
      .toLowerCase();
    for (const word of FORBIDDEN_FIELD_LANGUAGE_KEYS) {
      expect(blob).not.toContain(word);
    }
  });

  it("rejects OS jargon on the field surface", () => {
    expect(() => assertFieldSafe("pick a model")).toThrow(SurfaceViolationError);
    expect(() => assertFieldSafe("edit the prompt")).toThrow(SurfaceViolationError);
    expect(() => assertFieldSafe("inspect Temporal")).toThrow(SurfaceViolationError);
  });
});
