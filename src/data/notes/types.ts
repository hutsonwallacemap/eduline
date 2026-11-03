/** An original EduGenie chapter note: concise revision content written for the CBSE Class 10 syllabus. */
export interface ChapterNote {
  subject: string;
  chapter: string; // matches the chapter name in curriculum.ts
  overview: string;
  keyPoints: string[]; // KaTeX and **bold** supported
  formulas?: string[];
  terms?: { term: string; meaning: string }[];
  examFocus: string[];
}
