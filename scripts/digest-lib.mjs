// Digest content model: loading and validation. Shared by the validator, the prerenderer and the feed builder.
import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

export const DIGEST_DIR = resolve('content/digest')
export const LABELS = ['public', 'illustrative', 'founder', 'planned', 'hypothesis']
export const VERIFICATION = ['primary', 'secondary_only', 'user_supplied']
export const KINDS = ['observed', 'estimated', 'forecast', 'regulatory', 'government advisory', 'draft guidance', 'final guidance', 'vendor announcement', 'survey estimate', 'projection', 'other']
export const BANNED = ['revolutionary', 'game-changing', 'game changing', 'ai-powered', 'to the moon', 'guaranteed', 'guarantee', 'disrupt', 'coming soon', 'now supports', 'tokenomics', 'join the movement', 'early access', 'unprecedented', 'skyrocket', 'breakthrough', 'cutting-edge', 'cutting edge']

const DATE = /^\d{4}-\d{2}-\d{2}$/
const ID = /^[a-z0-9][a-z0-9-]{1,60}$/

export function loadPosts({ includeDrafts = false } = {}) {
  const files = readdirSync(DIGEST_DIR).filter((f) => f.endsWith('.json') && !f.startsWith('_') && f !== 'schema.json').sort()
  const posts = files.map((f) => ({ file: f, post: JSON.parse(readFileSync(join(DIGEST_DIR, f), 'utf8')) }))
  return posts.filter((p) => includeDrafts || p.post.status === 'published').map((p) => p.post).sort((a, b) => b.date.localeCompare(a.date))
}
export const loadAll = () => readdirSync(DIGEST_DIR).filter((f) => f.endsWith('.json') && !f.startsWith('_') && f !== 'schema.json').sort().map((f) => ({ file: f, post: JSON.parse(readFileSync(join(DIGEST_DIR, f), 'utf8')) }))

const strings = (o, out = []) => { if (typeof o === 'string') out.push(o); else if (Array.isArray(o)) o.forEach((x) => strings(x, out)); else if (o && typeof o === 'object') Object.values(o).forEach((x) => strings(x, out)); return out }

/** Returns an array of error strings (empty when valid). */
export function validatePost(post, file = '') {
  const e = []
  const err = (m) => e.push(`${file || post.date || '?'}: ${m}`)
  const str = (v, min, max) => typeof v === 'string' && v.trim().length >= min && v.length <= max
  if (post.schema_version !== 1) err('schema_version must be 1')
  if (!DATE.test(post.date ?? '')) err('date must be YYYY-MM-DD')
  if (file && file !== `${post.date}.json`) err(`filename must be ${post.date}.json`)
  if (!['draft', 'published'].includes(post.status)) err('status must be draft or published')
  if (!str(post.title, 10, 110)) err('title must be 10-110 characters')
  if (!str(post.seo_title, 20, 52)) err('seo_title must be 20-52 characters (the <title> tag is "seo_title — coldchainOS", kept under 70)')
  if (!str(post.summary, 70, 300)) err('summary must be 70-300 characters (it becomes the meta description)')
  if (!str(post.takeaway, 20, 280)) err('takeaway must be 20-280 characters')
  if (!Array.isArray(post.tags) || post.tags.length < 1 || post.tags.length > 6 || post.tags.some((t) => !ID.test(t))) err('tags: 1-6 lowercase slugs')
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/.test(post.published_at ?? '') || !(post.published_at ?? '').startsWith(post.date ?? '~')) err('published_at must be an ISO timestamp on the post date')
  if (!str(post.method, 20, 600)) err('method (how this digest was researched) must be 20-600 characters')

  const sources = Array.isArray(post.sources) ? post.sources : []
  if (!sources.length) err('at least one source is required')
  const ids = new Set()
  for (const s of sources) {
    if (!ID.test(s.id ?? '')) err(`source id invalid: ${s.id}`)
    if (ids.has(s.id)) err(`duplicate source id ${s.id}`)
    ids.add(s.id)
    for (const k of ['publisher', 'title', 'scope', 'qualification']) if (!str(s[k], 3, 600)) err(`source ${s.id}: ${k} is required`)
    if (!/^https:\/\/[^\s]+$/.test(s.url ?? '')) err(`source ${s.id}: url must be https`)
    if (!str(s.published, 4, 80)) err(`source ${s.id}: published (date as stated by the source) is required`)
    if (!DATE.test(s.accessed ?? '')) err(`source ${s.id}: accessed must be YYYY-MM-DD`)
    else if (post.date && s.accessed > post.date) err(`source ${s.id}: accessed is after the post date`)
    if (!KINDS.includes(s.kind)) err(`source ${s.id}: kind must be one of ${KINDS.join(', ')}`)
    if (!VERIFICATION.includes(s.verification)) err(`source ${s.id}: verification must be one of ${VERIFICATION.join(', ')}`)
    if (s.verification !== 'primary' && !str(s.verification_note, 10, 400)) err(`source ${s.id}: non-primary verification needs a verification_note`)
  }
  const items = Array.isArray(post.items) ? post.items : []
  if (items.length < 1 || items.length > 6) err('1-6 items are required')
  const itemIds = new Set()
  for (const it of items) {
    if (!ID.test(it.id ?? '')) err(`item id invalid: ${it.id}`)
    if (itemIds.has(it.id)) err(`duplicate item id ${it.id}`)
    itemIds.add(it.id)
    if (!str(it.headline, 10, 140)) err(`item ${it.id}: headline 10-140 characters`)
    if (!LABELS.includes(it.label)) err(`item ${it.id}: label must be one of ${LABELS.join(', ')}`)
    for (const k of ['what_happened', 'why_it_matters', 'not_established', 'review_question']) if (!str(it[k], 20, 900)) err(`item ${it.id}: ${k} must be 20-900 characters`)
    if (!Array.isArray(it.source_ids) || !it.source_ids.length) err(`item ${it.id}: cite at least one source`)
    else for (const sid of it.source_ids) if (!ids.has(sid)) err(`item ${it.id}: cites unknown source ${sid}`)
    if (!/\?\s*$/.test(it.review_question ?? '')) err(`item ${it.id}: review_question must be a question`)
  }
  for (const sid of ids) if (!items.some((it) => it.source_ids?.includes(sid))) err(`source ${sid} is not cited by any item`)

  const text = strings(post).join(' \n ').toLowerCase()
  for (const w of BANNED) if (text.includes(w)) err(`banned phrase "${w}" (brand voice)`)
  if (/\$\s?\d[\d,.]*\s*(b|m|k|billion|million)\b.*\b(saved|savings)\b/i.test(text)) err('do not state savings figures')
  return e
}
