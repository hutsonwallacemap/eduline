import type { Question } from '../types/quiz';

/** Helpers for writing EduGenie's own solved questions (Class 10 by default). */
let seq = 0;
const SOURCE = 'EduGenie solved question';

export const mcq = (subject: string, chapter: string, question: string, options: string[], correct: number, explanation: string, grade = 10): Question => ({
  id: `e10-${++seq}`,
  type: 'mcq',
  subject,
  chapter,
  grade,
  difficulty: 'Board Exam Level',
  question,
  options,
  correctAnswer: correct,
  explanation,
  marks: 1,
  source: SOURCE,
});

/** A written-answer question with a model answer in the marking-scheme style. */
export const describe = (subject: string, chapter: string, question: string, answer: string, marks: number, grade = 10): Question => ({
  id: `e10-${++seq}`,
  type: 'descriptive',
  subject,
  chapter,
  grade,
  difficulty: 'Board Exam Level',
  question,
  correctAnswer: '',
  explanation: answer,
  marks,
  source: SOURCE,
});
