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
| Sample Papers Vault | `src/views/Papers.tsx`, `src/components/OfficialResources.tsx` | Official CBSE / CISCE / State Board links, plus 544 real CBSE Class 10/12 sample papers and marking schemes |
| Formula & Revision | `src/views/Revision.tsx` | Flip-card carousel and printable cheat sheet |

Math anywhere in content uses `$inline$` and `$$display$$`, rendered by `src/components/MathText.tsx`.

## Class → Subject → Chapter

`selectedSubject` and `selectedChapter` live in the global store next to board, class and stream, so a choice made in the Doubt Solver carries into Practice and back. Changing class or stream clears them.

`src/components/SubjectChapterPicker.tsx` is the shared picker: subject chips for the class/stream, then a chapter box where students type their chapter or pick from suggestions. Suggestions are NCERT chapters per class and subject (`chaptersFor` in `src/data/curriculum.ts`); ICSE and State Board students can type their own book's chapter name.

Each subject has a `kind` (`math`, `science`, `english`, `hindi`, `social`, `commerce`, `cs`). It drives the sample prompts, the answer block labels and the AI instructions. English and Hindi are literature and language (character sketches, themes, poetic devices, grammar, comprehension) and never get numerical questions.

## Live AI (Claude)

Two endpoints keep the API key on the server. Locally they run in a Vite plugin (`server/plugin.ts`); on Vercel they run as functions in `api/`. Both call the same code in `server/routes.ts`:

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

### Deploying on Vercel

`api/doubt.ts` and `api/practice.ts` deploy as Vercel functions automatically (60 s limit, set in `vercel.json`). Add `ANTHROPIC_API_KEY` under **Project Settings → Environment Variables** and redeploy; `.env.local` is not uploaded. Photo uploads are capped at 3 MB to fit Vercel's 4.5 MB request limit.

Other static hosts serve no `/api/*`; the UI then says the AI server isn't running there.

## Offline data

- `src/data/questions.ts` — offline question bank for Class 10 (Maths, Science, English, Social Science), typed by `src/types/quiz.ts`. Questions are only ever used for their own class, subject and chapter.
- `src/data/officialLinks.ts` — official board portals (CBSE Academic SQP pages, CISCE, State Boards).
- `src/data/cbseSqp.json` — official CBSE Sample Question Papers and Marking Schemes (Class X and XII, sessions 2023-24 to 2026-27), with links to the PDFs on cbseacademic.nic.in. Collected from CBSE's `SQP_CLASSX_<session>.html` and `SQP_CLASSXII_<session>.html` pages. Papers CBSE had not uploaded (its `error.pdf` placeholder) are left out. Re-collect it each session when CBSE publishes new papers.
