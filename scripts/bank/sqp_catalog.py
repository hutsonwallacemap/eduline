"""Extract subject -> SQP / marking-scheme PDF links from saved cbseacademic.nic.in SQP pages."""
import html
import json
import re
import sys
from pathlib import Path
from urllib.parse import urljoin

sys.stdout.reconfigure(encoding='utf-8')
here = Path(sys.argv[1])
out_path = Path(sys.argv[2])
BASE = 'https://cbseacademic.nic.in/'

rows_out = []
for cls in ('X', 'XII'):
    for session in ('2026-27', '2025-26', '2024-25', '2023-24'):
        page = (here / f'SQP_{cls}_{session}.html').read_text(encoding='utf-8', errors='ignore')
        page = re.sub(r'<!--.*?-->', '', page, flags=re.S)  # drop commented-out links
        for tr in re.findall(r'<tr[^>]*>(.*?)</tr>', page, flags=re.S | re.I):
            cells = re.findall(r'<td[^>]*>(.*?)</td>', tr, flags=re.S | re.I)
            if len(cells) < 3:
                continue
            subject = html.unescape(re.sub(r'<[^>]+>', ' ', cells[0]))
            subject = re.sub(r'\s+', ' ', subject).strip()
            links = lambda c: [urljoin(BASE, h.strip()) for h in re.findall(r'href="([^"]+\.pdf)"', c, flags=re.I)]
            sqp, ms = links(cells[1]), links(cells[2])
            if not subject or not (sqp or ms):
                continue
            sqp = [u for u in sqp if not u.lower().endswith('/error.pdf')]  # CBSE placeholder for missing papers
            ms = [u for u in ms if not u.lower().endswith('/error.pdf')]
            if not (sqp or ms):
                continue
            pick = lambda ls, hindi: next((u for u in ls if ('_hi' in u.lower()) == hindi), None)
            rows_out.append({
                'cls': cls,
                'session': session,
                'subject': subject,
                'sqp': pick(sqp, False) or (sqp[0] if sqp else None),
                'ms': pick(ms, False) or (ms[0] if ms else None),
                'sqpHindi': pick(sqp, True),
                'msHindi': pick(ms, True),
            })

out_path.write_text(json.dumps(rows_out, ensure_ascii=False, indent=1), encoding='utf-8')
for cls in ('X', 'XII'):
    for session in ('2026-27', '2025-26', '2024-25', '2023-24'):
        n = sum(1 for r in rows_out if r['cls'] == cls and r['session'] == session)
        print(cls, session, n)
print('sample:', rows_out[0])
print('missing sqp:', sum(1 for r in rows_out if not r['sqp']), 'missing ms:', sum(1 for r in rows_out if not r['ms']))
