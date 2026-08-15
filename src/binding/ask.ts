/**
 * Action classes the optional Ask path SHALL NOT authorize (DEC-024).
 * Ask is a coordinator they can text, not a side door around policy or cards.
 */
export const ASK_CEILINGS = [
  "licensed_judgment",
  "prohibited",
  "governance",
  "material_state",
] as const;

export type AskCeiling = (typeof ASK_CEILINGS)[number];
