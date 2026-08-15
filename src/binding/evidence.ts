import type { EvidenceEvalFixture } from "../contract/types.js";

/** Real Estate binds journey outcomes as independent evidence. Self-declared is not enough. */
export const EVIDENCE_EVAL_FIXTURES: EvidenceEvalFixture[] = [
  {
    id: "ev-showing-kept",
    description: "Counterpart confirmed a kept showing",
    countsAsIndependentOutcome: true,
    kind: "journey_outcome",
  },
  {
    id: "ev-listing-live",
    description: "Listing went live on the bound MLS",
    countsAsIndependentOutcome: true,
    kind: "journey_outcome",
  },
  {
    id: "ev-contract-executed",
    description: "Executed contract confirmed by counterpart",
    countsAsIndependentOutcome: true,
    kind: "journey_outcome",
  },
  {
    id: "ev-closing-confirmed",
    description: "Closing confirmed by independent record",
    countsAsIndependentOutcome: true,
    kind: "journey_outcome",
  },
  {
    id: "ev-past-client-touch",
    description: "Past-client touch confirmed by counterpart",
    countsAsIndependentOutcome: true,
    kind: "journey_outcome",
  },
  {
    id: "ev-self-declared",
    description: "Self-declared success is not enough",
    countsAsIndependentOutcome: false,
    kind: "self_declared",
  },
];
