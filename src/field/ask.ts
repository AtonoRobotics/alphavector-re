import { SurfaceViolationError } from "../errors.js";
import { ASK_CEILINGS } from "../binding/ask.js";

export function assertAskAllowed(actionClass: string, text: string): void {
  if ((ASK_CEILINGS as readonly string[]).includes(actionClass)) {
    throw new SurfaceViolationError(
      `Ask path cannot authorize action class ${actionClass} (pack Ask ceiling)`,
    );
  }
  const lowered = text.toLowerCase();
  if (
    lowered.includes("pick a model") ||
    lowered.includes("edit prompt") ||
    lowered.includes("inspect temporal") ||
    lowered.includes("configure tool")
  ) {
    throw new SurfaceViolationError("Ask path is not an architecture console");
  }
}
