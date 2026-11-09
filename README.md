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
