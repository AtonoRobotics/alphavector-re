import type { ConnectorBinding } from "../contract/types.js";

/**
 * Pack connector bindings (CS-014). Which systems is pack data.
 * New-provider connect remains Architect / governance, not the field user.
 * Presence of a connector is not assumed autonomy (EXC-008).
 */
export const CONNECTORS: ConnectorBinding[] = [
  { id: "mls", system: "mls", tools: ["search", "pull"] },
  { id: "crm", system: "crm", tools: ["read", "sync"] },
  { id: "showing", system: "showing", tools: ["propose"] },
  { id: "transaction", system: "transaction", tools: ["status", "documents"] },
  { id: "email", system: "email", tools: ["draft", "send"] },
  { id: "sms", system: "sms", tools: ["draft", "send"] },
  { id: "calendar", system: "calendar", tools: ["read", "propose"] },
];
