import { useId, useMemo, useState } from 'react'
import { parseNonNegative } from './calc.ts'
import { dwell, energySensitivity } from './whyCalc.ts'

const num = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

function useField(initial: string, label: string, opts?: { positive?: boolean }) {
  const [raw, set] = useState(initial)
  const p = useMemo(() => {
    const r = parseNonNegative(raw, label)
    if (r.ok && opts?.positive && r.value === 0) return { ok: false as const, error: `${label} must be greater than zero.` }
    return r
  }, [raw, label, opts?.positive])
  return { raw, set, p }
}

function Field({ id, label, f, hint }: { id: string; label: string; f: ReturnType<typeof useField>; hint?: string }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        inputMode="decimal"
        autoComplete="off"
        value={f.raw}
        onChange={(e) => f.set(e.target.value)}
        aria-invalid={!f.p.ok}
        aria-describedby={`${id}-m`}
      />
      <p className={f.p.ok ? 'field__hint' : 'field__err'} id={`${id}-m`}>{!f.p.ok ? f.p.error : hint ?? ''}</p>
    </div>
  )
}

export function ExampleA() {
  const id = useId()
  const kw = useField('100', 'Average site load')
  const hrs = useField('8760', 'Operating hours per year')
  const r1 = useField('0.10', 'Starting rate')
  const r2 = useField('0.14', 'New rate')
  const cap = useField('7', 'Cap rate', { positive: true })
  const ok = [kw, hrs, r1, r2, cap].every((f) => f.p.ok)
  const out = ok
    ? energySensitivity({
        loadKw: (kw.p as { value: number }).value,
        hoursPerYear: (hrs.p as { value: number }).value,
        rateFrom: (r1.p as { value: number }).value,
        rateTo: (r2.p as { value: number }).value,
        capRatePct: (cap.p as { value: number }).value,
      })
    : null
  return (
    <form className="calc" onSubmit={(e) => e.preventDefault()} noValidate aria-label="Example A calculator">
      <p className="calc__badge">Illustrative scenario. Not measured data. Not an appraisal.</p>
      <div className="calc__fields calc__fields--3">
        <Field id={`${id}-kw`} label="Average site load (kW)" f={kw} />
        <Field id={`${id}-h`} label="Operating hours per year" f={hrs} hint="8,760 = every hour" />
        <Field id={`${id}-cap`} label="Assumed cap rate (%)" f={cap} />
        <Field id={`${id}-r1`} label="Starting rate ($/kWh)" f={r1} />
        <Field id={`${id}-r2`} label="New rate ($/kWh)" f={r2} />
      </div>
      <div className="calc__out" role="status" aria-live="polite" aria-atomic="true">
        {out ? (
          <dl>
            <div><dt>Annual energy</dt><dd>{num.format(out.annualKwh)} <span>kWh/yr</span></dd><small>kW × hours</small></div>
            <div><dt>Annual charge, starting → new</dt><dd>{usd.format(out.annualChargeFrom)} → {usd.format(out.annualChargeTo)} <span>/yr</span></dd><small>kWh × rate</small></div>
            <div><dt>Annual difference</dt><dd>{usd.format(out.annualDelta)} <span>/yr</span></dd><small>about {usd.format(out.monthlyDelta)} per month</small></div>
            <div>
              <dt>Simplified indicated value difference</dt>
              <dd>{out.indicatedValueDelta === null ? 'n/a' : usd.format(out.indicatedValueDelta)}</dd>
              <small>annual difference ÷ cap rate</small>
            </div>
          </dl>
        ) : (
          <p className="calc__invalid">Fix the highlighted input to see results. Zero is allowed except for the cap rate.</p>
        )}
      </div>
      <p className="calc__note">
        Holds only if the owner bears the extra expense, it is unreimbursed, and it reduces stabilized NOI dollar for
        dollar. Lease allocation, reimbursements, expense recovery, capital costs and actual tariffs can change the
        result. This is a sensitivity calculation, not an appraisal.
      </p>
    </form>
  )
}

export function ExampleB() {
  const id = useId()
  const pos = useField('1000', 'Usable pallet positions')
  const occ = useField('800', 'Average occupied positions')
  const out1 = useField('100', 'Scenario 1 outbound pallets per day')
  const out2 = useField('50', 'Scenario 2 outbound pallets per day')
  const ok = [pos, occ, out1, out2].every((f) => f.p.ok)
  const v = (f: ReturnType<typeof useField>) => (f.p as { value: number }).value
  const s1 = ok ? dwell({ usablePositions: v(pos), avgOccupiedPositions: v(occ), outboundPalletsPerDay: v(out1) }) : null
  const s2 = ok ? dwell({ usablePositions: v(pos), avgOccupiedPositions: v(occ), outboundPalletsPerDay: v(out2) }) : null
  const show = (d: number | null) => (d === null ? 'undefined (no outbound flow)' : `${num.format(d)} days`)
  return (
    <form className="calc" onSubmit={(e) => e.preventDefault()} noValidate aria-label="Example B calculator">
      <p className="calc__badge">Illustrative scenario. Hypothetical facility. Not measured data.</p>
      <div className="calc__fields calc__fields--2">
        <Field id={`${id}-p`} label="Usable pallet positions" f={pos} />
        <Field id={`${id}-o`} label="Average occupied positions" f={occ} />
        <Field id={`${id}-1`} label="Scenario 1: outbound pallets/day" f={out1} />
        <Field id={`${id}-2`} label="Scenario 2: outbound pallets/day" f={out2} />
      </div>
      <div className="calc__out" role="status" aria-live="polite" aria-atomic="true">
        {s1 && s2 ? (
          <dl>
            <div><dt>Average position occupancy</dt><dd>{s1.occupancyPct === null ? 'n/a' : `${num.format(s1.occupancyPct)}%`}</dd><small>occupied ÷ usable</small></div>
            <div><dt>Scenario 1 implied dwell</dt><dd>{show(s1.impliedDwellDays)}</dd><small>occupied ÷ outbound per day</small></div>
            <div><dt>Scenario 2 implied dwell</dt><dd>{show(s2.impliedDwellDays)}</dd><small>occupied ÷ outbound per day</small></div>
          </dl>
        ) : (
          <p className="calc__invalid">Fix the highlighted input to see results.</p>
        )}
        {s1?.occupiedExceedsUsable && <p className="calc__invalid">Occupied positions exceed usable positions. Check the inputs.</p>}
      </div>
      <p className="calc__note">
        Assumes steady state (inflow about equals outflow) and consistent units (positions are pallets). Same
        occupancy, very different flow. These scenarios do not establish revenue or profit: contracts, handling fees,
        storage fees, product mix, labor and seasonality all matter.
      </p>
    </form>
  )
}
