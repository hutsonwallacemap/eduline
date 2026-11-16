import type { Difficulty, Question } from '../../types/quiz';

/** Compact forms for writing Class 12 chapter question sets (100 per chapter). */
export type Mcq = [question: string, options: string[], correct: number, explanation: string];
export type Ar = [assertion: string, reason: string, correct: number, explanation: string];
export type Written = [marks: number, question: string, answer: string];

const AR_OPTIONS = [
  'Both A and R are true, and R is the correct explanation of A.',
  'Both A and R are true, but R is not the correct explanation of A.',
  'A is true, but R is false.',
  'A is false, but R is true.',
];

const SOURCE = 'EduGenie chapter question';

/** Turns one chapter's MCQs, assertion–reason items and written questions (with model answers) into Questions. */
export function chapterSet(code: string, subject: string, chapter: string, set: { mcq: Mcq[]; ar: Ar[]; written: Written[] }): Question[] {
  let n = 0;
  const base = (difficulty: Difficulty, marks: number) => ({ id: `${code}-${++n}`, subject, chapter, grade: 12, difficulty, marks, source: SOURCE });
  return [
    ...set.mcq.map(([question, options, correctAnswer, explanation], i): Question => ({
      ...base(i % 3 === 0 ? 'Easy' : 'Moderate', 1), type: 'mcq', question, options, correctAnswer, explanation,
    })),
    ...set.ar.map(([a, r, correctAnswer, explanation]): Question => ({
      ...base('Board Exam Level', 1), type: 'assertion_reason', question: `**Assertion (A):** ${a}\n**Reason (R):** ${r}`, options: AR_OPTIONS, correctAnswer, explanation,
    })),
    ...set.written.map(([marks, question, explanation]): Question => ({
      ...base('Board Exam Level', marks), type: 'descriptive', question, correctAnswer: '', explanation,
    })),
  ];
}
