/** Shared by the browser form and the Pages Function, so both enforce exactly the same rules. No platform APIs here. */

export const TOPICS = ['Bring a real problem', 'Collaborate or contribute', 'Datasets or evaluations', 'Press or brand', 'Something else'] as const
export type Topic = (typeof TOPICS)[number]

export const LIMITS = { name: 100, email: 254, organization: 120, messageMin: 10, messageMax: 5000 } as const

export interface ContactInput {
  name: string
  email: string
  organization: string
  topic: Topic
  message: string
}
export type FieldErrors = Partial<Record<keyof ContactInput, string>>

/** Remove control characters (including CR/LF, which enable email-header injection) and collapse whitespace. */
export const oneLine = (s: string) => s.replace(/[\u0000-\u001f\u007f\u2028\u2029]+/g, ' ').replace(/\s+/g, ' ').trim()
/** Keep line breaks in the message body but drop other control characters. */
export const body = (s: string) => s.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim()

const EMAIL = /^[A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/

export function validateContact(raw: Record<string, unknown>): { ok: true; value: ContactInput } | { ok: false; errors: FieldErrors } {
  const s = (k: string) => (typeof raw[k] === 'string' ? (raw[k] as string) : '')
  const name = oneLine(s('name'))
  const email = oneLine(s('email')).toLowerCase()
  const organization = oneLine(s('organization'))
  const topicRaw = oneLine(s('topic'))
  const message = body(s('message'))
  const errors: FieldErrors = {}
  if (!name) errors.name = 'Enter your name.'
  else if (name.length > LIMITS.name) errors.name = `Keep your name under ${LIMITS.name} characters.`
  if (!email) errors.email = 'Enter your email address.'
  else if (email.length > LIMITS.email || !EMAIL.test(email)) errors.email = 'Enter a valid email address.'
  if (organization.length > LIMITS.organization) errors.organization = `Keep this under ${LIMITS.organization} characters.`
  const topic = (TOPICS as readonly string[]).includes(topicRaw) ? (topicRaw as Topic) : null
  if (!topic) errors.topic = 'Choose a topic.'
  if (message.length < LIMITS.messageMin) errors.message = `Tell us a little more (at least ${LIMITS.messageMin} characters).`
  else if (message.length > LIMITS.messageMax) errors.message = `Keep your message under ${LIMITS.messageMax} characters.`
  if (Object.keys(errors).length) return { ok: false, errors }
  return { ok: true, value: { name, email, organization, topic: topic as Topic, message } }
}
