import Anthropic from '@anthropic-ai/sdk';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Connect, Plugin } from 'vite';
import { DoubtError, solveDoubt, type DoubtRequest } from './doubt';
import { generatePractice, type PracticeRequest } from './practice';

const MAX_BODY = 8 * 1024 * 1024; // photos are sent as base64

function readJson(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => {
      size += c.length;
      if (size > MAX_BODY) {
        reject(new DoubtError(413, 'too_large', 'Image is too large (max ~5 MB).'));
        req.destroy();
      } else chunks.push(c);
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch {
        reject(new DoubtError(400, 'bad_json', 'Invalid request body.'));
      }
    });
    req.on('error', reject);
  });
}

const send = (res: ServerResponse, status: number, body: unknown) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
};

const ROUTES: Record<string, (body: unknown) => Promise<unknown>> = {
  '/api/doubt': (body) => solveDoubt(body as DoubtRequest),
  '/api/practice': async (body) => ({ questions: await generatePractice(body as PracticeRequest) }),
};

const handler: Connect.NextHandleFunction = async (req, res, next) => {
  const route = ROUTES[req.url ?? ''];
  if (!route) return next();
  if (req.method !== 'POST') return send(res, 405, { error: 'method_not_allowed' });
  try {
    send(res, 200, await route(await readJson(req)));
  } catch (err) {
    if (err instanceof DoubtError) return send(res, err.status, { error: err.code, message: err.message });
    if (err instanceof Anthropic.AuthenticationError) return send(res, 503, { error: 'no_credentials', message: 'The server’s Anthropic API key was rejected.' });
    if (err instanceof Anthropic.RateLimitError) return send(res, 429, { error: 'rate_limited', message: 'Too many requests at once — try again in a minute.' });
    if (err instanceof Anthropic.APIError) return send(res, 502, { error: 'upstream', message: `Claude API error ${err.status ?? ''}`.trim() });
    console.error(err);
    send(res, 500, { error: 'internal', message: 'Something went wrong.' });
  }
};

/** Serves POST /api/doubt and /api/practice from the Vite dev and preview servers, keeping the API key server-side. */
export function doubtApi(): Plugin {
  return {
    name: 'edugenie-doubt-api',
    configureServer: (server) => void server.middlewares.use(handler),
    configurePreviewServer: (server) => void server.middlewares.use(handler),
  };
}
