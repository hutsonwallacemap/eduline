import type { Difficulty, Question } from '../../types/quiz';

/** Compact forms for writing chapter question sets (100 per chapter) — Class 12, and Class 10 via `grade: 10`. */
export type Mcq = [question: string, options: string[], correct: number, explanation: string];
export type Ar = [assertion: string, reason: string, correct: number, explanation: string];
export type Written = [marks: number, question: string, answer: string];

const AR_OPTIONS = [
  'Both A and R are true, and R is the correct explanation of A.',
  'Both A and R are true, but R is not the correct explanation of A.',
  'A is true, but R is false.',
  'A is false, but R is true.',
];

/** Hindi wording used by CBSE for assertion–reason items in Hindi papers. */
const AR_OPTIONS_HI = [
  'कथन (A) और कारण (R) दोनों सही हैं तथा कारण (R), कथन (A) की सही व्याख्या करता है।',
  'कथन (A) और कारण (R) दोनों सही हैं, परंतु कारण (R), कथन (A) की सही व्याख्या नहीं करता है।',
  'कथन (A) सही है, परंतु कारण (R) गलत है।',
  'कथन (A) गलत है, परंतु कारण (R) सही है।',
];

const SOURCE = 'EduGenie chapter question';

/** Turns one chapter's MCQs, assertion–reason items and written questions (with model answers) into Questions. */
/** Rotates an MCQ's options by a fixed, index-based step so correct answers are spread across A–D. */
function spread([question, options, correct, explanation]: Mcq, i: number): Mcq {
  const k = (i * 3 + 1) % options.length;
  const out = options.map((_, j) => options[(j - k + options.length) % options.length]);
  return [question, out, (correct + k) % options.length, explanation];
}

export function chapterSet(code: string, subject: string, chapter: string, set: { mcq: Mcq[]; ar: Ar[]; written: Written[] }, opts: { spreadAnswers?: boolean; grade?: number; lang?: 'hi' } = {}): Question[] {
  let n = 0;
  const grade = opts.grade ?? 12;
  const mcqs = opts.spreadAnswers ? set.mcq.map(spread) : set.mcq;
  const base = (difficulty: Difficulty, marks: number) => ({ id: `${code}-${++n}`, subject, chapter, grade, difficulty, marks, source: SOURCE });
  return [
    ...mcqs.map(([question, options, correctAnswer, explanation], i): Question => ({
      ...base(i % 3 === 0 ? 'Easy' : 'Moderate', 1), type: 'mcq', question, options, correctAnswer, explanation,
    })),
    ...set.ar.map(([a, r, correctAnswer, explanation]): Question => ({
      ...base('Board Exam Level', 1), type: 'assertion_reason', question: opts.lang === 'hi' ? `**कथन (A):** ${a}\n**कारण (R):** ${r}` : `**Assertion (A):** ${a}\n**Reason (R):** ${r}`,
      options: opts.lang === 'hi' ? AR_OPTIONS_HI : AR_OPTIONS, correctAnswer, explanation,
    })),
    ...set.written.map(([marks, question, explanation]): Question => ({
      ...base('Board Exam Level', marks), type: 'descriptive', question, correctAnswer: '', explanation,
    })),
  ];
}
