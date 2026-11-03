import raw from './library.json';
import { NOTES, noteKey } from './notes';

/**
 * Class 10 study resources: EduGenie's own chapter notes (read in the app), official NCERT textbooks and
 * exemplars and CBSE syllabi (opened on the official sites), and links to free notes pages from
 * publishers. Nothing third-party is re-hosted: NCERT and CBSE
 * do not allow their PDFs to be embedded on other sites, and publisher notes are their copyright.
 * Built and link-checked by the library scripts; see README.
 */
export type ResourceKind =
  | 'EduGenie Notes'
  | 'NCERT Textbook'
  | 'NCERT Exemplar'
  | 'CBSE Syllabus'
  | 'Notes'
  | 'Mind Map'
  | 'Important Questions'
  | 'NCERT Solutions'
  | 'Learning Platform';

export interface Resource {
  id: string;
  kind: ResourceKind;
  grade: number;
  subject: string;
  chapter: string | null;
  title: string;
  source: string;
  official: boolean;
  url: string;
  format: 'pdf' | 'web' | 'notes';
  noteKey?: string; // for EduGenie notes, opened in the in-app reader
  pages?: number;
  year?: string;
  language: string;
  description: string;
}

/** EduGenie's own chapter notes, listed first and read inside the app. */
const NOTE_RESOURCES: Resource[] = NOTES.map((n, i) => ({
  id: `note${i}`,
  kind: 'EduGenie Notes',
  grade: 10,
  subject: n.subject,
  chapter: n.chapter,
  title: `Chapter notes — ${n.chapter.includes(': ') ? n.chapter.split(': ')[1] : n.chapter}`,
  source: 'EduGenie',
  official: false,
  url: '',
  format: 'notes',
  noteKey: noteKey(n.subject, n.chapter),
  language: n.subject === 'Hindi' ? 'Hindi' : 'English',
  description: n.overview.replace(/\$[^$]*\$/g, '…'),
}));

export const LIBRARY: Resource[] = [...NOTE_RESOURCES, ...(raw as Resource[])];

export const RESOURCE_KINDS: ResourceKind[] = ['EduGenie Notes', 'NCERT Textbook', 'NCERT Exemplar', 'CBSE Syllabus', 'Notes', 'Mind Map', 'Important Questions', 'NCERT Solutions', 'Learning Platform'];

export const hostOf = (url: string) => (url ? new URL(url).hostname.replace(/^www\./, '') : 'eduline');

/** The NCERT chapter PDF for a chapter, if there is one. */
export const ncertChapter = (grade: number, subject: string, chapter: string) =>
  LIBRARY.find((r) => r.kind === 'NCERT Textbook' && r.grade === grade && r.subject === subject && r.chapter === chapter);
