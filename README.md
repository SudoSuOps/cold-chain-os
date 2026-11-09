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
npm run build      # typechecks, then writes static files to dist/
npm run preview -- --host   # serve dist/ locally at http://localhost:4173
```

## Static hosting (Cloudflare Pages)

Any static host works. For Cloudflare Pages: build command `npm run build`, output directory `dist`, Node 18+. No environment variables are needed. DNS and deployment are intentionally not configured here.

## Editing notes

- **Logo:** the wordmark is typographic placeholder text in `src/Wordmark.tsx`; swap in the brand asset there. Favicon is `public/favicon.svg`.
- **Links:** repo and Issues URLs live in `src/links.ts`.
- **Social image:** `public/og.svg` is referenced by Open Graph tags. Some platforms don't render SVG previews; export a 1200×630 PNG and update `index.html` if needed.
- **License:** none has been chosen yet. Add a `LICENSE` file once the owner decides.
