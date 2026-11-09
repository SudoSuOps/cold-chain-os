# Digest

A daily research note at `/digest/`. Each post is a validated JSON file in `content/digest/YYYY-MM-DD.json`. The build turns it into:

- a static page at `/digest/YYYY-MM-DD/` with `BlogPosting` JSON-LD that cites every source,
- an entry in the index at `/digest/`, the Atom feed `/digest/feed.xml`, and the machine-readable `/digest/posts.json`,
- a sitemap URL, and the "Latest from the Digest" card on the home page.

Drafts (`"status": "draft"`) are never built, linked, fed or put in the sitemap.

## Writing a post

Use the `digest-writer` skill (`.claude/skills/digest-writer/SKILL.md`), or by hand:

```bash
npm run digest:new -- 2026-11-10   # scaffold a draft from content/digest/_template.json
# edit content/digest/2026-11-10.json
npm run digest:check               # validate every post
# set "status": "published"
npm run build && npm test
```

## What the validator enforces

Every item needs: a headline, a label (public, illustrative, founder, planned, hypothesis), what happened, why it matters, what it does **not** establish, a review question ending in "?", and at least one cited source. Every source needs a publisher, exact title, https URL, the date the source states, an access date on or before the post date, a scope, a kind, a qualification, and a verification status; anything that is not read on the primary page needs a verification note. Every source must be cited by an item. Hype phrases and savings figures are refused. The filename, date and timestamp must agree.

## Editorial rules

Real sources read on the publisher's page; scope stated honestly (national is not local, wholesale is not retail, a survey is not revenue, a draft is not final, a cross-sector advisory is not a cold-chain incident); no advice, no invented incidents or savings, no confidential material. A post is a research note, not a live feed. Corrections go in `updated_at` and the start of `method`.

## SEO and GEO

Titles use a short `seo_title`; descriptions come from `summary`. The feed and `posts.json` are linked from `llms.txt` and from each page's head. Citations in the JSON-LD make the sourcing machine-readable. The audit (`scripts/audit.mjs`) fails the build if a post page lacks a BlogPosting, citations, a canonical URL, the embedded data the browser needs to hydrate it, or a feed entry.

## Growth note

`/digest/` lists every published post on one page. When there are more than a few hundred, add pagination or yearly archive pages.
