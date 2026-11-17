import type { Question } from '../../types/quiz';
import { ENGLISH10 } from './english';
import { MATHEMATICS10 } from './mathematics';
import { SCIENCE10 } from './science';
import { SOCIALSCIENCE10 } from './socialscience';

/** EduGenie's Class 10 chapter question sets (100 per chapter), loaded on demand with the question bank. */
export const CLASS10_QUESTIONS: Question[] = [...ENGLISH10, ...MATHEMATICS10, ...SCIENCE10, ...SOCIALSCIENCE10];
