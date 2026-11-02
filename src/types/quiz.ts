export type Board = 'CBSE' | 'ICSE' | 'State Board';
export type Difficulty = 'Easy' | 'Moderate' | 'Board Exam Level';
export type QuestionType = 'mcq' | 'assertion_reason' | 'short_answer' | 'descriptive';

export interface Question {
  id: string;
  type: QuestionType;
  subject: string;
  chapter: string;
  grade: number;
  difficulty: Difficulty;
  question: string; // KaTeX enabled: inline $...$ and display $$...$$
  options?: string[];
  correctAnswer: number | string; // option index for mcq / assertion_reason, accepted answers for short_answer, '' for descriptive
  explanation: string; // for board questions: CBSE's marking-scheme answer
  markKeywords?: string[]; // keywords examiners look for (ICSE keyword marking, CBSE step marks)
  hint?: string;
  marks: number;
  source?: string; // e.g. "CBSE Board 2024 · Set 31/1/1"
  sourceUrl?: string; // question paper
  schemeUrl?: string; // marking scheme
}

export interface QuizConfig {
  board: Board;
  grade: number;
  subject: string;
  chapter: string;
  difficulty: Difficulty;
  questionCount: 5 | 10 | 20;
  types: QuestionType[];
  timeLimitMinutes: number;
}

export interface AnswerRecord {
  answer: number | string | null;
  visited: boolean;
  markedForReview: boolean;
  timeSpentSec: number;
}
