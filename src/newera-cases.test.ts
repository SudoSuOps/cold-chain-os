import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { validateAgainstSchema, checkCase, checkSplits, recompute } from '../eval/new-era/validate.mjs'

const schema = JSON.parse(readFileSync(new URL('../eval/new-era/schema.json', import.meta.url), 'utf8'))
const cases = JSON.parse(readFileSync(new URL('../eval/new-era/cases.json', import.meta.url), 'utf8'))

test('there are 12 cases with unique ids', () => {
  assert.equal(cases.length, 12)
  assert.equal(new Set(cases.map((c: { case_id: string }) => c.case_id)).size, 12)
})
test('every case is valid against the schema', () => {
  for (const c of cases) assert.deepEqual(validateAgainstSchema(c, schema), [], c.case_id)
})
test('cross-field rules hold and calculations recompute deterministically', () => {
  for (const c of cases) assert.deepEqual(checkCase(c), [], c.case_id)
  const byId = Object.fromEntries(cases.map((c: { case_id: string }) => [c.case_id, c]))
  assert.equal(recompute(byId['NE-002'].calculation), 657000)
  assert.ok(Math.abs(recompute(byId['NE-003'].calculation) - 45552) < 1e-6)
  assert.equal(recompute(byId['NE-006'].calculation), 120)
})
test('related source families never span splits', () => {
  assert.deepEqual(checkSplits(cases), [])
})
test('all labels are drafts and none claims expert review', () => {
  assert.ok(cases.every((c: { label_status: string }) => c.label_status === 'draft_unreviewed'))
})
test('mechanical vs expert-review split is explicit', () => {
  const n = (t: string) => cases.filter((c: { testability: string }) => c.testability === t).length
  assert.equal(n('mechanical') + n('expert_review'), 12)
  assert.equal(n('expert_review'), 2)
})
test('schema rejects a malformed case', () => {
  const bad = { ...cases[0], case_id: 'bad', answer_type: 'maybe' }
  const errs = validateAgainstSchema(bad, schema)
  assert.ok(errs.length >= 2)
})
test('a case with a wrong calculation result is caught', () => {
  const bad = structuredClone(cases[1]); bad.calculation.result = 1
  assert.ok(checkCase(bad).length > 0)
})
test('no case contains attack payloads or scan instructions (basic guard)', () => {
  const blob = JSON.stringify(cases).toLowerCase()
  for (const w of ['nmap', 'shodan', 'exploit', 'cve-', 'metasploit']) assert.ok(!blob.includes(w), w)
})
