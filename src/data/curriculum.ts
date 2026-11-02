import type { Stream } from '../store';

export interface Subject {
  name: string;
  icon: string; // key resolved in SubjectIcon
  color: string; // tailwind gradient classes
  chapters: string[];
  examTag?: string; // competitive-exam crossover for senior grades
}

const S = (name: string, icon: string, color: string, chapters: string[], examTag?: string): Subject => ({
  name,
  icon,
  color,
  chapters,
  examTag,
});

const foundational: Subject[] = [
  S('Mathematics', 'sigma', 'from-violet-500 to-indigo-500', ['Quadratic Equations', 'Arithmetic Progressions', 'Triangles', 'Trigonometry', 'Statistics']),
  S('Science', 'flask', 'from-emerald-500 to-teal-500', ['Light – Reflection & Refraction', 'Chemical Reactions', 'Electricity', 'Life Processes', 'Atoms & Molecules']),
  S('Social Science', 'globe', 'from-amber-500 to-orange-500', ['Nationalism in India', 'Resources & Development', 'Power Sharing', 'Money & Credit']),
  S('English', 'book', 'from-sky-500 to-blue-500', ['Prose', 'Poetry', 'Grammar', 'Writing Skills']),
  S('Hindi', 'languages', 'from-rose-500 to-pink-500', ['Gadya Khand', 'Kavya Khand', 'Vyakaran', 'Lekhan']),
];

const physics = S('Physics', 'atom', 'from-indigo-500 to-blue-600', ['Electrostatics', 'Current Electricity', 'Ray Optics', 'Dual Nature of Matter', 'Semiconductors'], 'JEE/NEET Foundation');
const chemistry = S('Chemistry', 'flask', 'from-emerald-500 to-green-600', ['Solutions', 'Electrochemistry', 'Chemical Kinetics', 'Coordination Compounds', 'Haloalkanes'], 'JEE/NEET Foundation');
const maths = S('Mathematics', 'sigma', 'from-violet-500 to-purple-600', ['Relations & Functions', 'Matrices', 'Continuity & Differentiability', 'Integrals', 'Probability'], 'JEE Foundation');
const biology = S('Biology', 'dna', 'from-lime-500 to-emerald-600', ['Reproduction', 'Genetics & Evolution', 'Human Health & Disease', 'Biotechnology', 'Ecology'], 'NEET Foundation');
const english = S('English', 'book', 'from-sky-500 to-blue-500', ['Flamingo', 'Vistas', 'Writing Skills']);
const cs = S('Computer Science', 'cpu', 'from-slate-500 to-slate-700', ['Python Revision', 'File Handling', 'Data Structures', 'SQL', 'Networks']);

export const subjectsFor = (grade: number, stream: Stream): Subject[] => {
  if (grade <= 10) return foundational;
  switch (stream) {
    case 'Science (PCM)':
      return [physics, chemistry, maths, english, cs];
    case 'Science (PCB)':
      return [physics, chemistry, biology, english, cs];
    case 'Commerce':
      return [
        S('Accountancy', 'calculator', 'from-amber-500 to-orange-600', ['Partnership Accounts', 'Company Accounts', 'Financial Statements', 'Ratio Analysis', 'Cash Flow'], 'CA Foundation'),
        S('Business Studies', 'briefcase', 'from-cyan-500 to-sky-600', ['Principles of Management', 'Planning', 'Marketing', 'Financial Management']),
        S('Economics', 'trending', 'from-rose-500 to-red-600', ['National Income', 'Money & Banking', 'Government Budget', 'Indian Economy']),
        S('Applied Mathematics', 'sigma', 'from-violet-500 to-purple-600', ['Numerical Applications', 'Matrices', 'Calculus', 'Inferential Statistics']),
        english,
      ];
    case 'Humanities':
    default:
      return [
        S('History', 'landmark', 'from-amber-600 to-yellow-600', ['Harappan Civilisation', 'Kings & Chronicles', 'Colonialism', 'Framing the Constitution'], 'CUET Relevant'),
        S('Political Science', 'scale', 'from-indigo-500 to-violet-600', ['Cold War Era', 'Contemporary World Order', 'Politics in India since Independence']),
        S('Geography', 'globe', 'from-emerald-500 to-teal-600', ['Human Geography', 'Population', 'Transport & Communication']),
        S('Economics', 'trending', 'from-rose-500 to-red-600', ['National Income', 'Indian Economy']),
        english,
      ];
  }
};

export const STREAMS: { value: Stream; blurb: string }[] = [
  { value: 'Science (PCM)', blurb: 'Physics, Chemistry, Mathematics — JEE track' },
  { value: 'Science (PCB)', blurb: 'Physics, Chemistry, Biology — NEET track' },
  { value: 'Commerce', blurb: 'Accountancy, Business Studies, Economics' },
  { value: 'Humanities', blurb: 'History, Political Science, Geography' },
];
