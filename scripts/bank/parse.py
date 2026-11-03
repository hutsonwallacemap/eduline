"""Turn CBSE question-paper + marking-scheme text into structured questions with official answers."""
import re

NOISE = re.compile(
    r'^\s*(\*?please note.*|i\.e\.\s*\d{4}-\d{2}\.?|page\s*\d+\s*(of\s*\d+)?|\d+\s*/\s*\d+|section\s*[-–]?\s*[a-e]\b.*|'
    r'marking scheme.*|class\s*[-–]?\s*x{1,2}i*.*\(\d{4}-\d{2}\).*|sample question paper.*|.*code\s*no\.?\s*\d+.*|'
    r'q\.?\s*no\.?.*marks?.*|[•·]+|\*[\d/]+\*.*|\*[A-Z]+\*|.*\[\s*p\.?\s*t\.?\s*o\.?\s*\].*|#)\s*$',
    re.I,
)
INLINE_OPTIONS = re.compile(r'\(\s*([A-Da-d])\s*\)')
QSTART = re.compile(r'^\s*(?:Q(?:ue)?s?\.?\s*(?:no\.?)?\s*)?(\d{1,2})\s*[.):]?\s+(\S.*)$', re.I)
OPTION = re.compile(r'^\s*(?:\(\s*([a-dA-D])\s*\)|([a-dA-D])\s*[.)])\s*(.+)$')
ANSWER = re.compile(r'^\s*(?:ans(?:wer)?\.?\s*[:\-]?\s*)?(?:option\s*)?(?:\(\s*([a-dA-D])\s*\)|([a-dA-D])\s*[.)]|([a-dA-D])(?=\s|$))', re.I)
FIGURE = re.compile(
    r'\b(figure|fig\.|diagram (?:given|shown|below)|given (?:diagram|figure|graph|map)|graph (?:given|shown)|'
    r'image|picture|map of india|outline map|shown (?:above|below)|following (?:figure|diagram|graph))\b', re.I)
AR = re.compile(r'assertion\s*\(?a\)?', re.I)
REASON = re.compile(r'reason\s*\(?r\)?', re.I)
AR_OPTION_LINE = re.compile(
    r'^\s*(?:\(?[a-dA-D][).]\s*)?(both a and r are (?:true|false)|a is true,? but r is false|a is false,? but r is true)', re.I)
AR_INSTRUCTION = re.compile(
    r'(two statements|assertion\s*\(a\)\s*and\s*(?:a\s*)?reason\s*\(r\)|answer these questions by selecting|'
    r'(select|choose)\s+the\s+(appropriate|correct)\s+(option|answer|code))', re.I)
AR_OPTIONS = [
    'Both A and R are true, and R is the correct explanation of A.',
    'Both A and R are true, but R is not the correct explanation of A.',
    'A is true, but R is false.',
    'A is false, but R is true.',
]
MARKS_LINE = re.compile(r'^\s*\d(?:\.\d)?\s*$')
TRAIL_MARKS = re.compile(r'\s+(?:\d(?:\.\d)?|½)\s*$')


def clean_lines(text: str, paper: bool = False) -> list[str]:
    out = []
    for raw in text.replace('\r', '').split('\n'):
        raw = re.sub(r'[ \t ]{3,}(?:\d|½)(?:\s*\+\s*(?:\d|½))*\s*$', '', raw)  # marks column (layout mode)
        line = re.sub(r'[ \t ]+', ' ', raw).strip()
        if not line or NOISE.match(line):
            continue
        # The shared Assertion-Reason instructions and options sit between questions in the paper.
        if paper and not QSTART.match(line) and (AR_OPTION_LINE.match(line) or AR_INSTRUCTION.search(line)):
            continue
        out.append(line)
    return out


def blocks(text: str, paper: bool = False) -> dict[int, list[str]]:
    """Split text into blocks keyed by question number; numbers must increase by exactly one."""
    result: dict[int, list[str]] = {}
    current = 0
    for line in clean_lines(text, paper):
        m = QSTART.match(line)
        if m and int(m.group(1)) == current + 1:
            current += 1
            result[current] = [m.group(2)]
        elif current:
            result[current].append(line)
    return result


def strip_marks(lines: list[str]) -> tuple[list[str], int | None]:
    marks = None
    kept = []
    for line in lines:
        if MARKS_LINE.match(line):
            marks = marks or max(1, round(float(line)))
            continue
        kept.append(line)
    if kept and marks is None:
        m = TRAIL_MARKS.search(kept[-1])
        if m:
            marks = max(1, round(float(m.group(0).strip().replace('½', '0.5'))))
    return kept, marks


def unfold_inline_options(lines: list[str]) -> list[str]:
    """Board papers print options side by side, e.g. "(A) 8 : 1  (B) 2 : 1" — put each on its own line."""
    out = []
    for line in lines:
        marks = list(INLINE_OPTIONS.finditer(line))
        if len(marks) >= 2 and marks[0].start() == 0:
            for i, m in enumerate(marks):
                end = marks[i + 1].start() if i + 1 < len(marks) else len(line)
                out.append(f'({m.group(1)}) ' + line[m.end():end].strip())
        else:
            out.append(line)
    return out


def residue(lines: list[str], scheme: bool = False) -> bool:
    """True when a block contains leftovers of a figure or table (lines of lone letters/numbers)."""
    for line in lines:
        if OPTION.match(line) or (scheme and re.fullmatch(r'[\d½+\s.]+', line)):
            continue  # marking schemes have lone mark lines like "½ ½"
        tokens = line.split()
        if tokens and all(len(t) <= 2 for t in tokens) and not re.fullmatch(r'(OR|or)', line.strip()):
            return True
    return False


def split_options(lines: list[str]):
    """Return (stem_lines, options) when the block ends in exactly four A–D options, else (lines, None)."""
    stem, opts = [], []
    for line in unfold_inline_options(lines):
        m = OPTION.match(line)
        letter = (m.group(1) or m.group(2)).upper() if m else None
        if m and len(opts) < 4 and letter == 'ABCD'[len(opts)]:
            opts.append(m.group(3).strip())
        elif opts:
            if len(opts) < 4:
                opts[-1] += ' ' + line  # option wrapped onto the next line
            else:
                return lines, None  # more text after the options: not a simple MCQ
        else:
            stem.append(line)
    if len(opts) == 4 and stem:
        return stem, [o.strip() for o in opts]
    return lines, None


STOP = set('the a an of to in is are was were and or for on by with as at be this that which what from it its into than then '
           'their his her they he she we you your our not no yes all any each following given above below option options '
           'correct statement statements both true false reason assertion explanation'.split())


def words(text: str) -> set[str]:
    return {w for w in re.findall(r'[a-z0-9]+', text.lower()) if len(w) > 2 and w not in STOP}


def consistent_mcq(options: list[str], idx: int, explanation: str) -> bool:
    """The scheme's explanation must not point to a different option than its answer letter."""
    opts = [words(o) for o in options]
    if len({o.strip().lower() for o in options}) < 4 or any(not o.strip() for o in options):
        return False
    exp = words(explanation)
    if not exp:
        return True
    overlap = [len(o & exp) / max(1, len(o)) for o in opts]
    best = max(range(4), key=lambda i: overlap[i])
    return not (overlap[best] >= 0.6 and overlap[best] > overlap[idx] + 0.3)


def consistent_answer(question: str, answer: str) -> bool:
    """Descriptive answers must share subject words with their question (catches misaligned numbering)."""
    q, a = words(question), words(answer)
    return len(q & a) >= 2 or (len(q & a) >= 1 and len(q) <= 6)


def answer_letter(ms_lines: list[str]) -> int | None:
    for line in ms_lines[:3]:
        m = ANSWER.match(line)
        if m:
            return 'ABCD'.index((m.group(1) or m.group(2) or m.group(3)).upper())
    return None


def join(lines: list[str]) -> str:
    text = '\n'.join(lines)
    text = re.sub(r'(?<![.:?!)])\n(?=[a-z(])', ' ', text)  # re-join wrapped sentences
    return text.strip()


DEVANAGARI = re.compile(r'[ऀ-ॿ]')
SECTION_A = re.compile(r'^\s*(?:section|SECTION)\s*[-–—:]?\s*[\'"]?A[\'"]?\s*$|^\s*SECTION\s*[-–—]?\s*A\b', re.M)


def preprocess(text: str) -> str:
    """Keep English lines of bilingual board papers and start at Section A (skips numbered instructions)."""
    lines = [l for l in text.split('\n') if len(DEVANAGARI.findall(l)) <= 0.2 * max(1, len(l.strip()))]
    text = '\n'.join(lines)
    m = SECTION_A.search(text)
    return text[m.end():] if m else text


def parse_doc(qp_text: str, ms_text: str) -> list[dict]:
    qp_text, ms_text = preprocess(qp_text), preprocess(ms_text)
    qb, mb = blocks(qp_text, paper=True), blocks(ms_text)
    out = []
    for n, lines in qb.items():
        if n not in mb:
            continue
        q_lines, marks = strip_marks(lines)
        ms_lines, _ = strip_marks(mb[n])
        full = join(q_lines)
        if len(full) < 15 or FIGURE.search(full) or residue(q_lines):
            continue
        stem, options = split_options(q_lines)
        if not options and AR.search(full) and REASON.search(full):
            stem, options = q_lines, AR_OPTIONS
        if options:
            idx = answer_letter(ms_lines)
            if idx is None:
                continue
            explanation = re.sub(r'^(?:ans(?:wer)?\.?\s*[:\-]?\s*)?(?:option\s*)?\(?[a-dA-D][).]?\s*(?:/\s*)?', '', join(ms_lines), flags=re.I).strip()
            for _ in range(2):  # the marks columns ("1 1" in board schemes)
                explanation = TRAIL_MARKS.sub('', explanation).strip()
            if explanation and len(explanation) < 3:
                explanation = ''
            if residue(options) or not consistent_mcq(options, idx, explanation):
                continue
            out.append({
                'n': n,
                'type': 'assertion_reason' if options is AR_OPTIONS else 'mcq',
                'question': join(stem),
                'options': options,
                'correct': idx,
                'answer': explanation,
                'marks': marks or 1,
            })
        else:
            answer = join(ms_lines)
            if len(answer) < 30 or len(full) > 2500 or len(answer) > 3000 or residue(ms_lines, scheme=True) or not consistent_answer(full, answer):
                continue
            out.append({'n': n, 'type': 'descriptive', 'question': full, 'answer': answer, 'marks': marks or 2})
    return out
