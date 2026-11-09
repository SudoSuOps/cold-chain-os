# coldchainOS.org

Landing page for [coldchainOS](https://github.com/SudoSuOps/cold-chain-os), an early-stage, open-source project on cold-chain underwriting, operational evidence, and practical tools for understanding refrigerated facilities.

Stack: React + TypeScript + Vite, plain CSS with design tokens (`src/styles.css`), system fonts, no external services, no analytics.

## Setup

Requires Node 18+ (developed on Node 22).

```bash
npm install
```

## Development

```bash
npm run dev        # http://localhost:5173
npm test           # calculator unit tests (Node's built-in runner, Node 22+)
npm run typecheck
```

## Production build

```bash
npm run build      # typecheck, bundle, pre-render every page to static HTML, then audit dist/
npm run preview -- --host   # serve dist/ locally at http://localhost:4173
```

### What the build does

1. `tsc --noEmit` and `vite build` produce the client bundle in `dist/`.
2. `vite build --ssr` bundles the pages for Node (`dist-ssr/`, git-ignored).
3. `scripts/prerender.mjs` renders each page to static HTML and injects JSON-LD (`scripts/seo.mjs`), so crawlers and AI engines that don't run JavaScript get the full content. The browser then hydrates the same markup.
4. `scripts/audit.mjs` fails the build on: missing or duplicate titles and descriptions, wrong canonicals, missing Open Graph tags, invalid JSON-LD, empty pre-rendered content, heading or ARIA problems, images without alt text, broken internal links or anchors, and sitemap/robots/`llms.txt` mismatches. Run it alone with `npm run audit`.

## SEO and GEO

- Per-page title, description, canonical, Open Graph and Twitter tags live in each page's `index.html`.
- JSON-LD (Organization, WebSite, WebPage, BreadcrumbList; FAQPage on the home page) is generated from each page's own meta, so it cannot drift. The home-page FAQ is `src/faq.json`, used for both the visible text and the markup.
- `public/llms.txt` summarizes the site for AI engines, with the facts that must not be misstated (no platform, no license yet, no uploads, model-generated sample data).
- `public/sitemap.xml` has `lastmod`; update it when content changes. `public/robots.txt` allows all crawlers.
- `public/_headers` sets a site-wide Content-Security-Policy and other security headers, long-lived caching for fingerprinted assets, and a stricter policy for `/deal-room/`. `404.html` is a real, noindexed page.

## Static hosting (Cloudflare Pages)

Any static host works. For Cloudflare Pages: build command `npm run build`, output directory `dist`, Node 18+. No environment variables are needed. DNS and deployment are intentionally not configured here.

## Pages

`/` landing · `/why/` the story, sourced context and worked examples · `/last-mile/` last-mile context, route-economics calculator and sources · `/new-era/` AI, robotics, compute, edge-appliance design goals, security review questions and a dated source snapshot · `/compute/` compute-room schematic · `/datasets/` CRE sample records · `/deal-room/` local-only evidence checklist (no uploads) · `/brand/` brand kit.

Docs: `docs/why-coldchainos.md`, `market-context.md`, `nda-data-handling.md`, `illustrative-examples.md`, `sources.json`, `last-mile.md`, `last-mile-sources.json`, `new-era.md`, `edge-appliance-architecture.md`, `security-and-confidentiality.md`, `dataset-methodology.md`, `new-era-sources.json` (every sourced claim, rendered on `/why/`). Example arithmetic lives in `src/whyCalc.ts` with tests in `src/why.test.ts`.

`public/_headers` applies a strict Content-Security-Policy (`connect-src 'none'`) to `/deal-room/` on Cloudflare Pages. It is not applied by `npm run preview`.

## Evaluation assets

`eval/new-era/` holds a JSON schema, 12 synthetic draft cases (all `draft_unreviewed`; two need expert review) and a dependency-free validator. `npm test` checks schema validity, deterministic recomputation of calculations, split leakage by source family, and that no label claims expert review.

## Brand

The site uses the coldchainOS brand kit v1.0 (kept outside the repo; the guide PDF and source portrait are not committed).

- Tokens, fonts and licence notice: `public/brand/` (`tokens.css` is linked from every page head; `src/styles.css` maps its variables onto the brand tokens).
- Logos (SVG): `public/brand/logo/`. Header uses `horizontal-on-dark` and falls back to `mark-on-dark` below 340px (`src/Wordmark.tsx`).
- Bull hero images: `public/brand/hero/`. Landing hero follows the kit's integration guide.
- Favicon pack, `site.webmanifest`: `public/`. Open Graph image: `public/og/`.
- Icons are generated into `src/Icon.tsx` from the kit's SVGs.
- Brand page: `/brand/`.
- The brand name, wordmark, mark and Bull artwork are not covered by any code licence. See `public/brand/NOTICE.md`.

## Editing notes

- **Links:** repo and Issues URLs live in `src/links.ts`.
- **License:** none has been chosen yet. Add a `LICENSE` file once the owner decides.
