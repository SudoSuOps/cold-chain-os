import { handleContact, type Env } from '../_lib/handler.ts'

// Cloudflare Pages Function: POST /api/contact
// Secrets (RESEND_API_KEY) come from the environment. They are never in the repository or the browser bundle.
type Ctx = { request: Request; env: Env }
export const onRequestPost = ({ request, env }: Ctx) => handleContact(request, env)
export const onRequest = () => new Response(JSON.stringify({ ok: false, error: 'Method not allowed.' }), { status: 405, headers: { 'content-type': 'application/json', allow: 'POST' } })
