"""Tag chapters, de-duplicate and write the app's offline question bank (src/data/bank.json)."""
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from chapters import tag  # noqa: E402

sys.stdout.reconfigure(encoding='utf-8')
HERE = Path(__file__).parent
OUT = Path(sys.argv[1])

raw = []
# Board papers first so they win de-duplication; the progress file has every finished set, even mid-run.
progress = HERE / 'board_progress.jsonl'
if progress.exists():
    for line in progress.read_text(encoding='utf-8').splitlines():
        if line.strip():
            raw += json.loads(line)['records']
p = HERE / 'raw_sqp.json'
if p.exists():
    raw += json.loads(p.read_text(encoding='utf-8'))


FOOTER = re.compile(r'(?im)^\s*\d{0,3}\s*[^\n]{0,60}\b(?:SQP|sample question paper|marking scheme)\b[^\n]{0,20}\d{4}\s*-\s*\d{2,4}\s*$|^\s*page\s*\d+\s*(?:of\s*\d+)?\s*$')
INLINE_FOOTER = re.compile(r'\s*\d{1,3}\s+[A-Z][A-Za-z ]{2,40}\b(?:X|XII)\b\s+SQP\s*\d{4}-\d{2}\s*')


def tidy(text: str) -> str:
    text = FOOTER.sub('', text)  # page headers / footers that slipped into the text
    text = INLINE_FOOTER.sub(' ', text)
    text = text.replace('$', '＄')  # "$" would start KaTeX maths in the app
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


def key(q: str) -> str:
    return re.sub(r'[^a-z0-9]+', '', q.lower())[:160]


GARBLE = set('{}`~¡§©«±¥^＄$') | {'Ë', 'Ý', 'Ÿ', 'à', 'ñ', 'Û', 'Ü', 'Õ', 'Ô', '‹'}
LETTER_IN_EXPLANATION = re.compile(r'\(\s*([A-Da-d])\s*\)|^\s*([A-D])\s*[.)/]', re.M)


def garbled(text: str, code: bool = False) -> bool:
    """Hindi typed in legacy (non-Unicode) fonts extracts as symbol soup like 'H$m~m}{Zb'.
    Underscores (blanks) and bars (|A|) are normal; braces are normal in Computer Science code."""
    if not text:
        return False
    chars = GARBLE - set('{}') if code else GARBLE
    odd = sum(1 for ch in text if ch in chars)
    if odd / max(1, len(text)) > 0.02:
        return True
    return not code and bool(re.search(r'[A-Za-z][{}`~$]|[{}`~$][A-Za-z]', text))


def letter_conflict(r: dict) -> bool:
    """An MCQ whose explanation names a different option letter than its answer is mis-parsed."""
    if r['type'] == 'descriptive':
        return False
    letters = {(m.group(1) or m.group(2)).upper() for m in LETTER_IN_EXPLANATION.finditer(r.get('answer', ''))}
    return len(letters) == 1 and 'ABCD'.index(letters.pop()) != r['correct']


INSTRUCTION = re.compile(
    r'(?i)^\s*(section\s*[-–]?\s*[a-e]\b.{0,60}(consists|question\s*(number|no)|carry|carrying)|general instructions|'
    r'this question paper (contains|consists|comprises)|all questions are compulsory)')
kept_tokens: dict = defaultdict(list)
dropped = Counter()
seen, bank = set(), []
for r in raw:
    k = (r['cls'], r['subject'], key(r['question']))
    if k in seen or len(k[2]) < 12:
        continue
    if any(garbled(t, r['subject'] == 'Computer Science') for t in [r['question'], r.get('answer', ''), *(r.get('options') or [])]):
        dropped['garbled text'] += 1
        continue
    if letter_conflict(r):
        dropped['answer letter conflict'] += 1
        continue
    if INSTRUCTION.search(r['question']) or key(r['question']) == key(r.get('answer', '')):
        dropped['paper instructions'] += 1  # e.g. "SECTION C consists of 7 short answer questions…"
        continue
    toks = set(re.findall(r'[a-z0-9]{3,}', r['question'].lower()))
    if any(len(toks & t) / max(1, len(toks | t)) > 0.75 for t in kept_tokens[(r['cls'], r['subject'])]):
        dropped['near duplicate'] += 1  # board sets of one exam repeat many questions
        continue
    kept_tokens[(r['cls'], r['subject'])].append(toks)
    if re.match(r'\s*[a-z]{2,}', r['question']) and not re.match(r'\s*(which|what|how|why|when|where|who|name|state|give|find|read|write|explain|in |if |the |a |an )', r['question']):
        dropped['starts mid-sentence'] += 1  # text extraction lost the start of the question
        continue
    if r['type'] != 'descriptive':
        words = re.findall(r'[A-Za-z]{3,}', r.get('answer', ''))
        if len(' '.join(words)) < 0.4 * len(r.get('answer', '').strip()):
            r = {**r, 'answer': ''}  # only symbol fragments: show just the correct option
    seen.add(k)
    probe = ' '.join([r['question'], ' '.join(r.get('options') or []), r.get('answer', '')[:400]])
    chapter = tag(r['cls'], r['subject'], probe)
    rec = {
        'g': 10 if r['cls'] == 'X' else 12,
        's': r['subject'],
        'c': chapter,
        't': r['type'],
        'q': tidy(r['question']),
        'x': tidy(r.get('answer', '')),
        'm': int(r.get('marks') or 1),
        'src': r['paper'] if r['source'] == 'CBSE Board Exam' else f"CBSE {r['paper']}",
        'u': r['qpUrl'],
        'mu': r['msUrl'],
    }
    if r['type'] != 'descriptive':
        rec['o'] = [tidy(o) for o in r['options']]
        rec['a'] = r['correct']
    bank.append(rec)

for i, rec in enumerate(bank):
    rec['id'] = f'b{i}'

OUT.write_text(json.dumps(bank, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
print('dropped:', dict(dropped))
print('bank:', len(bank), 'questions,', round(OUT.stat().st_size / 1024), 'KB')
print('types:', dict(Counter(r['t'] for r in bank)))
print('chapter tagged:', sum(1 for r in bank if r['c']), '/', len(bank))
by = defaultdict(Counter)
for r in bank:
    by[(r['g'], r['s'])][r['c'] or '(mixed)'] += 1
for (g, s), cnt in sorted(by.items()):
    print(f'Class {g} {s}: {sum(cnt.values())}  ' + ', '.join(f'{c[:22]}={n}' for c, n in cnt.most_common()))
