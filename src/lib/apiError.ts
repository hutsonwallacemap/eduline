/** Readable message for a failed /api/* call. A 404/405 means no EduGenie API server is behind this page (e.g. a static host). */
export function apiErrorMessage(status: number, body: { message?: string }): string {
  if (status === 404 || status === 405) {
    return 'The AI server isn’t running where this page is hosted. Start the app with “npm run dev” in the edugenie-ai folder, or deploy the server/ code alongside the site (see README).';
  }
  return body.message ?? `Request failed (${status}).`;
}
