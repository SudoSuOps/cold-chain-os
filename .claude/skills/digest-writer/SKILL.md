---
name: digest-writer
description: Research and write the daily coldchainOS Digest post from real, verified sources, validate it, and build the site. Use when asked to write, draft, update or publish the daily digest or daily blog, or to drop real intel into the site as a post.
---

# digest-writer

Writes one coldchainOS Digest post per day as a validated JSON file, then builds the site so it becomes a static page, an Atom feed entry, a `posts.json` entry, a sitemap URL and a `BlogPosting` JSON-LD block with citations.

The Digest is **evidence-first**: every item says what a source documents, why it matters for cold-storage evidence, what it does **not** establish, and a question for an accountable person. The build refuses a post that breaks those rules. Never work around the validator; fix the post.

## Hard rules

1. **Real sources only.** Cite only pages you actually read on the publisher's own site during this session. Never cite from memory, a search snippet, or another model's summary. Never invent a source, quote, number, date, incident, victim, loss, savings figure or customer.
2. **Dates come from the source.** Get "today" from `date +%F` (the site's date, not your training data). Record the date the source states and the date you accessed it. A forecast is a forecast; an estimate is an estimate; keep observed, estimated, forecast, regulatory and draft apart.
3. **Primary or flagged.** If the publisher's page blocks you (403, paywall, login), do not quietly use a press summary. Either skip the item, or cite it with `verification: "secondary_only"` and a `verification_note` saying exactly what you could and could not confirm, and keep its numbers out of the headline. Facts the project owner hands you are `user_supplied` with a note.
4. **Scope honesty.** National is not local. Wholesale is not retail. A survey of grocery sales is not cold-chain revenue. A vendor press release is not an operating facility. A draft is not final. A cross-sector advisory (for example water) is not a cold-chain incident. If a source does not support a claim, the item's `not_established` field must say so.
5. **No advice.** No compliance, appraisal, engineering, legal, security or investment conclusions. No market-size or TAM claims. No predictions stated as fact.
6. **No confidential material.** Nothing from private client files, NDAs, the NAS corpus or personal data. Public sources only.
7. **coldchainOS voice.** Experienced, direct, plain, evidence-led. Spell it **coldchainOS**. Avoid hype and the phrases in `scripts/digest-lib.mjs` (BANNED), plus "ecosystem", "AI-powered", "revolutionary", "now supports". Label statements with the kinds in the brand voice: documented public evidence, illustrative, founder-reported, planned, hypothesis.

## Workflow

1. `date +%F`, then `ls content/digest` to see what exists. One post per date; do not overwrite a published post (to correct one, add `updated_at` and say what changed in `method`).
2. **Scout.** Search for what changed in roughly the last 1 to 7 days across these beats. Prefer items with a concrete, checkable hook such as a release, a comment deadline, an effective date, a published dataset or an advisory.
   - **Energy and grid:** EIA (Short-Term Energy Outlook, release schedule, electricity data), FERC, regional operators, utility tariff filings.
   - **Refrigeration and rules:** EPA HFC and Technology Transitions pages, DOE efficiency rules, FDA food traceability, state actions.
   - **Property market:** Newmark, CBRE, Cushman and Wakefield, JLL, Colliers cold-storage reports (cite the report itself).
   - **Operators and equipment:** GCCA, public operator filings, automation vendors' press releases (label as vendor announcements).
   - **Security and OT:** CISA advisories, NIST publications, vendor PSIRTs.
   - **Last mile and demand:** Brick Meets Click, USDA, FDA and CFP delivery guidance.
   Pick **3 to 5** items. Quality over volume; a quiet day can have 2.
3. **Read the primary page for every item.** Use WebFetch (or the `web-fetch` agent). Capture: exact title, publisher, publication date as stated, data period, geography or sector, the figures exactly as written, and any stated limitations. If a fetch fails, follow rule 3.
4. **Scaffold:** `npm run digest:new -- YYYY-MM-DD` creates `content/digest/YYYY-MM-DD.json` from the template as a **draft**.
5. **Write the JSON** (schema: `content/digest/schema.json`, enforced by `scripts/digest-lib.mjs`):
   - `title` (10 to 110): "Digest, Mon D, YYYY: three or four topics". `seo_title` (20 to 52): short and dated, used in the `<title>` tag.
   - `summary` (70 to 300): becomes the meta description and feed summary. Plain, specific, no hype.
   - `takeaway` (20 to 280): one pencil question the day leaves the reader with.
   - Each `item`: `headline` as "Publisher: what happened"; `label`; `what_happened` (the source's own dates, scope, numbers); `why_it_matters` (cold-storage evidence and underwriting relevance); `not_established` (required, specific); `review_question` (ends with "?", practical, for an engineer, operator, lender, broker or counsel); `source_ids`.
   - Each `source`: publisher, exact title, https `url`, `published` as the source states it, `accessed` (today or earlier), `scope`, `kind`, `qualification` (what it is not), `verification`.
   - `method`: what you searched, what you actually read, what you could not read.
   - `tags`: lowercase slugs such as energy, regulation, security, real-estate, last-mile, automation, datasets.
6. **Validate:** `npm run digest:check`. Fix every error; do not loosen the validator to pass.
7. **Build and test:** `npm run build` (validates, type-checks, prerenders, audits SEO, structure, links and accessibility basics) and `npm test`. Both must pass.
8. **Check the output:** open `dist/digest/YYYY-MM-DD/index.html` or preview with `npm run preview`; confirm the title, description, canonical URL, sources and the home-page "Latest from the Digest" card.
9. **Status.** Leave `status: "draft"` (drafts are never built or linked) unless the user asked you to publish. When publishing, set `"status": "published"`, rebuild, and re-run the tests.
10. **Do not commit, push or deploy** unless the user asks. When they do, commit message "Digest: YYYY-MM-DD" and push as they direct.

## Report back

Give the user: the title, the items and their sources, anything you could not verify (and how it is marked), what the validator and build said, and the exact preview command. Be honest about gaps; do not claim a source was read if it was not.

## Corrections and updates

If a published item turns out to be wrong, fix the JSON, set `updated_at` (ISO timestamp), and state the change at the start of `method` ("Correction, YYYY-MM-DD: ..."). Never silently edit a figure.

## Scheduling

This skill can run daily on request, for example with `/loop` or a scheduled routine. Each run still follows every rule above, and still stops at draft unless told to publish.
