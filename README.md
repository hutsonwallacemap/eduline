# EduGenie AI

Learning platform for Indian Classes 7–12 (CBSE / ICSE / State Board). React + TypeScript + Tailwind v4 + Zustand + KaTeX, built with Vite. It runs entirely in the browser with no API key or server: questions and answers come from official CBSE papers bundled with the app.

```bash
npm install
npm run dev
```

## Modules

| View | File | Notes |
| --- | --- | --- |
| Shell, board/grade/stream state | `src/store.ts`, `src/components/Header.tsx`, `StreamModal.tsx` | Class 11–12 forces a stream choice; state persists in localStorage |
| Board Prep | `src/views/BoardPrep.tsx`, `src/data/boardPrep.ts` | Class 10 paper pattern and unit weightage per subject, answer-writing method, common mistakes, important questions with solutions, exam-day time plan and an 8-week plan |
| Digital Library | `src/views/Library.tsx`, `src/data/library.json`, `src/data/uploads.json` | Class 10 NCERT textbooks and exemplars, CBSE 2026-27 syllabus, PDFs hosted on the site (read in the app), publisher notes and mind maps; filters by subject, chapter, type and official source |
| Notes, mind maps, PDF reader | `src/components/NotesReader.tsx`, `MindMap.tsx`, `PdfViewer.tsx`, `HostedPdfList.tsx` | Per chapter: notes, a mind map with recall mode, and that chapter's PDFs; hosted PDFs open in an in-app reader with download |
| Search | `src/components/SearchDialog.tsx` | Header search (or press /) across chapters, questions with answers, library, formulas and CBSE papers |
| Dashboard | `src/views/Dashboard.tsx` | Subjects come from `src/data/curriculum.ts` per grade + stream; a subject card opens Practice with it selected |
| Doubt Solver | `src/views/DoubtSolver.tsx` | Searches the CBSE question bank within the chosen class, subject and chapter and shows the official marking-scheme answers |
| Practice & Test engine | `src/views/Practice.tsx` | Subject → chapter → timed quiz with palette → report with retry-missed. MCQ / assertion-reason are auto-graded; written board answers are self-marked against the official scheme |
| Sample Papers Vault | `src/views/Papers.tsx`, `src/components/OfficialResources.tsx` | CBSE board exam papers 2022–2026 and sample papers with marking schemes, plus CISCE / State Board links |
| Formula & Revision | `src/views/Revision.tsx` | Flip-card carousel and printable cheat sheet |

Math anywhere in content uses `$inline$` and `$$display$$`, rendered by `src/components/MathText.tsx`.

## Class → Subject → Chapter

`selectedSubject` and `selectedChapter` live in the global store next to board, class and stream, so a choice made in the Doubt Solver carries into Practice and back. Changing class or stream clears them.

`src/components/SubjectChapterPicker.tsx` is the shared picker: subject chips, then a chapter box where students type their chapter or pick from suggestions. Suggestions are NCERT chapters per class and subject (`chaptersFor` in `src/data/curriculum.ts`) with the number of bank questions per chapter, plus “All chapters”.

## EduGenie solved questions

`src/data/class10Maths.ts`, `class10Science.ts` and `class10Humanities.ts` and `class10Hindi.ts` hold hand-written Class 10 questions for every chapter of Maths, Science, Social Science, English and Hindi (Kshitij, Kritika, grammar and writing): MCQs (auto-graded) and written questions with step-by-step model answers in the marking-scheme style. They are merged into the bank with the CBSE questions, so they appear in Practice, the Doubt Solver and Board Prep.

## CBSE question bank

`src/data/bank.json` holds questions with CBSE's official answers, taken from:

- CBSE board exam papers 2022–2026 (main exams, English-medium marking schemes), and
- CBSE sample question papers 2023-24 to 2026-27 with their marking schemes,

for the core Class 10 and 12 subjects. Each record has the class, subject, chapter (or none when it spans chapters, shown as “Mixed (board paper)”), type (`mcq`, `assertion_reason`, `descriptive`), options and answer index, the marking-scheme answer, marks, and links to the source paper and scheme. `src/data/bank.ts` loads it on demand and merges the hand-written questions in `src/data/questions.ts`.

How it was built: the question-paper and marking-scheme PDFs were downloaded from cbse.gov.in and cbseacademic.nic.in, their text extracted, and questions matched to answers by question number. A question was kept only when it passes these checks:

- the answer letter matches the explained answer;
- a written answer shares key words with its question;
- the question does not need a figure, map or graph that text can't show.

Chapters were assigned by keyword matching. Maths questions with complex notation are under-represented because PDF text extraction garbles fractions and symbols.

Questions in Hindi (or in legacy Hindi fonts), questions needing figures, and any MCQ whose marking-scheme explanation contradicts its answer letter are left out.

Classes 7–9 and 11 have no CBSE board or sample papers, so Practice there only has the hand-written questions.

## Paper catalogues

- `src/data/cbseBoardPapers.json` — board exam question papers and marking schemes, 2022–2026, main and compartment, from cbse.gov.in's question-paper and marking-scheme pages. Marking schemes are linked where CBSE published one.
- `src/data/cbseSqp.json` — sample question papers and marking schemes, Class X and XII, 2023-24 to 2026-27, from cbseacademic.nic.in.
- `src/data/officialLinks.ts` — official board portals (CBSE Academic, CISCE, State Boards).

Re-collect these each year when CBSE publishes new papers.

## EduGenie chapter notes

`src/data/notes/` holds original revision notes for all 93 Class 10 chapters: Mathematics (14), Science (13), Social Science (21), English (28) and Hindi (17, written in Hindi) — overview, key points, formulas, key terms and exam focus, aligned to the CBSE 2026-27 syllabus (including which parts are assessed only in school). They are written from scratch, not adapted from publishers' notes. `NotesReader` shows them in the app (printable), opened from the Library, Board Prep chapter headings and search.

**Mind maps** (`src/components/MindMap.tsx`) are generated from the same notes, so they never drift from them: the chapter in the centre, with branches for core ideas, formulas, key terms and exam tips. Each node gets a short handle (its bold phrase, the words before a colon, or a cue such as “$\sin A = ?$”). Recall mode hides the details so students say each point from memory and tap to check. The mind map is a tab in the notes reader and a link on every Board Prep chapter.

## Class 12 Arts (Humanities)

Built subject by subject. Done so far:

- **History** (12 chapters), **Political Science** (15, including "Challenges to and Restoration of the Congress System"), **Geography** (17, including India’s transport, India’s international trade and "Geographical Perspective on Selected Issues and Problems" — all in the 2026-27 NCERT books), **Economics** (13: five Macroeconomics and eight Indian Economic Development chapters) and **English Core** (19: eight Flamingo prose chapters, five Flamingo poems and six Vistas chapters): original notes and mind maps (`src/data/notes/history12.ts`, `polsci12.ts`, `geography12.ts`, `economics12.ts`, `english12.ts`) and **100 questions with model answers per chapter** — 60 MCQs, 10 assertion–reason, 30 written answers — in `src/data/class12/<subject>/chNN.ts`, built with `chapterSet()` in `src/data/class12/build.ts`.
- The Class 12 sets load with the question bank (not with the first page). Practice offers 50- and 100-question tests; the notes reader has a "100-question mock test" button that switches to Class 12 Arts.
- The Library follows the selected class: Class 12 shows EduGenie notes plus all 77 NCERT chapter PDFs for History, Political Science, Geography, Economics and English (`scripts/library/ncert_probe12.py`, `add_class12_ncert.py`).

- Economics and English MCQs pass `{ spreadAnswers: true }` to `chapterSet()`, which rotates each question's options so the correct answers are spread evenly across A–D.
- English notes and answers are written in our own words; they summarise and analyse the texts rather than reproduce them. Only Keats's public-domain lines are quoted. The three skills topics (Grammar, Writing Skills, Reading Comprehension) have no chapter sets yet.

All five Class 12 Arts subjects now have notes, mind maps and 100-question sets for every literature/textbook chapter.

## Class 12 Science and Commerce

Being added subject by subject, in the same format as the Arts subjects. Done so far:

- **Physics** (14 chapters, from Electric Charges and Fields to Semiconductor Electronics): fuller notes and mind maps (`src/data/notes/physics12.ts`) and 100 questions per chapter in `src/data/class12/physics/ch01–ch14.ts` — 60 MCQs, 10 assertion–reason and 30 written answers (10 × 2, 12 × 3, 8 × 5 marks), with worked numericals. Formulas in the questions use plain Unicode (×, ², ε₀, λ); the notes use KaTeX. Topics dropped from the current syllabus (potentiometer, meter bridge, cyclotron, transistors, logic gates, special-purpose diodes) are left out.
- The notes reader's "100-question mock test" button switches to a stream that has the subject (Science (PCM) for Physics).
- The Class 12 Library follows the selected stream and lists the subjects that have material; the others are named as coming soon.

Still to come: Chemistry, Mathematics, Biology, Computer Science, Accountancy, Business Studies and Applied Mathematics.

## Class 10 — full chapter sets

Being brought up to the Class 12 standard subject by subject. Done so far:

- **Science** (13 chapters): fuller notes and mind maps (`src/data/notes/science10.ts` — about 10 points and 4 key terms a chapter) and **100 questions with model answers per chapter** — 60 MCQs, 10 assertion–reason, 30 written answers in the board pattern (2, 3 and 5 marks), with worked numericals for Light and Electricity. Sets are in `src/data/class10/<subject>/chNN.ts`, built with `chapterSet(..., { grade: 10, spreadAnswers: true })`, and load with the question bank. Topics assessed only in school in 2026-27 (evolution; electric motor and generator) are left out of the sets.
- **Mathematics** (14 chapters): fuller notes and mind maps (`src/data/notes/maths10.ts`) and 100 questions per chapter in the same pattern, every numerical worked step by step. Topics removed in the rationalised syllabus — Euclid’s division lemma, cross-multiplication, completing the square, area of a triangle by coordinates, complementary-angle ratios, area of similar triangles and the Pythagoras proof, frustum, conversion of solids and ogives — are left out.
- **Social Science** (21 chapters — History, Geography, Civics, Economics): fuller notes and mind maps (`src/data/notes/sst10.ts`) and 100 questions per chapter in the same pattern. Board-scope notes from the 2026-27 syllabus are kept in the notes: The Making of a Global World (sub-topics 1–1.3 only), The Age of Industrialisation (periodic assessment only), Lifelines of National Economy (map work only) and Globalisation (the first two sections only).
- **English** (25 chapters — First Flight prose and poems, Footprints without Feet): fuller notes and mind maps (`src/data/notes/english10.ts`) and 100 questions per chapter in the same pattern — comprehension, character, theme and poetic-device MCQs, assertion–reason, and 2-, 3- and 5-mark answers. Questions describe and discuss the texts without reproducing them. The Grammar, Writing Skills and Reading Comprehension notes have no chapter set, so they show no mock-test button.
- **Hindi** (15 chapters — Kshitij Part 2 and Kritika Part 2, Course A): fuller notes and mind maps (`src/data/notes/hindi10.ts`) and 100 questions per chapter in the same pattern, written in Hindi, with assertion–reason items in CBSE’s Hindi wording (`chapterSet(..., { lang: 'hi' })`). Questions discuss the texts without reproducing them. The Vyakaran and Lekhan notes have no chapter set, so they show no mock-test button.
- `src/data/chapterSets.ts` lists the subjects that have full sets; the notes reader shows the "100-question mock test" button only for those.

All five Class 10 subjects now have full chapter sets.

## Digital Library

`src/data/library.json` lists 211 Class 10 resources, every link checked when built:

- **Official (opened on the official site):** 99 NCERT textbook chapter PDFs, 25 NCERT Exemplar chapters (chapters dropped from the syllabus left out), 10 CBSE 2026-27 syllabus PDFs.
- **Publisher pages (linked, not copied):** chapter notes from PW and Oswaal, subject notes, important questions and NCERT solutions from Educart, Oswaal mind maps (2022), EduRev's Class 10 page. PW pages are matched to chapters by their page titles, not their numbering.

### PDFs hosted on the site

`public/pdfs/` holds 54 resources (64 files, about 60 MB) shared with the owner's permission, built by `scripts/uploads/build_uploads.py` into `src/data/uploads.json`:

- **Revision notes:** Hinglish topper notes (Acids, Metals, Life Processes, Light, Human Eye), Our Environment notes, METAPHASE hand-written Heredity notes, Social Science 5-minute sheets.
- **Hunny Tutorials:** chapter-wise CBSE board questions 2022–26 and sample-paper questions 2019–25 for Science, plus Circles and Areas Related to Circles material.
- **Worksheets and practice:** Real Numbers and Polynomials worksheets, an 11-chapter case-study booklet, mid-term important questions and practice papers, LibreOffice Base practicals.
- **Papers:** school half-yearly papers 2026-27 (Maths, Science, Social Science), CBSE English 2026 board papers (5 series × 3 sets, grouped), the Maths Standard 2026 paper 30/4/2, and CBSE 2026-27 sample papers.

Each file is listed once and appears wherever it belongs: the Library, the chapter's PDFs tab in the notes reader, Board Prep's “Full papers to attempt” card, the matching rows in Sample Papers (“Read here”), and search. Scanned files are re-encoded (JPEG, max 1700 px) to keep the site light; exact duplicates in the source folder were skipped. Files with students' personal data, a personal planner, and a third-party practice paper that only looked like a CBSE paper are never published (`NEVER` in the script).

NCERT and CBSE send `X-Frame-Options: SAMEORIGIN`, so their PDFs cannot be shown inside the app; "Read online" opens them in the browser's PDF viewer. Publisher notes are copyrighted, so they are linked rather than re-hosted.

Board Prep follows CBSE's 2026-27 Class 10 curriculum and sample papers (paper design unchanged from 2025-26), including the parts assessed only in school. The new optional Advanced-level Mathematics and Science courses start in Class 9 in 2026-27 and do not affect this year's Class 10 board exam.

## Rebuilding the data

`scripts/bank/`, `scripts/library/` and `scripts/uploads/` hold the Python scripts (needs `pypdf`) that built the paper catalogues, the question bank and the library. Each takes input/output paths as arguments; re-run them when CBSE publishes a new session.
