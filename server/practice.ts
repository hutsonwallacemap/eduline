import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { z } from 'zod';
import { kindOf } from '../src/data/curriculum.js';
import type { Difficulty, Question, QuestionType } from '../src/types/quiz';
import { claude, DoubtError, SUBJECT_GUIDANCE } from './doubt.js';

const QuestionSchema = z.object({
  type: z.enum(['mcq', 'assertion_reason', 'short_answer']),
  question: z.string(),
  options: z.array(z.string()), // 4 for mcq / assertion_reason, empty for short_answer
  correctOption: z.number().int(), // index into options; -1 for short_answer
  acceptedAnswers: z.array(z.string()), // short_answer only; empty otherwise
  explanation: z.string(),
  markKeywords: z.array(z.string()),
  hint: z.string(),
  marks: z.number().int(),
});

export interface PracticeRequest {
  board: string;
  grade: number;
  stream: string;
  subject: string;
  chapter: string;
  difficulty: Difficulty;
  types: QuestionType[];
  count: number;
}

const AR_OPTIONS = [
  'Both A and R are true, and R is the correct explanation of A.',
  'Both A and R are true, but R is not the correct explanation of A.',
  'A is true, but R is false.',
  'A is false, but R is true.',
];

const DIFFICULTY: Record<Difficulty, string> = {
  Easy: 'foundational: direct recall and one-step application',
  Moderate: 'moderate: two-step reasoning and common board patterns',
  'Board Exam Level': 'board standard: the mix and depth of a real board paper, including case-based and higher-order questions',
};

const systemPrompt = (r: PracticeRequest) => {
  const kind = kindOf(r.subject);
  const language = kind === 'english' || kind === 'hindi';
  return `You write practice questions for Indian school students.

Student: ${r.board} board, Class ${r.grade}${r.grade >= 11 ? `, ${r.stream} stream` : ''}.
Subject: ${r.subject}. Chapter: ${r.chapter}.

Rules:
- Every question must test ${r.subject}, chapter "${r.chapter}", at the ${r.board} Class ${r.grade} level (NCERT for CBSE). No question from any other subject or chapter.
- ${SUBJECT_GUIDANCE[kind].focus}
${
  language
    ? `- For ${r.subject}, write questions on characters, themes, events, literary or poetic devices, vocabulary in context, grammar and comprehension of this chapter. No numerical or mathematical questions of any kind.`
    : ''
}
- Difficulty: ${DIFFICULTY[r.difficulty]}.
- Use only these question types: ${r.types.join(', ')}. Spread them roughly evenly.
- mcq: exactly 4 options, one correct; correctOption is its 0-based index; acceptedAnswers is empty.
- assertion_reason: question is "**Assertion (A):** ...\\n**Reason (R):** ..."; options must be exactly the 4 standard options in order: ${AR_OPTIONS.map((o) => `"${o}"`).join(', ')}; correctOption is the index.
- short_answer: only when the answer is a single word, number or short phrase that can be checked exactly. options is empty, correctOption is -1, and acceptedAnswers lists every acceptable spelling or form (e.g. "110", "110 W").
- explanation: a step-by-step solution or justification aligned to the board's marking scheme.
- hint: one short nudge that does not give the answer away.
- marks: 1 for mcq and assertion_reason; 1–2 for short_answer.
- Math, if the subject needs it, in LaTeX with $...$ inline and $$...$$ display.`;
};

export async function generatePractice(r: PracticeRequest): Promise<Question[]> {
  if (!r.subject || !r.chapter) throw new DoubtError(400, 'missing_scope', 'Choose a subject and chapter first.');
  const count = Math.min(Math.max(1, Math.round(r.count)), 20);
  const types = r.types.filter((t): t is QuestionType => ['mcq', 'assertion_reason', 'short_answer'].includes(t));
  if (!types.length) throw new DoubtError(400, 'bad_types', 'Choose at least one question type.');

  const response = await claude().beta.messages.parse({
    model: 'claude-opus-5-5',
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'medium', format: betaZodOutputFormat(z.object({ questions: z.array(QuestionSchema) })) },
    system: systemPrompt({ ...r, types }),
    messages: [{ role: 'user', content: `Write ${count} questions.` }],
  });

  if (response.stop_reason === 'refusal') throw new DoubtError(422, 'refusal', 'Questions could not be generated for this chapter.');
  if (!response.parsed_output) throw new DoubtError(502, 'bad_output', 'The questions could not be read. Please try again.');

  // Keep only questions that can be graded automatically.
  const stamp = Date.now().toString(36);
  const questions: Question[] = [];
  response.parsed_output.questions.forEach((q, i) => {
    if (!types.includes(q.type)) return;
    const base = {
      id: `ai-${stamp}-${i}`,
      type: q.type,
      subject: r.subject,
      chapter: r.chapter,
      grade: r.grade,
      difficulty: r.difficulty,
      question: q.question,
      explanation: q.explanation,
      markKeywords: q.markKeywords,
      hint: q.hint || undefined,
      marks: q.marks || 1,
    };
    if (q.type === 'short_answer') {
      if (q.acceptedAnswers.length) questions.push({ ...base, correctAnswer: q.acceptedAnswers.join('|') });
    } else if (q.options.length === 4 && q.correctOption >= 0 && q.correctOption < 4) {
      questions.push({ ...base, options: q.type === 'assertion_reason' ? AR_OPTIONS : q.options, correctAnswer: q.correctOption });
    }
  });
  if (!questions.length) throw new DoubtError(502, 'bad_output', 'No usable questions came back. Please try again.');
  return questions.slice(0, count);
}
