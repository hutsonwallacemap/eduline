"""Download SQP + MS PDFs for core subjects and extract their text."""
import json
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from pypdf import PdfReader

sys.stdout.reconfigure(encoding='utf-8')
catalog = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
out = Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)

# CBSE subject name -> app subject name
CORE = {
    'X': {
        'Science': 'Science',
        'Mathematics (Standard)': 'Mathematics',
        'Mathematics (Basic)': 'Mathematics',
        'Social Science': 'Social Science',
        'English (Language & Literature)': 'English',
    },
    'XII': {
        'Physics': 'Physics', 'Chemistry': 'Chemistry', 'Mathematics': 'Mathematics', 'Biology': 'Biology',
        'Accountancy': 'Accountancy', 'Business Studies': 'Business Studies', 'Economics': 'Economics',
        'Applied Mathematics': 'Applied Mathematics', 'History': 'History', 'Political Science': 'Political Science',
        'Geography': 'Geography', 'Computer Science': 'Computer Science', 'English Core': 'English',
    },
}


def fetch(url: str, dest: Path) -> bool:
    if dest.exists() and dest.stat().st_size > 1000:
        return True
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=90) as r:
            dest.write_bytes(r.read())
        return True
    except Exception as e:  # noqa: BLE001
        print('FAIL', url, e)
        return False


def text_of(pdf: Path) -> str:
    try:
        return '\n'.join(p.extract_text() or '' for p in PdfReader(str(pdf)).pages)
    except Exception as e:  # noqa: BLE001
        print('PDF FAIL', pdf.name, e)
        return ''


jobs = []
for p in catalog:
    app = CORE.get(p['cls'], {}).get(p['subject'])
    if not app or not p['sqp'] or not p['ms']:
        continue
    stem = f"SQP_{p['cls']}_{p['session']}_{p['subject']}".replace(' ', '_').replace('(', '').replace(')', '').replace('&', 'and')
    jobs.append((p, app, stem))


def run(job):
    p, app, stem = job
    ok = fetch(p['sqp'], out / f'{stem}.qp.pdf') and fetch(p['ms'], out / f'{stem}.ms.pdf')
    if not ok:
        return None
    return {
        'source': 'SQP', 'cls': p['cls'], 'year': p['session'], 'cbseSubject': p['subject'], 'subject': app,
        'qpUrl': p['sqp'], 'msUrl': p['ms'],
        'qp': text_of(out / f'{stem}.qp.pdf'), 'ms': text_of(out / f'{stem}.ms.pdf'),
    }


with ThreadPoolExecutor(8) as ex:
    docs = [d for d in ex.map(run, jobs) if d]
(out / 'sqp_docs.json').write_text(json.dumps(docs, ensure_ascii=False), encoding='utf-8')
print(len(jobs), 'jobs ->', len(docs), 'docs')
