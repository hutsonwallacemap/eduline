/** Subjects whose chapters each have a full 100-question set (see src/data/class10 and src/data/class12). */
const FULL_SETS: Record<number, string[]> = {
  10: ['Science', 'Mathematics', 'Social Science', 'English'],
  12: ['History', 'Political Science', 'Geography', 'Economics', 'English'],
};

/** Skill notes (not textbook chapters) that have no chapter set of their own. */
const NO_SET = new Set(['Grammar', 'Writing Skills', 'Reading Comprehension']);

export const hasFullSet = (grade: number, subject: string, chapter?: string) =>
  (FULL_SETS[grade]?.includes(subject) ?? false) && !(chapter && NO_SET.has(chapter));
