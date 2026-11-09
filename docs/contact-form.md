# Contact form

`/contact/` posts JSON to a Cloudflare Pages Function (`functions/api/contact.ts`), which sends two branded emails through the [Resend](https://resend.com) API:

1. **Notification** to the project inbox (default `bull@coldchainos.org`), with the visitor as `Reply-To`.
2. **Confirmation** to the visitor. It names the topic only and deliberately does not echo their message.

Both use the coldchainOS logo, the Bull and the brand palette, with a plain-text alternative. Brand images are PNG copies under `public/email/` (many mail clients block SVG and WebP).

## Configuration (secrets are never committed)

Changes to environment variables apply to the next deployment, so redeploy after changing them. Set these in Cloudflare Pages: **Settings > Variables and secrets** (use *Secret* for the key), for Production and Preview.

| Name | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | yes (secret) | Resend API key. Use a key restricted to sending. |
| `CONTACT_FROM` | no | Sender. Defaults to `coldchainOS <bull@coldchainos.org>`. Resend only sends from a domain verified in its dashboard (`coldchainos.org` is). |
| `CONTACT_TO` | no | Recipient. Defaults to `bull@coldchainos.org`. |
| `CONTACT_AUTO_REPLY` | no | Set to `false` to turn off the confirmation email. |
| `CONTACT_ALLOWED_ORIGINS` | no | Extra allowed origins (for example a preview URL), comma-separated. |

Until `RESEND_API_KEY` is set, the form returns a graceful "not configured, please email bull@coldchainos.org" message and sends nothing.

For local work with `wrangler pages dev`, copy `.dev.vars.example` to `.dev.vars` (git-ignored). If a key is ever pasted into chat, a ticket or a commit, rotate it in Resend.

## Abuse and privacy model

- Browser-side and server-side validation share one module (`functions/_lib/validate.ts`).
- Honeypot field and a minimum-fill-time check; bots get a silent `200` and nothing is sent.
- The request must come from an allowed origin and be JSON; bodies over 20 KB are refused.
- CR/LF and control characters are stripped from single-line fields (email-header injection). All user text is HTML-escaped in the emails.
- Provider errors are logged by status code only. Message content and the API key are never logged or returned.
- The site stores nothing. Resend processes the email and keeps its own delivery logs.
- The form is plain email: no attachments, not a secured channel, and the page says so.

## Residual risk and recommended hardening

An open form that sends a confirmation email can be used to send one unwanted email to an arbitrary address. The traps and the minimal confirmation reduce this but do not eliminate it. Recommended, as dashboard configuration:

- A Cloudflare rate-limiting rule on `POST /api/contact` (for example a handful of requests per IP per minute).
- Cloudflare Turnstile on the form (needs a site key and secret) if spam appears.
- Set `CONTACT_AUTO_REPLY=false` if confirmation emails are abused.

## Tests

`src/contact.test.ts` covers validation, origin and method checks, bot traps, header-injection stripping, HTML escaping, missing configuration, provider failure, that the confirmation never echoes the message, that the API key never appears in a payload, and that both emails carry the logo, the Bull and the owner attribution.
