import test from 'node:test'
import assert from 'node:assert/strict'
import { dwell, energySensitivity } from './whyCalc.ts'

const A = { loadKw: 100, hoursPerYear: 8760, rateFrom: 0.1, rateTo: 0.14, capRatePct: 7 }

test('Example A: energy assumption changes', () => {
  const r = energySensitivity(A)
  assert.equal(r.annualKwh, 876000)
  assert.equal(r.annualChargeFrom, 87600)
  assert.equal(r.annualChargeTo, 122640)
  assert.equal(r.annualDelta, 35040)
  assert.equal(r.monthlyDelta, 2920) // annual / 12, distinct from the annual figure
  assert.equal(r.indicatedValueDelta, 500571) // 35,040 / 0.07 = 500,571.43
})
test('Example A: zero load, equal rates, zero cap rate', () => {
  assert.equal(energySensitivity({ ...A, loadKw: 0 }).annualDelta, 0)
  assert.equal(energySensitivity({ ...A, rateTo: 0.1 }).indicatedValueDelta, 0)
  assert.equal(energySensitivity({ ...A, capRatePct: 0 }).indicatedValueDelta, null)
})
test('Example A: a rate decrease gives a negative delta', () => {
  assert.equal(energySensitivity({ ...A, rateFrom: 0.14, rateTo: 0.1 }).annualDelta, -35040)
})
test('Example B: occupancy is not throughput', () => {
  const s1 = dwell({ usablePositions: 1000, avgOccupiedPositions: 800, outboundPalletsPerDay: 100 })
  const s2 = dwell({ usablePositions: 1000, avgOccupiedPositions: 800, outboundPalletsPerDay: 50 })
  assert.equal(s1.occupancyPct, 80)
  assert.equal(s2.occupancyPct, 80)
  assert.equal(s1.impliedDwellDays, 8)
  assert.equal(s2.impliedDwellDays, 16)
})
test('Example B: zero throughput never divides by zero', () => {
  const r = dwell({ usablePositions: 1000, avgOccupiedPositions: 800, outboundPalletsPerDay: 0 })
  assert.equal(r.impliedDwellDays, null)
  assert.equal(r.occupancyPct, 80)
})
test('Example B: zero usable positions, occupied above usable', () => {
  assert.equal(dwell({ usablePositions: 0, avgOccupiedPositions: 0, outboundPalletsPerDay: 5 }).occupancyPct, null)
  assert.equal(dwell({ usablePositions: 100, avgOccupiedPositions: 120, outboundPalletsPerDay: 5 }).occupiedExceedsUsable, true)
})
