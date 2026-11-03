"""Build the CBSE previous-year board paper catalogue (question paper + marking scheme) from cbse.gov.in pages."""
import html
import json
import re
import sys
from pathlib import Path
from urllib.parse import quote, urljoin

sys.stdout.reconfigure(encoding='utf-8')
qp_html = Path(sys.argv[1]).read_text(encoding='utf-8', errors='ignore')
ms_html = Path(sys.argv[2]).read_text(encoding='utf-8', errors='ignore')
out = Path(sys.argv[3])
BASE = 'https://www.cbse.gov.in/cbsenew/'
LINK = re.compile(r'href="((?:question-paper|marking-scheme|Marking-Scheme)/(\d{4})(-COMPTT)?/(X|XII)/[^"]+\.(?:zip|pdf))"', re.I)


def norm(name: str) -> str:
    n = re.sub(r'\(.*?\)', ' ', name.upper())
    n = re.sub(r'\b(CODE|NO)\b', ' ', n)
    n = re.sub(r'[^A-Z]+', ' ', n)
    n = n.replace('MATHS', 'MATHEMATICS').replace('STD', 'STANDARD').replace('POLTICAL', 'POLITICAL')
    return ' '.join(n.split())


def rows(page: str):
    page = re.sub(r'<!--.*?-->', '', page, flags=re.S)
    for tr in re.findall(r'<tr[^>]*>(.*?)</tr>', page, flags=re.S | re.I):
        cells = re.findall(r'<td[^>]*>(.*?)</td>', tr, flags=re.S | re.I)
        if len(cells) < 2:
            continue
        m = LINK.search(tr)
        if not m:
            continue
        subject = re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', cells[0]))).strip()
        if not subject:
            continue
        url = urljoin(BASE, quote(m.group(1), safe='/-_.&'))
        yield {
            'year': int(m.group(2)), 'compartment': bool(m.group(3)), 'cls': m.group(4).upper(),
            'subject': subject.title() if subject.isupper() else subject, 'key': norm(subject), 'url': url,
        }


qps = list(rows(qp_html))
ms_rows = list(rows(ms_html))
mss = {(r['year'], r['compartment'], r['cls'], r['key']): r['url'] for r in ms_rows}
STOP = {'AND', 'OF', 'THE', 'LANGUAGE', 'LANGAUGE', 'MS', 'COURSE'}


def fuzzy(k):
    """Best same-exam marking scheme whose name shares most words (CBSE spells names differently per page)."""
    year, comp, cls, key = k
    words = set(key.split()) - STOP
    best, best_score = None, 0.0
    for r in ms_rows:
        if (r['year'], r['compartment'], r['cls']) != (year, comp, cls):
            continue
        other = set(r['key'].split()) - STOP
        if not words or not other:
            continue
        score = len(words & other) / len(words | other)
        if score > best_score:
            best, best_score = r['url'], score
    return best if best_score >= 0.75 else None  # strict, so e.g. two Hindustani Music papers are not swapped
catalog, seen = [], set()
for r in qps:
    k = (r['year'], r['compartment'], r['cls'], r['key'])
    if k in seen:
        continue
    seen.add(k)
    catalog.append({'year': r['year'], 'exam': 'Compartment' if r['compartment'] else 'Main', 'cls': r['cls'],
                    'subject': r['subject'], 'key': r['key'], 'qp': r['url'], 'ms': mss.get(k) or fuzzy(k)})

# 2026: CBSE published one question-paper zip for both Maths papers but separate marking schemes.
for c in [c for c in catalog if c['key'] == 'MATHEMATICS BASIC AND MATHEMATICS STANDARD']:
    catalog.remove(c)
    for variant in ('BASIC', 'STANDARD'):
        k = (c['year'], c['exam'] == 'Compartment', c['cls'], f'MATHEMATICS {variant}')
        catalog.append({**c, 'subject': f'Mathematics {variant.title()}', 'key': k[3], 'ms': mss.get(k)})
for c in catalog:
    c.pop('key', None)

catalog.sort(key=lambda c: (-c['year'], c['exam'] != 'Main', c['cls'], c['subject']))
out.write_text(json.dumps(catalog, ensure_ascii=False, indent=1), encoding='utf-8')
print(len(catalog), 'papers;', sum(1 for c in catalog if c['ms']), 'with marking scheme')
for y in range(2026, 2021, -1):
    for ex in ('Main', 'Compartment'):
        sel = [c for c in catalog if c['year'] == y and c['exam'] == ex]
        print(y, ex, len(sel), 'with MS:', sum(1 for c in sel if c['ms']))
print([c['subject'] for c in catalog if c['year'] == 2025 and c['cls'] == 'X' and c['exam'] == 'Main'][:40])
