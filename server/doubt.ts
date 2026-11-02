import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { z } from 'zod';
import { kindOf, type SubjectKind } from '../src/data/curriculum';

/** Same shape as `AiAnswer` in src/data/doubts.ts — the UI renders it into the three collapsible blocks. */
const AnswerSchema = z.object({
  steps: z.string(),
  formula: z.string(),
  pitfall: z.string(),
  markKeywords: z.array(z.string()),
  examTag: z.string().optional(),
});

export interface DoubtRequest {
  board: string;
  grade: number;
  stream: string;
  subject: string;
  chapter: string;
  question: string;
  image?: { mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'; data: string }; // base64, no data: prefix
  history: { role: 'user' | 'assistant'; text: string }[];
}

export class DoubtError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}

/** What a good answer looks like per subject — English and Hindi are literature and language, never numericals. */
export const SUBJECT_GUIDANCE: Record<SubjectKind, { focus: string; formula: string }> = {
  english: {
    focus:
      'This is an English literature and language subject. Focus on literature analysis, character sketches, themes, poetic and literary devices (with the quoted line and its effect), grammar rules with examples, and comprehension. Never turn the answer into a numerical or mathematical problem, and do not use LaTeX.',
    formula: 'the grammar rule, literary device, or answer-writing format used (no math)',
  },
  hindi: {
    focus:
      'This is a Hindi literature and language subject. Focus on the summary (saransh), character sketches, central idea (mool bhaav), poetic devices (alankar) and vyakaran rules with examples. Reply in simple Hindi written in Devanagari unless the student writes in English. No numericals and no LaTeX.',
    formula: 'the vyakaran rule, alankar, or answer-writing format used (no math)',
  },
  math: { focus: 'Solve step by step, showing every step that earns marks.', formula: 'the core formula or theorem used, as display math' },
  science: { focus: 'Explain the concept with definitions, reactions or laws, and work numericals step by step with units.', formula: 'the core formula, law or chemical equation used, as display math' },
  social: { focus: 'Answer with key events, dates, causes and effects, and important terms, in point form where it suits board answers. No numericals or LaTeX unless the question needs a figure.', formula: 'the key concept or definition the answer rests on' },
  commerce: { focus: 'Explain with definitions and worked examples (journal entries, formats or calculations where relevant).', formula: 'the key format, formula or principle used' },
  cs: { focus: 'Explain with short Python or SQL examples inside ``` fenced blocks.', formula: 'the key syntax, rule or concept used' },
};

const systemPrompt = (r: DoubtRequest) => {
  const g = SUBJECT_GUIDANCE[kindOf(r.subject)];
  return `You are EduGenie, a doubt solver for Indian school students.

Student: ${r.board} board, Class ${r.grade}${r.grade >= 11 ? `, ${r.stream} stream` : ''}.
Subject: ${r.subject}. Chapter: ${r.chapter}.

Scope:
- Answer only for ${r.subject}, chapter "${r.chapter}", within the ${r.board} Class ${r.grade} syllabus (NCERT for CBSE). Do not bring in another subject, another board's chapters, or another board's marking pattern.
- If the question belongs to a different subject or chapter, say so briefly in steps and suggest switching the subject or chapter, then answer only what fits "${r.chapter}".
- ${g.focus}
- If you are unsure of a board-specific fact (marks distribution, chapter placement), say that it should be checked against the latest official syllabus rather than guessing.

Tone: ${
  r.grade <= 8
    ? 'simple language and everyday analogies; short sentences.'
    : r.grade <= 10
      ? 'clear, board-exam focused; show every step that earns marks.'
      : 'academically rigorous with formal terminology. Set examTag to "Relevant for JEE/NEET" (or JEE / NEET / CUET alone) when the concept carries over to that exam; otherwise leave it out.'
}

Output fields:
- steps: the direct step-by-step answer. Bold step labels with **Step 1 — ...**. Put a blank line between steps.
- formula: ${g.formula}.
- pitfall: the most common mistake students make on this in board exams, and how marks are awarded (${
  r.board === 'ICSE' ? 'ICSE marks precise keywords and definitions' : 'CBSE awards step marks'
}). Bold the words examiners look for.
- markKeywords: 2–5 short phrases an examiner looks for.

Math (only when the subject needs it): write math in LaTeX with $...$ inline and $$...$$ for display. Chemical formulas use \\mathrm{}, e.g. $\\mathrm{H_2SO_4}$. Never use \\( \\) or \\[ \\]. A diagram may be drawn as ASCII art inside a \`\`\` fenced block in steps.`;
};

let client: Anthropic | null = null;

/** Shared client; throws `no_credentials` so the UI can fall back to offline content. */
export function claude(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    throw new DoubtError(503, 'no_credentials', 'ANTHROPIC_API_KEY is not set on the server.');
  }
  return (client ??= new Anthropic());
}

export async function solveDoubt(r: DoubtRequest) {
  if (!r.subject || !r.chapter) throw new DoubtError(400, 'missing_scope', 'Choose a subject and chapter first.');
  const client = claude();

  const messages: Anthropic.Beta.BetaMessageParam[] = r.history.map((m) => ({ role: m.role, content: m.text }));
  const content: Anthropic.Beta.BetaContentBlockParam[] = [];
  if (r.image) content.push({ type: 'image', source: { type: 'base64', media_type: r.image.mediaType, data: r.image.data } });
  content.push({ type: 'text', text: r.question || 'Solve the question in this textbook photo.' });
  messages.push({ role: 'user', content });

  const response = await client.beta.messages.parse({
    model: 'claude-opus-5-5',
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'medium', format: betaZodOutputFormat(AnswerSchema) },
    system: systemPrompt(r),
    messages,
  });

  if (response.stop_reason === 'refusal') {
    throw new DoubtError(422, 'refusal', 'EduGenie can’t help with that question.');
  }
  if (!response.parsed_output) {
    throw new DoubtError(502, 'bad_output', 'The answer could not be read. Please try again.');
  }
  return response.parsed_output;
}
