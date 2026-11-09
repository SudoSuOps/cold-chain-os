// Post-build step:
//  1. render each registered page to static HTML (+ embedded page data, + JSON-LD)
//  2. generate one static page per published digest post, the Atom feed, posts.json and the sitemap
// The client bundle hydrates the same markup, reading its data from the embedded #page-data block.
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'
import { jsonLdFor, jsonLdForPost, SITE_URL } from './seo.mjs'
import { loadPosts } from './digest-lib.mjs'

const server = await import(pathToFileURL(resolve('dist-ssr/entry-server.js')).href)
const posts = loadPosts()
const summary = (p) => ({ date: p.date, title: p.title, summary: p.summary, takeaway: p.takeaway, tags: p.tags, published_at: p.published_at, items: p.items.length, sources: p.sources.length })
const summaries = posts.map(summary)

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const embed = (data) => `<script type="application/json" id="page-data">${JSON.stringify(data).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')}</script>`
// Cloudflare's Email Address Obfuscation rewrites addresses into '[email protected]' for crawlers; email_off opts the page out.
const fill = (html, body, data) => html.replace('<div id="root"></div>', `<!--email_off--><div id="root">${body}</div>${data ? embed(data) : ''}<!--/email_off-->`)
const inject = (html, ld) => html.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(ld)}</script>\n  </head>`)

const propsFor = (file) => {
  if (file === 'index.html') return summaries.length ? { latest: summaries[0] } : {}
  if (file === 'digest/index.html') return { posts: summaries }
  return {}
}

let count = 0
for (const file of Object.keys(server.pages)) {
  const path = resolve('dist', file)
  let html = readFileSync(path, 'utf8')
  if (!html.includes('<div id="root"></div>')) throw new Error(`${file}: expected an empty #root to fill`)
  const props = propsFor(file)
  html = fill(html, server.render(file, props), Object.keys(props).length ? props : null)
  html = inject(html, jsonLdFor(file, html, { posts: summaries }))
  writeFileSync(path, html)
  count++
}

// ---- digest posts
const tplPath = resolve('dist/digest/post.html')
const tpl = readFileSync(tplPath, 'utf8')
posts.forEach((post, i) => {
  const prev = posts[i + 1] // older
  const next = posts[i - 1] // newer
  const nav = { prev: prev && { date: prev.date, title: prev.title }, next: next && { date: next.date, title: next.title } }
  const url = `${SITE_URL}/digest/${post.date}/`
  let html = tpl
    .replaceAll('{{TITLE}}', esc(`${post.seo_title} — coldchainOS`))
    .replaceAll('{{OG_TITLE}}', esc(post.title))
    .replaceAll('{{DESCRIPTION}}', esc(post.summary))
    .replaceAll('{{URL}}', url)
    .replaceAll('{{PUBLISHED}}', post.published_at)
  html = fill(html, server.renderPost({ post, ...nav }), { post, ...nav })
  html = inject(html, jsonLdForPost(post, html))
  const out = resolve('dist/digest', post.date, 'index.html')
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, html)
  count++
})
rmSync(tplPath)

// ---- feed, machine-readable index, sitemap
const updated = (posts[0]?.published_at ?? new Date().toISOString())
const atom = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>coldchainOS Digest</title>
  <subtitle>A daily research note on cold storage, energy, refrigeration, security and the last mile.</subtitle>
  <link href="${SITE_URL}/digest/feed.xml" rel="self" type="application/atom+xml"/>
  <link href="${SITE_URL}/digest/" rel="alternate" type="text/html"/>
  <id>${SITE_URL}/digest/</id>
  <updated>${updated}</updated>
  <author><name>coldchainOS</name><uri>${SITE_URL}/</uri></author>
${posts.map((p) => `  <entry>
    <title>${esc(p.title)}</title>
    <link href="${SITE_URL}/digest/${p.date}/" rel="alternate" type="text/html"/>
    <id>${SITE_URL}/digest/${p.date}/</id>
    <published>${p.published_at}</published>
    <updated>${p.updated_at ?? p.published_at}</updated>
    <summary>${esc(p.summary)}</summary>
${p.tags.map((t) => `    <category term="${esc(t)}"/>`).join('\n')}
  </entry>`).join('\n')}
</feed>
`
writeFileSync(resolve('dist/digest/feed.xml'), atom)
writeFileSync(resolve('dist/digest/posts.json'), JSON.stringify({ site: SITE_URL, generated_from: 'content/digest', posts: posts.map((p) => ({ url: `${SITE_URL}/digest/${p.date}/`, ...p })) }, null, 2) + '\n')

const STATIC_LASTMOD = '2026-11-09' // bump when static page content changes
const staticPages = Object.keys(server.pages).filter((f) => f !== '404.html')
const urlFor = (f) => (f === 'index.html' ? `${SITE_URL}/` : `${SITE_URL}/${f.replace('index.html', '')}`)
const entries = [
  ...staticPages.map((f) => ({ loc: urlFor(f), lastmod: f === 'digest/index.html' && posts[0] ? posts[0].date : f === 'index.html' && posts[0] ? posts[0].date : STATIC_LASTMOD })),
  ...posts.map((p) => ({ loc: `${SITE_URL}/digest/${p.date}/`, lastmod: (p.updated_at ?? p.published_at).slice(0, 10) })),
]
writeFileSync(resolve('dist/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.map((e) => `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n  </url>`).join('\n')}\n</urlset>\n`)
console.log(`prerendered ${count} pages (${posts.length} digest post${posts.length === 1 ? '' : 's'}), feed, posts.json, sitemap`)
