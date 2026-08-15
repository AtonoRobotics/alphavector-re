import { InstanceBindError } from "../errors.js";
import { signPayload, verifyPayload } from "../contract/signing.js";
import { canonicalJson } from "../ids.js";
import { PRODUCT } from "../identity.js";

export interface TenantInstanceBody {
  tenantId: string;
  packId: string;
  packVersion: string;
  brokerage: string;
  jurisdiction: string;
  mls: string;
  association: string;
}

export interface TenantInstance extends TenantInstanceBody {
  signatures: { counselEval: string };
}

export function unsignedTenantInstance(body: TenantInstanceBody): TenantInstanceBody {
  return { ...body };
}

export function signTenantInstance(body: TenantInstanceBody, counselPrivateKeyPem: string): TenantInstance {
  return {
    ...body,
    signatures: { counselEval: signPayload(body, counselPrivateKeyPem) },
  };
}

/**
 * Production bind fails closed without a counsel-signed tenant instance (TPB-006).
 */
export function assertCounselSignedInstance(
  raw: unknown,
  counselEvalPublicKeyPem: string,
): TenantInstance {
  if (!raw || typeof raw !== "object") {
    throw new InstanceBindError("INSTANCE_UNSIGNED", "Tenant instance required; fail closed");
  }
  const rec = raw as Record<string, unknown>;
  const sigs = rec.signatures;
  if (!sigs || typeof sigs !== "object" || typeof (sigs as { counselEval?: unknown }).counselEval !== "string") {
    throw new InstanceBindError("INSTANCE_UNSIGNED", "Counsel-signed tenant instance required; fail closed");
  }
  const { signatures, ...body } = rec as unknown as TenantInstance;
  if (body.packId !== PRODUCT.package) {
    throw new InstanceBindError("INSTANCE_INVALID", "Tenant instance packId must be alphavector-re");
  }
  if (!body.tenantId || !body.brokerage || !body.jurisdiction || !body.mls || !body.association) {
    throw new InstanceBindError("INSTANCE_INCOMPLETE", "Tenant instance missing brokerage bindings");
  }
  if (body.jurisdiction === "unbound") {
    throw new InstanceBindError("INSTANCE_UNBOUND", "Jurisdiction unbound; fail closed");
  }
  if (!verifyPayload(body, counselEvalPublicKeyPem, signatures.counselEval)) {
    throw new InstanceBindError("INSTANCE_UNSIGNED", "Counsel signature invalid; fail closed");
  }
  void canonicalJson(body);
  return { ...body, signatures };
}
