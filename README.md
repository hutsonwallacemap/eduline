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
| Dashboard | `src/views/Dashboard.tsx` | Subjects come from `src/data/curriculum.ts` per grade + stream |
| AI Doubt Solver | `src/views/DoubtSolver.tsx` | 3 seeded chats; answers split into steps / formula / board pitfall + mark keywords |
| Practice & Test engine | `src/views/Practice.tsx` | Configurator → timed quiz with palette → report with retry-missed |
| Sample Papers Vault | `src/views/Papers.tsx` | Multi-select filters, paper / marking-scheme preview, timed-test launch |
| Formula & Revision | `src/views/Revision.tsx` | Flip-card carousel and printable cheat sheet |

Math anywhere in content uses `$inline$` and `$$display$$`, rendered by `src/components/MathText.tsx`.

## Live AI answers (Claude)

The Doubt Solver calls `POST /api/doubt`, served by a Vite plugin (`server/plugin.ts`) so the API key stays on the server.
`server/doubt.ts` sends the question, an optional textbook photo and the last 10 turns to `claude-opus-5-5` (structured output matching `AiAnswer`), with a system prompt pinned to the selected board, class and stream.

```bash
cp .env.example .env.local   # then set ANTHROPIC_API_KEY
npm run dev
```

Without a key the endpoint returns `no_credentials` and the UI falls back to the curated demo answers in `src/data/doubts.ts`, with a banner.
Refusals and API errors show as an error bubble in the chat. Refused requests are retried on a fallback model server-side (`fallbacks: "default"`).

The endpoint runs on `npm run dev` and `npm run preview`. A static host (`dist/` only) has no `/api/doubt`; deploy `server/doubt.ts` behind a serverless function or Node server there.

## Mock data

- `src/data/questions.ts` — 15 questions (Class 10 Maths + Science) typed by `src/types/quiz.ts`. Other subjects fall back to these with a notice.
- `src/data/papers.ts` — generated catalogue; link real board PDFs in production.
