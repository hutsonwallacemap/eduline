export type Board = 'CBSE' | 'ICSE' | 'State Board';
export type Difficulty = 'Easy' | 'Moderate' | 'Board Exam Level';
export type QuestionType = 'mcq' | 'assertion_reason' | 'short_answer';

export interface Question {
  id: string;
  type: QuestionType;
  subject: string;
  chapter: string;
  grade: number;
  difficulty: Difficulty;
  question: string; // KaTeX enabled: inline $...$ and display $$...$$
  options?: string[];
  correctAnswer: number | string; // option index for mcq / assertion_reason, accepted answer for short_answer
  explanation: string;
  markKeywords?: string[]; // keywords examiners look for (ICSE keyword marking, CBSE step marks)
  hint?: string;
  marks: number;
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
