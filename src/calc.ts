export type ParseResult = { ok: true; value: number } | { ok: false; error: string }

/** Parse a non-negative finite number from user text. Zero is allowed. */
export function parseNonNegative(raw: string, label: string): ParseResult {
  const t = raw.trim()
  if (t === '') return { ok: false, error: `Enter a value for ${label}.` }
  if (!/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(t)) {
    return { ok: false, error: `${label} must be a number.` }
  }
  const n = Number(t)
  if (!Number.isFinite(n)) return { ok: false, error: `${label} must be a finite number.` }
  if (n < 0) return { ok: false, error: `${label} cannot be negative.` }
  return { ok: true, value: n }
}

export interface EnergyEstimate {
  dailyKwh: number
  thirtyDayKwh: number
  thirtyDayCharge: number
}

export function estimateEnergy(loadKw: number, ratePerKwh: number): EnergyEstimate {
  const dailyKwh = loadKw * 24
  const thirtyDayKwh = dailyKwh * 30
  return { dailyKwh, thirtyDayKwh, thirtyDayCharge: thirtyDayKwh * ratePerKwh }
}
