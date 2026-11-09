import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { validatePost, loadPosts, loadAll } from '../scripts/digest-lib.mjs'

const real = JSON.parse(readFileSync(new URL('../content/digest/2026-11-09.json', import.meta.url), 'utf8'))
const clone = () => structuredClone(real)
const errs = (p: unknown) => validatePost(p as Record<string, unknown>, `${(p as { date: string }).date}.json`)

test('the published post validates', () => assert.deepEqual(errs(real), []))
test('the template is not published and is a valid shape reference', () => {
  assert.ok(loadAll().every((a: { file: string }) => !a.file.startsWith('_')))
  assert.ok(loadPosts().every((p: { status: string }) => p.status === 'published'))
})
test('an item that cites no source is refused', () => {
  const p = clone(); p.items[0].source_ids = []
  assert.ok(errs(p).some((e) => /cite at least one source/.test(e)))
})
test('an item citing an unknown source is refused', () => {
  const p = clone(); p.items[0].source_ids = ['nope']
  assert.ok(errs(p).some((e) => /unknown source nope/.test(e)))
})
test('a source that no item cites is refused', () => {
  const p = clone(); p.sources.push({ ...p.sources[0], id: 'orphan-source' })
  assert.ok(errs(p).some((e) => /not cited by any item/.test(e)))
})
test('missing "what it does not establish" is refused', () => {
  const p = clone(); p.items[0].not_established = ''
  assert.ok(errs(p).some((e) => /not_established/.test(e)))
})
test('a review question must be a question', () => {
  const p = clone(); p.items[0].review_question = 'Check the controls and report back to the team.'
  assert.ok(errs(p).some((e) => /must be a question/.test(e)))
})
test('hype and unsupported-claim phrases are refused', () => {
  for (const w of ['revolutionary', 'game-changing', 'AI-powered', 'guaranteed', 'now supports']) {
    const p = clone(); p.items[0].why_it_matters = `This is a ${w} development for the whole cold chain industry.`
    assert.ok(errs(p).some((e) => /banned phrase/.test(e)), w)
  }
})
test('sources must be https, dated, and accessed on or before the post date', () => {
  let p = clone(); p.sources[0].url = 'http://example.org/x'
  assert.ok(errs(p).some((e) => /https/.test(e)))
  p = clone(); p.sources[0].accessed = '2026-11-10'
  assert.ok(errs(p).some((e) => /after the post date/.test(e)))
  p = clone(); p.sources[0].accessed = 'yesterday'
  assert.ok(errs(p).some((e) => /accessed must be/.test(e)))
})
test('a non-primary source needs a verification note', () => {
  const p = clone(); p.sources[0].verification = 'secondary_only'
  assert.ok(errs(p).some((e) => /verification_note/.test(e)))
  p.sources[0].verification_note = 'The primary page returned 403; confirmed through press summaries.'
  assert.deepEqual(errs(p), [])
})
test('filename, date and timestamp must agree', () => {
  const p = clone()
  assert.ok(validatePost(p, '2026-11-08.json').some((e) => /filename must be/.test(e)))
  const q = clone(); q.published_at = '2026-11-08T09:00:00-05:00'
  assert.ok(errs(q).some((e) => /published_at/.test(e)))
})
test('title tag length is bounded and savings figures are refused', () => {
  const p = clone(); p.seo_title = 'x'.repeat(60)
  assert.ok(errs(p).some((e) => /seo_title/.test(e)))
  const q = clone(); q.items[0].what_happened = 'The operator reported $2 million in savings from the change this year alone.'
  assert.ok(errs(q).some((e) => /savings/.test(e)))
})
test('between 1 and 6 items', () => {
  const p = clone(); p.items = []
  assert.ok(errs(p).some((e) => /1-6 items/.test(e)))
})
