# New era

> The cold chain is becoming a connected machine.
> Robotics moves the product. Software coordinates the work. Compute processes the evidence. Electricity supports the system. Understanding the connections means examining the dependencies.

**Status.** coldchainOS is investigating how physical operations, digital systems, energy and confidential business records intersect. It is not a deployed cybersecurity platform, an autonomous refrigeration controller, a certified engineering service or an incident-response provider. What exists in this repository is verified in the table below; everything else is planned.

## What is implemented and verified here

| Capability | Status | Verification |
|---|---|---|
| Deterministic calculators (energy sensitivity, dwell, route economics) | Implemented and verified | Unit tests in `src/*.test.ts` |
| Local-only evidence checklist at `/deal-room/` | Prototype | Reads file names only in the browser; CSP header set in `public/_headers`; not tested against real files |
| Evaluation schema and 12 synthetic draft cases | Implemented; labels are drafts | `npm test` checks schema validity, deterministic calculations, split leakage and draft status |
| Edge appliance (document store, local models, retrieval, briefs) | Planned | None |
| Evidence-linked brief generation | Planned | None |

## Layers

Physical (products, refrigeration, buildings, docks, vehicles, power); automation (AS/RS, conveyors, pallet handling, mobile robots where relevant); coordination (WMS, WES, TMS, enterprise systems, scheduling, vendor support); evidence (service records, utility bills, equipment inventories, contracts, authorized sensor records, operating logs); intelligence (document extraction, retrieval, deterministic calculation, model-assisted review, human interpretation).

Information flow is not control authority. A refrigeration system may keep operating during an enterprise-software outage while receiving, picking or dispatch stops. A communications outage is not automatically a refrigeration failure. A sensor reading is not automatically a verified product-temperature record.

## Dated evidence

See `new-era-sources.json` (checked 2026-11-09). CISA's July 22 and July 30, 2026 bulletins are cross-sector and water-sector lessons, not cold-chain attacks. TGW's June 9, 2026 announcement describes a facility under construction with go-live anticipated at the end of 2027. NIST SP 800-82 Rev. 3 (September 2023) is the current final OT guidance; Rev. 4 is only an initial public draft. The IEA projection is verified from press summaries only.

## What we are building

Domain-specific datasets and reproducible evaluations that help identify potential issues, expose missing evidence, and prepare source-linked questions for accountable professionals. See `dataset-methodology.md`, `edge-appliance-architecture.md` and `security-and-confidentiality.md`.
