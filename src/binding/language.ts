import type { FieldLanguageMap } from "../contract/types.js";

/**
 * Business-language labels for field cards (DEC-020 / DEC-024).
 * No model, prompt, Temporal, or tool configuration.
 */
export const FIELD_LANGUAGE_MAP: FieldLanguageMap = {
  approve: "Approve",
  deny: "Deny",
  kill: "Stop everything",
  "purpose.follow-up": "Send this follow-up",
  "purpose.showing": "Confirm this showing",
  "purpose.listing": "Update this listing",
  "purpose.transaction": "Move this transaction",
  "subject.buyer": "This buyer",
  "subject.seller": "This seller",
  "subject.listing": "This listing",
  "subject.property": "This property",
  "subject.transaction": "This transaction",
  "subject.past-client": "This past client",
  "channel.email": "Email",
  "channel.sms": "Text",
  "channel.phone": "Phone",
  "journey.buyer": "Buyer",
  "journey.seller": "Seller",
  "journey.listing": "Listing",
  "journey.transaction": "Transaction",
  "journey.past-client": "Past client",
};

export const FORBIDDEN_FIELD_LANGUAGE_KEYS = [
  "model",
  "prompt",
  "temporal",
  "tool",
  "trust tier",
  "trust ladder",
  "skill promotion",
] as const;
