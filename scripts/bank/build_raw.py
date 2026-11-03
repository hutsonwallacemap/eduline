"""Build raw question records from CBSE sample papers (SQP) and board papers (2022-2026), with official answers."""
import io
import threading
import json
import logging
import re
import sys
import urllib.request
import zipfile
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from pypdf import PdfReader

sys.path.insert(0, str(Path(__file__).parent))
from parse import parse_doc  # noqa: E402

logging.disable(logging.WARNING)
sys.stdout.reconfigure(encoding='utf-8')
HERE = Path(__file__).parent
APP = Path(sys.argv[1])  # edugenie-ai folder
UA = {'User-Agent': 'Mozilla/5.0'}
LOCK = threading.Lock()


def pdf_text(data: bytes, mode: str) -> str:
    reader = PdfReader(io.BytesIO(data))
    out = []
    for page in reader.pages:
        try:
            out.append((page.extract_text(extraction_mode='layout') if mode == 'layout' else page.extract_text()) or '')
        except Exception:  # noqa: BLE001
            out.append('')
    return '\n'.join(out)


def best_parse(qp: bytes, ms: bytes) -> list[dict]:
    best: list[dict] = []
    for mode in ('plain', 'layout'):
        if mode == 'layout' and len(best) >= 8:
            break  # layout mode is slow; only needed when plain text extraction fails
        try:
            got = parse_doc(pdf_text(qp, mode), pdf_text(ms, mode))
        except Exception as e:  # noqa: BLE001
            print('parse error', e)
            continue
        if len(got) > len(best):
            best = got
    return best


# ---------- Sample papers (already downloaded by download_sqp.py) ----------

def sqp_records() -> list[dict]:
    docs = json.loads((HERE / 'sqp' / 'sqp_docs.json').read_text(encoding='utf-8'))
    out = []

    def one(d):
        stem = f"SQP_{d['cls']}_{d['year']}_{d['cbseSubject']}".replace(' ', '_').replace('(', '').replace(')', '').replace('&', 'and')
        qp = (HERE / 'sqp' / f'{stem}.qp.pdf').read_bytes()
        ms = (HERE / 'sqp' / f'{stem}.ms.pdf').read_bytes()
        qs = best_parse(qp, ms)
        meta = {'source': 'CBSE Sample Paper', 'paper': f"SQP {d['year']}", 'cls': d['cls'], 'subject': d['subject'],
                'cbseSubject': d['cbseSubject'], 'qpUrl': d['qpUrl'], 'msUrl': d['msUrl']}
        print(f"SQP {d['cls']} {d['year']} {d['cbseSubject'][:24]:24} {len(qs)}")
        return [{**meta, **q} for q in qs]

    with ThreadPoolExecutor(6) as ex:
        for recs in ex.map(one, docs):
            out.extend(recs)
    return out


# ---------- Board papers: read only the needed members of large zips via HTTP ranges ----------

class RangeFile(io.RawIOBase):
    """Seekable read-only view of a remote file using HTTP Range requests, with a small read-ahead cache."""

    CHUNK = 8 * 1024 * 1024

    def __init__(self, url: str):
        self.url, self.pos = url, 0
        req = urllib.request.Request(url, headers={**UA, 'Range': 'bytes=0-0'})
        with urllib.request.urlopen(req, timeout=120) as r:
            self.size = int(r.headers['Content-Range'].split('/')[-1])
        self.cache_start, self.cache = -1, b''

    def seekable(self):
        return True

    def readable(self):
        return True

    def tell(self):
        return self.pos

    def seek(self, offset, whence=0):
        self.pos = offset if whence == 0 else self.pos + offset if whence == 1 else self.size + offset
        return self.pos

    def _fetch(self, start, end):
        req = urllib.request.Request(self.url, headers={**UA, 'Range': f'bytes={start}-{end - 1}'})
        with urllib.request.urlopen(req, timeout=180) as r:
            return r.read()

    def read(self, n=-1):
        if n is None or n < 0:
            n = self.size - self.pos
        n = min(n, self.size - self.pos)
        if n <= 0:
            return b''
        if not (self.cache_start <= self.pos and self.pos + n <= self.cache_start + len(self.cache)):
            end = min(self.size, self.pos + max(n, self.CHUNK))
            self.cache_start, self.cache = self.pos, self._fetch(self.pos, end)
        off = self.pos - self.cache_start
        data = self.cache[off:off + n]
        self.pos += len(data)
        return data

    def readinto(self, b):
        data = self.read(len(b))
        b[:len(data)] = data
        return len(data)


# Board catalogue subject name (lower-case, normalised) -> app subject, per class.
BOARD_SUBJECTS = {
    'X': [(r'^science$', 'Science'), (r'^social science$', 'Social Science'), (r'^mathematics (standard|basic)$', 'Mathematics'),
          (r'^english (literature|language and literature|lang\w* and lit\w*)$', 'English')],
    'XII': [(r'^physics$', 'Physics'), (r'^chemistry$', 'Chemistry'), (r'^mathematics$', 'Mathematics'), (r'^biology$', 'Biology'),
            (r'^accountancy$', 'Accountancy'), (r'^business studies$', 'Business Studies'), (r'^economics$', 'Economics'),
            (r'^applied math(ematics|s)?$', 'Applied Mathematics'), (r'^history$', 'History'),
            (r'^pol(i)?tical science$', 'Political Science'), (r'^geography$', 'Geography'),
            (r'^computer science( new)?$', 'Computer Science'), (r'^english core$', 'English')],
}


def app_subject(cls: str, name: str) -> str | None:
    n = re.sub(r'[^a-z ]+', ' ', name.lower().replace('&', ' and '))
    n = ' '.join(n.split())
    for pat, app in BOARD_SUBJECTS[cls]:
        if re.match(pat, n):
            return app
    return None


GROUP = re.compile(r'(?<!\d)(\d{1,3})\s*[-_/ ]\s*(\d{1,2})\s*[-_/ ]\s*1(?!\d)')


def group_key(name: str):
    m = GROUP.search(Path(name).name)
    return (int(m.group(1)), int(m.group(2))) if m else None


DONE = HERE / 'board_progress.jsonl'  # one line per finished set, so a restart resumes


def board_one(c: dict, done_keys: set[str]) -> list[tuple[str, list[dict]]]:
    """Read up to two sets of one subject's board paper; returns (progress key, records) per new set. Runs in a worker process."""
    app = app_subject(c['cls'], c['subject'])
    try:
        qz = zipfile.ZipFile(RangeFile(c['qp'])) if c['qp'].lower().endswith('.zip') else None
        mz = zipfile.ZipFile(RangeFile(c['ms'])) if c['ms'].lower().endswith('.zip') else None
    except Exception as e:  # noqa: BLE001
        print('ZIP FAIL', c['year'], c['subject'], e, flush=True)
        return []
    if not qz or not mz:
        return []
    qps, mss = {}, {}
    for info in qz.infolist():
        k = group_key(info.filename)
        if k and info.filename.lower().endswith('.pdf') and k not in qps and 'impaired' not in info.filename.lower():
            qps[k] = info
    for info in mz.infolist():
        low = info.filename.lower()
        if not low.endswith('.pdf') or 'hindi' in low:
            continue
        k = group_key(info.filename)
        if k and k not in mss:
            mss[k] = info
    out = []
    for k in sorted(set(qps) & set(mss))[:2]:
        set_code = f'{k[0]}/{k[1]}/1'
        done_key = f"{c['cls']}|{c['year']}|{c['subject']}|{set_code}"
        if done_key in done_keys:
            continue
        try:
            qp, ms = qz.read(qps[k]), mz.read(mss[k])
        except Exception as e:  # noqa: BLE001
            print('READ FAIL', c['year'], c['subject'], k, e, flush=True)
            continue
        qs = best_parse(qp, ms)
        meta = {'source': 'CBSE Board Exam', 'paper': f"Board {c['year']} · Set {set_code}", 'cls': c['cls'], 'subject': app,
                'cbseSubject': c['subject'], 'qpUrl': c['qp'], 'msUrl': c['ms']}
        out.append((done_key, [{**meta, **q} for q in qs]))
        print(f"BOARD {c['cls']} {c['year']} {c['subject'][:24]:24} set {set_code}: {len(qs)}", flush=True)
    return out


def board_records() -> list[dict]:
    from concurrent.futures import ProcessPoolExecutor, as_completed
    done: dict[str, list[dict]] = {}
    if DONE.exists():
        for line in DONE.read_text(encoding='utf-8').splitlines():
            row = json.loads(line)
            done[row['key']] = row['records']
    catalog = json.loads((APP / 'src' / 'data' / 'cbseBoardPapers.json').read_text(encoding='utf-8'))
    jobs = [c for c in catalog if c['exam'] == 'Main' and c['ms'] and app_subject(c['cls'], c['subject'])]
    print('board papers to read:', len(jobs), '· sets already done:', len(done), flush=True)
    keys = set(done)
    with ProcessPoolExecutor(10) as ex:
        futures = [ex.submit(board_one, c, keys) for c in jobs]
        for f in as_completed(futures):
            try:
                results = f.result()
            except Exception as e:  # noqa: BLE001
                print('JOB FAIL', e, flush=True)
                continue
            with DONE.open('a', encoding='utf-8') as fh:
                for key, recs in results:
                    done[key] = recs
                    fh.write(json.dumps({'key': key, 'records': recs}, ensure_ascii=False) + '\n')
    return [r for recs in done.values() for r in recs]


if __name__ == '__main__':
    which = sys.argv[2] if len(sys.argv) > 2 else 'all'
    if which in ('all', 'sqp'):
        s = sqp_records()
        (HERE / 'raw_sqp.json').write_text(json.dumps(s, ensure_ascii=False), encoding='utf-8')
        print('SQP questions:', len(s))
    if which in ('all', 'board'):
        b = board_records()
        (HERE / 'raw_board.json').write_text(json.dumps(b, ensure_ascii=False), encoding='utf-8')
        print('Board questions:', len(b))
