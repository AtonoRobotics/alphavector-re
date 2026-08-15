/**
 * Development scaffold identity. Not a consumer brand.
 * Locked 2026-08-15: AV Dev / alphavector-re / llc.alphavector.dev.
 * Host is alphavector-core. This repository is the Real Estate pack, not the OS.
 */
export const PRODUCT = {
  appDisplay: "AV Dev",
  package: "alphavector-re",
  bundleId: "llc.alphavector.dev",
  hostPackage: "alphavector-core",
  hostRef: "99b4793",
} as const;

export const FORBIDDEN_PRODUCT_NAMES = [
  "Alpha Agent",
  "AlphaAgent",
  "Alpha Agents",
  "Alpha Agent AI",
  "Mission Control",
  "Desk",
  "Shape",
  "Director",
  "Play",
  "Plant",
  "HIL",
  "Thor",
  "Human.AI",
  "The Agency",
  "Omniflow",
  "Oracle",
] as const;

export const FORBIDDEN_PRODUCT_TYPE_STRINGS = [
  "desk",
  "shape",
  "director",
  "play",
  "plant",
  "hil",
  "thor",
] as const;

export function isForbiddenProductName(name: string): boolean {
  const lowered = name.trim().toLowerCase();
  return FORBIDDEN_PRODUCT_NAMES.some((n) => n.toLowerCase() === lowered);
}

export function isForbiddenProductType(name: string): boolean {
  return FORBIDDEN_PRODUCT_TYPE_STRINGS.includes(
    name.trim().toLowerCase() as (typeof FORBIDDEN_PRODUCT_TYPE_STRINGS)[number],
  );
}

export function assertNotConsumerBrand(name: string): void {
  const lowered = name.trim().toLowerCase();
  if (lowered === "av dev" || lowered === "alpha vector" || lowered === "alphavector") {
    throw new Error("AV Dev / alphavector-re is a development scaffold, not a consumer brand");
  }
}
