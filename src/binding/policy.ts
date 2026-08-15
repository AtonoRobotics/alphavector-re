import type { PolicyBodies } from "../contract/types.js";

/**
 * Real Estate policy bodies (DEC-019 policy section).
 * IN-001 jurisdiction / MLS / association + fair housing + RESPA / Reg B.
 * IN-003 licensed-action boundary.
 * IN-004 consent / DNC / quiet hours.
 * Fail closed. Graduation does not strip these rules.
 */
export const POLICY: PolicyBodies = {
  jurisdiction: [
    {
      id: "j-deny-unbound",
      when: { jurisdiction: "unbound" },
      decision: "deny",
      reason: "Fail closed without a counsel-signed tenant instance",
    },
    {
      id: "j-deny-steering",
      when: { purpose: "steering" },
      decision: "deny",
      reason: "Fair housing: steering is prohibited",
    },
    {
      id: "j-deny-protected",
      when: { purpose: "protected-class" },
      decision: "deny",
      reason: "Fair housing: targeting or ranking by protected class is prohibited",
    },
    {
      id: "j-deny-respa",
      when: { purpose: "respa-kickback" },
      decision: "deny",
      reason: "RESPA: kickbacks and unearned fees are prohibited",
    },
    {
      id: "j-deny-regb",
      when: { purpose: "reg-b" },
      decision: "deny",
      reason: "Reg B: discriminatory credit treatment is prohibited",
    },
    {
      id: "j-allow-read",
      when: { actionClass: "read" },
      decision: "allow",
      reason: "Reads are permitted",
    },
    {
      id: "j-allow-write",
      when: { actionClass: "internal_write" },
      decision: "allow",
      reason: "Internal writes permitted when authorized",
    },
    {
      id: "j-allow-comm-email",
      when: { actionClass: "communicate", channel: "email", purpose: "follow-up" },
      decision: "allow",
      reason: "Email permitted with consent",
    },
    {
      id: "j-allow-comm-sms",
      when: { actionClass: "communicate", channel: "sms", purpose: "follow-up" },
      decision: "allow",
      reason: "Text permitted with consent",
    },
    {
      id: "j-allow-material",
      when: { actionClass: "material_state", purpose: "owner-authorized" },
      decision: "allow",
      reason: "Material state change with owner authorization",
    },
  ],
  licensedAction: [
    {
      id: "la-deny-prohibited",
      when: { actionClass: "prohibited" },
      decision: "deny",
      reason: "Prohibited class: legal, tax, lending, negotiation advice",
    },
    {
      id: "la-deny-judgment",
      when: { actionClass: "licensed_judgment" },
      decision: "deny",
      reason: "Licensed judgment remains a human decision",
    },
    {
      id: "la-deny-gov",
      when: { actionClass: "governance" },
      decision: "deny",
      reason: "Governance is Architect control plane, not an agent effect",
    },
    {
      id: "la-deny-legal",
      when: { purpose: "legal-advice" },
      decision: "deny",
      reason: "EXC-001: autonomous legal advice is excluded",
    },
  ],
  consent: [
    {
      id: "c-deny-dnc",
      when: { purpose: "dnc" },
      decision: "deny",
      reason: "Do-not-contact",
    },
    {
      id: "c-deny-quiet",
      when: { purpose: "quiet-hours" },
      decision: "deny",
      reason: "Quiet hours",
    },
    {
      id: "c-deny-recovery",
      when: { purpose: "recovery" },
      decision: "deny",
      reason: "EXC-008: assumed autonomy for routine recovery is excluded",
    },
    {
      id: "c-deny-crm",
      when: { purpose: "crm-update" },
      decision: "deny",
      reason: "EXC-008: assumed autonomy for routine CRM updates is excluded",
    },
    {
      id: "c-deny-sched",
      when: { purpose: "scheduling" },
      decision: "deny",
      reason: "EXC-008: assumed autonomy for routine scheduling is excluded",
    },
    {
      id: "c-deny-assumed",
      when: { purpose: "assumed-autonomy" },
      decision: "deny",
      reason: "EXC-008: assumed autonomy for routine communications is excluded",
    },
    {
      id: "c-allow-followup",
      when: { purpose: "follow-up", actionClass: "communicate" },
      decision: "allow",
      reason: "Consented follow-up",
    },
    {
      id: "c-allow-write",
      when: { actionClass: "internal_write" },
      decision: "allow",
      reason: "Internal write has no contact consent requirement",
    },
    {
      id: "c-allow-read",
      when: { actionClass: "read" },
      decision: "allow",
      reason: "Reads have no contact consent requirement",
    },
    {
      id: "c-allow-material",
      when: { actionClass: "material_state", purpose: "owner-authorized" },
      decision: "allow",
      reason: "Owner-authorized material state",
    },
  ],
  adversarialFixtures: [
    {
      id: "fx-dnc",
      description: "DNC must deny",
      input: { actionClass: "communicate", purpose: "dnc", channel: "email" },
      expect: "deny",
    },
    {
      id: "fx-quiet",
      description: "Quiet hours must deny",
      input: { actionClass: "communicate", purpose: "quiet-hours", channel: "sms" },
      expect: "deny",
    },
    {
      id: "fx-steering",
      description: "Fair housing steering must deny",
      input: { actionClass: "communicate", purpose: "steering", channel: "email" },
      expect: "deny",
    },
    {
      id: "fx-protected",
      description: "Protected-class targeting must deny",
      input: { actionClass: "communicate", purpose: "protected-class", channel: "email" },
      expect: "deny",
    },
    {
      id: "fx-judgment",
      description: "Licensed judgment must deny",
      input: { actionClass: "licensed_judgment" },
      expect: "deny",
    },
    {
      id: "fx-prohibited",
      description: "Prohibited class must deny",
      input: { actionClass: "prohibited" },
      expect: "deny",
    },
    {
      id: "fx-respa",
      description: "RESPA kickback must deny",
      input: { actionClass: "communicate", purpose: "respa-kickback", channel: "email" },
      expect: "deny",
    },
    {
      id: "fx-regb",
      description: "Reg B discrimination must deny",
      input: { actionClass: "internal_write", purpose: "reg-b" },
      expect: "deny",
    },
    {
      id: "fx-exc-008-recovery",
      description: "Assumed recovery autonomy must deny",
      input: { actionClass: "communicate", purpose: "recovery", channel: "email" },
      expect: "deny",
    },
    {
      id: "fx-exc-008-crm",
      description: "Assumed CRM autonomy must deny",
      input: { actionClass: "internal_write", purpose: "crm-update" },
      expect: "deny",
    },
    {
      id: "fx-exc-008-sched",
      description: "Assumed scheduling autonomy must deny",
      input: { actionClass: "communicate", purpose: "scheduling", channel: "email" },
      expect: "deny",
    },
    {
      id: "fx-unbound",
      description: "Unbound jurisdiction must deny",
      input: { actionClass: "communicate", jurisdiction: "unbound", channel: "email" },
      expect: "deny",
    },
    {
      id: "fx-legal",
      description: "Legal advice must deny",
      input: { actionClass: "communicate", purpose: "legal-advice", channel: "email" },
      expect: "deny",
    },
    {
      id: "fx-email-ok",
      description: "Consented email allow",
      input: { actionClass: "communicate", purpose: "follow-up", channel: "email" },
      expect: "allow",
    },
    {
      id: "fx-sms-ok",
      description: "Consented SMS allow",
      input: { actionClass: "communicate", purpose: "follow-up", channel: "sms" },
      expect: "allow",
    },
    {
      id: "fx-email-unknown-purpose",
      description: "Channel-only email with unknown purpose must fail closed",
      input: { actionClass: "communicate", purpose: "unknown-purpose", channel: "email" },
      expect: "deny",
    },
    {
      id: "fx-sms-unknown-purpose",
      description: "Channel-only SMS with unknown purpose must fail closed",
      input: { actionClass: "communicate", purpose: "unknown-purpose", channel: "sms" },
      expect: "deny",
    },
    {
      id: "fx-email-missing-purpose",
      description: "Channel-only email with missing purpose must fail closed",
      input: { actionClass: "communicate", channel: "email" },
      expect: "deny",
    },
    {
      id: "fx-sms-missing-purpose",
      description: "Channel-only SMS with missing purpose must fail closed",
      input: { actionClass: "communicate", channel: "sms" },
      expect: "deny",
    },
    {
      id: "fx-read-ok",
      description: "Read allow",
      input: { actionClass: "read" },
      expect: "allow",
    },
    {
      id: "fx-write-ok",
      description: "Authorized internal write allow",
      input: { actionClass: "internal_write" },
      expect: "allow",
    },
  ],
};
