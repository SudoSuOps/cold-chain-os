import { validateContact } from './validate.ts'
import { confirmationEmail, notificationEmail, type Branding } from './email.ts'

export interface Env {
  /** Secret. Set in Cloudflare Pages (Settings > Variables and Secrets). Never committed. */
  RESEND_API_KEY?: string
  /** Verified sender, e.g. "coldchainOS <hello@your-verified-domain>". Required by Resend. */
  CONTACT_FROM?: string
  /** Where messages go. Defaults to the project inbox. */
  CONTACT_TO?: string
  /** Set to "false" to disable the confirmation email to the sender. */
  CONTACT_AUTO_REPLY?: string
  /** Comma-separated extra allowed origins (e.g. a Pages preview URL). */
  CONTACT_ALLOWED_ORIGINS?: string
}

export const SITE = 'https://coldchainos.org'
const DEFAULT_TO = 'build@swarmandbee.ai'
const OWNER = 'Swarm & Bee LLC'
const MIN_FILL_MS = 3000
const MAX_AGE_MS = 24 * 60 * 60 * 1000
const MAX_BODY_BYTES = 20_000

const json = (status: number, data: unknown) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } })

export const allowedOrigins = (env: Env) =>
  new Set([SITE, 'https://www.coldchainos.org', ...(env.CONTACT_ALLOWED_ORIGINS ?? '').split(',').map((s) => s.trim()).filter(Boolean)])

type Fetch = (input: string, init: RequestInit) => Promise<Response>

async function sendResend(f: Fetch, key: string, payload: Record<string, unknown>, idempotencyKey: string) {
  return f('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json', 'idempotency-key': idempotencyKey },
    body: JSON.stringify(payload),
  })
}

export async function handleContact(request: Request, env: Env, opts: { fetch?: Fetch; now?: () => number; uuid?: () => string } = {}): Promise<Response> {
  const f: Fetch = opts.fetch ?? ((u, i) => fetch(u, i))
  const now = opts.now ?? Date.now
  const uuid = opts.uuid ?? (() => crypto.randomUUID())

  if (request.method !== 'POST') return json(405, { ok: false, error: 'Method not allowed.' })
  const origin = request.headers.get('origin')
  if (!origin || !allowedOrigins(env).has(origin)) return json(403, { ok: false, error: 'Request not allowed.' })
  if (!(request.headers.get('content-type') ?? '').toLowerCase().includes('application/json')) return json(415, { ok: false, error: 'Send JSON.' })

  const text = await request.text()
  if (text.length > MAX_BODY_BYTES) return json(413, { ok: false, error: 'Message too large.' })
  let raw: Record<string, unknown>
  try {
    const parsed = JSON.parse(text)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('shape')
    raw = parsed as Record<string, unknown>
  } catch {
    return json(400, { ok: false, error: 'Invalid request.' })
  }

  // Bot traps. Answer as if it worked so scripts get no signal.
  if (typeof raw.website === 'string' && raw.website.trim() !== '') return json(200, { ok: true })
  const started = Number(raw.startedAt)
  const age = now() - started
  if (!Number.isFinite(started) || age < MIN_FILL_MS || age > MAX_AGE_MS) return json(200, { ok: true })

  const v = validateContact(raw)
  if (!v.ok) return json(400, { ok: false, error: 'Please check the highlighted fields.', fields: v.errors })

  if (!env.RESEND_API_KEY || !env.CONTACT_FROM) {
    return json(503, { ok: false, error: `The contact form isn't configured yet. Please email ${DEFAULT_TO}.` })
  }
  const to = env.CONTACT_TO || DEFAULT_TO
  const branding: Branding = { siteUrl: SITE, ownerName: OWNER, replyEmail: to }
  const id = uuid()
  const note = notificationEmail(branding, v.value, new Date(now()).toISOString())

  try {
    const res = await sendResend(f, env.RESEND_API_KEY, {
      from: env.CONTACT_FROM, to: [to], reply_to: v.value.email, subject: note.subject, html: note.html, text: note.text,
    }, `contact-${id}`)
    if (!res.ok) {
      console.error('contact: notification send failed', res.status) // status only; never log message content
      return json(502, { ok: false, error: `We couldn't send your message. Please email ${DEFAULT_TO}.` })
    }
  } catch {
    console.error('contact: notification send threw')
    return json(502, { ok: false, error: `We couldn't send your message. Please email ${DEFAULT_TO}.` })
  }

  if (env.CONTACT_AUTO_REPLY !== 'false') {
    try {
      const conf = confirmationEmail(branding, v.value)
      const res = await sendResend(f, env.RESEND_API_KEY, {
        from: env.CONTACT_FROM, to: [v.value.email], reply_to: to, subject: conf.subject, html: conf.html, text: conf.text,
      }, `confirm-${id}`)
      if (!res.ok) console.error('contact: confirmation send failed', res.status)
    } catch {
      console.error('contact: confirmation send threw')
    }
  }
  return json(200, { ok: true })
}
