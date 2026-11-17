/** Subjects whose chapters each have a full 100-question set (see src/data/class10 and src/data/class12). */
const FULL_SETS: Record<number, string[]> = {
  10: ['Science'],
  12: ['History', 'Political Science', 'Geography', 'Economics', 'English'],
};

export const hasFullSet = (grade: number, subject: string) => FULL_SETS[grade]?.includes(subject) ?? false;
