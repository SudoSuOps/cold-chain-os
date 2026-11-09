import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { LIMITS, TOPICS, validateContact, type FieldErrors } from '../functions/_lib/validate.ts'
import { CONTACT_EMAIL } from './links.ts'

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'error'; message: string }

export default function ContactForm() {
  const id = useId()
  const [startedAt, setStartedAt] = useState(0)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const statusRef = useRef<HTMLDivElement>(null)
  useEffect(() => setStartedAt(Date.now()), []) // bot time-trap; set after mount so server and client markup match

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status.kind === 'sending') return
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    const v = validateContact(data)
    if (!v.ok) {
      setErrors(v.errors)
      setStatus({ kind: 'error', message: 'Please check the highlighted fields.' })
      const first = Object.keys(v.errors)[0]
      ;(form.elements.namedItem(first) as HTMLElement | null)?.focus()
      return
    }
    setErrors({})
    setStatus({ kind: 'sending' })
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...data, startedAt }),
      })
      const j = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: FieldErrors }
      if (res.ok && j.ok) {
        form.reset()
        setStartedAt(Date.now())
        setStatus({ kind: 'sent' })
      } else {
        if (j.fields) setErrors(j.fields)
        setStatus({ kind: 'error', message: j.error ?? `Something went wrong. Please email ${CONTACT_EMAIL}.` })
      }
    } catch {
      setStatus({ kind: 'error', message: `We couldn't reach the server. Please email ${CONTACT_EMAIL}.` })
    }
    statusRef.current?.focus()
  }

  const f = (name: keyof FieldErrors) => ({
    id: `${id}-${name}`,
    name,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${id}-${name}-err` : undefined,
  })
  const err = (name: keyof FieldErrors) => (errors[name] ? <p className="field__err" id={`${id}-${name}-err`}>{errors[name]}</p> : null)

  if (status.kind === 'sent') {
    return (
      <div className="cf cf--done" role="status" tabIndex={-1} ref={statusRef}>
        <h3>Message sent.</h3>
        <p>Thank you. A person reads every message and replies from {CONTACT_EMAIL}. We also sent you a short confirmation; check your spam folder if it doesn’t arrive.</p>
        <button type="button" className="btn btn--ghost" onClick={() => setStatus({ kind: 'idle' })}>Send another</button>
      </div>
    )
  }

  return (
    <form className="cf" onSubmit={onSubmit} noValidate aria-label="Contact form">
      <div className="cf__grid">
        <div className="field">
          <label htmlFor={`${id}-name`}>Your name</label>
          <input {...f('name')} autoComplete="name" maxLength={LIMITS.name + 20} required />
          {err('name')}
        </div>
        <div className="field">
          <label htmlFor={`${id}-email`}>Email address</label>
          <input {...f('email')} type="email" autoComplete="email" inputMode="email" maxLength={LIMITS.email + 20} required />
          {err('email')}
        </div>
        <div className="field">
          <label htmlFor={`${id}-organization`}>Organization <span className="cf__opt">(optional)</span></label>
          <input {...f('organization')} autoComplete="organization" maxLength={LIMITS.organization + 20} />
          {err('organization')}
        </div>
        <div className="field">
          <label htmlFor={`${id}-topic`}>Topic</label>
          <select {...f('topic')} defaultValue="" required>
            <option value="" disabled>Choose a topic</option>
            {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {err('topic')}
        </div>
      </div>
      <div className="field">
        <label htmlFor={`${id}-message`}>Message</label>
        <textarea {...f('message')} rows={7} maxLength={LIMITS.messageMax + 200} required aria-describedby={errors.message ? `${id}-message-err` : `${id}-message-hint`} />
        <p className="field__hint" id={`${id}-message-hint`}>Describe the problem, facility or question. Please leave out confidential or personal details.</p>
        {err('message')}
      </div>
      {/* Honeypot: real visitors never see or fill this. */}
      <div className="hp" aria-hidden="true">
        <label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" defaultValue="" /></label>
      </div>
      <div className="cf__actions">
        <button type="submit" className="btn btn--primary" disabled={status.kind === 'sending'}>{status.kind === 'sending' ? 'Sending…' : 'Send message'}</button>
        <div role="status" aria-live="polite" tabIndex={-1} ref={statusRef} className={status.kind === 'error' ? 'cf__status cf__status--err' : 'cf__status'}>
          {status.kind === 'error' ? status.message : ''}
        </div>
      </div>
      <noscript><p className="field__err">This form needs JavaScript. Email {CONTACT_EMAIL} instead.</p></noscript>
    </form>
  )
}
