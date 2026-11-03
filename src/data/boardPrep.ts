/**
 * CBSE Class 10 board exam pattern, unit weightage and answer-writing guidance for 2026-27, taken from
 * CBSE's 2026-27 Class 10 curriculum and sample question papers (CBSE states the paper design is unchanged
 * from 2025-26). Each theory paper is 80 marks, 3 hours, plus 20 marks of internal assessment.
 */
export interface PaperSection {
  name: string;
  type: string;
  questions: number;
  marksEach: string;
  total: number;
}

export interface SubjectPrep {
  subject: string; // matches the app subject name
  paper: string;
  sections: PaperSection[];
  weightage: { unit: string; marks: number; chapters?: string }[];
  howToWrite: { title: string; points: string[] }[];
  mistakes: string[];
  notInBoard?: string[]; // syllabus parts assessed only in school (internal / periodic / project) in 2026-27
}

export const CLASS10_PREP: SubjectPrep[] = [
  {
    subject: 'Mathematics',
    paper: 'Mathematics Standard (041) · 80 marks · 3 hours · 38 questions',
    sections: [
      { name: 'A', type: 'MCQs (18) and Assertion–Reason (2)', questions: 20, marksEach: '1', total: 20 },
      { name: 'B', type: 'Very short answer', questions: 5, marksEach: '2', total: 10 },
      { name: 'C', type: 'Short answer', questions: 6, marksEach: '3', total: 18 },
      { name: 'D', type: 'Long answer', questions: 4, marksEach: '5', total: 20 },
      { name: 'E', type: 'Case-based (sub-parts 1 + 1 + 2)', questions: 3, marksEach: '4', total: 12 },
    ],
    weightage: [
      { unit: 'Number Systems', marks: 6, chapters: 'Real Numbers' },
      { unit: 'Algebra', marks: 20, chapters: 'Polynomials, Linear Equations, Quadratic Equations, AP' },
      { unit: 'Coordinate Geometry', marks: 6 },
      { unit: 'Geometry', marks: 15, chapters: 'Triangles, Circles' },
      { unit: 'Trigonometry', marks: 12, chapters: 'Intro to Trigonometry, Applications' },
      { unit: 'Mensuration', marks: 10, chapters: 'Areas Related to Circles, Surface Areas and Volumes' },
      { unit: 'Statistics & Probability', marks: 11 },
    ],
    howToWrite: [
      { title: 'Every answer', points: ['Write "Given", "To find / To prove" for word problems and proofs.', 'State the formula before substituting — the formula earns a step mark.', 'Show every step; CBSE awards marks per step even if the final answer is wrong.', 'Box or underline the final answer and write the unit.'] },
      { title: 'Geometry and trigonometry', points: ['Draw a neat, labelled figure with a pencil and scale — it carries marks in proofs and heights-and-distances.', 'Mark right angles and given angles on the figure.', 'Give a reason in brackets for each step of a proof, e.g. (radius ⊥ tangent), (CPCT).'] },
      { title: 'Case-based questions', points: ['Read the passage once fully, then identify the chapter it is testing.', 'The 2-mark sub-part usually needs a formula and two steps — do it first if you are short of time.'] },
    ],
    mistakes: ['Sign errors when substituting negative values — use brackets: −4(2)(−3).', 'Forgetting to reject an impossible root (negative length, k = 0).', 'Using degrees instead of the given π value, or mixing cm and m in mensuration.', 'Leaving answers like 40/√3 without rationalising when asked.'],
  },
  {
    subject: 'Science',
    paper: 'Science (086) · 80 marks · 3 hours · 39 questions in three subject sections',
    sections: [
      { name: 'A', type: 'Biology (Q1–16): 9 × 1-mark (MCQ, A–R), 3 × 2, 2 × 3, 1 case-based × 4, 1 long × 5', questions: 16, marksEach: '1–5', total: 30 },
      { name: 'B', type: 'Chemistry (Q17–29): 8 × 1-mark, 1 × 2, 2 × 3, 1 case-based × 4, 1 long × 5', questions: 13, marksEach: '1–5', total: 25 },
      { name: 'C', type: 'Physics (Q30–39): 3 × 1-mark, 2 × 2, 3 × 3, 1 case-based × 4, 1 long × 5', questions: 10, marksEach: '1–5', total: 25 },
    ],
    weightage: [
      { unit: 'Chemical Substances – Nature and Behaviour', marks: 25, chapters: 'Ch 1–4' },
      { unit: 'World of Living', marks: 25, chapters: 'Ch 5–8' },
      { unit: 'Natural Phenomena', marks: 12, chapters: 'Light, Human Eye' },
      { unit: 'Effects of Current', marks: 13, chapters: 'Electricity, Magnetic Effects' },
      { unit: 'Natural Resources', marks: 5, chapters: 'Our Environment' },
    ],
    howToWrite: [
      { title: 'Chemistry', points: ['Write balanced equations with state symbols (s), (l), (g), (aq) and conditions on the arrow.', 'Name the type of reaction when asked — it is often a separate mark.', 'For "give reasons", write the reason, not just the observation.'] },
      { title: 'Biology', points: ['Draw labelled diagrams in pencil: nephron, heart, brain, flower, human eye are frequent.', 'Use exact terms examiners look for: "selective reabsorption", "double circulation", "variation".', 'Flow charts (reflex arc, sex determination) score faster than paragraphs.'] },
      { title: 'Physics', points: ['Numericals: Given → formula → substitution with units → answer with unit and sign.', 'Use the New Cartesian sign convention for mirrors and lenses, and state the nature of the image.', 'Ray diagrams need arrows on every ray and the principal axis.'] },
    ],
    mistakes: ['Unbalanced equations or missing state symbols.', 'Forgetting units or the sign of v, u, f.', 'Diagrams without labels or arrows.', 'Writing long paragraphs where 3 crisp points are asked.'],
    notInBoard: [
      'Periodic Classification of Elements (studied, assessed only in school)',
      'Evolution — acquired and inherited traits, speciation, fossils, human evolution',
      'Electric motor, electromagnetic induction and electric generator',
    ],
  },
  {
    subject: 'Social Science',
    paper: 'Social Science (087) · 80 marks · 3 hours · 38 questions in four discipline sections',
    sections: [
      { name: 'A', type: 'History (Q1–9): 4 MCQs, 1 × 2, 1 × 3, 1 long × 5, 1 case-based × 4, map × 2', questions: 9, marksEach: '1–5', total: 20 },
      { name: 'B', type: 'Geography (Q10–19): 6 MCQs, 1 × 2, 1 long × 5, 1 case-based × 4, map × 3', questions: 10, marksEach: '1–5', total: 20 },
      { name: 'C', type: 'Political Science (Q20–28): 4 MCQs, 2 × 2, 1 × 3, 1 long × 5, 1 case-based × 4', questions: 9, marksEach: '1–5', total: 20 },
      { name: 'D', type: 'Economics (Q29–38): 6 MCQs, 3 × 3, 1 long × 5', questions: 10, marksEach: '1–5', total: 20 },
    ],
    weightage: [
      { unit: 'History — India and the Contemporary World II', marks: 20, chapters: '18 + 2 map' },
      { unit: 'Geography — Contemporary India II', marks: 20, chapters: '17 + 3 map' },
      { unit: 'Political Science — Democratic Politics II', marks: 20 },
      { unit: 'Economics — Understanding Economic Development', marks: 20 },
    ],
    howToWrite: [
      { title: 'Short and long answers', points: ['Keep to CBSE word limits: 2 marks ≤ 40 words, 3 marks ≤ 60, 5 marks ≤ 120, case-based ≤ 100.', 'Write in points — one point per mark (3 points for 3 marks, 5 for 5).', 'Start each point with a bold keyword or a short heading, then explain in one line.', 'Add dates, names and examples (e.g. Chauri Chaura, 1922) — they make answers precise.'] },
      { title: 'Map skill', points: ['Practise the CBSE map list: INC sessions, Dandi, Champaran; dams, soils, crops, minerals, ports, airports.', 'Mark with a dot or symbol and write the name neatly next to it.'] },
    ],
    mistakes: ['Writing essays instead of points.', 'Mixing up dates and events of the national movement.', 'Not practising maps — 5 easy marks lost.', 'Ignoring Economics definitions (GDP, collateral, MNC) that are asked word for word.'],
    notInBoard: [
      'History: The Age of Industrialisation (periodic assessment only)',
      'History: The Making of a Global World beyond sub-topics 1–1.3 (internal project)',
      'Geography: Lifelines of National Economy — only map pointing is in the board exam',
      'Economics: Globalisation beyond "What is Globalisation?" and "Factors that enabled it" (internal project)',
      'Economics: Consumer Rights (project work)',
    ],
  },
  {
    subject: 'English',
    paper: 'English Language & Literature (184) · 80 marks · 3 hours · 11 questions',
    sections: [
      { name: 'A', type: 'Reading — two unseen passages', questions: 2, marksEach: '10', total: 20 },
      { name: 'B', type: 'Grammar (10) and Writing — formal letter, analytical paragraph (10)', questions: 3, marksEach: 'varies', total: 20 },
      { name: 'C', type: 'Literature — extracts, short and long answers (First Flight, Footprints)', questions: 6, marksEach: 'varies', total: 40 },
    ],
    weightage: [
      { unit: 'Reading', marks: 20 },
      { unit: 'Writing and Grammar', marks: 20 },
      { unit: 'Literature', marks: 40 },
    ],
    howToWrite: [
      { title: 'Literature answers', points: ['Begin with context: name the chapter and the character.', 'Support each point with an event or a short quotation from the text.', 'Long answers (100–120 words): introduction, 3 points, a value-based conclusion.'] },
      { title: 'Writing', points: ['Formal letter: sender, date, receiver, subject, salutation, body, close — the format carries marks.', 'Analytical paragraph: introduce the data, describe the trend with figures, conclude with the overall pattern.', 'Stay within the word limit.'] },
      { title: 'Reading and grammar', points: ['Read the questions before the passage so you know what to look for.', 'Answer in complete, precise phrases — do not copy whole sentences.', 'For grammar, rewrite only what is asked.'] },
    ],
    mistakes: ['Missing parts of the letter format.', 'Retelling the whole story instead of answering the question.', 'Exceeding word limits.', 'Careless spelling of character names (Lomov, Natalya, Matilda).'],
  },
  {
    subject: 'Hindi',
    paper: 'Hindi Course A (002) · 80 marks · 3 hours · 15 questions',
    sections: [
      { name: 'क', type: 'अपठित गद्यांश (two unseen passages)', questions: 2, marksEach: '7', total: 14 },
      { name: 'ख', type: 'व्याकरण (grammar)', questions: 4, marksEach: '4', total: 16 },
      { name: 'ग', type: 'पाठ्यपुस्तक — क्षितिज, कृतिका', questions: 5, marksEach: 'varies', total: 30 },
      { name: 'घ', type: 'रचनात्मक लेखन — अनुच्छेद, पत्र, सूचना/विज्ञापन, लघुकथा/ई-मेल', questions: 4, marksEach: 'varies', total: 20 },
    ],
    weightage: [
      { unit: 'अपठित गद्यांश (Reading)', marks: 14 },
      { unit: 'व्याकरण (Grammar)', marks: 16 },
      { unit: 'पाठ्यपुस्तक (Literature)', marks: 30 },
      { unit: 'रचनात्मक लेखन (Writing)', marks: 20 },
    ],
    howToWrite: [
      { title: 'उत्तर लेखन', points: ['पाठ और लेखक का नाम लिखकर उत्तर शुरू करें।', 'प्रत्येक अंक के लिए एक मुख्य बिंदु लिखें।', 'पत्र और अनुच्छेद में प्रारूप और शब्द-सीमा का ध्यान रखें।'] },
    ],
    mistakes: ['मात्रा और वर्तनी की गलतियाँ।', 'पत्र के प्रारूप के अंग छूट जाना।', 'व्याकरण में उदाहरण न देना।'],
  },
];

/** Exam-day time plan for a 3-hour, 80-mark paper. */
export const TIME_PLAN = [
  { slot: 'Reading time (15 min)', plan: 'Read the whole paper. Mark easy questions and choose your internal-choice options.' },
  { slot: '0:00 – 0:25', plan: 'All 1-mark questions (MCQs, Assertion–Reason) — in Science and Social Science they are spread across each subject section. Do not get stuck: mark doubtful ones and return later.' },
  { slot: '0:25 – 0:50', plan: '2-mark questions. Keep each to 30–50 words or two clean steps.' },
  { slot: '0:50 – 1:40', plan: '3-mark and 5-mark questions. Diagrams, figures and points first.' },
  { slot: '1:40 – 2:30', plan: 'Case-based questions and remaining long answers.' },
  { slot: '2:30 – 3:00', plan: 'Revise: units, signs, labels, unanswered MCQs. There is no negative marking — attempt everything.' },
];

/** An eight-week plan before the board exams. */
export const EIGHT_WEEK_PLAN = [
  { weeks: 'Weeks 1–3', focus: 'Finish NCERT line by line, chapter by chapter. Solve every in-text and exercise question. Make one-page notes and formula lists.' },
  { weeks: 'Weeks 4–5', focus: 'Chapter-wise practice here in Practice: MCQs daily, then written answers checked against the official marking scheme.' },
  { weeks: 'Week 6', focus: 'Previous board papers (2022–2026) chapter-wise. List every question you got wrong and revise that topic.' },
  { weeks: 'Weeks 7–8', focus: 'Full sample papers under 3-hour timing, three per week per subject. Revise notes, formula sheets and maps daily.' },
];

export const NINETY_PLUS = [
  'Treat NCERT as the syllabus: most board questions are drawn directly from NCERT text and exercises.',
  'Practise every day, a little: 20 questions daily beats a weekend marathon.',
  'Write answers, do not just read them — marks come from how you present, not only what you know.',
  'Learn the marking scheme: keywords, units, diagrams and steps are where marks are given.',
  'Solve at least five full papers per subject under timed conditions before the exam.',
  'Keep an error notebook: every mistake you make in practice, with the correct method.',
  'Sleep well in the last week — revision in a rested mind sticks far better.',
];
