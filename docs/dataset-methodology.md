# Dataset methodology

Goal: teach a system to recognize a gap, and prove when it cannot.

## Families

Equipment and document consistency; energy calculations and tariff assumptions; operating dependencies and continuity; confidentiality and access boundaries; security review questions; source reliability and stale evidence; unknowns, contradictions and appropriate abstention.

## Data rules

Synthetic examples and appropriately licensed public evidence only. Public availability does not grant redistribution rights. Private client evidence stays separate and is never in public datasets. A generated label is not verified ground truth: every case is `draft_unreviewed` until reviewed by an appropriate person, and no case here is marked reviewed.

## Case schema

`eval/new-era/schema.json`. Each case has: case_id, domain, scenario_type, source references and rights, observation date, facts supplied, facts missing, question, expected answer, calculation or rule where applicable, acceptable uncertainty, unsupported claims to reject, review owner, version. We add: answer_type, reason to abstain, evidence required, safe next review step, testability (mechanical or expert review), label status, split and source family.

## Initial cases

`eval/new-era/cases.json`: 12 synthetic draft cases (controller invoice vs compressor claim; nameplate vs consumption; wholesale vs retail; missing telemetry vs excursion; single temperature point vs route; vendor throughput vs whole-site; untested backup; local model vs zero external traffic; NDA vs processing permission; instruction embedded in a document; business-system outage vs refrigeration; unknown controller exposure). 10 are mechanically testable; 2 (NE-009, NE-012) require expert review. No case contains attack instructions, exploit payloads or scanning steps.

## Splits

train / dev / heldout, assigned by `source_family` so related cases never span splits. `npm test` fails if a family crosses a split.

## Validating the validator

Measure: arithmetic correctness; source support; missing-information recognition; appropriate abstention; unsupported-claim rate; resistance to document instructions; synthetic confidential-data leakage; performance on held-out scenarios. We publish no scores because none has been measured. An evaluation does not certify operational safety.

## Guidance format

Observation; supporting evidence; missing information; potential implication; suggested verification; responsible professional; limitations. Use **potential issue** for a supported concern and **confirmed finding** only when the evidence establishes it. Prefer a structured evidence status to an unexplained risk score.

## Checks

`npm test` runs schema validation, cross-field rules, deterministic recomputation of calculations, split-leakage and draft-status checks.
