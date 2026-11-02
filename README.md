# EduGenie AI

Adaptive learning platform for Indian Classes 7–12 (CBSE / ICSE / State Board). React + TypeScript + Tailwind v4 + Zustand + KaTeX, built with Vite.

```bash
npm install
npm run dev
```

## Modules

| View | File | Notes |
| --- | --- | --- |
| Shell, board/grade/stream state | `src/store.ts`, `src/components/Header.tsx`, `StreamModal.tsx` | Class 11–12 forces a stream choice; state persists in localStorage |
| Dashboard | `src/views/Dashboard.tsx` | Subjects come from `src/data/curriculum.ts` per grade + stream; a subject card opens Practice with it selected |
| AI Doubt Solver | `src/views/DoubtSolver.tsx` | Scoped to the chosen subject + chapter; answers split into steps / rule / board pitfall + mark keywords |
| Practice & Test engine | `src/views/Practice.tsx` | Subject → chapter → timed quiz with palette → report with retry-missed |
| Sample Papers Vault | `src/views/Papers.tsx`, `src/components/OfficialResources.tsx` | Official CBSE / CISCE / State Board links, plus EduGenie mock papers |
| Formula & Revision | `src/views/Revision.tsx` | Flip-card carousel and printable cheat sheet |

Math anywhere in content uses `$inline$` and `$$display$$`, rendered by `src/components/MathText.tsx`.

## Class → Subject → Chapter

`selectedSubject` and `selectedChapter` live in the global store next to board, class and stream, so a choice made in the Doubt Solver carries into Practice and back. Changing class or stream clears them.

`src/components/SubjectChapterPicker.tsx` is the shared picker: subject chips for the class/stream, then a chapter box where students type their chapter or pick from suggestions. Suggestions are NCERT chapters per class and subject (`chaptersFor` in `src/data/curriculum.ts`); ICSE and State Board students can type their own book's chapter name.

Each subject has a `kind` (`math`, `science`, `english`, `hindi`, `social`, `commerce`, `cs`). It drives the sample prompts, the answer block labels and the AI instructions. English and Hindi are literature and language (character sketches, themes, poetic devices, grammar, comprehension) and never get numerical questions.

## Live AI (Claude)

Two endpoints, served by a Vite plugin (`server/plugin.ts`) so the API key stays on the server:

- `POST /api/doubt` (`server/doubt.ts`): the question, an optional textbook photo and the last 10 turns go to `claude-opus-5-5`, scoped to board, class, stream, subject and chapter.
- `POST /api/practice` (`server/practice.ts`): generates gradable questions (MCQ, assertion-reason, exact short answers) for one subject and chapter.

```bash
cp .env.example .env.local   # then set ANTHROPIC_API_KEY
npm run dev
```

Without a key both endpoints return `no_credentials`:

- the Doubt Solver falls back to demo answers in `src/data/doubts.ts`, with a banner;
- Practice uses only offline questions for the exact class, subject and chapter. If there are none, it says so instead of showing another subject's questions.

Refused requests are retried on a fallback model server-side (`fallbacks: "default"`); other errors show in the UI.

The endpoints run on `npm run dev` and `npm run preview`. A static host (`dist/` only) has no `/api/*`; deploy `server/` behind a serverless function or Node server there.

## Offline data

- `src/data/questions.ts` — offline question bank for Class 10 (Maths, Science, English, Social Science), typed by `src/types/quiz.ts`. Questions are only ever used for their own class, subject and chapter.
- `src/data/officialLinks.ts` — official board portals (CBSE Academic SQP pages, CISCE, State Boards).
- `src/data/papers.ts` — generated mock catalogue for timed practice.
