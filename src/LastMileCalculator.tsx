import { useId, useMemo, useState } from 'react'
import { parseNonNegative } from './calc.ts'
import { routeEconomics, validateRoute, type RouteInput } from './lastMileCalc.ts'

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
const num = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })
const pct = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1 })

function useField(initial: string, label: string) {
  const [raw, set] = useState(initial)
  const p = useMemo(() => parseNonNegative(raw, label), [raw, label])
  return { raw, set, p }
}
type F = ReturnType<typeof useField>
const val = (f: F) => (f.p as { value: number }).value

function Field({ id, label, f, hint }: { id: string; label: string; f: F; hint?: string }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} inputMode="decimal" autoComplete="off" value={f.raw} onChange={(e) => f.set(e.target.value)} aria-invalid={!f.p.ok} aria-describedby={`${id}-m`} />
      <p className={f.p.ok ? 'field__hint' : 'field__err'} id={`${id}-m`}>{!f.p.ok ? f.p.error : hint ?? ''}</p>
    </div>
  )
}

export default function LastMileCalculator() {
  const id = useId()
  const hours = useField('4', 'Paid route hours')
  const rate = useField('25', 'Driver cost per hour')
  const miles = useField('40', 'Route miles')
  const perMile = useField('0.75', 'Vehicle cost per mile')
  const cons = useField('2', 'Consumables per attempted delivery')
  const att = useField('20', 'Attempted deliveries')
  const c1 = useField('20', 'Scenario 1 completed')
  const c2 = useField('18', 'Scenario 2 completed')
  const fields = [hours, rate, miles, perMile, cons, att, c1, c2]
  const parsed = fields.every((f) => f.p.ok)

  const mk = (c: F): RouteInput => ({
    paidHours: val(hours), driverRatePerHour: val(rate), miles: val(miles), vehicleCostPerMile: val(perMile),
    consumablesPerAttempt: val(cons), attempted: val(att), completed: val(c),
  })
  const v1 = parsed ? validateRoute(mk(c1)) : null
  const v2 = parsed ? validateRoute(mk(c2)) : null
  const r1 = v1?.ok ? routeEconomics(mk(c1)) : null
  const r2 = v2?.ok ? routeEconomics(mk(c2)) : null
  const err = (parsed && v1 && !v1.ok ? v1.error : null) ?? (parsed && v2 && !v2.ok ? v2.error : null)

  const cost = (v: number | null) => (v === null ? 'No completed deliveries' : usd.format(v))
  const n = (v: number | null, suffix = '') => (v === null ? 'n/a' : `${num.format(v)}${suffix}`)

  return (
    <form className="calc" onSubmit={(e) => e.preventDefault()} noValidate aria-label="Route economics calculator">
      <p className="calc__badge">Illustrative scenario. Not measured data. A selected-cost example, not a delivery P&amp;L.</p>
      <div className="calc__fields calc__fields--4">
        <Field id={`${id}-h`} label="Paid route hours" f={hours} hint="Fractions allowed" />
        <Field id={`${id}-r`} label="Driver cost per hour ($)" f={rate} />
        <Field id={`${id}-m`} label="Route miles" f={miles} hint="Fractions allowed" />
        <Field id={`${id}-pm`} label="Vehicle cost per mile ($)" f={perMile} hint="Excludes driver labor" />
        <Field id={`${id}-c`} label="Consumables per attempt ($)" f={cons} hint="Packaging and cooling" />
        <Field id={`${id}-a`} label="Attempted deliveries" f={att} />
        <Field id={`${id}-c1`} label="Scenario 1: completed" f={c1} />
        <Field id={`${id}-c2`} label="Scenario 2: completed" f={c2} />
      </div>
      <div className="calc__out" role="status" aria-live="polite" aria-atomic="true">
        {err && <p className="calc__invalid">{err}</p>}
        {!parsed && <p className="calc__invalid">Fix the highlighted input to see results. Zero and fractions are allowed; negatives are not.</p>}
        {r1 && r2 && (
          <div className="lm-table" role="table" aria-label="Results by scenario">
            <div role="row" className="lm-row lm-row--head"><span role="columnheader">Selected costs</span><span role="columnheader">Scenario 1</span><span role="columnheader">Scenario 2</span></div>
            <div role="row" className="lm-row"><span role="rowheader">Driver (hours × rate)</span><span role="cell">{usd.format(r1.driverCost)}</span><span role="cell">{usd.format(r2.driverCost)}</span></div>
            <div role="row" className="lm-row"><span role="rowheader">Vehicle (miles × cost per mile)</span><span role="cell">{usd.format(r1.vehicleCost)}</span><span role="cell">{usd.format(r2.vehicleCost)}</span></div>
            <div role="row" className="lm-row"><span role="rowheader">Consumables (attempts × cost)</span><span role="cell">{usd.format(r1.consumablesCost)}</span><span role="cell">{usd.format(r2.consumablesCost)}</span></div>
            <div role="row" className="lm-row lm-row--sum"><span role="rowheader">Selected route cost</span><span role="cell">{usd.format(r1.selectedRouteCost)}</span><span role="cell">{usd.format(r2.selectedRouteCost)}</span></div>
            <div role="row" className="lm-row lm-row--key"><span role="rowheader">Cost per completed delivery</span><span role="cell">{cost(r1.costPerCompleted)}</span><span role="cell">{cost(r2.costPerCompleted)}</span></div>
            <div role="row" className="lm-row lm-row--head"><span role="columnheader">Operating metrics</span><span role="columnheader">Scenario 1</span><span role="columnheader">Scenario 2</span></div>
            <div role="row" className="lm-row"><span role="rowheader">Completed deliveries per paid route hour</span><span role="cell">{n(r1.completedPerPaidHour)}</span><span role="cell">{n(r2.completedPerPaidHour)}</span></div>
            <div role="row" className="lm-row"><span role="rowheader">Completed ÷ attempted</span><span role="cell">{r1.completionRate === null ? 'n/a' : pct.format(r1.completionRate)}</span><span role="cell">{r2.completionRate === null ? 'n/a' : pct.format(r2.completionRate)}</span></div>
            <div role="row" className="lm-row"><span role="rowheader">Route miles per completed delivery</span><span role="cell">{n(r1.milesPerCompleted)}</span><span role="cell">{n(r2.milesPerCompleted)}</span></div>
          </div>
        )}
      </div>
      <p className="calc__note">
        Selected-cost scenario only. Excludes picking, facility overhead, platform fees, insurance not included in vehicle
        cost, refunds, product losses, redelivery, taxes and other costs. Vehicle cost per mile should exclude driver
        labor, which is counted once under paid hours. The value of delivered goods is not logistics revenue. Consumables
        are priced per attempt, so a failed delivery lowers completions without lowering cost. This tool gives no route-safety or
        food-safety verdict.
      </p>
    </form>
  )
}
