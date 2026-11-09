import { useId, useMemo, useState } from 'react'
import { estimateEnergy, parseNonNegative } from './calc.ts'

const int = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export default function Calculator() {
  const id = useId()
  const [kw, setKw] = useState('10')
  const [rate, setRate] = useState('0.12')

  const kwP = useMemo(() => parseNonNegative(kw, 'Average load'), [kw])
  const rateP = useMemo(() => parseNonNegative(rate, 'Electricity rate'), [rate])
  const result = kwP.ok && rateP.ok ? estimateEnergy(kwP.value, rateP.value) : null

  return (
    <form className="calc" onSubmit={(e) => e.preventDefault()} noValidate aria-labelledby={`${id}-t`}>
      <p className="calc__badge">Illustrative scenario — not measured project data.</p>
      <h3 id={`${id}-t`} className="calc__title">Start with the power bill.</h3>

      <div className="calc__fields">
        <div className="field">
          <label htmlFor={`${id}-kw`}>Average total site electrical load (kW)</label>
          <input
            id={`${id}-kw`}
            inputMode="decimal"
            autoComplete="off"
            value={kw}
            onChange={(e) => setKw(e.target.value)}
            aria-invalid={!kwP.ok}
            aria-describedby={!kwP.ok ? `${id}-kw-err` : undefined}
          />
          <p className="field__err" id={`${id}-kw-err`}>{!kwP.ok ? kwP.error : ''}</p>
        </div>
        <div className="field">
          <label htmlFor={`${id}-rate`}>Electricity rate ($ per kWh)</label>
          <input
            id={`${id}-rate`}
            inputMode="decimal"
            autoComplete="off"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            aria-invalid={!rateP.ok}
            aria-describedby={!rateP.ok ? `${id}-rate-err` : undefined}
          />
          <p className="field__err" id={`${id}-rate-err`}>{!rateP.ok ? rateP.error : ''}</p>
        </div>
      </div>

      <div className="calc__out" role="status" aria-live="polite" aria-atomic="true">
        {result ? (
          <dl>
            <div>
              <dt>Daily electricity use</dt>
              <dd>{int.format(result.dailyKwh)} <span>kWh</span></dd>
              <small>kW × 24</small>
            </div>
            <div>
              <dt>Estimated 30-day use</dt>
              <dd>{int.format(result.thirtyDayKwh)} <span>kWh</span></dd>
              <small>kW × 24 × 30</small>
            </div>
            <div>
              <dt>Estimated 30-day energy charge</dt>
              <dd>{usd.format(result.thirtyDayCharge)}</dd>
              <small>kWh × rate</small>
            </div>
          </dl>
        ) : (
          <p className="calc__invalid">Fix the highlighted input to see results. Zero is allowed; negative values are not.</p>
        )}
      </div>

      <p className="calc__note">
        Use average load across the whole site, including equipment cycling. Energy charges only; excludes
        demand charges, fixed fees, taxes, maintenance, and other operating costs.
      </p>
    </form>
  )
}
