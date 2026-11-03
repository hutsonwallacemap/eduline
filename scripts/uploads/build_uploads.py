"""Copy the shared Class 10 PDFs into public/pdfs (deduplicated, compressed) and write src/data/uploads.json.

Run: python -I scripts/uploads/build_uploads.py <folder with the PDFs>
Each file is listed exactly once in MANIFEST. English board papers of one series are grouped as one
resource with a part per set. Grade_10.pdf and personal planners are never included (private data).
"""
import io
import json
import logging
import sys
from pathlib import Path

from PIL import Image
from pypdf import PdfReader, PdfWriter

logging.disable(logging.WARNING)
ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'public' / 'pdfs'
SRC = Path(sys.argv[1])

M, SC, SS, EN, HI, IT = 'Mathematics', 'Science', 'Social Science', 'English', 'Hindi', 'Information Technology'
CRE, ABS, MNM, CARBON = 'Chemical Reactions and Equations', 'Acids, Bases and Salts', 'Metals and Non-metals', 'Carbon and its Compounds'
LIFE, CONTROL, REPRO, HERED = 'Life Processes', 'Control and Coordination', 'How do Organisms Reproduce?', 'Heredity'
LIGHT, EYE, ELEC, MAG, ENV = 'Light – Reflection and Refraction', 'The Human Eye and the Colourful World', 'Electricity', 'Magnetic Effects of Electric Current', 'Our Environment'
HUNNY = 'Hunny Tutorials'
BP = 'CBSE board questions 2022–2026, collected chapter-wise'
SQ = 'CBSE sample-paper questions 2019–2025, collected chapter-wise'


def item(file, slug, kind, subject, title, source, description, chapters=None, year=None, language='English', official=False):
    return dict(file=file, slug=slug, kind=kind, subject=subject, title=title, source=source, description=description,
                chapters=chapters or [], year=year, language=language, official=official)


def series(slug, title, code, files, year='2026'):
    return dict(slug=slug, kind='CBSE Board Paper', subject=EN, title=title, source='CBSE', official=True, year=year,
                language='English', chapters=[], parts=[(f'Set {i + 1}', f) for i, f in enumerate(files)],
                description=f'Official CBSE Class 10 English Language & Literature board question paper, series {code} — all three sets.')


MANIFEST = [
    # --- Revision notes (Hinglish topper notes and hand-written notes) ---
    item('Acids Bases and Salts Revision Notes.pdf', 'science/acids-bases-salts-revision-notes', 'Revision Notes', SC, 'Acids, Bases and Salts — topper revision notes', 'Shared notes', 'Indicators, reactions of acids and bases, the pH scale and the five important salts, in quick revision form.', [ABS], language='Hinglish'),
    item('Metals and Nonmetals Revision Notes.pdf', 'science/metals-non-metals-revision-notes', 'Revision Notes', SC, 'Metals and Non-metals — topper revision notes', 'Shared notes', 'Properties, the reactivity series, ionic compounds, extraction and corrosion, condensed for revision.', [MNM], language='Hinglish'),
    item('Life Processes - Nutrition and Respiration Revision Notes.pdf', 'science/life-processes-revision-notes', 'Revision Notes', SC, 'Life Processes (nutrition and respiration) — topper revision notes', 'Shared notes', 'Autotrophic and human nutrition, aerobic and anaerobic respiration, with the diagrams to remember.', [LIFE], language='Hinglish'),
    item('Light Reflection and Refraction Revision Notes.pdf', 'science/light-revision-notes', 'Revision Notes', SC, 'Light — Reflection and Refraction — topper revision notes', 'Shared notes', 'Mirror and lens rules, sign convention, ray diagrams and the formulas in one place.', [LIGHT], language='Hinglish'),
    item('Human Eye and Colourful World Revision Notes.pdf', 'science/human-eye-revision-notes', 'Revision Notes', SC, 'The Human Eye and the Colourful World — topper revision notes', 'Shared notes', 'Parts of the eye, defects and their correction, dispersion, scattering and atmospheric refraction.', [EYE], language='Hinglish'),
    item('Class 10 Science - Our Environment Revision Notes (1).pdf', 'science/our-environment-revision-notes', 'Revision Notes', SC, 'Our Environment — revision notes', 'Shared notes', 'Ecosystems, food chains and webs, the 10% law, biological magnification, ozone and waste management.', [ENV]),
    item('Creative Class 10 Science - Our Environment Notes (1).pdf', 'science/our-environment-visual-notes', 'Revision Notes', SC, 'Our Environment — visual notes', 'Shared notes', 'The same chapter as colourful visual notes with flow charts — good for a last look before the exam.', [ENV]),
    item('Heredity_full_notes-1_METAPHASE_watermarked (1).pdf', 'science/heredity-handwritten-notes', 'Revision Notes', SC, 'Heredity — hand-written notes', 'METAPHASE', 'Traits and variation, Mendel’s experiments, monohybrid and dihybrid crosses, and sex determination.', [HERED]),
    item('Class_10_SST_5_Minute_Revision_Sheet.pdf', 'social-science/5-minute-revision-sheets', 'Revision Notes', SS, 'Social Science 5-minute revision sheets (9 high-value chapters)', 'Shared notes', 'One sheet per chapter: the key facts, dates and answer points for nine chapters that carry the most marks.',
         ['History: The Rise of Nationalism in Europe', 'History: Nationalism in India', 'Geography: Forest and Wildlife Resources', 'Geography: Water Resources', 'Civics: Federalism', 'Civics: Gender, Religion and Caste', 'Economics: Sectors of the Indian Economy', 'Economics: Money and Credit', 'Economics: Globalisation and the Indian Economy'], year='2026-27'),

    # --- Hunny Tutorials: chapter-wise board and sample-paper questions ---
    item('Class X Chem Ch- 1  BP 2022-26.pdf', 'science/chemical-reactions-board-questions', 'Chapter-wise PYQs', SC, 'Chemical Reactions and Equations — board questions 2022–26', HUNNY, BP + '.', [CRE], year='2022–2026'),
    item('Class X Chem Ch- 2  BP 2022-26.pdf', 'science/acids-bases-salts-board-questions', 'Chapter-wise PYQs', SC, 'Acids, Bases and Salts — board questions 2022–26', HUNNY, BP + '.', [ABS], year='2022–2026'),
    item('Class X Chemistry  Ch-1 & 2  SQP 2019-2025.pdf', 'science/chemistry-ch1-2-sample-paper-questions', 'Chapter-wise PYQs', SC, 'Chemical Reactions + Acids, Bases and Salts — sample-paper questions 2019–25', HUNNY, SQ + '.', [CRE, ABS], year='2019–2025'),
    item('Class X Chemistry Ch- 3 & 4 SQP 2019-2025.pdf', 'science/chemistry-ch3-4-sample-paper-questions', 'Chapter-wise PYQs', SC, 'Metals and Non-metals + Carbon — sample-paper questions 2019–25', HUNNY, SQ + '.', [MNM, CARBON], year='2019–2025'),
    item('Class X Bio Ch-5 2022-2026 (1).pdf', 'science/life-processes-board-questions', 'Chapter-wise PYQs', SC, 'Life Processes — board questions 2022–26', HUNNY, BP + '.', [LIFE], year='2022–2026'),
    item('Class X Bio Ch- 6 BP 2022-26.pdf', 'science/control-coordination-board-questions', 'Chapter-wise PYQs', SC, 'Control and Coordination — board questions 2022–26', HUNNY, BP + '.', [CONTROL], year='2022–2026'),
    item('Class X Biology Ch- 5 & 6 SQP 2019-2025.pdf', 'science/biology-ch5-6-sample-paper-questions', 'Chapter-wise PYQs', SC, 'Life Processes + Control and Coordination — sample-paper questions 2019–25', HUNNY, SQ + '.', [LIFE, CONTROL], year='2019–2025'),
    item('Class X Biology Ch- 7 & 8 SQP 2019-2025.pdf', 'science/biology-ch7-8-sample-paper-questions', 'Chapter-wise PYQs', SC, 'Reproduction + Heredity — sample-paper questions 2019–25', HUNNY, SQ + '.', [REPRO, HERED], year='2019–2025'),
    item('Class X Biology Ch- 14 Our Env, SQP 2019-2025.pdf', 'science/our-environment-sample-paper-questions', 'Chapter-wise PYQs', SC, 'Our Environment — sample-paper questions 2019–25', HUNNY, SQ + '.', [ENV], year='2019–2025'),
    item('Class X Physics Ch-9 BP 2022-26.pdf', 'science/light-board-questions', 'Chapter-wise PYQs', SC, 'Light — Reflection and Refraction — board questions 2022–26', HUNNY, BP + '.', [LIGHT], year='2022–2026'),
    item('Class X Physics Ch-10 BP 2022-26.pdf', 'science/human-eye-board-questions', 'Chapter-wise PYQs', SC, 'The Human Eye — board questions 2022–26', HUNNY, BP + '.', [EYE], year='2022–2026'),
    item('Class X Phy Ch-12 BP 2022-26.pdf', 'science/magnetic-effects-board-questions', 'Chapter-wise PYQs', SC, 'Magnetic Effects of Electric Current — board questions 2022–26', HUNNY, BP + '.', [MAG], year='2022–2026'),
    item('Class X Physics Ch- light & Eye SQP 2019-2025.pdf', 'science/light-eye-sample-paper-questions', 'Chapter-wise PYQs', SC, 'Light + Human Eye — sample-paper questions 2019–25', HUNNY, SQ + '.', [LIGHT, EYE], year='2019–2025'),
    item('Class X Physics Ch- Electricity & Magnetic SQP 2022-2025.pdf', 'science/electricity-magnetic-sample-paper-questions', 'Chapter-wise PYQs', SC, 'Electricity + Magnetic Effects — sample-paper questions 2022–25', HUNNY, 'CBSE sample-paper questions 2022–2025, collected chapter-wise.', [ELEC, MAG], year='2022–2025'),
    item('Class X Maths Ch-10 NCERT Solutions (1).pdf', 'mathematics/circles-ncert-solutions', 'NCERT Solutions', M, 'Circles — NCERT solutions (hand-written)', HUNNY, 'Step-by-step solutions to the NCERT exercises on tangents to a circle.', ['Circles'], year='2026-27'),
    item('Class X Maths Ch- Circles Imp Ques.pdf', 'mathematics/circles-important-questions', 'Important Questions', M, 'Circles — 10 solved + 10 unsolved important questions', HUNNY, 'Exam-oriented tangent questions on the latest CBSE pattern: work through the solved ones, then try the rest.', ['Circles']),
    item('Class X Maths Ch-11 Area Related to a Circle Insta Material.pdf', 'mathematics/areas-related-to-circles-quick-material', 'Revision Notes', M, 'Areas Related to Circles — quick study material', HUNNY, 'Sector, segment and arc formulas with worked examples, ready for quick revision.', ['Areas Related to Circles']),
    item('Class X Maths Ch-11 Area Related to a Circle Assignment - Test.pdf', 'mathematics/areas-related-to-circles-test', 'Worksheet', M, 'Areas Related to Circles — assignment test', HUNNY, 'A short chapter test to check yourself after revising the chapter.', ['Areas Related to Circles']),

    # --- Worksheets and practice ---
    item('Worksheet Real Numbers Class 10 (2).pdf', 'mathematics/real-numbers-worksheet', 'Worksheet', M, 'Real Numbers — worksheet', 'Shared worksheet', 'MCQs, assertion–reason and short questions on HCF, LCM, prime factorisation and irrational numbers.', ['Real Numbers']),
    item('Worksheet Chapter Polynomials Class 10.pdf', 'mathematics/polynomials-worksheet', 'Worksheet', M, 'Polynomials — worksheet', 'Shared worksheet', 'Graph-based zero questions and the relation between zeroes and coefficients.', ['Polynomials']),
    item('DOC-20261001-WA0022.pdf', 'mathematics/case-study-question-booklet', 'Worksheet', M, 'Case-study question booklet (11 chapters, 50 pages)', 'Shared worksheet', 'Real-life case-study questions — the 4-mark Section E type — for 11 chapters, from Real Numbers to Probability.',
         ['Real Numbers', 'Polynomials', 'Pair of Linear Equations in Two Variables', 'Quadratic Equations', 'Arithmetic Progressions', 'Triangles', 'Some Applications of Trigonometry', 'Areas Related to Circles', 'Surface Areas and Volumes', 'Statistics', 'Probability']),
    item('Class_10_Maths_Important_Questions_Midterm.pdf', 'mathematics/midterm-important-questions', 'Important Questions', M, 'Mid-term important questions (8 chapters)', 'Shared practice set', 'CBSE-style practice questions for the mid-term chapters, grouped chapter by chapter.',
         ['Real Numbers', 'Polynomials', 'Pair of Linear Equations in Two Variables', 'Quadratic Equations', 'Arithmetic Progressions', 'Coordinate Geometry', 'Areas Related to Circles', 'Triangles'], year='2026-27'),
    item('CBSE_Class_10_Mathematics_Midterm_Question_Paper_2026_27 (1).pdf', 'mathematics/midterm-practice-paper-2026-27', 'Practice Paper', M, 'Mathematics mid-term practice paper 2026-27', 'Shared practice paper', 'A full 80-mark paper in the CBSE pattern for mid-term practice.', year='2026-27'),
    item('CBSE_Class_10_English_Midterm_Subham_Shivani_2026_27.pdf', 'english/midterm-practice-paper-2026-27', 'Practice Paper', EN, 'English mid-term practice paper 2026-27', 'Shared practice paper', 'A full 80-mark English Language & Literature paper in the CBSE pattern.', year='2026-27'),
    item('LibreOffice Base_Practicals.pdf', 'information-technology/libreoffice-base-practicals', 'Worksheet', IT, 'LibreOffice Base practicals (IT 402)', 'Shared notes', 'Aim, steps and field tables for the database practicals: creating tables, entering records and queries.'),

    # --- School half-yearly papers 2026-27 ---
    item('Class X Maths Hansraj HY 2026-27.pdf', 'mathematics/half-yearly-2026-27-hansraj', 'School Exam Paper', M, 'Maths half-yearly 2026-27 — Hansraj', 'School paper', 'A real school half-yearly paper — attempt it in 3 hours to test your mid-term preparation.', year='2026-27'),
    item('Class X Maths New Era HY 2026-27.pdf', 'mathematics/half-yearly-2026-27-new-era', 'School Exam Paper', M, 'Maths half-yearly 2026-27 — New Era Public School', 'School paper', 'A real school mid-term paper (80 marks, sections A–E).', year='2026-27'),
    item('Class X Maths SBM HY 2026-27.pdf', 'mathematics/half-yearly-2026-27-sbm', 'School Exam Paper', M, 'Maths half-yearly 2026-27 — SBM', 'School paper', 'A real school half-yearly paper for timed practice.', year='2026-27'),
    item('Class X Maths St. Gregorios HY 2026-27.pdf', 'mathematics/half-yearly-2026-27-st-gregorios', 'School Exam Paper', M, 'Maths half-yearly 2026-27 — St. Gregorios', 'School paper', 'A real school half-yearly paper for timed practice.', year='2026-27'),
    item('Class X Science Govt. HY 2026-27.pdf', 'science/half-yearly-2026-27-govt', 'School Exam Paper', SC, 'Science half-yearly 2026-27 — Govt. school', 'School paper', 'A real school half-yearly paper for timed practice.', year='2026-27'),
    item('Class X Science New Era HY 2026-27.pdf', 'science/half-yearly-2026-27-new-era', 'School Exam Paper', SC, 'Science half-yearly 2026-27 — New Era Public School', 'School paper', 'A real school half-yearly paper for timed practice.', year='2026-27'),
    item('Class X Science SBM HY 2026-27.pdf', 'science/half-yearly-2026-27-sbm', 'School Exam Paper', SC, 'Science half-yearly 2026-27 — SBM', 'School paper', 'A real school half-yearly paper for timed practice.', year='2026-27'),
    item('Class X Science St. Froebel HY 2026-27.pdf', 'science/half-yearly-2026-27-st-froebel', 'School Exam Paper', SC, 'Science half-yearly 2026-27 — St. Froebel', 'School paper', 'A real school half-yearly paper for timed practice.', year='2026-27'),
    item('Class X Social Neo HY 2026-27.pdf', 'social-science/half-yearly-2026-27-neo', 'School Exam Paper', SS, 'Social Science half-yearly 2026-27 — Neo', 'School paper', 'A real school half-yearly paper for timed practice.', year='2026-27'),
    item('Class X Social SBM HY 2026-27.pdf', 'social-science/half-yearly-2026-27-sbm', 'School Exam Paper', SS, 'Social Science half-yearly 2026-27 — SBM', 'School paper', 'A real school half-yearly paper for timed practice.', year='2026-27'),

    # --- Official CBSE papers (copies hosted so they open inside the app) ---
    series('english/board-2026-series-2-1', 'English board paper 2026 — series 2/1 (3 sets)', '2/1', ['2-1-1_English (Lang. & Lit.).pdf', '2-1-2_English (Lang. & Lit.).pdf', '2-1-3_English (Lang. & Lit.).pdf']),
    series('english/board-2026-series-2-2', 'English board paper 2026 — series 2/2 (3 sets)', '2/2', ['2-2-1 (1).pdf', '2-2-2 (1).pdf', '2-2-3 (1).pdf']),
    series('english/board-2026-series-2-3', 'English board paper 2026 — series 2/3 (3 sets)', '2/3', ['2-3-1 (1).pdf', '2-3-2 (1).pdf', '2-3-3 (1).pdf']),
    series('english/board-2026-series-2-4', 'English board paper 2026 — series 2/4 (3 sets)', '2/4', ['1160-1_2-4-1 English (Lang. & Lit.) (1).pdf', '1160-2_2-4-2 English (Lang. & Lit.) (1).pdf', '1160-3_2-4-3 English (Lang. & Lit.) (1).pdf']),
    series('english/board-2026-series-2-5', 'English board paper 2026 — series 2/5 (3 sets)', '2/5', ['1161-1_2-5-1 English (Lang. & Lit.) (1).pdf', '1161-2_2-5-2 English (Lang. & Lit.) (1).pdf', '1161-3_2-5-3 English (Lang. & Lit.) (1).pdf']),
    item('CBSE_Class_12_Mathematics_Standard_2026_Set_30_4_2_Question_Paper_PDF_e032efe83a9eedbad3c3b46df638e26c.pdf', 'mathematics/board-2026-standard-30-4-2', 'CBSE Board Paper', M, 'Maths Standard board paper 2026 — set 30/4/2', 'CBSE', 'The 2026 Class 10 Mathematics (Standard) board paper, 38 questions, 80 marks.', year='2026', official=True),
    item('MathsStandard-SQP.pdf', 'mathematics/sample-paper-2026-27-standard', 'CBSE Sample Paper', M, 'Maths Standard sample paper 2026-27', 'CBSE', 'CBSE’s official sample question paper for the 2026-27 board exam — the exact pattern you will face.', year='2026-27', official=True),
    item('Copy of Science-SQP.pdf', 'science/sample-paper-2026-27', 'CBSE Sample Paper', SC, 'Science sample paper 2026-27', 'CBSE', 'CBSE’s official sample question paper for the 2026-27 board exam.', year='2026-27', official=True),
    item('Copy of EnglishL-SQP.pdf', 'english/sample-paper-2026-27', 'CBSE Sample Paper', EN, 'English Language & Literature sample paper 2026-27', 'CBSE', 'CBSE’s official sample question paper for the 2026-27 board exam.', year='2026-27', official=True),
    item('Copy of HindiCourseA-SQP.pdf', 'hindi/sample-paper-2026-27-course-a', 'CBSE Sample Paper', HI, 'हिंदी (पाठ्यक्रम अ) सैंपल पेपर 2026-27', 'CBSE', 'CBSE का 2026-27 बोर्ड परीक्षा के लिए आधिकारिक सैंपल प्रश्न-पत्र।', year='2026-27', language='Hindi', official=True),
]

# Never published: private data (student names / a personal plan), or a third-party practice paper that
# looked like a CBSE paper but isn't ("सैंपल प्रश्न-पत्र 03", publisher unknown, no permission).
NEVER = {'Grade_10.pdf', "Alina's Pre-Board Master Planner 2026.pdf", 'cbse-10th-hindi-a-hin_1768027557.pdf'}


def compress(src: Path) -> bytes:
    """Re-encode large scanned page images as JPEG (max 1700 px, quality 62) and compress streams."""
    raw = src.read_bytes()
    w = PdfWriter(clone_from=PdfReader(io.BytesIO(raw)))
    if len(raw) > 900_000:
        for page in w.pages:
            for img in page.images:
                try:
                    pil = img.image
                    if pil.width * pil.height < 250_000:
                        continue
                    if max(pil.size) > 1700:
                        pil.thumbnail((1700, 1700), Image.LANCZOS)
                    if pil.mode not in ('RGB', 'L'):
                        pil = pil.convert('RGB')
                    img.replace(pil, quality=62)
                except Exception:  # noqa: BLE001 - keep the original image if it can't be re-encoded
                    pass
    for page in w.pages:
        page.compress_content_streams()
    w.compress_identical_objects(remove_duplicates=True, remove_unreferenced=True)
    buf = io.BytesIO()
    w.write(buf)
    out = buf.getvalue()
    return out if len(out) < len(raw) else raw


def publish(file: str, slug: str) -> tuple[str, int, int]:
    assert file not in NEVER
    src = SRC / file
    data = compress(src)
    dest = OUT / f'{slug}.pdf'
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)
    pages = len(PdfReader(io.BytesIO(data)).pages)
    print(f'{src.stat().st_size // 1024:>6} KB -> {len(data) // 1024:>6} KB  {slug}')
    return f'/pdfs/{slug}.pdf', pages, len(data)


def main():
    files = [p for m in MANIFEST for p in ([f for _, f in m['parts']] if 'parts' in m else [m['file']])]
    assert len(files) == len(set(files)), 'a file is listed twice'
    slugs = [m['slug'] for m in MANIFEST]
    assert len(slugs) == len(set(slugs)), 'a slug is used twice'
    out, total = [], 0
    for i, m in enumerate(MANIFEST):
        r = {k: v for k, v in m.items() if k not in ('file', 'parts')}
        r['id'] = f'up{i}'
        if 'parts' in m:
            r['parts'] = []
            for label, f in m['parts']:
                url, pages, size = publish(f, f"{m['slug']}-set-{label[-1]}")
                r['parts'].append({'label': label, 'url': url, 'pages': pages})
                total += size
            r['url'] = r['parts'][0]['url']
            r['pages'] = sum(p['pages'] for p in r['parts'])
        else:
            r['url'], r['pages'], size = publish(m['file'], m['slug'])
            total += size
        out.append(r)
    (ROOT / 'src' / 'data' / 'uploads.json').write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding='utf-8')
    print(f'{len(out)} resources, {len(files)} files, {total / 1e6:.1f} MB')


if __name__ == '__main__':
    main()
