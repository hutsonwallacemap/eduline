"""Build src/data/library.json: Class 10 study resources (official NCERT/CBSE files and links to free notes pages)."""
import json
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
HERE = Path(__file__).parent
OUT = Path(sys.argv[1])
UA = {'User-Agent': 'Mozilla/5.0'}

MATHS = ['Real Numbers', 'Polynomials', 'Pair of Linear Equations in Two Variables', 'Quadratic Equations', 'Arithmetic Progressions', 'Triangles', 'Coordinate Geometry', 'Introduction to Trigonometry', 'Some Applications of Trigonometry', 'Circles', 'Areas Related to Circles', 'Surface Areas and Volumes', 'Statistics', 'Probability']
SCIENCE = ['Chemical Reactions and Equations', 'Acids, Bases and Salts', 'Metals and Non-metals', 'Carbon and its Compounds', 'Life Processes', 'Control and Coordination', 'How do Organisms Reproduce?', 'Heredity', 'Light – Reflection and Refraction', 'The Human Eye and the Colourful World', 'Electricity', 'Magnetic Effects of Electric Current', 'Our Environment']
HISTORY = ['History: The Rise of Nationalism in Europe', 'History: Nationalism in India', 'History: The Making of a Global World', 'History: The Age of Industrialisation', 'History: Print Culture and the Modern World']
GEOGRAPHY = ['Geography: Resources and Development', 'Geography: Forest and Wildlife Resources', 'Geography: Water Resources', 'Geography: Agriculture', 'Geography: Minerals and Energy Resources', 'Geography: Manufacturing Industries', 'Geography: Lifelines of National Economy']
CIVICS = ['Civics: Power Sharing', 'Civics: Federalism', 'Civics: Gender, Religion and Caste', 'Civics: Political Parties', 'Civics: Outcomes of Democracy']
ECONOMICS = ['Economics: Development', 'Economics: Sectors of the Indian Economy', 'Economics: Money and Credit', 'Economics: Globalisation and the Indian Economy', None]  # 5 = Consumer Rights (project work)
FIRST_FLIGHT = ['A Letter to God', 'Nelson Mandela: Long Walk to Freedom', 'Two Stories about Flying', 'From the Diary of Anne Frank', 'Glimpses of India', 'Mijbil the Otter', 'Madam Rides the Bus', 'The Sermon at Benares', 'The Proposal']
FOOTPRINTS = ['Footprints: A Triumph of Surgery', "Footprints: The Thief's Story", 'Footprints: The Midnight Visitor', 'Footprints: A Question of Trust', 'Footprints: Footprints without Feet', 'Footprints: The Making of a Scientist', 'Footprints: The Necklace', 'Footprints: Bholi', 'Footprints: The Book That Saved the Earth']
KSHITIJ = ['Surdas ke Pad', 'Ram-Lakshman-Parshuram Samvad', 'Aatmakathya', 'Utsah aur At Nahin Rahi Hai', 'Yeh Danturit Muskaan aur Fasal', 'Sangatkar', 'Netaji ka Chashma', 'Balgobin Bhagat', 'Lakhnavi Andaz', 'Ek Kahani Yeh Bhi', 'Naubatkhane Mein Ibadat', 'Sanskriti']
KRITIKA = ['Kritika: Mata ka Anchal', 'Kritika: Sana-Sana Hath Jodi', 'Kritika: Main Kyon Likhta Hoon']

NCERT_BOOKS = {
    'jemh1': ('Mathematics', 'NCERT Mathematics', MATHS),
    'jesc1': ('Science', 'NCERT Science', SCIENCE),
    'jess3': ('Social Science', 'India and the Contemporary World II', HISTORY),
    'jess1': ('Social Science', 'Contemporary India II', GEOGRAPHY),
    'jess4': ('Social Science', 'Democratic Politics II', CIVICS),
    'jess2': ('Social Science', 'Understanding Economic Development', ECONOMICS),
    'jeff1': ('English', 'First Flight', FIRST_FLIGHT),
    'jefp1': ('English', 'Footprints without Feet', FOOTPRINTS),
    'jhks1': ('Hindi', 'Kshitij Part 2', KSHITIJ),
    'jhkr1': ('Hindi', 'Kritika Part 2', KRITIKA),
    'jhsp1': ('Hindi', 'Sparsh Part 2 (Hindi B)', None),
    'jhsy1': ('Hindi', 'Sanchayan Part 2 (Hindi B)', None),
}

res = []


def add(**r):
    r.setdefault('grade', 10)
    r.setdefault('language', 'Hindi' if r.get('subject') == 'Hindi' else 'English')
    res.append(r)


def label(ch: str | None) -> str:
    return ch.split(': ', 1)[1] if ch and ': ' in ch else (ch or '')


# NCERT textbooks (found by ncert_probe.py)
for row in json.loads((HERE / 'ncert.json').read_text(encoding='utf-8')):
    subject, book, chapters = NCERT_BOOKS[row['code']]
    n = row['chapter']
    ch = chapters[n - 1] if chapters and n <= len(chapters) else None
    name = label(ch) if ch else ('Consumer Rights (project work)' if row['code'] == 'jess2' and n == 5 else f'Chapter {n}')
    add(kind='NCERT Textbook', subject=subject, chapter=ch, title=f'{book} — {name}', source='NCERT', official=True,
        url=row['url'], format='pdf', pages=row['pages'], year='2026-27 reprint',
        description=f'Chapter {n} of the NCERT Class 10 textbook "{book}".')

# NCERT Exemplar (old numbering; chapters dropped from the syllabus are skipped)
EX_MATHS = {1: 'Real Numbers', 2: 'Polynomials', 3: 'Pair of Linear Equations in Two Variables', 4: 'Quadratic Equations', 5: 'Arithmetic Progressions', 6: 'Triangles', 7: 'Coordinate Geometry', 8: 'Introduction to Trigonometry', 9: 'Circles', 11: 'Areas Related to Circles', 12: 'Surface Areas and Volumes', 13: 'Statistics'}
EX_SCIENCE = {1: 'Chemical Reactions and Equations', 2: 'Acids, Bases and Salts', 3: 'Metals and Non-metals', 4: 'Carbon and its Compounds', 6: 'Life Processes', 7: 'Control and Coordination', 8: 'How do Organisms Reproduce?', 9: 'Heredity', 10: 'Light – Reflection and Refraction', 11: 'The Human Eye and the Colourful World', 12: 'Electricity', 13: 'Magnetic Effects of Electric Current', 15: 'Our Environment'}
EX_TITLES = {('mathematics', 8): 'Introduction to Trigonometry & its Applications', ('mathematics', 13): 'Statistics and Probability', ('science', 9): 'Heredity and Evolution'}
for row in json.loads((HERE / 'exemplar.json').read_text(encoding='utf-8')):
    table = EX_MATHS if row['sub'] == 'mathematics' else EX_SCIENCE
    ch = table.get(row['n'])
    if not ch:
        continue
    subject = 'Mathematics' if row['sub'] == 'mathematics' else 'Science'
    add(kind='NCERT Exemplar', subject=subject, chapter=ch, title=f'NCERT Exemplar {subject} — {EX_TITLES.get((row["sub"], row["n"]), ch)}',
        source='NCERT', official=True, url=row['url'], format='pdf', pages=row['pages'],
        description='NCERT Exemplar problems: MCQs, short and long answer questions beyond the textbook exercises, with answers.')

# CBSE syllabus 2026-27
SYL = [
    ('Mathematics', 'Maths_SecP1X_2026-27.pdf', 'CBSE Class 10 Mathematics syllabus 2026-27'),
    ('Mathematics', 'MathsAd_SecP1_2026-27.pdf', 'CBSE Mathematics (Advanced) syllabus 2026-27'),
    ('Science', 'Science_SecP1_2026-27.pdf', 'CBSE Class 9–10 Science syllabus 2026-27'),
    ('Science', 'ScienceSt_SecP1_2026-27.pdf', 'CBSE Science (Standard) syllabus 2026-27'),
    ('Science', 'ScienceAd_SecP1_2026-27.pdf', 'CBSE Science (Advanced) syllabus 2026-27'),
    ('Social Science', 'SocialScience_SecP1X_2026-27.pdf', 'CBSE Class 10 Social Science syllabus 2026-27'),
    ('English', 'English_LL_SecP1_2026-27.pdf', 'CBSE English Language & Literature syllabus 2026-27'),
    ('Hindi', 'Hindi_A_SecP1_2026-27.pdf', 'CBSE Hindi Course A syllabus 2026-27'),
    ('Hindi', 'Hindi_B_SecP1_2026-27.pdf', 'CBSE Hindi Course B syllabus 2026-27'),
    (None, 'Curriculum_SecP1_2026-27.pdf', 'CBSE Secondary Curriculum 2026-27 (overview)'),
]
for subject, f, title in SYL:
    add(kind='CBSE Syllabus', subject=subject or 'All subjects', chapter=None, title=title, source='CBSE', official=True,
        url=f'https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/{f}', format='pdf', year='2026-27',
        description='Official CBSE curriculum: units, chapters, marks and question-paper design.', language='Hindi' if 'Hindi' in title else 'English')

# Free notes pages on publisher sites (linked, not copied)
PW = 'https://www.pw.live/school-prep/exams/'


def page_title(url: str) -> str:
    import html as _html
    import re as _re
    for attempt in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as resp:
                m = _re.search(r'<title>([^<]*)', resp.read(200_000).decode('utf-8', 'ignore'), _re.I)
                return _html.unescape(m.group(1)) if m else ''
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return ''
        except Exception:  # noqa: BLE001
            pass
        time.sleep(2 + 2 * attempt)
    return ''


def match_chapter(title: str, chapters: list[str]) -> str | None:
    """Pick the chapter whose name appears in the page title (PW's numbering differs from NCERT's)."""
    import re as _re
    norm = lambda t: ' '.join(_re.sub(r'[^a-z ]', ' ', t.lower().replace('colorful', 'colourful')).split())
    t = norm(title)
    best = None
    for ch in chapters:
        name = norm(label(ch).replace('Introduction to ', ''))
        key = ' '.join(w for w in name.split() if w not in {'the', 'and', 'of', 'in', 'its', 'a'})
        words = key.split()
        if words and all(w in t.split() or w[:-1] in t for w in words):
            if not best or len(name) > len(norm(label(best))):
                best = ch
    return best


PW_PAGES = [('maths', i, MATHS, 'Mathematics') for i in range(1, 16)] + [('science', i, SCIENCE, 'Science') for i in range(1, 16)] \
    + [('social-science-history', i, HISTORY, 'Social Science') for i in range(1, 6)] + [('social-science-geography', i, GEOGRAPHY, 'Social Science') for i in range(1, 8)] \
    + [('social-science-civics', i, CIVICS, 'Social Science') for i in range(1, 9)] + [('social-science-economics', i, ECONOMICS[:4], 'Social Science') for i in range(1, 6)]
pw_urls = [f'{PW}cbse-class-10-{part}-notes-chapter-{i}' for part, i, _, _ in PW_PAGES]
with ThreadPoolExecutor(3) as ex:
    pw_titles = list(ex.map(page_title, pw_urls))
pw_seen = set()
for (part, i, chapters, subject), url, title in zip(PW_PAGES, pw_urls, pw_titles):
    ch = match_chapter(title, chapters) if title else None
    print(f'PW {part} {i:2d} -> {ch} | {title[:70]}')
    if not ch or (subject, ch) in pw_seen:
        continue
    pw_seen.add((subject, ch))
    add(kind='Notes', subject=subject, chapter=ch, title=f'Revision notes — {label(ch)}', source='PW (Physics Wallah)', official=False,
        url=url, format='web', description='Free chapter notes on pw.live.')

OSW = 'https://oswaalbooks.com/pages/'
for ch, slug in [('Chemical Reactions and Equations', 'cbse-notes-science-chapter-1-chemical-reactions-and-equations'),
                 ('Acids, Bases and Salts', 'cbse-class-10-science-notes-chapter-2-acids-bases-salts'),
                 ('Carbon and its Compounds', 'cbse-class-10-science-notes-chapter-4-carbon-and-its-compounds'),
                 ('Control and Coordination', 'cbse-class-10-science-notes-chapter-7-control-and-coordination'),
                 ('How do Organisms Reproduce?', 'cbse-class-10-science-notes-chapter-8-how-do-organisms-reproduce'),
                 ('Heredity', 'cbse-class-10-science-notes-chapter-9-heredity-and-evolution'),
                 ('Light – Reflection and Refraction', 'cbse-class-10-science-notes-chapter-10-light-reflection-and-refraction'),
                 ('The Human Eye and the Colourful World', 'cbse-class-10-science-notes-chapter-11-the-human-eye-and-the-colorful-world'),
                 ('Electricity', 'cbse-class-10-science-notes-chapter-12-electricity'),
                 ('Magnetic Effects of Electric Current', 'cbse-class-10-science-notes-chapter-13-magnetic-effects-of-electric-current'),
                 ('Our Environment', 'cbse-class-10-science-notes-chapter-15-our-environment')]:
    add(kind='Notes', subject='Science', chapter=ch, title=f'Chapter notes — {ch}', source='Oswaal Books', official=False,
        url=OSW + slug, format='web', description='Free chapter notes on oswaalbooks.com.')

SHOP = 'https://cdn.shopify.com/s/files/1/0572/7299/1924/files/'
for subject, f in [('Mathematics', 'Oswaal_CBSE_10th_Mind_Maps_Mathematics_Standard.pdf?v=1662806815'), ('Science', 'Oswaal_CBSE_10th_Mind_Maps_Science.pdf?v=1662806722'),
                   ('English', 'Oswaal_CBSE_10th_Mind_Maps_English_Language_Literature.pdf?v=1662806720'), ('Hindi', 'Oswaal_CBSE_10th_Mind_Maps_Hindi-A.pdf?v=1662806721'),
                   ('Social Science', 'Oswaal_CBSE_10th_Mind_Maps_Social_Science.pdf?v=1662806722')]:
    add(kind='Mind Map', subject=subject, chapter=None, title=f'{subject} mind maps (all chapters)', source='Oswaal Books', official=False,
        url=SHOP + f, format='pdf', year='2022', description='Free one-page mind maps per chapter, published in 2022 (older syllabus — some chapters are no longer examined).')

EDU = 'https://www.educart.co/cbse/'
for subject, slug, kind in [('English', 'cbse-class-10-english-summary-and-notes', 'Notes'), ('Hindi', 'cbse-class-10-hindi-a-notes', 'Notes'),
                            ('Mathematics', 'cbse-class-10-maths-notes', 'Notes'), ('Science', 'cbse-class-10-science-notes', 'Notes'),
                            ('Social Science', 'cbse-class-10-sst-notes', 'Notes'),
                            ('Mathematics', 'cbse-class-10-maths-important-questions', 'Important Questions'),
                            ('Science', 'cbse-class-10-science-important-questions', 'Important Questions'),
                            ('Social Science', 'cbse-class-10-sst-important-questions', 'Important Questions')]:
    add(kind=kind, subject=subject, chapter=None, title=f'{subject} {"chapter-wise notes" if kind == "Notes" else "important questions"} 2026-27', source='Educart',
        official=False, url=EDU + slug, format='web', description=f'Free {"chapter-wise notes PDFs" if kind == "Notes" else "important questions"} on educart.co (some downloads ask for sign-up).')
for subject, slug in [('Mathematics', 'solutions-for-class-10-maths'), ('Science', 'solutions-for-class-10-science'), ('Social Science', 'solutions-for-class-10-sst'), ('English', 'solutions-for-class-10-english')]:
    add(kind='NCERT Solutions', subject=subject, chapter=None, title=f'NCERT Solutions — {subject}', source='Educart', official=False,
        url=f'https://www.educart.co/ncert/{slug}', format='web', description='Free NCERT exercise solutions on educart.co.')

add(kind='Learning Platform', subject='All subjects', chapter=None, title='EduRev Class 10 (videos, notes, tests)', source='EduRev', official=False,
    url='https://edurev.in/class-10', format='web', description='Free and paid Class 10 courses on EduRev; requires sign-in.')


# Verify every link and drop anything that does not load
def ok(r):
    for attempt in range(3):
        try:
            req = urllib.request.Request(r['url'], headers={**UA, 'Range': 'bytes=0-1023'})
            with urllib.request.urlopen(req, timeout=60) as resp:
                return resp.status in (200, 206)
        except urllib.error.HTTPError as e:
            if e.code in (404, 410):
                return False
        except Exception:  # noqa: BLE001
            pass
        time.sleep(2 + 2 * attempt)
    return False


with ThreadPoolExecutor(3) as ex:
    flags = list(ex.map(ok, res))
bad = [r for r, f in zip(res, flags) if not f]
good = [r for r, f in zip(res, flags) if f]
seen, final = set(), []
for r in good:
    if r['url'] in seen:
        continue
    seen.add(r['url'])
    final.append(r)
for i, r in enumerate(final):
    r['id'] = f'lib{i}'
OUT.write_text(json.dumps(final, ensure_ascii=False, indent=1), encoding='utf-8')
from collections import Counter  # noqa: E402
print('resources:', len(final), dict(Counter(r['kind'] for r in final)))
print('failed links:', len(bad))
for r in bad:
    print('  FAIL', r['kind'], r['title'], r['url'])
