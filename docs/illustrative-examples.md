# Illustrative examples

All three are **illustrative**. They are built to show a calculation, not to describe a real property, tenant or result. The arithmetic is in `src/whyCalc.ts` and tested in `src/why.test.ts`.

## Example A: an energy assumption changes

Inputs: average site load 100 kW; 8,760 operating hours per year; rate moves from $0.10 to $0.14 per kWh; assumed cap rate 7%.

| Step | Formula | Result |
|---|---|---|
| Annual energy | 100 kW × 8,760 h | 876,000 kWh |
| Annual charge at $0.10 | 876,000 × 0.10 | $87,600 |
| Annual charge at $0.14 | 876,000 × 0.14 | $122,640 |
| Annual difference | $122,640 − $87,600 | $35,040 per year (about $2,920 per month) |
| Simplified value difference | $35,040 ÷ 0.07 | about $500,571 |

The last line holds only if the extra expense is borne by the owner, is unreimbursed, and reduces stabilized NOI dollar for dollar. Lease allocation, reimbursements, expense recovery, capital costs and actual tariffs can change the result. This is a sensitivity calculation, not an appraisal.

## Example B: occupancy is not throughput

A hypothetical facility has 1,000 usable pallet positions and 800 average occupied positions (80% average position occupancy).

| Scenario | Outbound pallets/day | Implied dwell |
|---|---|---|
| 1 | 100 | 800 ÷ 100 = 8 days |
| 2 | 50 | 800 ÷ 50 = 16 days |

Assumptions: steady state (inflow about equals outflow) and consistent units (positions are pallets). Same occupancy, twice the dwell. These scenarios establish neither revenue nor profit: contracts, handling fees, storage fees, product mix, labor and seasonality all matter. If outbound throughput is zero, dwell is undefined, not infinite.

## Example C: the OM and the service file disagree

A fictional offering memorandum says "recently upgraded refrigeration." The evidence includes a newer controller invoice but no documentation confirming a compressor replacement.

> Controller upgrade documented. Compressor replacement unverified. Request equipment schedule, nameplate data, and relevant service records.

Missing documentation is not a claim that equipment failed. No real property or dispute is described.
