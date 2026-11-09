#!/usr/bin/env python3
"""Build public/data/cre-samples.json from a local copy of the bakery-cre eval files.

usage: python3 scripts/build-samples.py <dir with underwriting.jsonl, rent_roll.jsonl...> <menu.json>

Selection is deliberately conservative: cold-storage facilities only, no real company
names, verification_score >= 89, one record per city. Each underwriting record is also
re-checked here (revenue, vacancy loss, EGI) so the site can show the math was verified,
or that it was not.
"""
import json, re, sys, hashlib
from pathlib import Path

src, manifest = Path(sys.argv[1]), json.load(open(sys.argv[2]))
BRANDS = re.compile(r'fedex|amazon|lineage|americold|\bups\b|walmart|sysco|us foods|kroger|target|costco|nestl|'
                    r'tyson|kraft|conagra|hormel|prologis|blackstone|dhl|xpo|preferred freezer|nfi|ryder|publix|'
                    r'whole foods|aldi|pepsi|coca|procter|p&g|cold storage co', re.I)
COLD = re.compile(r'cold storage facility', re.I)
money = lambda s: int(round(float(s.replace(',', ''))))

def recheck(user, out):
    """Recompute PGI, vacancy loss, EGI from the prompt; compare to the stated answer."""
    tenants = re.findall(r':\s*([\d,]+)\s*SF at \$([\d.]+)/SF', user)
    vac = re.search(r'Vacancy:\s*([\d.]+)%', user)
    if not tenants or not vac:
        return None
    pgi = sum(int(s.replace(',', '')) * float(r) for s, r in tenants)
    vloss = pgi * float(vac.group(1)) / 100
    exp = {'PGI': round(pgi), 'Vacancy loss': round(vloss), 'EGI': round(pgi - vloss)}
    got = {}
    for k, pat in (('PGI', r'PGI:\s*\$([\d,]+)'), ('Vacancy loss', r'Vacancy loss[^:]*:\s*\$([\d,]+)'), ('EGI', r'EGI:\s*\$([\d,]+)')):
        m = re.search(pat, out)
        if not m:
            return None
        got[k] = money(m.group(1))
    return [{'line': k, 'stated': got[k], 'recomputed': exp[k], 'ok': abs(got[k] - exp[k]) <= 1} for k in exp]

def sanity(out):
    """Plain-sense flags the arithmetic re-check does not cover."""
    flags = []
    noi = re.search(r'NOI:\s*\$(-?[\d,]+)', out)
    val = re.search(r'Value:\s*\$(-?[\d,]+)', out)
    if noi and noi.group(1).startswith('-'):
        flags.append('Negative NOI reported')
    if val and val.group(1).startswith('-'):
        flags.append('Negative property value reported')
    return flags

rows = [json.loads(l) for l in open(src / 'underwriting.jsonl')]
rows = [r for r in rows
        if COLD.search(r['messages'][1]['content']) and not BRANDS.search(json.dumps(r['messages']))
        and r['verification_score'] >= 89 and len(r['messages']) == 3]
rows.sort(key=lambda r: (-r['verification_score'], r['cell_id']))

picked, cities, prose = [], set(), 0
for r in rows:
    u = r['messages'][1]['content']
    city = re.search(r' in ([^.\n]+?)\.', u)
    city = city.group(1) if city else r['cell_id']
    is_prose = not u.startswith('Perform a complete underwriting')
    if city in cities: continue
    if is_prose:
        if prose >= 3: continue
        prose += 1
    elif sum(1 for p in picked if not p['prose']) >= 7:
        continue
    check = None if is_prose else recheck(u, r['messages'][2]['content'])
    if not is_prose and check is None: continue
    cities.add(city)
    picked.append({
        'id': r['cell_id'], 'category': r['task_type'], 'grade': r['grade'], 'prose': is_prose,
        'verification_score': r['verification_score'], 'gates': r['gate_results'],
        'fingerprint': r['fingerprint'],
        'messages': r['messages'], 'recheck': check,
        'flags': [] if is_prose else sanity(r['messages'][2]['content']),
    })
    if len(picked) >= 10: break

cre = manifest['domains']['cre']
out = {
    'meta': {
        'package': manifest['package'], 'generated': manifest['generated'],
        'source_rows': manifest['source']['rows'], 'cre_rows': cre['rows'],
        'royal_jelly_rows': cre['royal_jelly']['rows'],
        'source_sha256': manifest['source']['sha256'],
        # from dataset.card.md (bucket counts sum to source_rows)
        'buckets': [['In-domain CRE', 706915], ['Eval split', 3539], ['Off-domain', 98731], ['Quarantined', 912]],
        'categories': [['Underwriting', 271094], ['Comp analysis', 102252], ['Valuation', 92990], ['Tax assessment', 74913],
                       ['Rent roll', 56519], ['Debt analysis', 42190], ['Capital markets', 25818], ['New economy', 19911],
                       ['1031 exchange', 18665]],
        'gates': ['length', 'json', 'concepts', 'numeric', 'degenerate', 'relevance'],
        'origin': 'Model-generated training data (lineage gen_model: various). Not extracted from real transactions.',
        'selection': 'Eval-split rows; cold-storage facilities; real company names excluded; score >= 89; one per city.',
    },
    'records': picked,
}
Path('public/data/cre-samples.json').write_text(json.dumps(out, indent=1, ensure_ascii=False) + '\n')
print(len(picked), 'records;', sum(1 for p in picked if p['recheck'] and not all(c['ok'] for c in p['recheck'])), 'with recheck mismatches')
