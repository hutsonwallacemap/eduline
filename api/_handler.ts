import type { IncomingMessage, ServerResponse } from 'node:http';
import { runRoute } from '../server/routes.js';

/** Vercel Node function for one API route. Vercel parses JSON bodies into `req.body`. */
export const vercelRoute =
  (path: string) =>
  async (req: IncomingMessage & { body?: unknown }, res: ServerResponse) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.method !== 'POST') {
      res.statusCode = 405;
      return res.end(JSON.stringify({ error: 'method_not_allowed' }));
    }
    const out = await runRoute(path, req.body);
    res.statusCode = out.status;
    res.end(JSON.stringify(out.body));
  };
