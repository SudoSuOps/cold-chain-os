// Scaffold a draft from the template: npm run digest:new -- [YYYY-MM-DD]
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
const date = process.argv[2] ?? new Date().toISOString().slice(0, 10)
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { console.error('date must be YYYY-MM-DD'); process.exit(1) }
const dest = `content/digest/${date}.json`
if (existsSync(dest)) { console.error(`${dest} already exists`); process.exit(1) }
copyFileSync('content/digest/_template.json', dest)
writeFileSync(dest, readFileSync(dest, 'utf8').replaceAll('YYYY-MM-DD', date))
console.log(`created ${dest} (status: draft)`)
