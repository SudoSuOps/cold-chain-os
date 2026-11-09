import type { ContactInput } from './validate.ts'

/**
 * Branded transactional email (coldchainOS Bull + logo). Table layout and inline styles for email-client
 * compatibility; images are PNG (many clients block SVG/WebP); every user-supplied value is HTML-escaped.
 */
const BRAND = {
  bg: '#06142A', card: '#0D1F3A', border: '#2A3F5F', text: '#EEF4FA', muted: '#9AAABD', ice: '#8FCFF5', navy: '#06142A',
  font: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif",
}

export const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

export interface Branding { siteUrl: string; ownerName: string; replyEmail: string }

function frame(b: Branding, preheader: string, inner: string): string {
  const logo = `${b.siteUrl}/email/coldchainos-logo-480.png`
  const bull = `${b.siteUrl}/email/coldchainos-bull-240.png`
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark light"><meta name="supported-color-schemes" content="dark light"><title>coldchainOS</title></head>
<body style="margin:0;padding:0;background:${BRAND.bg};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${BRAND.bg};">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BRAND.bg}" style="background:${BRAND.bg};"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
<tr><td style="padding:8px 4px 20px 4px;"><a href="${b.siteUrl}/"><img src="${logo}" width="200" alt="coldchainOS" style="display:block;border:0;height:auto;width:200px;"></a></td></tr>
<tr><td bgcolor="${BRAND.card}" style="background:${BRAND.card};border:1px solid ${BRAND.border};border-radius:10px;padding:28px 28px 24px 28px;font-family:${BRAND.font};color:${BRAND.text};font-size:16px;line-height:1.6;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td width="72" valign="top" style="padding-right:16px;"><img src="${bull}" width="64" height="64" alt="The coldchainOS Bull" style="display:block;border:0;width:64px;height:64px;border-radius:32px;"></td>
<td valign="middle" style="font-family:${BRAND.font};font-size:13px;letter-spacing:1.2px;text-transform:uppercase;color:${BRAND.ice};font-weight:600;">Does the cold chain pencil?</td></tr></table>
<div style="height:18px;line-height:18px;">&nbsp;</div>
${inner}
</td></tr>
<tr><td style="padding:18px 8px 4px 8px;font-family:${BRAND.font};font-size:12px;line-height:1.6;color:${BRAND.muted};">
coldchainOS is an independent, self-funded, open-source project in active development. &copy; 2026 ${esc(b.ownerName)}<br>
<a href="${b.siteUrl}/" style="color:${BRAND.ice};">${esc(b.siteUrl.replace(/^https?:\/\//, ''))}</a> &middot; <a href="mailto:${esc(b.replyEmail)}" style="color:${BRAND.ice};">${esc(b.replyEmail)}</a>
</td></tr></table></td></tr></table></body></html>`
}

const row = (label: string, value: string) =>
  `<tr><td valign="top" style="padding:6px 16px 6px 0;font-family:${BRAND.font};font-size:13px;color:${BRAND.muted};white-space:nowrap;">${label}</td><td style="padding:6px 0;font-family:${BRAND.font};font-size:15px;color:${BRAND.text};">${value}</td></tr>`

/** To the project: the message, with the sender as Reply-To. */
export function notificationEmail(b: Branding, m: ContactInput, receivedAtIso: string) {
  const subject = `[coldchainOS] ${m.topic}: ${m.name}`
  const html = frame(b, `New message from ${m.name}`,
    `<h1 style="margin:0 0 14px 0;font-family:${BRAND.font};font-size:22px;line-height:1.25;color:${BRAND.text};">New message from the website</h1>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px 0;">
${row('From', esc(m.name))}
${row('Email', `<a href="mailto:${esc(m.email)}" style="color:${BRAND.ice};">${esc(m.email)}</a>`)}
${m.organization ? row('Organization', esc(m.organization)) : ''}
${row('Topic', esc(m.topic))}
${row('Received', esc(receivedAtIso))}
</table>
<div style="border-left:3px solid ${BRAND.ice};padding:6px 0 6px 16px;margin:0 0 20px 0;white-space:pre-wrap;word-wrap:break-word;font-family:${BRAND.font};font-size:16px;color:${BRAND.text};">${esc(m.message)}</div>
<a href="mailto:${esc(m.email)}?subject=${encodeURIComponent('Re: ' + m.topic)}" style="display:inline-block;background:${BRAND.ice};color:${BRAND.navy};font-family:${BRAND.font};font-weight:600;font-size:15px;text-decoration:none;padding:12px 22px;border-radius:4px;">Reply to ${esc(m.name)}</a>
<p style="margin:20px 0 0 0;font-family:${BRAND.font};font-size:12px;color:${BRAND.muted};">Sent from the coldchainOS contact form. Treat the message as untrusted text.</p>`)
  const text = [
    'New message from the coldchainOS website', '',
    `From: ${m.name}`, `Email: ${m.email}`, ...(m.organization ? [`Organization: ${m.organization}`] : []),
    `Topic: ${m.topic}`, `Received: ${receivedAtIso}`, '', m.message, '',
    `Reply to ${m.email}.`,
  ].join('\n')
  return { subject, html, text }
}

/** To the sender: a short confirmation. It deliberately does not echo their message. */
export function confirmationEmail(b: Branding, m: ContactInput) {
  const first = m.name.split(' ')[0]
  const subject = 'We got your message: coldchainOS'
  const html = frame(b, 'Thanks for writing to coldchainOS.',
    `<h1 style="margin:0 0 14px 0;font-family:${BRAND.font};font-size:22px;line-height:1.25;color:${BRAND.text};">Thanks, ${esc(first)}. We got your message.</h1>
<p style="margin:0 0 14px 0;">You wrote to us about <strong style="color:${BRAND.text};">${esc(m.topic)}</strong>. A person reads every message, and we reply from <a href="mailto:${esc(b.replyEmail)}" style="color:${BRAND.ice};">${esc(b.replyEmail)}</a>. We can&rsquo;t promise a response time.</p>
<p style="margin:0 0 14px 0;"><strong style="color:${BRAND.text};">One request:</strong> please don&rsquo;t email confidential documents, client records or personal information. Tell us what you have, and we&rsquo;ll agree on a safe way to handle it.</p>
<p style="margin:0 0 20px 0;color:${BRAND.muted};">While you wait: the project, its sources and its open questions are all in the open.</p>
<a href="https://github.com/SudoSuOps/cold-chain-os" style="display:inline-block;background:${BRAND.ice};color:${BRAND.navy};font-family:${BRAND.font};font-weight:600;font-size:15px;text-decoration:none;padding:12px 22px;border-radius:4px;">Explore the project</a>
<p style="margin:20px 0 0 0;font-family:${BRAND.font};font-size:12px;color:${BRAND.muted};">You&rsquo;re receiving this once because this address was entered on the coldchainOS contact form. If that wasn&rsquo;t you, you can ignore this message.</p>`)
  const text = [
    `Thanks, ${first}. We got your message.`, '',
    `You wrote to us about: ${m.topic}.`,
    `A person reads every message, and we reply from ${b.replyEmail}. We can't promise a response time.`, '',
    "One request: please don't email confidential documents, client records or personal information. Tell us what you have, and we'll agree on a safe way to handle it.", '',
    'Explore the project: https://github.com/SudoSuOps/cold-chain-os', '',
    "You're receiving this once because this address was entered on the coldchainOS contact form. If that wasn't you, you can ignore this message.", '',
    `coldchainOS, an independent open-source project. (c) 2026 ${b.ownerName}`,
  ].join('\n')
  return { subject, html, text }
}
