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
  { name: 'HCF × LCM', subject: 'Mathematics', minGrade: 10, equation: r`$$\text{HCF}(a, b) \times \text{LCM}(a, b) = a \times b$$`, units: 'Numbers', whenToUse: 'Finding the LCM or HCF of two numbers when the other is known. Holds for two numbers only.' },
  { name: 'Zeroes of a Quadratic Polynomial', subject: 'Mathematics', minGrade: 10, equation: r`$$\alpha + \beta = -\frac{b}{a}, \qquad \alpha\beta = \frac{c}{a}$$`, units: 'Dimensionless', whenToUse: r`Verifying zeroes, or forming $k[x^2 - (\alpha+\beta)x + \alpha\beta]$.` },
  { name: 'Pair of Linear Equations', subject: 'Mathematics', minGrade: 10, equation: r`$$\frac{a_1}{a_2} \neq \frac{b_1}{b_2}\ \text{(unique)}, \quad \frac{a_1}{a_2} = \frac{b_1}{b_2} = \frac{c_1}{c_2}\ \text{(infinite)}, \quad \frac{a_1}{a_2} = \frac{b_1}{b_2} \neq \frac{c_1}{c_2}\ \text{(none)}$$`, units: 'Ratios', whenToUse: 'Deciding whether lines intersect, coincide or are parallel; finding k for a given number of solutions.' },
  { name: 'Nature of Roots', subject: 'Mathematics', minGrade: 10, equation: r`$$D = b^2 - 4ac:\quad D > 0 \text{ distinct},\ D = 0 \text{ equal},\ D < 0 \text{ no real roots}$$`, units: 'Dimensionless', whenToUse: 'Finding k for equal roots, or the nature of roots without solving.' },
  { name: 'Distance Formula', subject: 'Mathematics', minGrade: 10, equation: r`$$d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$`, units: 'Units of length', whenToUse: 'Length of a segment, collinearity, equidistant points, type of triangle/quadrilateral.' },
  { name: 'Section and Mid-point Formula', subject: 'Mathematics', minGrade: 10, equation: r`$$P = \left(\frac{m x_2 + n x_1}{m + n}, \frac{m y_2 + n y_1}{m + n}\right), \quad M = \left(\frac{x_1 + x_2}{2}, \frac{y_1 + y_2}{2}\right)$$`, units: 'Coordinates', whenToUse: 'Point dividing a segment in m : n internally; the mid-point is the 1 : 1 case.' },
  { name: 'Standard Trigonometric Values', subject: 'Mathematics', minGrade: 10, equation: r`$$\sin 0^\circ, 30^\circ, 45^\circ, 60^\circ, 90^\circ = 0, \tfrac12, \tfrac{1}{\sqrt2}, \tfrac{\sqrt3}{2}, 1$$`, units: 'Dimensionless', whenToUse: r`$\cos$ is the same list reversed; $\tan = \sin/\cos$ gives $0, \tfrac{1}{\sqrt3}, 1, \sqrt3$, not defined.` },
  { name: 'Trigonometric Identities', subject: 'Mathematics', minGrade: 10, equation: r`$$1 + \tan^2\theta = \sec^2\theta, \qquad 1 + \cot^2\theta = \csc^2\theta$$`, units: 'Dimensionless', whenToUse: 'Proving identities: convert everything to sin and cos if stuck.' },
  { name: 'Sector and Arc', subject: 'Mathematics', minGrade: 10, equation: r`$$\text{Area} = \frac{\theta}{360^\circ}\pi r^2, \qquad \text{Arc length} = \frac{\theta}{360^\circ} 2\pi r$$`, units: r`$\text{cm}^2$, cm`, whenToUse: 'Clock hands, sectors, segments (segment = sector − triangle).' },
  { name: 'Surface Areas', subject: 'Mathematics', minGrade: 10, equation: r`$$\text{CSA: cylinder } 2\pi rh,\ \text{cone } \pi r l,\ \text{hemisphere } 2\pi r^2; \quad \text{sphere } 4\pi r^2$$`, units: r`$\text{cm}^2$`, whenToUse: r`Combined solids: add only the outer (visible) surfaces. Cone slant height $l = \sqrt{h^2 + r^2}$.` },
  { name: 'Volumes', subject: 'Mathematics', minGrade: 10, equation: r`$$\text{Cylinder } \pi r^2 h,\ \text{cone } \tfrac13 \pi r^2 h,\ \text{sphere } \tfrac43 \pi r^3,\ \text{hemisphere } \tfrac23 \pi r^3$$`, units: r`$\text{cm}^3$`, whenToUse: 'Combined solids: add volumes. Melting/recasting: volume stays the same.' },
  { name: 'Mean of Grouped Data', subject: 'Mathematics', minGrade: 10, equation: r`$$\bar x = \frac{\sum f_i x_i}{\sum f_i} = a + \frac{\sum f_i d_i}{\sum f_i}$$`, units: 'Same as data', whenToUse: r`Direct method, or assumed-mean method with $d_i = x_i - a$ for large numbers.` },
  { name: 'Mode and Median of Grouped Data', subject: 'Mathematics', minGrade: 10, equation: r`$$\text{Mode} = l + \frac{f_1 - f_0}{2f_1 - f_0 - f_2}\,h, \qquad \text{Median} = l + \frac{\frac{n}{2} - cf}{f}\,h$$`, units: 'Same as data', whenToUse: 'Identify the modal class (highest f) or median class (cf just above n/2) first.' },
  { name: 'Probability', subject: 'Mathematics', minGrade: 10, equation: r`$$P(E) = \frac{\text{favourable outcomes}}{\text{total outcomes}}, \qquad P(E) + P(\bar E) = 1$$`, units: r`$0 \le P \le 1$`, whenToUse: 'Dice (6 or 36 outcomes), coins, a deck of 52 cards (26 red, 4 of each rank).' },
  { name: 'Refractive Index', subject: 'Science', minGrade: 10, equation: r`$$n = \frac{c}{v}, \qquad n_{21} = \frac{\sin i}{\sin r}$$`, units: 'Dimensionless', whenToUse: 'Speed of light in a medium; comparing optical densities.' },
  { name: 'Resistance and Resistivity', subject: 'Science', minGrade: 10, equation: r`$$R = \rho\frac{l}{A}, \quad R_s = R_1 + R_2 + \dots, \quad \frac{1}{R_p} = \frac{1}{R_1} + \frac{1}{R_2} + \dots$$`, units: r`$\Omega$; $\rho$ in $\Omega\,$m`, whenToUse: 'Effect of length and area on resistance; combining resistors.' },
  { name: 'Charge, Current and Heat', subject: 'Science', minGrade: 10, equation: r`$$I = \frac{Q}{t}, \quad V = \frac{W}{Q}, \quad H = I^2 R t$$`, units: 'A, V, J', whenToUse: "Current from charge, potential difference from work, Joule's law of heating." },
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
