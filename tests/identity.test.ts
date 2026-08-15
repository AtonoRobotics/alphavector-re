import { describe, expect, it } from "vitest";
import { PRODUCT, isForbiddenProductName, assertNotConsumerBrand } from "../src/identity.js";
import { PACK_IDENTITY } from "../src/binding/identity.js";

describe("identity", () => {
  it("is the AV Dev Real Estate pack", () => {
    expect(PRODUCT.appDisplay).toBe("AV Dev");
    expect(PRODUCT.package).toBe("alphavector-re");
    expect(PRODUCT.bundleId).toBe("llc.alphavector.dev");
    expect(PRODUCT.hostPackage).toBe("alphavector-core");
    expect(PRODUCT.hostRef).toBe("99b4793");
    expect(PACK_IDENTITY.packId).toBe("alphavector-re");
    expect(PACK_IDENTITY.displayName).toBe("AV Dev");
  });

  it("treats Mission Control names as forbidden", () => {
    expect(isForbiddenProductName("Mission Control")).toBe(true);
    expect(isForbiddenProductName("Desk")).toBe(true);
    expect(isForbiddenProductName("Thor")).toBe(true);
  });

  it("refuses treating AV Dev as a consumer brand", () => {
    expect(() => assertNotConsumerBrand("AV Dev")).toThrow(/not a consumer brand/);
  });
});
