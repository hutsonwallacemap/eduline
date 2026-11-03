import raw from './library.json';
import { NOTES, noteKey } from './notes';
import uploads from './uploads.json';

/**
 * Class 10 study resources: EduGenie's own chapter notes (read in the app), official NCERT textbooks and
 * exemplars and CBSE syllabi (opened on the official sites), links to free notes pages from publishers,
 * and PDFs hosted on this site (shared revision notes, chapter-wise question banks, worksheets, school
 * papers, and copies of CBSE board and sample papers) that open in the in-app PDF reader.
 * Publisher pages are linked, never copied. Built by scripts/library and scripts/uploads; see README.
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
  | 'Learning Platform'
  | 'Revision Notes'
  | 'Chapter-wise PYQs'
  | 'Worksheet'
  | 'Practice Paper'
  | 'School Exam Paper'
  | 'CBSE Board Paper'
  | 'CBSE Sample Paper';

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
  format: 'pdf' | 'web' | 'notes' | 'hosted'; // hosted = a PDF on this site, read in the app
  chapters?: string[]; // hosted PDFs that cover several chapters
  parts?: { label: string; url: string; pages: number }[]; // sets of one board-paper series
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

type Upload = Omit<Resource, 'grade' | 'chapter' | 'format' | 'year'> & { chapters: string[]; year: string | null };

/** PDFs hosted in public/pdfs, each listed once; see scripts/uploads/build_uploads.py. */
export const HOSTED: Resource[] = (uploads as Upload[]).map((u) => ({
  ...u,
  grade: 10,
  chapter: u.chapters.length === 1 ? u.chapters[0] : null,
  format: 'hosted',
  year: u.year ?? undefined,
}));

export const LIBRARY: Resource[] = [...NOTE_RESOURCES, ...HOSTED, ...(raw as Resource[])];

export const RESOURCE_KINDS: ResourceKind[] = [
  'EduGenie Notes', 'Revision Notes', 'Chapter-wise PYQs', 'Important Questions', 'Worksheet', 'CBSE Board Paper', 'CBSE Sample Paper',
  'School Exam Paper', 'Practice Paper', 'NCERT Textbook', 'NCERT Exemplar', 'NCERT Solutions', 'CBSE Syllabus', 'Notes', 'Mind Map', 'Learning Platform',
];

/** Whether a resource belongs to a chapter (hosted PDFs can cover several). */
export const coversChapter = (r: Resource, chapter: string) => r.chapter === chapter || !!r.chapters?.includes(chapter);

/** Hosted PDFs for one chapter: the chapter's own files first, then multi-chapter ones. */
export const hostedForChapter = (subject: string, chapter: string) =>
  HOSTED.filter((r) => r.subject === subject && coversChapter(r, chapter)).sort((a, b) => (a.chapters?.length ?? 1) - (b.chapters?.length ?? 1));

export const hostOf = (url: string) => (url ? new URL(url).hostname.replace(/^www\./, '') : 'eduline');

/** The NCERT chapter PDF for a chapter, if there is one. */
export const ncertChapter = (grade: number, subject: string, chapter: string) =>
  LIBRARY.find((r) => r.kind === 'NCERT Textbook' && r.grade === grade && r.subject === subject && r.chapter === chapter);
