// Post-build step: render each page to static HTML (so crawlers that don't run JavaScript get the content)
// and inject per-page JSON-LD. The client bundle hydrates the same markup.
import { readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { jsonLdFor } from './seo.mjs'

const server = await import(pathToFileURL(resolve('dist-ssr/entry-server.js')).href)
let count = 0
for (const file of Object.keys(server.pages)) {
  const path = resolve('dist', file)
  let html = readFileSync(path, 'utf8')
  if (!html.includes('<div id="root"></div>')) throw new Error(`${file}: expected an empty #root to fill`)
  html = html.replace('<div id="root"></div>', `<div id="root">${server.render(file)}</div>`)
  const ld = jsonLdFor(file)
  html = html.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(ld)}</script>\n  </head>`)
  writeFileSync(path, html)
  count++
}
console.log(`prerendered ${count} pages`)
