// Structured data (JSON-LD) per page. Descriptions are read from each page's own <meta>, so they cannot drift.
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const SITE = 'https://coldchainos.org'
const REPO = 'https://github.com/SudoSuOps/cold-chain-os'
const X = 'https://x.com/bestinbull'
const faq = JSON.parse(readFileSync(resolve('src/faq.json'), 'utf8'))

const meta = (html, re) => (html.match(re) ?? [])[1]?.replace(/&amp;/g, '&')
const urlFor = (file) => (file === 'index.html' ? `${SITE}/` : `${SITE}/${file.replace('index.html', '')}`)

export function jsonLdFor(file, html = readFileSync(resolve('dist', file), 'utf8'), ctx = {}) {
  const name = meta(html, /<title>([^<]*)<\/title>/)
  const description = meta(html, /<meta name="description" content="([^"]*)"/)
  const url = urlFor(file)
  const org = {
    '@type': 'Organization',
    '@id': `${SITE}/#org`,
    name: 'coldchainOS',
    url: `${SITE}/`,
    logo: `${SITE}/icons/favicon-512.png`,
    slogan: 'Does the cold chain pencil?',
    description: 'An independent, self-funded, open-source project building tools to connect source documents, operating evidence, transparent calculations and reviewable findings behind cold-storage decisions.',
    email: 'bull@coldchainos.org',
    contactPoint: { '@type': 'ContactPoint', email: 'bull@coldchainos.org', contactType: 'general inquiries' },
    sameAs: [REPO, X],
  }
  const site = { '@type': 'WebSite', '@id': `${SITE}/#site`, url: `${SITE}/`, name: 'coldchainOS', publisher: { '@id': `${SITE}/#org` }, copyrightHolder: { '@type': 'Organization', name: 'Swarm & Bee LLC' }, inLanguage: 'en-US' }
  const graph = [org, site]
  if (file === 'digest/index.html' && ctx.posts) {
    graph.push({ '@type': 'Blog', '@id': `${SITE}/digest/#blog`, url: `${SITE}/digest/`, name: 'coldchainOS Digest', description: 'A daily research note on cold storage, energy, refrigeration, security and the last mile.', publisher: { '@id': `${SITE}/#org` }, inLanguage: 'en-US', blogPost: ctx.posts.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: `${SITE}/digest/${p.date}/`, datePublished: p.published_at })) })
  }
  if (file === '404.html') return { '@context': 'https://schema.org', '@graph': graph }
  const page = { '@type': file === 'contact/index.html' ? 'ContactPage' : 'WebPage', '@id': `${url}#page`, url, name, description, isPartOf: { '@id': `${SITE}/#site` }, about: { '@id': `${SITE}/#org` }, inLanguage: 'en-US' }
  graph.push(page)
  if (file !== 'index.html') {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: name.split(' — ')[0], item: url },
      ],
    })
  } else {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}

/** JSON-LD for one digest post. Every source becomes a citation, which is what AI engines and scholars look for. */
export function jsonLdForPost(post, html) {
  const url = `${SITE}/digest/${post.date}/`
  const base = jsonLdFor('digest/index.html', html, {})['@graph'].filter((n) => n['@type'] === 'Organization' || n['@type'] === 'WebSite')
  return {
    '@context': 'https://schema.org',
    '@graph': [
      ...base,
      {
        '@type': 'BlogPosting', '@id': `${url}#post`, headline: post.title, description: post.summary, url, mainEntityOfPage: url,
        datePublished: post.published_at, dateModified: post.updated_at ?? post.published_at, inLanguage: 'en-US', keywords: post.tags.join(', '),
        author: { '@id': `${SITE}/#org` }, publisher: { '@id': `${SITE}/#org` }, isPartOf: { '@id': `${SITE}/digest/#blog` },
        image: `${SITE}/og/coldchainos-open-graph-1200x630.png`,
        citation: post.sources.map((s) => ({ '@type': 'CreativeWork', name: s.title, url: s.url, publisher: { '@type': 'Organization', name: s.publisher } })),
      },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Digest', item: `${SITE}/digest/` },
        { '@type': 'ListItem', position: 3, name: post.date, item: url },
      ] },
    ],
  }
}
export const SITE_URL = SITE
