// Structured data (JSON-LD) per page. Descriptions are read from each page's own <meta>, so they cannot drift.
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const SITE = 'https://coldchainos.org'
const REPO = 'https://github.com/SudoSuOps/cold-chain-os'
const X = 'https://x.com/bestinbull'
const faq = JSON.parse(readFileSync(resolve('src/faq.json'), 'utf8'))

const meta = (html, re) => (html.match(re) ?? [])[1]?.replace(/&amp;/g, '&')
const urlFor = (file) => (file === 'index.html' ? `${SITE}/` : `${SITE}/${file.replace('index.html', '')}`)

export function jsonLdFor(file, html = readFileSync(resolve('dist', file), 'utf8')) {
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
    sameAs: [REPO, X],
  }
  const site = { '@type': 'WebSite', '@id': `${SITE}/#site`, url: `${SITE}/`, name: 'coldchainOS', publisher: { '@id': `${SITE}/#org` }, inLanguage: 'en-US' }
  const graph = [org, site]
  if (file === '404.html') return { '@context': 'https://schema.org', '@graph': graph }
  const page = { '@type': 'WebPage', '@id': `${url}#page`, url, name, description, isPartOf: { '@id': `${SITE}/#site` }, about: { '@id': `${SITE}/#org` }, inLanguage: 'en-US' }
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
