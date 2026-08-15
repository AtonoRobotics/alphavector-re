# alphavector-re

AV Dev Real Estate pack. Package `alphavector-re`. Loads on `alphavector-core`.

Not Mission Control. Not the OS. Not a consumer house name.

This repository is the first domain pack (DEC-001-B). It is a signed binding the core can load (DEC-019). It is not a fork of the OS and not types baked into core tables.

This is a development scaffold, not a consumer brand.

| Use | Value |
| --- | --- |
| App display | AV Dev |
| Package | alphavector-re |
| Bundle | llc.alphavector.dev |
| Host | alphavector-core @ 99b4793 |

## What this is

A complete Real Estate pack binding:

- Identity, role bindings, journey kinds, action-class verbs
- Policy bodies: fair housing, DNC / quiet hours, licensed-action, RESPA / Reg B
- Connector bindings (MLS, CRM, showing, transaction, email, SMS, calendar)
- DEC-026 record / party / knowledge bindings
- Evidence / eval fixtures (journey outcomes)
- Ask ceilings
- Field language map (business words)

The pack authors the org chart. Roles are an array. Count is data. A binding MAY have four roles or dozens. This authored fixture uses eight, including hidden specialists. That number is not a freeze. The field user SHALL NOT spawn agents, write personas, or add skills.

Journeys (pack types only): buyer, seller, listing, transaction, past-client.

Data: Person, Household, Property, Listing, Requirement, Transaction (and Recommendation) bind onto core generic slots. They are not OS types. Property is not a listing.

Authorization is the default. No T0-T3 numbers. EXC-008: no assumed autonomy for routine communications, CRM, scheduling, or recovery.

Unsigned, incomplete, or unsigned-owner packs fail closed. A counsel-signed tenant instance is required to bind a brokerage / jurisdiction. Graduation does not strip policy.

## What this is not

- Not alphavector-core. The computer primitive, agent runtime, and policy gateway host stay in core.
- Not Mission Control. Desk, Shape, Director, Play, Plant, HIL, and Thor are not product types here.
- Not a consumer house name.
- Not a later Physical AI / robot pack.

## Locks

Field users do not configure models, prompts, Temporal, or tools (DEC-020).

Ask cannot authorize licensed judgment, prohibited classes, governance, or material state.

Policy-auth is not owner-auth. Both are required. Deny is terminal.

## Development

Node 20. Vitest. Run install, then test, then build.

Signing keys are generated in tests. Do not commit private keys or tenant secrets.
