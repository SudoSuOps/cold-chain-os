// Validate every digest post (drafts included). Exits non-zero on any problem.
import { loadAll, validatePost } from './digest-lib.mjs'
const all = loadAll()
let errors = []
for (const { file, post } of all) errors.push(...validatePost(post, file))
const dates = all.map((a) => a.post.date)
if (new Set(dates).size !== dates.length) errors.push('duplicate post dates')
const pub = all.filter((a) => a.post.status === 'published').length
console.log(`digest: ${all.length} post(s), ${pub} published, ${all.length - pub} draft`)
if (errors.length) { errors.forEach((e) => console.log('FAIL ' + e)); console.log(`${errors.length} problem(s)`); process.exit(1) }
console.log('digest check passed')
