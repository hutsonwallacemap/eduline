import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Connect, Plugin } from 'vite';
import { hasRoute, runRoute } from './routes.js';

const MAX_BODY = 4.5 * 1024 * 1024; // same limit as Vercel functions; photos are sent as base64

function readJson(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve) => {
    let size = 0;
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => {
      size += c.length;
      if (size <= MAX_BODY) chunks.push(c);
    });
    req.on('end', () => {
      if (size > MAX_BODY) return resolve(null);
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch {
        resolve(null);
      }
    });
    req.on('error', () => resolve(null));
  });
}

const send = (res: ServerResponse, status: number, body: unknown) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
};

const handler: Connect.NextHandleFunction = async (req, res, next) => {
  const path = req.url ?? '';
  if (!hasRoute(path)) return next();
  if (req.method !== 'POST') return send(res, 405, { error: 'method_not_allowed' });
  const out = await runRoute(path, await readJson(req));
  send(res, out.status, out.body);
};

/** Serves POST /api/doubt and /api/practice from the Vite dev and preview servers (api/ serves them on Vercel). */
export function doubtApi(): Plugin {
  return {
    name: 'edugenie-doubt-api',
    configureServer: (server) => void server.middlewares.use(handler),
    configurePreviewServer: (server) => void server.middlewares.use(handler),
  };
}
