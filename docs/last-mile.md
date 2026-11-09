# Last mile

> The last mile is where the cold chain meets the customer.
> A warehouse can hold the product. The last mile has to deliver it, on time, in the required condition, at a cost the operation can support.

**Status.** coldchainOS does not operate deliveries and has no deployed monitoring, routing or customer integrations. Nothing in this repository does. The page is context, an educational calculator, and a description of planned work. Statements are labelled documented, illustrative, founder-reported, or planned.

## What it is

The final delivery leg from a local fulfillment point to the intended recipient. It is not literally one mile. A regional distribution center supplying a local hub is generally middle-mile; the final delivery begins downstream.

Three patterns: consumer home delivery; business-to-business final delivery; click-and-collect, where the customer completes the final journey. Cold-chain performance includes staging, loading, transport, unloading, handoff, and any time before the recipient puts the product into appropriate storage.

## Recipients vs. buyers

Recipients: households and working families; older adults and people with limited mobility; restaurants, hotels and caterers; independent grocers and specialty stores; schools and institutional kitchens; patients receiving temperature-sensitive medication; clinics and other authorized healthcare recipients.

Buyers of logistics services: retailers, distributors, food brands, meal providers, pharmacies, healthcare organizations, delivery operators.

Better access is a *potential* benefit. We make no claim about affordability, equitable coverage or rural reach without evidence about an actual service.

## Product categories (not ranked)

Fresh proteins; dairy and chilled foods; produce (conditions differ by product); frozen foods and ice cream (frozen quality and microbial safety are different issues); meal kits and prepared chilled meals; temperature-sensitive medicines (a separate operational lane governed by product labeling, validated procedures and applicable rules; no universal pharmaceutical temperature band is stated).

Enabling equipment categories (not endorsements): insulated totes and packaging; refrigerants or phase-change materials; refrigerated vehicles and compartments; local cold rooms and appropriately designed lockers; temperature loggers and sensors; order, dispatch and routing tools. Packaging cannot make any route acceptable.

## Market velocity, in three parts

- **Market momentum:** growth in sales, active customers, order frequency, delivery use.
- **Operating velocity:** orders picked per hour; pick-complete to dispatch; orders per route; stops per paid driver hour; completed deliveries per route hour; miles per completed delivery; on-time %; first-attempt completion %; dwell in each staging area.
- **Economic performance:** cost per completed delivery; contribution per order; refunds, redeliveries and claims; packaging and cooling; labor and vehicle; energy at the local node; peak and off-peak utilization.

Dollar sales growth is not physical order growth. Order growth is not profitability. More drops per hour do not prove temperature control. High facility occupancy does not establish fast product movement. Every metric needs a defined denominator and time window.

## Current market evidence (checked 2026-11-09)

See `last-mile-sources.json`. Brick Meets Click reported U.S. online grocery sales up 20.7% year over year in 3Q26 (published Oct 15, 2026), with Delivery up more than 30% and about three-quarters of the topline increase; and up just over 16% in September 2026 (published Oct 21, 2026), with order frequency up 9.0%. These are survey-based grocery-sales estimates across fulfillment methods and categories. They are not cold-chain logistics revenue, a software market, or refrigerated shipment counts. FDA's 2022 constituent update points to best practices for third-party delivery services; they are recommendations, not a universal legal requirement.

## Route economics example (illustrative)

Defaults: 4 paid hours at $25/hour, 40 miles at $0.75/mile (vehicle cost, excluding driver labor), $2 consumables per attempted delivery, 20 attempted.

| Line | Formula | Result |
|---|---|---|
| Driver | 4 × $25 | $100 |
| Vehicle | 40 × $0.75 | $30 |
| Consumables | 20 × $2 | $40 |
| Selected route cost | | $170 |
| Per completed delivery, 20 completed | $170 ÷ 20 | $8.50 |
| Per completed delivery, 18 completed | $170 ÷ 18 | about $9.44 |

This is a selected-cost scenario, not a delivery P&L. It excludes picking, facility overhead, platform fees, insurance not in vehicle cost, refunds, product losses, redelivery and taxes. The value of the delivered goods is not logistics revenue. Consumables are priced per *attempt*, so a failed delivery lowers completions without lowering cost. Zero completed deliveries returns "No completed deliveries". The calculator gives no safety verdict. Code: `src/lastMileCalc.ts`; tests: `src/lastmile.test.ts`.

## Why local real estate matters

A local node affects distance to customers, route density, dispatch windows, staging capacity, vehicle access, loading time, refrigeration and electrical needs, labor access, and rent and operating cost. A closer site may cut travel while raising occupancy cost; a larger radius may reach more customers while adding time and variability. A nearer facility is not automatically more profitable.

A Jupiter / Palm Beach example would be explicitly hypothetical. We have no delivery-demand data, traffic measurements, customers, permitting analysis or utility-capacity information, and we invent none. The 8 × 20-foot portable cooler is founder-reported field-lab hardware for future investigation, not an approved food-distribution or pharmaceutical facility.

## What coldchainOS intends to contribute (planned)

Collect evidence; identify gaps and conflicting assumptions; calculate scenarios; produce a source-linked brief; support accountable human review. Possible inputs: order timestamps, dispatch records, receiving confirmations, route summaries, utility bills, equipment records, handling requirements, packaging specifications, authorized temperature records. Possible questions: where does product wait; what changes when order density falls; what does a failed delivery do to unit economics; what evidence supports the claimed conditions; does a proposed site improve combined facility-and-route economics.

Customer addresses, patient information, delivery details and confidential contracts stay out of the public website and public datasets. Demonstrations use synthetic data.

## Open research questions

- Newer FDA or CFP guidance on delivery-service food safety than the 2022 update; the CFP document's formal title.
- A source for refrigerated-specific (not all-grocery) delivery volume, with defined geography, period and channel.
- Sample sizes and category coverage for the Brick Meets Click surveys.
- Healthcare lane: which authorities and labeling govern a specific product class (out of scope for this site until a qualified source is cited).
