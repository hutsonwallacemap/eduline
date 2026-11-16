"""Find NCERT Class 12 Arts textbook chapter PDFs and read each chapter's title from its first page."""
import io
import json
import re
import sys
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from pypdf import PdfReader

sys.stdout.reconfigure(encoding='utf-8')
OUT = Path(sys.argv[1])
UA = {'User-Agent': 'Mozilla/5.0'}

BOOKS = {
    'lehs1': ('History', 'Themes in Indian History I'),
    'lehs2': ('History', 'Themes in Indian History II'),
    'lehs3': ('History', 'Themes in Indian History III'),
    'leps1': ('Political Science', 'Contemporary World Politics'),
    'leps2': ('Political Science', 'Politics in India since Independence'),
    'legy1': ('Geography', 'Fundamentals of Human Geography'),
    'legy2': ('Geography', 'India: People and Economy'),
    'leec1': ('Economics', 'Introductory Microeconomics?'),
    'leec2': ('Economics', 'Introductory Macroeconomics'),
    'keec1': ('Economics', 'Indian Economic Development'),
    'lefl1': ('English', 'Flamingo'),
    'levt1': ('English', 'Vistas'),
}


def fetch(url: str) -> bytes | None:
    import time
    for attempt in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120) as r:
                if r.status != 200 or 'pdf' not in r.headers.get('Content-Type', ''):
                    return None
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            time.sleep(2 + attempt * 3)
        except Exception:  # noqa: BLE001
            time.sleep(2 + attempt * 3)
    print('FAILED', url, flush=True)
    return None


def first_lines(data: bytes) -> str:
    try:
        reader = PdfReader(io.BytesIO(data))
        text = (reader.pages[0].extract_text() or '')
        return re.sub(r'\s+', ' ', text)[:300], len(reader.pages)
    except Exception:  # noqa: BLE001
        return '', 0


def probe(code_ch):
    code, ch = code_ch
    url = f'https://ncert.nic.in/textbook/pdf/{code}{ch:02d}.pdf'
    data = fetch(url)
    if not data:
        return None
    text, pages = first_lines(data)
    return {'code': code, 'chapter': ch, 'url': url, 'pages': pages, 'kb': len(data) // 1024, 'firstPage': text}


jobs = [(code, ch) for code in BOOKS for ch in range(1, 16)]
with ThreadPoolExecutor(2) as ex:
    found = [r for r in ex.map(probe, jobs) if r]

for r in found:
    r['subject'], r['book'] = BOOKS[r['code']]
found.sort(key=lambda r: (r['code'], r['chapter']))
OUT.write_text(json.dumps(found, ensure_ascii=False, indent=1), encoding='utf-8')
for code in BOOKS:
    rows = [r for r in found if r['code'] == code]
    print(code, BOOKS[code][1], '->', len(rows), 'chapters')
    for r in rows:
        print(f"   {r['chapter']:2d} p{r['pages']:3d} | {r['firstPage'][:110]}")
