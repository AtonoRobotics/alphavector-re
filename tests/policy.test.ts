import { describe, expect, it } from "vitest";
import { POLICY } from "../src/binding/policy.js";
import { evaluateAdversarialFixtures, evaluateRules, policySurvivesGraduation } from "../src/contract/evaluator.js";
import { MemoryPackRegistry, PackLoader } from "../src/contract/loader.js";
import { signedRePack } from "./helpers.js";

describe("policy fixtures fail closed", () => {
  it("adversarial fixtures pass on the authored pack", () => {
    const result = evaluateAdversarialFixtures(POLICY);
    expect(result.ok).toBe(true);
  });

  it("signed pack load requires fixtures to pass", () => {
    const { anchors, binding } = signedRePack();
    const loader = new PackLoader(new MemoryPackRegistry(), anchors);
    const result = loader.load({ tenantId: "t1", binding, actor: "architect" });
    expect(result.ok).toBe(true);
  });

  it("unknown purpose fails closed", () => {
    const decision = evaluateRules(POLICY, {
      tenantId: "t1",
      agentId: "a1",
      actionClass: "communicate",
      purpose: "unknown-purpose",
    });
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toMatch(/fail closed/i);
  });

  it("DNC, quiet hours, fair housing, RESPA, Reg B deny", () => {
    const cases = [
      { purpose: "dnc", actionClass: "communicate", channel: "email" },
      { purpose: "quiet-hours", actionClass: "communicate", channel: "sms" },
      { purpose: "steering", actionClass: "communicate", channel: "email" },
      { purpose: "protected-class", actionClass: "communicate", channel: "email" },
      { purpose: "respa-kickback", actionClass: "communicate", channel: "email" },
      { purpose: "reg-b", actionClass: "internal_write" },
    ];
    for (const c of cases) {
      const decision = evaluateRules(POLICY, { tenantId: "t1", agentId: "a1", ...c });
      expect(decision.allowed, c.purpose).toBe(false);
    }
  });

  it("EXC-008 routine comms CRM scheduling recovery deny", () => {
    for (const purpose of ["recovery", "crm-update", "scheduling", "assumed-autonomy"]) {
      const decision = evaluateRules(POLICY, {
        tenantId: "t1",
        agentId: "a1",
        actionClass: purpose === "crm-update" ? "internal_write" : "communicate",
        purpose,
        channel: "email",
      });
      expect(decision.allowed, purpose).toBe(false);
    }
  });

  it("graduation does not strip policy", () => {
    const req = {
      tenantId: "t1",
      agentId: "a1",
      actionClass: "communicate",
      purpose: "dnc",
      channel: "email",
    };
    const before = evaluateRules(POLICY, req);
    const after = policySurvivesGraduation(POLICY, req);
    expect(before.allowed).toBe(false);
    expect(after.allowed).toBe(false);
    expect(after.reason).toBe(before.reason);
  });

  it("unbound jurisdiction fails closed", () => {
    const decision = evaluateRules(POLICY, {
      tenantId: "t1",
      agentId: "a1",
      actionClass: "communicate",
      channel: "email",
      jurisdiction: "unbound",
    });
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toMatch(/counsel-signed tenant instance/i);
  });
});
