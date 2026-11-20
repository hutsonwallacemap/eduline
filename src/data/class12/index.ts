import type { Question } from '../../types/quiz';
import { ECONOMICS12 } from './economics';
import { ENGLISH12 } from './english';
import { GEOGRAPHY12 } from './geography';
import { HISTORY12 } from './history';
import { PHYSICS12 } from './physics';
import { POLSCI12 } from './polsci';

/** EduGenie's Class 12 chapter question sets (Arts, Science, Commerce), loaded on demand with the question bank. */
export const CLASS12_QUESTIONS: Question[] = [...HISTORY12, ...POLSCI12, ...GEOGRAPHY12, ...ECONOMICS12, ...ENGLISH12, ...PHYSICS12];
