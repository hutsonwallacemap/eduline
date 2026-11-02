import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { doubtApi } from './server/plugin';

export default defineConfig(({ mode }) => {
  // Load ANTHROPIC_* from .env.local into the server process only (never exposed to the client bundle).
  for (const [k, v] of Object.entries(loadEnv(mode, process.cwd(), 'ANTHROPIC_'))) process.env[k] ??= v;
  return {
    plugins: [react(), tailwindcss(), doubtApi()],
  };
});
