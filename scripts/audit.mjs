// Post-build audit of dist/: SEO, structure, accessibility basics, internal links, sitemap. No dependencies.
// Exits non-zero on any failure so a broken site cannot be built silently.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, resolve, relative } from 'node:path'

const DIST = resolve('dist')
const SITE = 'https://coldchainos.org'
const fails = []
const warns = []
const fail = (f, m) => fails.push(`${f}: ${m}`)
const warn = (f, m) => warns.push(`${f}: ${m}`)

const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p] })
const htmlFiles = walk(DIST).filter((p) => p.endsWith('.html')).map((p) => relative(DIST, p))
const idsOf = (html) => [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])
const strip = (s) => s.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '')

const cache = new Map()
const read = (f) => (cache.has(f) ? cache.get(f) : (cache.set(f, readFileSync(join(DIST, f), 'utf8')), cache.get(f)))
const pageFor = (href) => {
  const path = href.split('#')[0].split('?')[0]
  if (path === '' || path === '/') return 'index.html'
  const clean = path.replace(/^\//, '')
  if (existsSync(join(DIST, clean)) && statSync(join(DIST, clean)).isFile()) return clean
  if (existsSync(join(DIST, clean, 'index.html'))) return join(clean, 'index.html')
  return null
}

const titles = new Map(), descs = new Map()
for (const f of htmlFiles) {
  const html = read(f)
  const body = strip(html)
  const isIndexable = f !== '404.html'
  const title = (html.match(/<title>([^<]*)<\/title>/) ?? [])[1]
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) ?? [])[1]
  if (!title) fail(f, 'missing <title>')
  else {
    if (title.length < 15 || title.length > 70) fail(f, `title length ${title.length} outside 15-70`)
    if (titles.has(title)) fail(f, `duplicate title with ${titles.get(title)}`)
    titles.set(title, f)
  }
  if (!desc) fail(f, 'missing meta description')
  else {
    if (desc.length < 70 || desc.length > 320) fail(f, `description length ${desc.length} outside 70-320`)
    if (descs.has(desc) && isIndexable) fail(f, `duplicate description with ${descs.get(desc)}`)
    descs.set(desc, f)
  }
  if (!/<html lang="en"/.test(html)) fail(f, 'missing <html lang>')
  if (!/<meta name="viewport"/.test(html)) fail(f, 'missing viewport')
  if (isIndexable) {
    const canon = (html.match(/<link rel="canonical" href="([^"]+)"/) ?? [])[1]
    const expect = f === 'index.html' ? `${SITE}/` : `${SITE}/${f.replace('index.html', '')}`
    if (canon !== expect) fail(f, `canonical ${canon} != ${expect}`)
    for (const p of ['og:title', 'og:description', 'og:url', 'og:image', 'og:image:alt', 'twitter:card']) {
      if (!new RegExp(`(property|name)="${p}"`).test(html)) fail(f, `missing ${p}`)
    }
    const ogt = (html.match(/property="og:title" content="([^"]*)"/) ?? [])[1]
    const twt = (html.match(/name="twitter:title" content="([^"]*)"/) ?? [])[1]
    if (twt !== undefined && twt !== ogt) fail(f, `twitter:title "${twt}" != og:title "${ogt}"`)
    if ((html.match(/property="og:url" content="([^"]+)"/) ?? [])[1] !== expect) fail(f, 'og:url does not match canonical')
    if (!/name="robots" content="index,follow/.test(html)) fail(f, 'missing index,follow robots meta')
  } else {
    if (!/name="robots" content="noindex"/.test(html)) fail(f, '404 must be noindex')
    if (/name="twitter:title"/.test(html)) fail(f, '404 should not carry a page-specific twitter:title')
  }
  // structured data
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  if (ld.length !== 1) fail(f, `expected 1 JSON-LD block, found ${ld.length}`)
  else { try { JSON.parse(ld[0][1]) } catch { fail(f, 'JSON-LD is not valid JSON') } }
  // pre-rendered content present
  const root = (html.match(/<div id="root">([\s\S]*)<\/div>(?:<script type="application\/json" id="page-data">[\s\S]*?<\/script>)?<!--\/email_off-->\s*<\/body>/) ?? [])[1] ?? ''
  if (!html.includes('<!--email_off--><div id="root">')) fail(f, 'missing email_off markers (Cloudflare would obfuscate addresses for crawlers)')
  if (root.length < 1500) fail(f, `pre-rendered content too small (${root.length} chars); crawlers would see an empty page`)
  // exactly one h1, ordered headings
  const h1s = (body.match(/<h1[\s>]/g) ?? []).length
  if (h1s !== 1) fail(f, `expected 1 <h1>, found ${h1s}`)
  const levels = [...body.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1])
  for (let i = 1; i < levels.length; i++) if (levels[i] - levels[i - 1] > 1) { fail(f, `heading level jumps h${levels[i - 1]} -> h${levels[i]}`); break }
  // duplicate ids
  const ids = idsOf(body)
  const dup = ids.filter((x, i) => ids.indexOf(x) !== i)
  if (dup.length) fail(f, `duplicate ids: ${[...new Set(dup)].join(', ')}`)
  // aria references
  for (const m of body.matchAll(/aria-(?:labelledby|describedby|controls)="([^"]+)"/g)) {
    for (const id of m[1].split(/\s+/)) if (!ids.includes(id)) {
      // describedby targets are conditionally rendered in some forms; only fail for labelledby/controls
      if (!m[0].startsWith('aria-describedby')) fail(f, `aria reference to missing id "${id}"`)
    }
  }
  // images alt
  for (const m of body.matchAll(/<img\b[^>]*>/g)) if (!/\salt=/.test(m[0])) fail(f, `<img> without alt: ${m[0].slice(0, 80)}`)
  // svg role=img must have a title
  for (const m of body.matchAll(/<svg\b[^>]*role="img"[^>]*>([\s\S]*?)<\/svg>/g)) if (!/<title/.test(m[1])) fail(f, '<svg role="img"> without <title>')
  // links: text, rel, resolution
  for (const m of body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
    const attrs = m[1]
    const href = (attrs.match(/href="([^"]*)"/) ?? [])[1]
    const text = m[2].replace(/<[^>]+>/g, '').trim()
    if (href === undefined) continue
    if (!text && !/aria-label=/.test(attrs) && !/<img[^>]*alt="[^"]+"/.test(m[2])) fail(f, `link with no accessible name: ${href}`)
    if (/^https?:/.test(href)) {
      if (/target="_blank"/.test(attrs) && !/noopener/.test(attrs)) fail(f, `target=_blank without noopener: ${href}`)
      continue
    }
    if (href.startsWith('mailto:') || href.startsWith('tel:')) continue
    const hash = href.includes('#') ? href.split('#')[1] : ''
    const target = href.startsWith('#') ? f : pageFor(href)
    if (!target) { fail(f, `broken internal link: ${href}`); continue }
    if (hash && !idsOf(strip(read(target))).includes(hash)) fail(f, `missing anchor ${href}`)
  }
  // no leftover placeholders
  if (/lorem ipsum|TODO|FIXME|undefined|\[object Object\]|NaN%/.test(body)) fail(f, 'placeholder or bad-render text found')
  // forms must not post
  if (/<form[^>]*action=/.test(body)) fail(f, 'form with an action attribute')
}

// digest: posts, feed, machine-readable index
const postFiles = htmlFiles.filter((f) => /^digest\/\d{4}-\d{2}-\d{2}\/index\.html$/.test(f))
for (const f of postFiles) {
  const html = read(f)
  const date = f.split('/')[1]
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]))[0]
  const bp = (ld?.['@graph'] ?? []).find((n) => n['@type'] === 'BlogPosting')
  if (!bp) fail(f, 'missing BlogPosting JSON-LD')
  else {
    if (!bp.datePublished?.startsWith(date)) fail(f, 'datePublished does not match the post date')
    if (!bp.citation?.length) fail(f, 'BlogPosting has no citations')
    if (!bp.citation?.every((c) => /^https:/.test(c.url))) fail(f, 'non-https citation')
  }
  if (!/<meta property="og:type" content="article"/.test(html)) fail(f, 'og:type should be article')
  if (!/article:published_time/.test(html)) fail(f, 'missing article:published_time')
  if (!html.includes('id="page-data"')) fail(f, 'missing embedded page data (client could not hydrate)')
  if (!/rel="alternate" type="application\/atom\+xml"/.test(html)) fail(f, 'missing feed autodiscovery link')
  if (!/\bid="src-/.test(html)) fail(f, 'no sources section')
  if (html.includes('{{')) fail(f, 'unfilled template placeholder')
}
if (existsSync(join(DIST, 'digest/post.html'))) fail('digest/post.html', 'template must not be published')
if (postFiles.length) {
  const feed = read('digest/feed.xml')
  if (!feed.startsWith('<?xml') || !feed.includes('<feed xmlns="http://www.w3.org/2005/Atom">')) fail('digest/feed.xml', 'not a valid Atom feed header')
  const opens = (feed.match(/<entry>/g) ?? []).length, closes = (feed.match(/<\/entry>/g) ?? []).length
  if (opens !== postFiles.length || closes !== postFiles.length) fail('digest/feed.xml', `expected ${postFiles.length} entries`)
  const idx = JSON.parse(read('digest/posts.json'))
  if (idx.posts.length !== postFiles.length) fail('digest/posts.json', 'post count does not match built pages')
} else warn('digest', 'no published posts')

// sitemap <-> pages
const sm = read('sitemap.xml')
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
const expected = htmlFiles.filter((f) => f !== '404.html').map((f) => (f === 'index.html' ? `${SITE}/` : `${SITE}/${f.replace('index.html', '')}`))
for (const e of expected) if (!locs.includes(e)) fail('sitemap.xml', `missing ${e}`)
for (const l of locs) if (!expected.includes(l)) fail('sitemap.xml', `lists non-page ${l}`)
if (!/<lastmod>/.test(sm)) warn('sitemap.xml', 'no lastmod')
const robots = read('robots.txt')
if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`)) fail('robots.txt', 'missing sitemap line')
if (/Disallow:\s*\/\s*$/m.test(robots)) fail('robots.txt', 'blocks the whole site')
for (const f of ['llms.txt', '_headers', 'site.webmanifest', 'favicon.ico', 'favicon.svg', 'apple-touch-icon-180.png', 'og/coldchainos-open-graph-1200x630.png']) {
  if (!existsSync(join(DIST, f))) fail(f, 'missing from dist')
}
// every llms.txt link is a real page
for (const m of read('llms.txt').matchAll(/\]\((https:\/\/coldchainOS\.org[^)]*)\)/g)) if (!expected.includes(m[1])) fail('llms.txt', `links to unknown page ${m[1]}`)

console.log(`audited ${htmlFiles.length} pages`)
for (const w of warns) console.log(`warn  ${w}`)
if (fails.length) { for (const x of fails) console.log(`FAIL  ${x}`); console.log(`${fails.length} failure(s)`); process.exit(1) }
console.log('audit passed')
