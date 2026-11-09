/**
 * Selected-cost route economics for the /last-mile page. Illustrative only.
 * Money in USD. Calculations run at full precision; rounding happens at display.
 * Driver labor is priced per paid route hour; the per-mile input must therefore EXCLUDE driver labor.
 */

export interface RouteInput {
  paidHours: number
  driverRatePerHour: number
  miles: number
  vehicleCostPerMile: number // excludes driver labor
  consumablesPerAttempt: number // packaging / cooling consumables per attempted delivery
  attempted: number
  completed: number
}

export interface RouteResult {
  driverCost: number
  vehicleCost: number
  consumablesCost: number
  selectedRouteCost: number
  /** null when there are no completed deliveries (not Infinity, not NaN) */
  costPerCompleted: number | null
  completedPerPaidHour: number | null // null when paid hours = 0
  completionRate: number | null // completed / attempted, null when attempted = 0
  milesPerCompleted: number | null // null when completed = 0
}

export type RouteValidation = { ok: true } | { ok: false; error: string }

export function validateRoute(i: RouteInput): RouteValidation {
  for (const [k, v] of Object.entries(i)) {
    if (!Number.isFinite(v)) return { ok: false, error: `${k} must be a finite number.` }
    if (v < 0) return { ok: false, error: `${k} cannot be negative.` }
  }
  if (i.completed > i.attempted) return { ok: false, error: 'Completed deliveries cannot exceed attempted deliveries.' }
  return { ok: true }
}

export function routeEconomics(i: RouteInput): RouteResult {
  const driverCost = i.paidHours * i.driverRatePerHour
  const vehicleCost = i.miles * i.vehicleCostPerMile
  const consumablesCost = i.attempted * i.consumablesPerAttempt
  const selectedRouteCost = driverCost + vehicleCost + consumablesCost
  return {
    driverCost,
    vehicleCost,
    consumablesCost,
    selectedRouteCost,
    costPerCompleted: i.completed > 0 ? selectedRouteCost / i.completed : null,
    completedPerPaidHour: i.paidHours > 0 ? i.completed / i.paidHours : null,
    completionRate: i.attempted > 0 ? i.completed / i.attempted : null,
    milesPerCompleted: i.completed > 0 ? i.miles / i.completed : null,
  }
}
