import test from 'node:test'
import assert from 'node:assert/strict'
import { handleContact, type Env } from '../functions/_lib/handler.ts'
import { validateContact, oneLine } from '../functions/_lib/validate.ts'
import { esc, notificationEmail, confirmationEmail } from '../functions/_lib/email.ts'

const ENV: Env = { RESEND_API_KEY: 're_test_key', CONTACT_FROM: 'coldchainOS <hello@example.test>' }
const T0 = 1_800_000_000_000
const good = { name: 'Ada Lovelace', email: 'Ada@Example.com', organization: 'Analytical Cold Storage', topic: 'Bring a real problem', message: 'We have a 40,000 SF freezer and a question about demand charges.', website: '', startedAt: T0 - 10_000 }

type Call = { url: string; init: RequestInit }
function harness(over: Partial<Env> = {}, status = 200) {
  const calls: Call[] = []
  const fetch = async (url: string, init: RequestInit) => { calls.push({ url, init }); return new Response('{}', { status }) }
  return { calls, env: { ...ENV, ...over }, opts: { fetch, now: () => T0, uuid: () => 'uuid-1' } }
}
const req = (body: unknown, headers: Record<string, string> = {}) =>
  new Request('https://coldchainos.org/api/contact', { method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://coldchainos.org', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) })
const payload = (c: Call) => JSON.parse(c.init.body as string)

test('valid submission sends a branded notification and a confirmation', async () => {
  const h = harness()
  const res = await handleContact(req(good), h.env, h.opts)
  assert.equal(res.status, 200)
  assert.deepEqual(await res.json(), { ok: true })
  assert.equal(h.calls.length, 2)
  assert.equal(h.calls[0].url, 'https://api.resend.com/emails')
  assert.equal((h.calls[0].init.headers as Record<string, string>).authorization, 'Bearer re_test_key')
  const [n, c] = [payload(h.calls[0]), payload(h.calls[1])]
  assert.deepEqual(n.to, ['bull@coldchainos.org'])
  assert.equal(n.reply_to, 'ada@example.com')
  assert.equal(n.from, ENV.CONTACT_FROM)
  assert.match(n.subject, /^\[coldchainOS\] Bring a real problem: Ada Lovelace$/)
  assert.deepEqual(c.to, ['ada@example.com'])
  assert.equal(c.reply_to, 'bull@coldchainos.org')
  for (const p of [n, c]) {
    assert.ok(p.html.includes('https://coldchainos.org/email/coldchainos-logo-480.png'), 'logo')
    assert.ok(p.html.includes('https://coldchainos.org/email/coldchainos-bull-240.png'), 'bull')
    assert.ok(p.html.includes('alt="The coldchainOS Bull"'))
    assert.ok(p.html.includes('Swarm &amp; Bee LLC'))
    assert.ok(p.text.length > 50, 'plain-text alternative')
  }
})
test('the confirmation never echoes the sender\'s message', async () => {
  const h = harness()
  await handleContact(req(good), h.env, h.opts)
  const c = payload(h.calls[1])
  assert.ok(!c.html.includes('demand charges') && !c.text.includes('demand charges'))
  assert.ok(payload(h.calls[0]).html.includes('demand charges'))
})
test('user content is HTML-escaped in both emails', () => {
  const evil = { name: '<img src=x onerror=alert(1)>', email: 'a@b.co', organization: '"><script>x</script>', topic: 'Something else' as const, message: '<b>hi</b> & <script>alert(1)</script>' }
  const n = notificationEmail({ siteUrl: 'https://coldchainos.org', ownerName: 'X', replyEmail: 'r@x.co' }, evil, 't')
  const c = confirmationEmail({ siteUrl: 'https://coldchainos.org', ownerName: 'X', replyEmail: 'r@x.co' }, evil)
  for (const html of [n.html, c.html]) { assert.ok(!/<script>x|<script>alert|<img src=x/.test(html)); assert.ok(html.includes('&lt;')) }
  assert.equal(esc(`<&>"'`), '&lt;&amp;&gt;&quot;&#39;')
})
test('CR/LF header injection is stripped from single-line fields', async () => {
  assert.equal(oneLine('Ada\r\nBcc: evil@x.co'), 'Ada Bcc: evil@x.co')
  const h = harness()
  await handleContact(req({ ...good, name: 'Ada\r\nBcc: evil@x.co' }), h.env, h.opts)
  const subject = payload(h.calls[0]).subject as string
  assert.ok(!/[\r\n]/.test(subject))
  assert.equal(validateContact({ ...good, email: 'a@b.co\r\nBcc: evil@x.co' }).ok, false)
})
test('honeypot and time traps answer 200 but send nothing', async () => {
  for (const body of [{ ...good, website: 'http://spam.test' }, { ...good, startedAt: T0 - 500 }, { ...good, startedAt: T0 - 2 * 86_400_000 }, { ...good, startedAt: 'nope' }]) {
    const h = harness()
    const res = await handleContact(req(body), h.env, h.opts)
    assert.equal(res.status, 200)
    assert.equal(h.calls.length, 0)
  }
})
test('rejects wrong origin, missing origin, wrong method and wrong content type', async () => {
  const h = harness()
  assert.equal((await handleContact(req(good, { origin: 'https://evil.test' }), h.env, h.opts)).status, 403)
  const noOrigin = new Request('https://coldchainos.org/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(good) })
  assert.equal((await handleContact(noOrigin, h.env, h.opts)).status, 403)
  assert.equal((await handleContact(new Request('https://coldchainos.org/api/contact', { method: 'GET' }), h.env, h.opts)).status, 405)
  assert.equal((await handleContact(req(good, { 'content-type': 'text/plain' }), h.env, h.opts)).status, 415)
  assert.equal(h.calls.length, 0)
})
test('allowed origins include www and configured previews', async () => {
  const h = harness({ CONTACT_ALLOWED_ORIGINS: 'https://preview.example.pages.dev' })
  assert.equal((await handleContact(req(good, { origin: 'https://www.coldchainos.org' }), h.env, h.opts)).status, 200)
  assert.equal((await handleContact(req(good, { origin: 'https://preview.example.pages.dev' }), h.env, h.opts)).status, 200)
})
test('validation errors return 400 with field messages and send nothing', async () => {
  const h = harness()
  const res = await handleContact(req({ ...good, email: 'not-an-email', message: 'short', topic: 'Spam' }), h.env, h.opts)
  assert.equal(res.status, 400)
  const j = await res.json() as { fields: Record<string, string> }
  assert.ok(j.fields.email && j.fields.message && j.fields.topic)
  assert.equal(h.calls.length, 0)
  assert.equal(validateContact({ ...good, message: 'x'.repeat(5001) }).ok, false)
  assert.equal(validateContact({ ...good, name: '   ' }).ok, false)
})
test('oversized and malformed bodies are rejected', async () => {
  const h = harness()
  assert.equal((await handleContact(req('x'.repeat(30_000)), h.env, h.opts)).status, 413)
  assert.equal((await handleContact(req('{not json'), h.env, h.opts)).status, 400)
  assert.equal((await handleContact(req('[1,2]'), h.env, h.opts)).status, 400)
})
test('a missing API key gives a graceful 503 and leaks nothing', async () => {
  for (const env of [{}, { CONTACT_FROM: 'a@b.co' }]) {
    const h = harness(); h.env = env as Env
    const res = await handleContact(req(good), h.env, h.opts)
    assert.equal(res.status, 503)
    const text = await res.text()
    assert.ok(!text.includes('re_x') && text.includes('bull@coldchainos.org'))
    assert.equal(h.calls.length, 0)
  }
})
test('the sender defaults to the verified project domain when CONTACT_FROM is unset', async () => {
  const h = harness(); h.env = { RESEND_API_KEY: 're_test_key' }
  const res = await handleContact(req(good), h.env, h.opts)
  assert.equal(res.status, 200)
  assert.equal(payload(h.calls[0]).from, 'coldchainOS <bull@coldchainos.org>')
  assert.deepEqual(payload(h.calls[0]).to, ['bull@coldchainos.org'])
})
test('Resend failure returns 502 without leaking the provider response', async () => {
  const h = harness({}, 422)
  const res = await handleContact(req(good), h.env, h.opts)
  assert.equal(res.status, 502)
  assert.ok(!(await res.text()).includes('422'))
  assert.equal(h.calls.length, 1)
})
test('a failed confirmation does not fail the submission; auto-reply can be disabled', async () => {
  let n = 0
  const calls: string[] = []
  const f = async (_u: string, i: RequestInit) => { calls.push(JSON.parse(i.body as string).subject); return new Response('{}', { status: ++n === 1 ? 200 : 500 }) }
  assert.equal((await handleContact(req(good), ENV, { fetch: f, now: () => T0, uuid: () => 'u' })).status, 200)
  assert.equal(calls.length, 2)
  const h = harness({ CONTACT_AUTO_REPLY: 'false' })
  await handleContact(req(good), h.env, h.opts)
  assert.equal(h.calls.length, 1)
})
test('the API key never appears in any email payload', async () => {
  const h = harness()
  await handleContact(req(good), h.env, h.opts)
  for (const c of h.calls) assert.ok(!(c.init.body as string).includes('re_test_key'))
})
