export type Label = 'public' | 'illustrative' | 'founder' | 'planned' | 'hypothesis'
export interface DigestSource { id: string; publisher: string; title: string; url: string; published: string; accessed: string; scope: string; kind: string; qualification: string; verification: 'primary' | 'secondary_only' | 'user_supplied'; verification_note?: string }
export interface DigestItem { id: string; headline: string; label: Label; what_happened: string; why_it_matters: string; not_established: string; review_question: string; source_ids: string[] }
export interface DigestPost { schema_version: 1; date: string; status: 'draft' | 'published'; title: string; seo_title: string; summary: string; takeaway: string; tags: string[]; published_at: string; updated_at?: string; method: string; items: DigestItem[]; sources: DigestSource[] }
export interface DigestSummary { date: string; title: string; summary: string; takeaway: string; tags: string[]; published_at: string; items: number; sources: number }
export interface DigestNav { date: string; title: string }

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
/** "2026-11-09" -> "Nov 9, 2026". Pure string math, so server and client always agree. */
export const prettyDate = (d: string) => { const [y, m, day] = d.split('-').map(Number); return `${MONTHS[m - 1]} ${day}, ${y}` }
