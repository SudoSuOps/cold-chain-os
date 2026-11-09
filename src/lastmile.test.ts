import test from 'node:test'
import assert from 'node:assert/strict'
import { routeEconomics, validateRoute, type RouteInput } from './lastMileCalc.ts'

const D: RouteInput = { paidHours: 4, driverRatePerHour: 25, miles: 40, vehicleCostPerMile: 0.75, consumablesPerAttempt: 2, attempted: 20, completed: 20 }

test('default scenario: $170 selected cost, $8.50 per completed delivery', () => {
  const r = routeEconomics(D)
  assert.equal(r.driverCost, 100)
  assert.equal(r.vehicleCost, 30)
  assert.equal(r.consumablesCost, 40)
  assert.equal(r.selectedRouteCost, 170)
  assert.equal(r.costPerCompleted, 8.5)
  assert.equal(r.completedPerPaidHour, 5)
  assert.equal(r.completionRate, 1)
  assert.equal(r.milesPerCompleted, 2)
})
test('failed-delivery scenario: same costs, 18 completed -> about $9.44', () => {
  const r = routeEconomics({ ...D, completed: 18 })
  assert.equal(r.selectedRouteCost, 170) // consumables are per ATTEMPT, so cost does not fall
  assert.equal(r.costPerCompleted!.toFixed(2), '9.44')
  assert.ok(Math.abs(r.costPerCompleted! - 170 / 18) < 1e-12)
  assert.equal(r.completedPerPaidHour, 4.5)
  assert.equal(r.completionRate, 0.9)
  assert.ok(Math.abs(r.milesPerCompleted! - 40 / 18) < 1e-12)
})
test('zero completed deliveries: no division by zero', () => {
  const r = routeEconomics({ ...D, completed: 0 })
  assert.equal(r.costPerCompleted, null)
  assert.equal(r.milesPerCompleted, null)
  assert.equal(r.completionRate, 0)
  assert.equal(r.selectedRouteCost, 170)
})
test('zero hours and zero attempts do not divide by zero', () => {
  assert.equal(routeEconomics({ ...D, paidHours: 0 }).completedPerPaidHour, null)
  const r = routeEconomics({ ...D, attempted: 0, completed: 0 })
  assert.equal(r.completionRate, null)
  assert.equal(r.consumablesCost, 0)
})
test('fractional hours and miles are allowed', () => {
  const r = routeEconomics({ ...D, paidHours: 3.5, miles: 12.4 })
  assert.equal(r.driverCost, 87.5)
  assert.ok(Math.abs(r.vehicleCost - 9.3) < 1e-9)
})
test('validation: negatives, completed > attempted, non-finite', () => {
  assert.equal(validateRoute(D).ok, true)
  assert.equal(validateRoute({ ...D, miles: -1 }).ok, false)
  assert.equal(validateRoute({ ...D, driverRatePerHour: -0.01 }).ok, false)
  assert.equal(validateRoute({ ...D, completed: 21 }).ok, false)
  assert.equal(validateRoute({ ...D, paidHours: NaN }).ok, false)
  assert.equal(validateRoute({ ...D, miles: Infinity }).ok, false)
})
