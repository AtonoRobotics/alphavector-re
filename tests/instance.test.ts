import { describe, expect, it } from "vitest";
import { generateEd25519 } from "../src/contract/signing.js";
import { assertCounselSignedInstance, signTenantInstance } from "../src/instance/tenant.js";
import { InstanceBindError } from "../src/errors.js";

const body = {
  tenantId: "t1",
  packId: "alphavector-re",
  packVersion: "0.1.0",
  brokerage: "Example Brokerage",
  jurisdiction: "us-ca",
  mls: "example-mls",
  association: "example-assoc",
};

describe("counsel-signed tenant instance", () => {
  it("fails closed without a signature", () => {
    const counsel = generateEd25519();
    expect(() => assertCounselSignedInstance(body, counsel.publicKeyPem)).toThrow(InstanceBindError);
    expect(() => assertCounselSignedInstance(undefined, counsel.publicKeyPem)).toThrow(/fail closed/i);
  });

  it("binds a counsel-signed instance", () => {
    const counsel = generateEd25519();
    const signed = signTenantInstance(body, counsel.privateKeyPem);
    const bound = assertCounselSignedInstance(signed, counsel.publicKeyPem);
    expect(bound.jurisdiction).toBe("us-ca");
  });

  it("refuses unbound jurisdiction", () => {
    const counsel = generateEd25519();
    const signed = signTenantInstance({ ...body, jurisdiction: "unbound" }, counsel.privateKeyPem);
    expect(() => assertCounselSignedInstance(signed, counsel.publicKeyPem)).toThrow(/unbound/i);
  });
});
