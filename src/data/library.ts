import raw from './library.json';

/**
 * Class 10 study resources: official NCERT textbooks and exemplars and CBSE syllabi (opened on the
 * official sites), and links to free notes pages from publishers. Nothing is re-hosted: NCERT and CBSE
 * do not allow their PDFs to be embedded on other sites, and publisher notes are their copyright.
 * Built and link-checked by the library scripts; see README.
 */
export type ResourceKind =
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
  format: 'pdf' | 'web';
  pages?: number;
  year?: string;
  language: string;
  description: string;
}

export const LIBRARY = raw as Resource[];

export const RESOURCE_KINDS: ResourceKind[] = ['NCERT Textbook', 'NCERT Exemplar', 'CBSE Syllabus', 'Notes', 'Mind Map', 'Important Questions', 'NCERT Solutions', 'Learning Platform'];

export const hostOf = (url: string) => new URL(url).hostname.replace(/^www\./, '');

/** The NCERT chapter PDF for a chapter, if there is one. */
export const ncertChapter = (grade: number, subject: string, chapter: string) =>
  LIBRARY.find((r) => r.kind === 'NCERT Textbook' && r.grade === grade && r.subject === subject && r.chapter === chapter);
