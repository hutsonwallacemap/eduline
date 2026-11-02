import type { Question } from '../types/quiz';

const r = String.raw;

const AR_OPTIONS = [
  'Both A and R are true, and R is the correct explanation of A.',
  'Both A and R are true, but R is not the correct explanation of A.',
  'A is true, but R is false.',
  'A is false, but R is true.',
];

/** Hand-written questions, merged into the CBSE question bank (bank.ts). Short-answer `correctAnswer` lists accepted answers separated by "|". */
export const QUESTION_BANK: Question[] = [
  {
    id: 'm1', type: 'mcq', subject: 'Mathematics', chapter: 'Quadratic Equations', grade: 10, difficulty: 'Easy', marks: 1,
    question: r`The roots of $x^2 - 5x + 6 = 0$ are:`,
    options: ['$2, 3$', '$-2, -3$', '$1, 6$', '$-1, 6$'],
    correctAnswer: 0,
    explanation: r`Split the middle term: $x^2 - 2x - 3x + 6 = (x-2)(x-3) = 0$, so $x = 2$ or $x = 3$.`,
    hint: 'Find two numbers with product 6 and sum 5.',
    markKeywords: ['factorisation'],
  },
  {
    id: 'm2', type: 'mcq', subject: 'Mathematics', chapter: 'Quadratic Equations', grade: 10, difficulty: 'Moderate', marks: 1,
    question: r`For what value of $k$ does $2x^2 + kx + 8 = 0$ have equal roots?`,
    options: [r`$\pm 4$`, r`$\pm 8$`, r`$\pm 16$`, r`$\pm 2$`],
    correctAnswer: 1,
    explanation: r`Equal roots $\Rightarrow D = 0$: $k^2 - 4(2)(8) = 0 \Rightarrow k^2 = 64 \Rightarrow k = \pm 8$.`,
    markKeywords: ['discriminant = 0', 'equal roots'],
  },
  {
    id: 'm3', type: 'assertion_reason', subject: 'Mathematics', chapter: 'Quadratic Equations', grade: 10, difficulty: 'Board Exam Level', marks: 1,
    question: r`**Assertion (A):** $x^2 + x + 1 = 0$ has no real roots.
**Reason (R):** A quadratic has no real roots when $b^2 - 4ac < 0$.`,
    options: AR_OPTIONS,
    correctAnswer: 0,
    explanation: r`$D = 1 - 4 = -3 < 0$, so A is true. R is the exact condition used, so R explains A.`,
    markKeywords: ['discriminant', 'no real roots'],
  },
  {
    id: 'm4', type: 'mcq', subject: 'Mathematics', chapter: 'Arithmetic Progressions', grade: 10, difficulty: 'Easy', marks: 1,
    question: r`The $10^{th}$ term of the AP $2, 7, 12, \ldots$ is:`,
    options: ['$45$', '$47$', '$50$', '$52$'],
    correctAnswer: 1,
    explanation: r`$a_n = a + (n-1)d = 2 + 9 \times 5 = 47$.`,
    hint: r`Use $a_n = a + (n-1)d$.`,
    markKeywords: ['general term'],
  },
  {
    id: 'm5', type: 'short_answer', subject: 'Mathematics', chapter: 'Arithmetic Progressions', grade: 10, difficulty: 'Moderate', marks: 2,
    question: r`Find the sum of the first 20 natural numbers. (Answer with a number.)`,
    correctAnswer: '210',
    explanation: r`$S_n = \frac{n}{2}(a + l) = \frac{20}{2}(1 + 20) = 10 \times 21 = 210$. **1 mark** for the formula, **1 mark** for the value.`,
    markKeywords: ['sum formula', 'substitution'],
  },
  {
    id: 'm6', type: 'mcq', subject: 'Mathematics', chapter: 'Introduction to Trigonometry', grade: 10, difficulty: 'Easy', marks: 1,
    question: r`The value of $\sin^2 30^\circ + \cos^2 30^\circ$ is:`,
    options: ['$0$', r`$\frac{1}{2}$`, '$1$', r`$\frac{\sqrt{3}}{2}$`],
    correctAnswer: 2,
    explanation: r`Identity: $\sin^2\theta + \cos^2\theta = 1$ for every $\theta$.`,
    markKeywords: ['trigonometric identity'],
  },
  {
    id: 'm7', type: 'mcq', subject: 'Mathematics', chapter: 'Introduction to Trigonometry', grade: 10, difficulty: 'Board Exam Level', marks: 1,
    question: r`If $\tan\theta = \frac{3}{4}$, then $\sec\theta$ equals (with $\theta$ acute):`,
    options: [r`$\frac{5}{4}$`, r`$\frac{4}{5}$`, r`$\frac{5}{3}$`, r`$\frac{3}{5}$`],
    correctAnswer: 0,
    explanation: r`$\sec^2\theta = 1 + \tan^2\theta = 1 + \frac{9}{16} = \frac{25}{16} \Rightarrow \sec\theta = \frac{5}{4}$.`,
    markKeywords: [r`$1 + \tan^2\theta = \sec^2\theta$`],
  },
  {
    id: 'm8', type: 'short_answer', subject: 'Mathematics', chapter: 'Statistics', grade: 10, difficulty: 'Easy', marks: 1,
    question: r`Find the mean of $4, 8, 12, 16, 20$.`,
    correctAnswer: '12',
    explanation: r`$\bar{x} = \frac{4+8+12+16+20}{5} = \frac{60}{5} = 12$.`,
    markKeywords: ['mean formula'],
  },
  {
    id: 's1', type: 'mcq', subject: 'Science', chapter: 'Light – Reflection and Refraction', grade: 10, difficulty: 'Easy', marks: 1,
    question: r`The refractive index of glass is $1.5$. The speed of light in glass is ($c = 3 \times 10^8\ \text{m/s}$):`,
    options: [r`$2 \times 10^8$ m/s`, r`$4.5 \times 10^8$ m/s`, r`$1.5 \times 10^8$ m/s`, r`$3 \times 10^8$ m/s`],
    correctAnswer: 0,
    explanation: r`$n = \frac{c}{v} \Rightarrow v = \frac{3 \times 10^8}{1.5} = 2 \times 10^8\ \text{m/s}$.`,
    markKeywords: ['refractive index', 'speed of light'],
  },
  {
    id: 's2', type: 'mcq', subject: 'Science', chapter: 'Light – Reflection and Refraction', grade: 10, difficulty: 'Board Exam Level', marks: 1,
    question: r`A concave mirror has focal length $-15$ cm. An object at $-30$ cm forms an image at:`,
    options: ['$-30$ cm', '$-15$ cm', '$+30$ cm', '$-10$ cm'],
    correctAnswer: 0,
    explanation: r`$\frac{1}{v} + \frac{1}{u} = \frac{1}{f} \Rightarrow \frac{1}{v} = -\frac{1}{15} + \frac{1}{30} = -\frac{1}{30}$, so $v = -30$ cm (object at $C$, image at $C$).`,
    markKeywords: ['mirror formula', 'sign convention'],
  },
  {
    id: 's3', type: 'assertion_reason', subject: 'Science', chapter: 'Chemical Reactions and Equations', grade: 10, difficulty: 'Moderate', marks: 1,
    question: r`**Assertion (A):** Iron articles are painted to prevent rusting.
**Reason (R):** Paint stops iron from coming in contact with air and moisture.`,
    options: AR_OPTIONS,
    correctAnswer: 0,
    explanation: r`Rusting needs both oxygen and water: $4\mathrm{Fe} + 3\mathrm{O_2} + x\mathrm{H_2O} \rightarrow 2\mathrm{Fe_2O_3}\cdot x\mathrm{H_2O}$. Paint blocks both, so R explains A.`,
    markKeywords: ['corrosion', 'air and moisture'],
  },
  {
    id: 's4', type: 'mcq', subject: 'Science', chapter: 'Chemical Reactions and Equations', grade: 10, difficulty: 'Easy', marks: 1,
    question: r`$\mathrm{CaO} + \mathrm{H_2O} \rightarrow \mathrm{Ca(OH)_2}$ is an example of a:`,
    options: ['Combination reaction', 'Decomposition reaction', 'Displacement reaction', 'Double displacement reaction'],
    correctAnswer: 0,
    explanation: r`Two reactants form a single product — a **combination reaction**. It is also exothermic.`,
    markKeywords: ['combination reaction', 'exothermic'],
  },
  {
    id: 's5', type: 'mcq', subject: 'Science', chapter: 'Electricity', grade: 10, difficulty: 'Moderate', marks: 1,
    question: r`Three resistors of $6\ \Omega$ each are connected in parallel. The equivalent resistance is:`,
    options: [r`$18\ \Omega$`, r`$2\ \Omega$`, r`$3\ \Omega$`, r`$6\ \Omega$`],
    correctAnswer: 1,
    explanation: r`$\frac{1}{R_p} = \frac{1}{6} + \frac{1}{6} + \frac{1}{6} = \frac{1}{2} \Rightarrow R_p = 2\ \Omega$.`,
    markKeywords: ['parallel combination'],
  },
  {
    id: 's6', type: 'short_answer', subject: 'Science', chapter: 'Electricity', grade: 10, difficulty: 'Board Exam Level', marks: 2,
    question: r`A bulb draws $0.5$ A at $220$ V. Find its power in watts.`,
    correctAnswer: '110|110 w|110w|110 watt|110 watts',
    explanation: r`$P = VI = 220 \times 0.5 = 110\ \text{W}$. **1 mark** for $P = VI$, **1 mark** for value with unit.`,
    markKeywords: ['P = VI', 'unit: watt'],
  },
  {
    id: 's7', type: 'short_answer', subject: 'Science', chapter: 'Life Processes', grade: 10, difficulty: 'Moderate', marks: 1,
    question: r`Name the pigment that traps light energy during photosynthesis.`,
    correctAnswer: 'chlorophyll',
    explanation: r`**Chlorophyll** in chloroplasts absorbs light: $6\mathrm{CO_2} + 6\mathrm{H_2O} \xrightarrow[\text{chlorophyll}]{\text{sunlight}} \mathrm{C_6H_{12}O_6} + 6\mathrm{O_2}$.`,
    markKeywords: ['chlorophyll', 'chloroplast'],
  },
  {
    id: 'e1', type: 'mcq', subject: 'English', chapter: 'Poem: Dust of Snow', grade: 10, difficulty: 'Easy', marks: 1,
    question: 'In “Dust of Snow”, the crow and the hemlock tree are usually symbols of:',
    options: ['Joy and hope', 'Sorrow and gloom', 'Wealth and power', 'Peace and calm'],
    correctAnswer: 1,
    explanation: 'Crows and the poisonous hemlock are traditionally linked with **gloom and death**. Frost uses them ironically: here they lift the poet’s mood.',
    hint: 'Think of what a hemlock tree is known for.',
    markKeywords: ['symbolism', 'irony'],
  },
  {
    id: 'e2', type: 'mcq', subject: 'English', chapter: 'Poem: Dust of Snow', grade: 10, difficulty: 'Moderate', marks: 1,
    question: 'What is the rhyme scheme of each stanza of “Dust of Snow”?',
    options: ['AABB', 'ABAB', 'ABBA', 'ABCD'],
    correctAnswer: 1,
    explanation: 'crow / snow and tree / me alternate, giving **ABAB**.',
    markKeywords: ['rhyme scheme'],
  },
  {
    id: 'e3', type: 'assertion_reason', subject: 'English', chapter: 'A Letter to God', grade: 10, difficulty: 'Board Exam Level', marks: 1,
    question: `**Assertion (A):** Lencho called the post office employees “a bunch of crooks”.
**Reason (R):** He believed God had sent the full amount and the employees had taken part of it.`,
    options: AR_OPTIONS,
    correctAnswer: 0,
    explanation: 'Lencho’s **unshakeable faith in God** made him suspect the postmaster’s staff when he received only seventy pesos — the **irony** is that they had collected the money for him.',
    markKeywords: ['faith in God', 'irony'],
  },
  {
    id: 'e4', type: 'mcq', subject: 'English', chapter: 'A Letter to God', grade: 10, difficulty: 'Easy', marks: 1,
    question: 'What destroyed Lencho’s crop?',
    options: ['A flood', 'Locusts', 'A hailstorm', 'A drought'],
    correctAnswer: 2,
    explanation: 'Rain turned into **hailstones** that destroyed the corn field completely.',
    markKeywords: ['hailstorm'],
  },
  {
    id: 'e5', type: 'mcq', subject: 'English', chapter: 'Grammar', grade: 10, difficulty: 'Moderate', marks: 1,
    question: 'Choose the correct reported speech: She said, “I am busy today.”',
    options: ['She said that she is busy today.', 'She said that she was busy that day.', 'She said that I was busy today.', 'She says that she was busy that day.'],
    correctAnswer: 1,
    explanation: 'Reporting verb in the past → **present becomes past** (am → was), and **today becomes that day**; the pronoun changes to she.',
    markKeywords: ['tense backshift', 'time expression change'],
  },
  {
    id: 'e6', type: 'mcq', subject: 'English', chapter: 'Grammar', grade: 10, difficulty: 'Easy', marks: 1,
    question: 'Fill in the blank: Neither the teacher nor the students ___ present.',
    options: ['was', 'were', 'is', 'has been'],
    correctAnswer: 1,
    explanation: 'With **neither … nor**, the verb agrees with the nearer subject — “students” is plural, so **were**.',
    markKeywords: ['subject–verb agreement', 'proximity rule'],
  },
  {
    id: 'ss1', type: 'mcq', subject: 'Social Science', chapter: 'History: Nationalism in India', grade: 10, difficulty: 'Easy', marks: 1,
    question: 'In which year was the Non-Cooperation Movement launched?',
    options: ['1919', '1920', '1930', '1942'],
    correctAnswer: 1,
    explanation: 'Gandhiji launched the **Non-Cooperation Movement in 1920** (approved at the Nagpur session, December 1920).',
    markKeywords: ['1920', 'Non-Cooperation'],
  },
  {
    id: 'ss2', type: 'assertion_reason', subject: 'Social Science', chapter: 'Civics: Power Sharing', grade: 10, difficulty: 'Moderate', marks: 1,
    question: `**Assertion (A):** Belgium amended its Constitution four times between 1970 and 1993.
**Reason (R):** It wanted to accommodate its linguistic diversity and keep the country united.`,
    options: AR_OPTIONS,
    correctAnswer: 0,
    explanation: 'The amendments created **community government** and equal Dutch–French representation, which explains A.',
    markKeywords: ['accommodation', 'community government'],
  },
];

const normalise = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();

/** Auto-grading for MCQ, assertion-reason and short answers. Written (descriptive) answers are self-marked in the report. */
export function isCorrect(q: Question, answer: number | string | null): boolean {
  if (answer === null || answer === '' || q.type === 'descriptive') return false;
  if (q.type === 'short_answer') {
    return String(q.correctAnswer).split('|').some((a) => normalise(a) === normalise(String(answer)));
  }
  return answer === q.correctAnswer;
}
