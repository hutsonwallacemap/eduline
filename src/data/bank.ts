import type { Question, QuestionType } from '../types/quiz';
import { CLASS10_ENGLISH, CLASS10_SST } from './class10Humanities';
import { CLASS10_MATHS } from './class10Maths';
import { CLASS10_SCIENCE } from './class10Science';
import { QUESTION_BANK } from './questions';

/** EduGenie's own solved questions (hand-written, with model answers). */
export const AUTHORED: Question[] = [...QUESTION_BANK, ...CLASS10_MATHS, ...CLASS10_SCIENCE, ...CLASS10_SST, ...CLASS10_ENGLISH];

/**
 * Offline question bank: questions and official answers taken from CBSE board papers (2022–2026)
 * and CBSE sample question papers with their marking schemes. Built by the extraction scripts and
 * loaded on demand so the first page stays light. Hand-written questions from questions.ts are merged in.
 */
interface BankRecord {
  id: string;
  g: 10 | 12; // class
  s: string; // app subject
  c: string | null; // chapter, or null when the question spans chapters
  t: 'mcq' | 'assertion_reason' | 'descriptive';
  q: string;
  o?: string[];
  a?: number;
  x: string; // marking-scheme answer
  m: number;
  src: string;
  u: string; // question paper
  mu: string; // marking scheme
}

export const ALL_CHAPTERS = 'All chapters';
export const MIXED_CHAPTER = 'Mixed (board paper)';

const toQuestion = (r: BankRecord): Question => ({
  id: r.id,
  type: r.t,
  subject: r.s,
  chapter: r.c ?? MIXED_CHAPTER,
  grade: r.g,
  difficulty: 'Board Exam Level',
  question: r.q,
  options: r.o,
  correctAnswer: r.t === 'descriptive' ? '' : (r.a ?? 0),
  explanation: r.x,
  marks: r.m,
  source: r.src,
  sourceUrl: r.u,
  schemeUrl: r.mu,
});

let cache: Promise<Question[]> | null = null;

export function loadBank(): Promise<Question[]> {
  return (cache ??= import('./bank.json').then((m) => [...AUTHORED, ...(m.default as BankRecord[]).map(toQuestion)]));
}

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();

const shuffle = <T,>(xs: T[]) => {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const inScope = (q: Question, grade: number, subject: string, chapter: string) =>
  q.grade === grade && q.subject === subject && (chapter === ALL_CHAPTERS || norm(q.chapter) === norm(chapter));

/** Questions for a test: same class, subject and chapter only; chosen difficulty first, in random order. */
export async function pickQuestions(cfg: { grade: number; subject: string; chapter: string; difficulty: string; types: QuestionType[]; questionCount: number }) {
  const pool = (await loadBank()).filter((q) => inScope(q, cfg.grade, cfg.subject, cfg.chapter) && cfg.types.includes(q.type));
  return [...shuffle(pool.filter((q) => q.difficulty === cfg.difficulty)), ...shuffle(pool.filter((q) => q.difficulty !== cfg.difficulty))].slice(0, cfg.questionCount);
}

/** How many questions each chapter of a subject has, plus the subject total. */
export async function chapterCounts(grade: number, subject: string) {
  const counts: Record<string, number> = {};
  let total = 0;
  for (const q of await loadBank()) {
    if (q.grade !== grade || q.subject !== subject) continue;
    counts[q.chapter] = (counts[q.chapter] ?? 0) + 1;
    total++;
  }
  return { counts, total };
}

/* ---------- Search, for the Doubt Solver ---------- */

const STOP = new Set(
  'the a an of to in is are was were and or for on by with as at be this that which what from it its into than then their his her they he she we you your our not no all any each following given above below why how explain define write state describe give two three what\'s mention name find'.split(' '),
);
const tokens = (s: string) => norm(s).match(/[a-z0-9]+/g)?.filter((w) => w.length > 2 && !STOP.has(w)) ?? [];

/** Board questions closest to what the student typed, within their class, subject and chapter. */
export async function searchBank(grade: number, subject: string, chapter: string, query: string, limit = 3): Promise<Question[]> {
  const pool = (await loadBank()).filter((q) => q.grade === grade && q.subject === subject);
  const words = [...new Set(tokens(query))];
  if (!words.length) return [];
  // Rarer words count more (inverse document frequency over the subject's questions).
  const df = new Map<string, number>();
  for (const q of pool) for (const w of new Set(tokens(q.question))) df.set(w, (df.get(w) ?? 0) + 1);
  const idf = (w: string) => Math.log(1 + pool.length / (1 + (df.get(w) ?? 0)));
  const scored = pool
    .map((q) => {
      const qt = new Set(tokens(q.question));
      const at = new Set(tokens(q.explanation));
      let score = 0;
      for (const w of words) score += qt.has(w) ? idf(w) : at.has(w) ? 0.4 * idf(w) : 0;
      if (chapter && chapter !== ALL_CHAPTERS && norm(q.chapter) === norm(chapter)) score *= 1.5;
      return { q, score: score / Math.sqrt(words.length) };
    })
    .filter((x) => x.score >= 1.2)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.q);
}

/** A few questions from the chosen chapter, shortest first, to offer as starting points. */
export async function chapterQuestions(grade: number, subject: string, chapter: string, limit = 4): Promise<Question[]> {
  return (await loadBank())
    .filter((q) => inScope(q, grade, subject, chapter) && q.question.length < 220)
    .sort((a, b) => a.question.length - b.question.length)
    .slice(0, limit);
}
