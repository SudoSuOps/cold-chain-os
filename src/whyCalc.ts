/**
 * Illustrative sensitivity calculations for the /why page.
 * Pure functions, no I/O. All money is USD; "annual" and "monthly" are named explicitly.
 */

const cents = (n: number) => Math.round(n * 100) / 100

export interface EnergySensitivityInput {
  loadKw: number
  hoursPerYear: number
  rateFrom: number // $/kWh
  rateTo: number // $/kWh
  capRatePct: number // e.g. 7 for 7%
}

export interface EnergySensitivity {
  annualKwh: number
  annualChargeFrom: number
  annualChargeTo: number
  annualDelta: number
  monthlyDelta: number // annualDelta / 12, for unit checks only
  /** annualDelta / cap rate. null when the cap rate is not a positive number. */
  indicatedValueDelta: number | null
}

/**
 * Simplified sensitivity: if the extra energy expense is borne by the owner, is unreimbursed,
 * and reduces stabilized NOI dollar for dollar, indicated value changes by deltaNOI / capRate.
 * It is not an appraisal.
 */
export function energySensitivity(i: EnergySensitivityInput): EnergySensitivity {
  const annualKwh = i.loadKw * i.hoursPerYear
  const annualChargeFrom = cents(annualKwh * i.rateFrom)
  const annualChargeTo = cents(annualKwh * i.rateTo)
  const annualDelta = cents(annualChargeTo - annualChargeFrom)
  const monthlyDelta = cents(annualDelta / 12)
  const indicatedValueDelta = i.capRatePct > 0 ? Math.round(annualDelta / (i.capRatePct / 100)) : null
  return { annualKwh, annualChargeFrom, annualChargeTo, annualDelta, monthlyDelta, indicatedValueDelta }
}

export interface DwellInput {
  usablePositions: number
  avgOccupiedPositions: number
  outboundPalletsPerDay: number
}

export interface Dwell {
  /** null when there are no usable positions */
  occupancyPct: number | null
  /**
   * Implied average dwell in days = occupied positions / outbound pallets per day.
   * Valid only in steady state (inflow about equals outflow) with positions and flow in consistent units.
   * null when throughput is zero: dwell is undefined, not infinite.
   */
  impliedDwellDays: number | null
  occupiedExceedsUsable: boolean
}

export function dwell(i: DwellInput): Dwell {
  return {
    occupancyPct: i.usablePositions > 0 ? Math.round((i.avgOccupiedPositions / i.usablePositions) * 10000) / 100 : null,
    impliedDwellDays: i.outboundPalletsPerDay > 0 ? Math.round((i.avgOccupiedPositions / i.outboundPalletsPerDay) * 100) / 100 : null,
    occupiedExceedsUsable: i.avgOccupiedPositions > i.usablePositions,
  }
}
