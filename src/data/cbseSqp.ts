import raw from './cbseSqp.json';

/**
 * Official CBSE Sample Question Papers and Marking Schemes, extracted from the
 * cbseacademic.nic.in SQP pages (Class X and XII, sessions 2023-24 to 2026-27).
 * CBSE publishes SQPs for Classes 10 and 12 only.
 */
export interface CbsePaper {
  cls: 'X' | 'XII';
  session: string;
  subject: string; // CBSE's subject name, e.g. "Mathematics (Standard)"
  sqp: string | null;
  ms: string | null;
  sqpHindi: string | null;
  msHindi: string | null;
}

export const CBSE_PAPERS = raw as CbsePaper[];

export const CBSE_SESSIONS = [...new Set(CBSE_PAPERS.map((p) => p.session))].sort().reverse();

export const cbseClassFor = (grade: number): 'X' | 'XII' => (grade >= 11 ? 'XII' : 'X');

/** Whether a CBSE paper belongs to one of the app's subjects (CBSE splits some into variants). */
export function matchesSubject(appSubject: string, cbseSubject: string): boolean {
  switch (appSubject) {
    case 'Mathematics':
      return cbseSubject.startsWith('Mathematics');
    case 'English':
      return cbseSubject.startsWith('English');
    case 'Hindi':
      return cbseSubject.startsWith('Hindi');
    default:
      return cbseSubject === appSubject;
  }
}
