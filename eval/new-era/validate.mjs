// Minimal, dependency-free validator for eval/new-era. Supports the JSON Schema subset the schema uses.
export function validateAgainstSchema(value, schema, path = '$') {
  const errors = []
  const types = Array.isArray(schema.type) ? schema.type : schema.type ? [schema.type] : null
  const actual = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value
  if (types && !types.includes(actual) && !(actual === 'number' && types.includes('integer') && Number.isInteger(value))) {
    return [`${path}: expected ${types.join('|')}, got ${actual}`]
  }
  if (schema.enum && !schema.enum.includes(value)) errors.push(`${path}: ${JSON.stringify(value)} not in enum`)
  if (typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) errors.push(`${path}: shorter than ${schema.minLength}`)
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) errors.push(`${path}: does not match ${schema.pattern}`)
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) errors.push(`${path}: fewer than ${schema.minItems} items`)
    if (schema.items) value.forEach((v, i) => errors.push(...validateAgainstSchema(v, schema.items, `${path}[${i}]`)))
  }
  if (actual === 'object' && value !== null) {
    for (const k of schema.required ?? []) if (!(k in value)) errors.push(`${path}: missing required "${k}"`)
    if (schema.additionalProperties === false) {
      for (const k of Object.keys(value)) if (!(k in (schema.properties ?? {}))) errors.push(`${path}: unexpected property "${k}"`)
    }
    for (const [k, sub] of Object.entries(schema.properties ?? {})) if (k in value) errors.push(...validateAgainstSchema(value[k], sub, `${path}.${k}`))
  }
  return errors
}

/** Recompute a case's calculation deterministically. Returns the number, or null when there is no calculation. */
export function recompute(calc) {
  if (!calc) return null
  const vals = Object.values(calc.inputs)
  if (calc.kind === 'product') return vals.reduce((a, b) => a * b, 1)
  if (calc.kind === 'min') return Math.min(...vals)
  throw new Error(`unknown calculation kind ${calc.kind}`)
}

/** Cross-field rules the schema cannot express. */
export function checkCase(c) {
  const errors = []
  if (c.answer_type === 'computed' && !c.calculation) errors.push(`${c.case_id}: computed answer needs a calculation`)
  if (c.calculation) {
    const r = recompute(c.calculation)
    if (Math.abs(r - c.calculation.result) > 1e-9 * Math.max(1, Math.abs(r))) errors.push(`${c.case_id}: calculation result ${c.calculation.result} != recomputed ${r}`)
  }
  if (c.label_status === 'expert_reviewed') errors.push(`${c.case_id}: expert_reviewed requires a review record, which this repository does not have yet`)
  if (c.answer_type === 'reject_instruction' && !c.unsupported_claims_to_reject.length) errors.push(`${c.case_id}: reject_instruction needs claims to reject`)
  return errors
}

/** Related source families must stay in one split. */
export function checkSplits(cases) {
  const errors = []
  const seen = new Map()
  for (const c of cases) {
    if (seen.has(c.source_family) && seen.get(c.source_family) !== c.split) errors.push(`family "${c.source_family}" spans splits ${seen.get(c.source_family)} and ${c.split}`)
    seen.set(c.source_family, c.split)
  }
  const ids = cases.map((c) => c.case_id)
  if (new Set(ids).size !== ids.length) errors.push('duplicate case_id')
  return errors
}
