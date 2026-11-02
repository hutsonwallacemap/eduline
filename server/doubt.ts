import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { z } from 'zod';

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
  question: string;
  image?: { mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'; data: string }; // base64, no data: prefix
  history: { role: 'user' | 'assistant'; text: string }[];
}

export class DoubtError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}

const systemPrompt = (r: DoubtRequest) => `You are EduGenie, a doubt solver for Indian school students.

Student: ${r.board} board, Class ${r.grade}${r.grade >= 11 ? `, ${r.stream} stream` : ''}.

Curriculum:
- Answer strictly within the ${r.board} Class ${r.grade} syllabus (NCERT for CBSE). Do not bring in another board's chapters, notation or marking pattern.
- If a question is outside this syllabus, say so in the steps and give the closest in-syllabus explanation.
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
- formula: the core formula or rule used, as display math.
- pitfall: the most common mistake students make on this in board exams, and how marks are awarded (${
  r.board === 'ICSE' ? 'ICSE marks precise keywords and definitions' : 'CBSE awards step marks'
}). Bold the words examiners look for.
- markKeywords: 2–5 short phrases an examiner looks for.

Math: write all math in LaTeX with $...$ inline and $$...$$ for display. Chemical formulas use \\mathrm{}, e.g. $\\mathrm{H_2SO_4}$. Never use \\( \\) or \\[ \\]. A diagram may be drawn as ASCII art inside a \`\`\` fenced block in steps.`;

let client: Anthropic | null = null;

export async function solveDoubt(r: DoubtRequest) {
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    throw new DoubtError(503, 'no_credentials', 'ANTHROPIC_API_KEY is not set on the server.');
  }
  client ??= new Anthropic();

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
