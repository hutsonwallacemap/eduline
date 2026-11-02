import Anthropic from '@anthropic-ai/sdk';
import { DoubtError, solveDoubt, type DoubtRequest } from './doubt.js';
import { generatePractice, type PracticeRequest } from './practice.js';

// Imports in server/ and api/ carry .js extensions so they also resolve as native ESM on Vercel.

const ROUTES: Record<string, (body: unknown) => Promise<unknown>> = {
  '/api/doubt': (body) => solveDoubt(body as DoubtRequest),
  '/api/practice': async (body) => ({ questions: await generatePractice(body as PracticeRequest) }),
};

export const hasRoute = (path: string) => path in ROUTES;

/** Runs an API route and maps every failure to a status + `{ error, message }` the UI understands. */
export async function runRoute(path: string, body: unknown): Promise<{ status: number; body: unknown }> {
  try {
    if (!body || typeof body !== 'object') throw new DoubtError(400, 'bad_json', 'Invalid request body.');
    return { status: 200, body: await ROUTES[path](body) };
  } catch (err) {
    if (err instanceof DoubtError) return { status: err.status, body: { error: err.code, message: err.message } };
    if (err instanceof Anthropic.AuthenticationError)
      return { status: 503, body: { error: 'no_credentials', message: 'The server’s Anthropic API key was rejected.' } };
    if (err instanceof Anthropic.RateLimitError)
      return { status: 429, body: { error: 'rate_limited', message: 'Too many requests at once — try again in a minute.' } };
    if (err instanceof Anthropic.APIError)
      return { status: 502, body: { error: 'upstream', message: `Claude API error ${err.status ?? ''}`.trim() } };
    console.error(err);
    return { status: 500, body: { error: 'internal', message: 'Something went wrong.' } };
  }
}
