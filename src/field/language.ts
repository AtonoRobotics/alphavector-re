import { SurfaceViolationError } from "../errors.js";
import { FIELD_LANGUAGE_MAP, FORBIDDEN_FIELD_LANGUAGE_KEYS } from "../binding/language.js";

export function fieldLabel(key: string): string {
  const label = FIELD_LANGUAGE_MAP[key];
  if (!label) {
    throw new SurfaceViolationError(`No field language for ${key}`);
  }
  assertFieldSafe(label);
  assertFieldSafe(key);
  return label;
}

export function assertFieldSafe(text: string): void {
  const lowered = text.toLowerCase();
  for (const word of FORBIDDEN_FIELD_LANGUAGE_KEYS) {
    if (lowered.includes(word)) {
      throw new SurfaceViolationError(`Field surface must not expose ${word}`);
    }
  }
}
