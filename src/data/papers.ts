export type DocType = 'Official Board Sample Paper' | 'Compartment Paper' | 'Model Mock Paper';

export interface Paper {
  id: string;
  board: 'CBSE' | 'ICSE';
  grade: number;
  year: number;
  docType: DocType;
  subject: string;
  marks: number;
  durationHours: number;
}

const SUBJECTS: Record<number, string[]> = {
  7: ['Mathematics', 'Science'],
  8: ['Mathematics', 'Science'],
  9: ['Mathematics', 'Science', 'Social Science'],
  10: ['Mathematics', 'Science', 'Social Science', 'English'],
  11: ['Physics', 'Chemistry', 'Mathematics', 'Accountancy'],
  12: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Accountancy', 'Economics'],
};
const DOC_TYPES: DocType[] = ['Official Board Sample Paper', 'Compartment Paper', 'Model Mock Paper'];

/** Deterministic mock catalogue. Board exams (10/12) carry 80 theory marks / 3 h; lower classes school-level papers. */
export const PAPERS: Paper[] = (['CBSE', 'ICSE'] as const).flatMap((board) =>
  Object.entries(SUBJECTS).flatMap(([g, subs]) =>
    [2025, 2024, 2023, 2022, 2021, 2020].flatMap((year, yi) =>
      subs
        .filter((_, si) => (si + yi) % 2 === 0)
        .map((subject, si) => {
          const grade = Number(g);
          const docType = grade === 10 || grade === 12 ? DOC_TYPES[(yi + si) % 3] : 'Model Mock Paper';
          const senior = grade >= 9;
          return {
            id: `${board}-${grade}-${year}-${subject}-${si}`,
            board,
            grade,
            year,
            docType,
            subject,
            marks: board === 'ICSE' ? (senior ? 80 : 50) : senior ? (['Physics', 'Chemistry', 'Biology'].includes(subject) ? 70 : 80) : 50,
            durationHours: senior ? (board === 'ICSE' && grade === 10 ? 2 : 3) : 2,
          };
        }),
    ),
  ),
);

export const ALL_DOC_TYPES = DOC_TYPES;
