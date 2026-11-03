import { MATHS10_NOTES } from './maths10';
import { SCIENCE10_NOTES } from './science10';
import { SST10_NOTES } from './sst10';
import type { ChapterNote } from './types';

export type { ChapterNote } from './types';

/** All original EduGenie chapter notes (Class 10). */
export const NOTES: ChapterNote[] = [...MATHS10_NOTES, ...SCIENCE10_NOTES, ...SST10_NOTES];

export const noteKey = (subject: string, chapter: string) => `${subject}|${chapter}`;

const byKey = new Map(NOTES.map((n) => [noteKey(n.subject, n.chapter), n]));

export const noteFor = (subject: string, chapter: string) => byKey.get(noteKey(subject, chapter));
