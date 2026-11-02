const r = String.raw;

export interface Formula {
  name: string;
  subject: string;
  equation: string; // KaTeX
  units: string;
  whenToUse: string;
  minGrade: number;
}

export const FORMULAS: Formula[] = [
  { name: 'Quadratic Formula', subject: 'Mathematics', minGrade: 10, equation: r`$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$`, units: 'Dimensionless', whenToUse: r`Roots of any $ax^2 + bx + c = 0$ when factorisation is not obvious.` },
  { name: 'nth Term of an AP', subject: 'Mathematics', minGrade: 10, equation: r`$$a_n = a + (n-1)d$$`, units: 'Same as the terms', whenToUse: 'Finding a specific term or the number of terms in an arithmetic sequence.' },
  { name: 'Sum of an AP', subject: 'Mathematics', minGrade: 10, equation: r`$$S_n = \frac{n}{2}\left[2a + (n-1)d\right]$$`, units: 'Same as the terms', whenToUse: r`Sum of first $n$ terms; use $\frac{n}{2}(a + l)$ if the last term is known.` },
  { name: 'Pythagorean Identity', subject: 'Mathematics', minGrade: 10, equation: r`$$\sin^2\theta + \cos^2\theta = 1$$`, units: 'Dimensionless', whenToUse: 'Simplifying trigonometric expressions and proving identities.' },
  { name: 'Area of a Circle', subject: 'Mathematics', minGrade: 7, equation: r`$$A = \pi r^2, \quad C = 2\pi r$$`, units: r`$\text{cm}^2$, cm`, whenToUse: 'Mensuration problems involving circles, sectors and rings.' },
  { name: 'Simple Interest', subject: 'Mathematics', minGrade: 7, equation: r`$$SI = \frac{P \times R \times T}{100}$$`, units: '₹', whenToUse: 'Interest calculated only on the principal.' },
  { name: "Ohm's Law", subject: 'Science', minGrade: 10, equation: r`$$V = IR$$`, units: r`V (volt), A (ampere), $\Omega$ (ohm)`, whenToUse: 'Relating voltage, current and resistance at constant temperature.' },
  { name: 'Electric Power', subject: 'Science', minGrade: 10, equation: r`$$P = VI = I^2R = \frac{V^2}{R}$$`, units: 'W (watt)', whenToUse: 'Energy consumption of appliances; 1 kWh = 3.6 × 10⁶ J.' },
  { name: 'Mirror Formula', subject: 'Science', minGrade: 10, equation: r`$$\frac{1}{v} + \frac{1}{u} = \frac{1}{f}, \quad m = -\frac{v}{u}$$`, units: 'cm or m', whenToUse: 'Image position and magnification for spherical mirrors (New Cartesian sign convention).' },
  { name: 'Lens Formula', subject: 'Science', minGrade: 10, equation: r`$$\frac{1}{v} - \frac{1}{u} = \frac{1}{f}, \quad P = \frac{1}{f\,(\text{m})}$$`, units: 'cm; power in D (dioptre)', whenToUse: 'Image formation by convex and concave lenses.' },
  { name: 'Speed & Density', subject: 'Science', minGrade: 7, equation: r`$$v = \frac{d}{t}, \quad \rho = \frac{m}{V}$$`, units: r`m/s, $\text{kg/m}^3$`, whenToUse: 'Basic motion and material property problems.' },
  { name: 'Newton’s Second Law', subject: 'Science', minGrade: 9, equation: r`$$F = ma = \frac{\Delta p}{\Delta t}$$`, units: r`N = $\text{kg·m/s}^2$`, whenToUse: 'Force from change in momentum or acceleration.' },
  { name: 'Coulomb’s Law', subject: 'Physics', minGrade: 12, equation: r`$$F = \frac{1}{4\pi\varepsilon_0}\frac{q_1 q_2}{r^2}$$`, units: r`N; $\frac{1}{4\pi\varepsilon_0} = 9 \times 10^9\ \text{N·m}^2/\text{C}^2$`, whenToUse: 'Force between point charges. JEE/NEET Foundation.' },
  { name: 'Einstein’s Photoelectric Equation', subject: 'Physics', minGrade: 12, equation: r`$$K_{max} = h\nu - \phi_0 = eV_0$$`, units: 'eV or J', whenToUse: 'Stopping potential and threshold frequency problems. JEE/NEET Foundation.' },
  { name: 'Nernst Equation', subject: 'Chemistry', minGrade: 12, equation: r`$$E_{cell} = E^\circ_{cell} - \frac{0.059}{n}\log Q$$`, units: 'V (at 298 K)', whenToUse: 'Cell EMF at non-standard concentrations.' },
  { name: 'First-Order Rate Constant', subject: 'Chemistry', minGrade: 12, equation: r`$$k = \frac{2.303}{t}\log\frac{[R]_0}{[R]}, \quad t_{1/2} = \frac{0.693}{k}$$`, units: r`$\text{s}^{-1}$`, whenToUse: 'Kinetics of first-order reactions, including radioactive decay.' },
];

export const formulasFor = (grade: number) =>
  FORMULAS.filter((f) => f.minGrade <= grade && (grade >= 11 || !['Physics', 'Chemistry'].includes(f.subject)));
