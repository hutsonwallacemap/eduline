import { ENGLISH10_NOTES } from './english10';
import { GEOGRAPHY12_NOTES } from './geography12';
import { HINDI10_NOTES } from './hindi10';
import { HISTORY12_NOTES } from './history12';
import { MATHS10_NOTES } from './maths10';
import { POLSCI12_NOTES } from './polsci12';
import { SCIENCE10_NOTES } from './science10';
import { SST10_NOTES } from './sst10';
import type { ChapterNote } from './types';

export type { ChapterNote } from './types';

/** All original EduGenie chapter notes (Class 10, and Class 12 Arts). */
export const NOTES: ChapterNote[] = [...MATHS10_NOTES, ...SCIENCE10_NOTES, ...SST10_NOTES, ...ENGLISH10_NOTES, ...HINDI10_NOTES, ...HISTORY12_NOTES, ...POLSCI12_NOTES, ...GEOGRAPHY12_NOTES];

export const noteKey = (subject: string, chapter: string) => `${subject}|${chapter}`;

const byKey = new Map(NOTES.map((n) => [noteKey(n.subject, n.chapter), n]));

export const noteFor = (subject: string, chapter: string) => byKey.get(noteKey(subject, chapter));
