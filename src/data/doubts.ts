const r = String.raw;
const FENCE = '```';

export interface AiAnswer {
  steps: string; // KaTeX enabled
  formula: string;
  pitfall: string;
  markKeywords: string[];
  examTag?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text?: string;
  image?: string; // object URL of an uploaded photo
  answer?: AiAnswer;
  error?: string;
}

export interface Conversation {
  id: string;
  title: string;
  meta: string; // e.g. "Class 10 · Mathematics"
  messages: ChatMessage[];
}

const quadratic: AiAnswer = {
  steps: r`Compare $2x^2 + 5x - 3 = 0$ with $ax^2 + bx + c = 0$: $a = 2,\ b = 5,\ c = -3$.

**Step 1 — Discriminant:** $D = b^2 - 4ac = 25 - 4(2)(-3) = 25 + 24 = 49$. Since $D > 0$, the roots are real and distinct.

**Step 2 — Apply the formula:**
$$x = \frac{-5 \pm \sqrt{49}}{2 \cdot 2} = \frac{-5 \pm 7}{4}$$

**Step 3 — Roots:** $x = \frac{2}{4} = \frac{1}{2}$ or $x = \frac{-12}{4} = -3$.

**Check by factorisation:** $2x^2 + 6x - x - 3 = 2x(x+3) - 1(x+3) = (2x-1)(x+3)$ ✔`,
  formula: r`$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}, \qquad D = b^2 - 4ac$$`,
  pitfall: r`Students often write $D = 25 - 24 = 1$ by dropping the sign of $c$. Always substitute negatives inside brackets: $-4(2)(-3)$. CBSE awards **1 mark for D**, **1 mark for substitution** and **1 mark for both roots** — show every step.`,
  markKeywords: ['discriminant', 'real and distinct roots', 'quadratic formula'],
};

const atoms: AiAnswer = {
  steps: r`**Law of conservation of mass:** mass can neither be created nor destroyed in a chemical reaction.

Example: $\underset{\text{(40 g)}}{\mathrm{CaCO_3}} \rightarrow \underset{\text{(22.4 g)}}{\mathrm{CaO}} + \underset{\text{(17.6 g)}}{\mathrm{CO_2}}$

Total mass of products $= 22.4 + 17.6 = 40\ \text{g}$ = mass of reactant. ✔

Dalton explained this with his atomic theory: atoms are **indivisible** and are only **rearranged** in a reaction, so the total mass stays constant.`,
  formula: r`$$\sum m_{\text{reactants}} = \sum m_{\text{products}}$$`,
  pitfall: r`Don't confuse it with the **law of constant proportions** (fixed ratio of elements by mass in a compound). Examiners deduct marks if the definition omits the words **"chemical reaction"**.`,
  markKeywords: ['neither created nor destroyed', 'chemical reaction', 'Dalton’s atomic theory'],
};

const photoelectric: AiAnswer = {
  steps: r`Given: $\lambda = 400\ \text{nm}$, work function $\phi_0 = 2.0\ \text{eV}$.

**Step 1 — Photon energy:**
$$E = \frac{hc}{\lambda} = \frac{1240\ \text{eV·nm}}{400\ \text{nm}} = 3.1\ \text{eV}$$

**Step 2 — Einstein's equation:** $K_{max} = E - \phi_0 = 3.1 - 2.0 = 1.1\ \text{eV}$

**Step 3 — Stopping potential:** $eV_0 = K_{max} \Rightarrow V_0 = 1.1\ \text{V}$`,
  formula: r`$$K_{max} = h\nu - \phi_0 = eV_0, \qquad hc \approx 1240\ \text{eV·nm}$$`,
  pitfall: r`Stopping potential depends on **frequency**, not intensity. Writing $V_0$ in eV instead of volts loses the unit mark. The $1240\ \text{eV·nm}$ shortcut saves time in JEE/NEET too.`,
  markKeywords: ['Einstein’s photoelectric equation', 'work function', 'stopping potential'],
  examTag: 'Relevant for JEE/NEET',
};

const snell: AiAnswer = {
  steps: r`When light passes from medium 1 into medium 2, it bends at the boundary.

${FENCE}
        Normal
          |
  incident \ i |
     ray    \  |        Medium 1 (air, n₁)
 ------------\-+-------------------------
             |\                Medium 2 (glass, n₂)
             | \ r
             |  \ refracted ray (bends towards normal)
${FENCE}

**Snell's law:** the ratio of the sine of the angle of incidence to the sine of the angle of refraction is constant for a given pair of media.

Example: light enters glass ($n = 1.5$) from air at $i = 30^\circ$:
$$\sin r = \frac{\sin 30^\circ}{1.5} = \frac{0.5}{1.5} = 0.333 \Rightarrow r \approx 19.5^\circ$$`,
  formula: r`$$n_1 \sin i = n_2 \sin r, \qquad n_{21} = \frac{\sin i}{\sin r} = \frac{v_1}{v_2}$$`,
  pitfall: r`Angles are measured from the **normal**, never from the surface. Light bends **towards the normal** when entering a denser medium. Always draw the normal as a dotted line in diagrams — it carries marks.`,
  markKeywords: ['normal', 'refractive index', 'denser medium'],
};

export const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    title: 'Law of conservation of mass',
    meta: 'Class 9 · Science',
    messages: [
      { id: 'm1', role: 'user', text: 'State the law of conservation of mass with an example.' },
      { id: 'm2', role: 'ai', answer: atoms },
    ],
  },
  {
    id: 'c2',
    title: r`Solve $2x^2 + 5x - 3 = 0$`,
    meta: 'Class 10 · Mathematics',
    messages: [
      { id: 'm3', role: 'user', text: r`Solve: $2x^2 + 5x - 3 = 0$` },
      { id: 'm4', role: 'ai', answer: quadratic },
    ],
  },
  {
    id: 'c3',
    title: 'Stopping potential for 400 nm light',
    meta: 'Class 12 · Physics',
    messages: [
      { id: 'm5', role: 'user', text: r`Light of wavelength 400 nm falls on a metal with work function 2.0 eV. Find the stopping potential.` },
      { id: 'm6', role: 'ai', answer: photoelectric },
    ],
  },
];

export const SAMPLE_CHIPS = [
  "Explain Snell's Law with a diagram",
  r`Solve: $2x^2 + 5x - 3 = 0$`,
  'State the law of conservation of mass',
  'Find stopping potential for 400 nm light, φ = 2 eV',
];

export const TRENDING = [
  'Ohm’s Law & V–I graph',
  'Mendelian dihybrid cross',
  'Trigonometric identities',
  'Lens formula sign convention',
  'Nationalism in India: Non-Cooperation',
];

/** Mock AI: keyword routing to curated, board-checked answers instead of free generation. */
export function mockAnswer(question: string, image: boolean): AiAnswer {
  const q = question.toLowerCase();
  if (q.includes('snell') || q.includes('refraction')) return snell;
  if (q.includes('2x^2') || q.includes('quadratic')) return quadratic;
  if (q.includes('conservation of mass') || q.includes('dalton')) return atoms;
  if (q.includes('stopping') || q.includes('photoelectric') || q.includes('work function')) return photoelectric;
  return {
    steps: image
      ? 'I’ve read your textbook photo (OCR preview). In the full version, the extracted question is matched to the NCERT chapter and solved step by step here.'
      : `Here’s how I’d approach **“${question.replace(/\$/g, '')}”**:\n\n1. Identify the chapter and the concept being tested.\n2. Write the governing law or formula.\n3. Substitute the values with units.\n4. State the final answer with its unit, and box it.`,
    formula: 'Live formula blocks appear once the server has an Anthropic API key (see README).',
    pitfall: 'Answers are generated from the board syllabus you selected in the header — switch boards to see board-specific marking tips.',
    markKeywords: ['definition', 'formula', 'units'],
  };
}
