import type { Question } from '../../types/quiz';
import { HISTORY12 } from './history';
import { POLSCI12 } from './polsci';

/** EduGenie's Class 12 Arts chapter question sets, loaded on demand with the question bank. */
export const CLASS12_QUESTIONS: Question[] = [...HISTORY12, ...POLSCI12];
