import test from 'node:test'
import assert from 'node:assert/strict'
import { estimateEnergy, parseNonNegative } from './calc.ts'

test('default example', () => {
  const r = estimateEnergy(10, 0.12)
  assert.equal(r.dailyKwh, 240)
  assert.equal(r.thirtyDayKwh, 7200)
  assert.ok(Math.abs(r.thirtyDayCharge - 864) < 1e-9)
})
test('zero allowed', () => {
  assert.deepEqual(parseNonNegative('0', 'x'), { ok: true, value: 0 })
  assert.equal(estimateEnergy(0, 0.12).thirtyDayCharge, 0)
})
test('rejects negatives, blanks, junk', () => {
  for (const v of ['-1', '-0.01', '', '  ', 'abc', '1,5', 'Infinity', '1e999'])
    assert.equal(parseNonNegative(v, 'x').ok, false, v)
})
