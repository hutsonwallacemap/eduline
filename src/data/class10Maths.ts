import type { Question } from '../types/quiz';
import { describe, mcq } from './authoring';

const r = String.raw;
const S = 'Mathematics';

/** Class 10 Mathematics: chapter-wise important questions with board-style solutions. */
export const CLASS10_MATHS: Question[] = [
  // Real Numbers
  mcq(S, 'Real Numbers', r`If HCF(26, 91) = 13, then LCM(26, 91) is:`, ['$182$', '$2366$', '$91$', '$13$'], 0,
    r`For two numbers, $\text{HCF} \times \text{LCM} = $ product of the numbers. So $\text{LCM} = \dfrac{26 \times 91}{13} = 182$.`),
  mcq(S, 'Real Numbers', 'The product of a non-zero rational number and an irrational number is always:', ['rational', 'irrational', 'zero', 'an integer'], 1,
    r`If $r \neq 0$ is rational and $r \times x$ were rational, then $x = \dfrac{rx}{r}$ would be rational — a contradiction. So the product is **irrational**.`),
  describe(S, 'Real Numbers', r`Find the HCF and LCM of $6$, $72$ and $120$ using prime factorisation.`,
    r`**Step 1 — Prime factorise:** $6 = 2 \times 3$, $72 = 2^3 \times 3^2$, $120 = 2^3 \times 3 \times 5$.

**Step 2 — HCF** = product of the smallest powers of common primes $= 2^1 \times 3^1 = 6$.

**Step 3 — LCM** = product of the greatest powers of all primes $= 2^3 \times 3^2 \times 5 = 360$.`, 2),
  describe(S, 'Real Numbers', r`Prove that $\sqrt{3}$ is irrational.`,
    r`**Assume the opposite:** let $\sqrt{3} = \dfrac{a}{b}$, where $a, b$ are co-prime integers and $b \neq 0$.

**Square both sides:** $3b^2 = a^2$, so $3$ divides $a^2$, hence $3$ divides $a$ (a prime dividing $a^2$ divides $a$). Write $a = 3c$.

**Substitute:** $3b^2 = 9c^2 \Rightarrow b^2 = 3c^2$, so $3$ divides $b^2$ and hence $b$.

**Contradiction:** $3$ divides both $a$ and $b$, but they were co-prime. So our assumption is wrong and $\sqrt{3}$ is **irrational**.

*Marks are given for: assumption, the "prime divides square" step, the contradiction, and the conclusion.*`, 3),

  // Polynomials
  mcq(S, 'Polynomials', r`If $\alpha$ and $\beta$ are the zeroes of $x^2 - 5x + 6$, then $\alpha + \beta$ equals:`, ['$-5$', '$5$', '$6$', '$-6$'], 1,
    r`Sum of zeroes $= -\dfrac{b}{a} = -\dfrac{-5}{1} = 5$.`),
  mcq(S, 'Polynomials', 'The graph of a polynomial p(x) cuts the x-axis at exactly three points. The number of zeroes of p(x) is:', ['1', '2', '3', '0'], 2,
    'Each point where the graph meets the x-axis is a zero, so the polynomial has **3** zeroes.'),
  describe(S, 'Polynomials', r`Find the zeroes of $6x^2 - 7x - 3$ and verify the relationship between the zeroes and the coefficients.`,
    r`**Factorise:** $6x^2 - 7x - 3 = 6x^2 - 9x + 2x - 3 = 3x(2x - 3) + 1(2x - 3) = (3x + 1)(2x - 3)$.

**Zeroes:** $x = -\dfrac{1}{3}$ and $x = \dfrac{3}{2}$.

**Verify sum:** $-\dfrac{1}{3} + \dfrac{3}{2} = \dfrac{7}{6}$ and $-\dfrac{b}{a} = \dfrac{7}{6}$ ✔

**Verify product:** $-\dfrac{1}{3} \times \dfrac{3}{2} = -\dfrac{1}{2}$ and $\dfrac{c}{a} = \dfrac{-3}{6} = -\dfrac{1}{2}$ ✔`, 3),
  describe(S, 'Polynomials', r`Find a quadratic polynomial whose sum of zeroes is $-3$ and product of zeroes is $2$.`,
    r`A quadratic polynomial is $k\,[x^2 - (\text{sum})x + \text{product}]$.

$= k\,[x^2 - (-3)x + 2] = k\,(x^2 + 3x + 2)$. Taking $k = 1$: $\;x^2 + 3x + 2$.`, 2),

  // Pair of Linear Equations
  mcq(S, 'Pair of Linear Equations in Two Variables', r`The lines $2x + 3y = 5$ and $4x + 6y = 10$ are:`, ['intersecting', 'parallel', 'coincident', 'perpendicular'], 2,
    r`$\dfrac{a_1}{a_2} = \dfrac{2}{4}$, $\dfrac{b_1}{b_2} = \dfrac{3}{6}$, $\dfrac{c_1}{c_2} = \dfrac{5}{10}$ — all equal to $\dfrac{1}{2}$, so the lines are **coincident** (infinitely many solutions).`),
  describe(S, 'Pair of Linear Equations in Two Variables', r`Find $k$ for which the pair $kx + 3y = k - 3$ and $12x + ky = k$ has no solution.`,
    r`**Condition for no solution:** $\dfrac{a_1}{a_2} = \dfrac{b_1}{b_2} \neq \dfrac{c_1}{c_2}$.

$\dfrac{k}{12} = \dfrac{3}{k} \Rightarrow k^2 = 36 \Rightarrow k = \pm 6$.

**Check** $\dfrac{3}{k} \neq \dfrac{k - 3}{k}$, i.e. $k \neq 6$.

So $k = -6$. (For $k = 6$ the lines are coincident.)`, 3),
  describe(S, 'Pair of Linear Equations in Two Variables', r`5 pencils and 7 pens together cost ₹50, whereas 7 pencils and 5 pens together cost ₹46. Find the cost of one pencil and one pen.`,
    r`Let one pencil cost ₹$x$ and one pen ₹$y$.

$5x + 7y = 50 \quad (1)$ and $7x + 5y = 46 \quad (2)$.

**Add:** $12x + 12y = 96 \Rightarrow x + y = 8 \quad (3)$.

**Subtract (1) from (2):** $2x - 2y = -4 \Rightarrow x - y = -2 \quad (4)$.

From (3) and (4): $x = 3$, $y = 5$. **A pencil costs ₹3 and a pen costs ₹5.**`, 3),

  // Quadratic Equations
  mcq(S, 'Quadratic Equations', r`The equation $2x^2 - 4x + 3 = 0$ has:`, ['two distinct real roots', 'two equal real roots', 'no real roots', 'more than two real roots'], 2,
    r`$D = b^2 - 4ac = 16 - 24 = -8 < 0$, so there are **no real roots**.`),
  describe(S, 'Quadratic Equations', r`Solve $2x^2 - 7x + 3 = 0$ by factorisation.`,
    r`Split the middle term: $2x^2 - 6x - x + 3 = 2x(x - 3) - 1(x - 3) = (2x - 1)(x - 3) = 0$.

So $x = \dfrac{1}{2}$ or $x = 3$.`, 2),
  describe(S, 'Quadratic Equations', r`Find $k$ so that $kx(x - 2) + 6 = 0$ has two equal roots.`,
    r`Expand: $kx^2 - 2kx + 6 = 0$. For equal roots, $D = 0$:

$(-2k)^2 - 4(k)(6) = 0 \Rightarrow 4k^2 - 24k = 0 \Rightarrow 4k(k - 6) = 0$.

$k = 0$ is rejected (the equation would not be quadratic), so $k = 6$.`, 2),
  describe(S, 'Quadratic Equations', 'Find two consecutive positive integers whose product is 306.',
    r`Let the integers be $n$ and $n + 1$. Then $n(n + 1) = 306 \Rightarrow n^2 + n - 306 = 0$.

$n^2 + 18n - 17n - 306 = (n + 18)(n - 17) = 0 \Rightarrow n = 17$ (positive).

**The integers are 17 and 18.**`, 3),

  // Arithmetic Progressions
  mcq(S, 'Arithmetic Progressions', r`The 10th term of the AP $3, 8, 13, \ldots$ is:`, ['$48$', '$53$', '$45$', '$50$'], 0,
    r`$a = 3$, $d = 5$. $a_{10} = a + 9d = 3 + 45 = 48$.`),
  mcq(S, 'Arithmetic Progressions', r`If the $n$th term of an AP is $a_n = 3 + 4n$, its common difference is:`, ['$3$', '$4$', '$7$', '$-4$'], 1,
    r`$d = a_{n+1} - a_n = [3 + 4(n+1)] - [3 + 4n] = 4$.`),
  describe(S, 'Arithmetic Progressions', 'How many two-digit numbers are divisible by 3?',
    r`They form the AP $12, 15, 18, \ldots, 99$ with $a = 12$, $d = 3$, $a_n = 99$.

$99 = 12 + (n - 1) \times 3 \Rightarrow n - 1 = 29 \Rightarrow n = 30$.

**There are 30 two-digit numbers divisible by 3.**`, 2),
  describe(S, 'Arithmetic Progressions', r`Find the sum of the first 20 terms of the AP $1, 4, 7, 10, \ldots$`,
    r`$a = 1$, $d = 3$, $n = 20$.

$S_n = \dfrac{n}{2}[2a + (n - 1)d] = \dfrac{20}{2}[2 + 19 \times 3] = 10 \times 59 = 590$.`, 2),

  // Triangles
  mcq(S, 'Triangles', r`In $\triangle ABC$, $DE \parallel BC$ with $D$ on $AB$ and $E$ on $AC$. If $AD = 2$ cm, $DB = 3$ cm and $AE = 4$ cm, then $EC$ is:`, ['$6$ cm', '$5$ cm', '$8$ cm', '$1.5$ cm'], 0,
    r`By the Basic Proportionality Theorem, $\dfrac{AD}{DB} = \dfrac{AE}{EC} \Rightarrow \dfrac{2}{3} = \dfrac{4}{EC} \Rightarrow EC = 6$ cm.`),
  mcq(S, 'Triangles', r`$\triangle ABC \sim \triangle PQR$ with $AB = 4$ cm and $PQ = 6$ cm. If the perimeter of $\triangle ABC$ is $20$ cm, the perimeter of $\triangle PQR$ is:`, ['$24$ cm', '$30$ cm', '$13.3$ cm', '$36$ cm'], 1,
    r`Perimeters of similar triangles are in the ratio of corresponding sides: $\dfrac{20}{P} = \dfrac{4}{6} \Rightarrow P = 30$ cm.`),
  describe(S, 'Triangles', 'A vertical pole 6 m long casts a shadow 4 m long. At the same time a tower casts a shadow 28 m long. Find the height of the tower.',
    r`The sun's rays make the same angle with the ground, so the two right triangles (pole–shadow and tower–shadow) are **similar (AA)**.

$\dfrac{\text{height of tower}}{28} = \dfrac{6}{4} \Rightarrow \text{height} = \dfrac{6 \times 28}{4} = 42$ m.`, 3),
  describe(S, 'Triangles', 'State and prove the Basic Proportionality Theorem (Thales theorem).',
    r`**Statement:** If a line is drawn parallel to one side of a triangle to meet the other two sides at distinct points, the other two sides are divided in the same ratio.

**Given:** $\triangle ABC$, $DE \parallel BC$, $D$ on $AB$, $E$ on $AC$. **To prove:** $\dfrac{AD}{DB} = \dfrac{AE}{EC}$.

**Construction:** Join $BE$ and $CD$; draw $EN \perp AB$ and $DM \perp AC$.

**Proof:** $\dfrac{ar(ADE)}{ar(BDE)} = \dfrac{\frac12 AD \cdot EN}{\frac12 DB \cdot EN} = \dfrac{AD}{DB}$ and $\dfrac{ar(ADE)}{ar(DEC)} = \dfrac{AE}{EC}$.

$\triangle BDE$ and $\triangle DEC$ lie on the same base $DE$ between the same parallels $DE$ and $BC$, so $ar(BDE) = ar(DEC)$.

Therefore $\dfrac{AD}{DB} = \dfrac{AE}{EC}$. ∎

*Draw the figure: it carries marks.*`, 5),

  // Coordinate Geometry
  mcq(S, 'Coordinate Geometry', 'The distance between the points (2, 3) and (4, 1) is:', [r`$2$`, r`$2\sqrt{2}$`, r`$4$`, r`$\sqrt{2}$`], 1,
    r`$d = \sqrt{(4 - 2)^2 + (1 - 3)^2} = \sqrt{4 + 4} = 2\sqrt{2}$.`),
  mcq(S, 'Coordinate Geometry', 'The mid-point of the segment joining (−2, 4) and (6, −8) is:', ['(2, −2)', '(4, −4)', '(2, 2)', '(−4, 6)'], 0,
    r`Mid-point $= \left(\dfrac{-2 + 6}{2}, \dfrac{4 - 8}{2}\right) = (2, -2)$.`),
  describe(S, 'Coordinate Geometry', 'Find the coordinates of the point which divides the join of A(−1, 7) and B(4, −3) in the ratio 2 : 3.',
    r`Section formula with $m : n = 2 : 3$:

$x = \dfrac{2(4) + 3(-1)}{2 + 3} = \dfrac{5}{5} = 1$, $\quad y = \dfrac{2(-3) + 3(7)}{5} = \dfrac{15}{5} = 3$.

**The point is (1, 3).**`, 2),
  describe(S, 'Coordinate Geometry', 'Find the point on the x-axis which is equidistant from (2, −5) and (−2, 9).',
    r`Let the point be $P(x, 0)$. Then $PA^2 = PB^2$:

$(x - 2)^2 + 25 = (x + 2)^2 + 81 \Rightarrow -4x + 29 = 4x + 85 \Rightarrow -8x = 56 \Rightarrow x = -7$.

**The point is (−7, 0).**`, 3),

  // Introduction to Trigonometry
  mcq(S, 'Introduction to Trigonometry', r`If $\sin A = \dfrac{3}{5}$ and $A$ is acute, then $\cos A$ is:`, [r`$\dfrac{4}{5}$`, r`$\dfrac{3}{4}$`, r`$\dfrac{5}{4}$`, r`$\dfrac{5}{3}$`], 0,
    r`$\cos A = \sqrt{1 - \sin^2 A} = \sqrt{1 - \tfrac{9}{25}} = \dfrac{4}{5}$.`),
  mcq(S, 'Introduction to Trigonometry', r`The value of $9\sec^2 A - 9\tan^2 A$ is:`, ['$1$', '$9$', '$8$', '$0$'], 1,
    r`$9(\sec^2 A - \tan^2 A) = 9 \times 1 = 9$.`),
  describe(S, 'Introduction to Trigonometry', r`Prove that $\dfrac{1 + \tan^2 A}{1 + \cot^2 A} = \tan^2 A$.`,
    r`LHS $= \dfrac{\sec^2 A}{\csc^2 A} = \dfrac{1/\cos^2 A}{1/\sin^2 A} = \dfrac{\sin^2 A}{\cos^2 A} = \tan^2 A =$ RHS. ∎

*Write each identity you use: $1 + \tan^2 A = \sec^2 A$, $1 + \cot^2 A = \csc^2 A$.*`, 2),
  describe(S, 'Introduction to Trigonometry', r`Evaluate $\dfrac{\sin 30^\circ + \tan 45^\circ - \csc 60^\circ}{\sec 30^\circ + \cos 60^\circ + \cot 45^\circ}$.`,
    r`Substitute: $\sin 30^\circ = \tfrac12$, $\tan 45^\circ = 1$, $\csc 60^\circ = \tfrac{2}{\sqrt3}$, $\sec 30^\circ = \tfrac{2}{\sqrt3}$, $\cos 60^\circ = \tfrac12$, $\cot 45^\circ = 1$.

Numerator $= \tfrac32 - \tfrac{2}{\sqrt3} = \dfrac{3\sqrt3 - 4}{2\sqrt3}$; Denominator $= \tfrac{2}{\sqrt3} + \tfrac32 = \dfrac{4 + 3\sqrt3}{2\sqrt3}$.

Value $= \dfrac{3\sqrt3 - 4}{3\sqrt3 + 4} = \dfrac{(3\sqrt3 - 4)^2}{27 - 16} = \dfrac{43 - 24\sqrt3}{11}$.`, 3),

  // Some Applications of Trigonometry
  mcq(S, 'Some Applications of Trigonometry', 'If the length of the shadow of a tower equals its height, the angle of elevation of the sun is:', ['30°', '45°', '60°', '90°'], 1,
    r`$\tan\theta = \dfrac{h}{h} = 1 \Rightarrow \theta = 45^\circ$.`),
  describe(S, 'Some Applications of Trigonometry', 'The angle of elevation of the top of a tower from a point on the ground 30 m away from its foot is 30°. Find the height of the tower.',
    r`Let the height be $h$. In the right triangle, $\tan 30^\circ = \dfrac{h}{30}$.

$h = 30 \times \dfrac{1}{\sqrt3} = 10\sqrt3 \approx 17.32$ m.

*Draw the figure, mark the angle and the right angle — the figure carries a mark.*`, 2),
  describe(S, 'Some Applications of Trigonometry', 'A kite is flying at a height of 60 m above the ground. The string makes an angle of 60° with the ground. Find the length of the string, assuming it is straight.',
    r`$\sin 60^\circ = \dfrac{60}{L} \Rightarrow L = \dfrac{60}{\sqrt3 / 2} = \dfrac{120}{\sqrt3} = 40\sqrt3 \approx 69.28$ m.`, 2),

  // Circles
  mcq(S, 'Circles', 'The length of the tangent from a point 5 cm away from the centre of a circle of radius 3 cm is:', ['4 cm', '8 cm', '2 cm', '√34 cm'], 0,
    r`The radius is perpendicular to the tangent: $\text{tangent} = \sqrt{5^2 - 3^2} = 4$ cm.`),
  mcq(S, 'Circles', 'The number of tangents that can be drawn to a circle at a point on the circle is:', ['0', '1', '2', 'infinitely many'], 1,
    'Exactly **one** tangent passes through a point on the circle.'),
  describe(S, 'Circles', 'Prove that the lengths of tangents drawn from an external point to a circle are equal.',
    r`**Given:** circle with centre $O$, external point $P$, tangents $PQ$ and $PR$. **To prove:** $PQ = PR$.

**Construction:** join $OQ$, $OR$, $OP$.

**Proof:** In $\triangle OQP$ and $\triangle ORP$: $OQ = OR$ (radii), $OP = OP$ (common), $\angle OQP = \angle ORP = 90^\circ$ (radius $\perp$ tangent).

So $\triangle OQP \cong \triangle ORP$ (RHS), hence $PQ = PR$ (CPCT). ∎`, 3),
  describe(S, 'Circles', 'Two concentric circles have radii 5 cm and 3 cm. Find the length of the chord of the larger circle which touches the smaller circle.',
    r`The chord touches the smaller circle, so the radius $3$ cm is perpendicular to the chord at its mid-point.

Half-chord $= \sqrt{5^2 - 3^2} = 4$ cm, so the **chord is 8 cm**.`, 2),

  // Areas Related to Circles
  mcq(S, 'Areas Related to Circles', r`The perimeter of a semicircle of radius $7$ cm is $\left(\pi = \tfrac{22}{7}\right)$:`, ['22 cm', '36 cm', '44 cm', '29 cm'], 1,
    r`Perimeter $= \pi r + 2r = 22 + 14 = 36$ cm. Don't forget the diameter!`),
  describe(S, 'Areas Related to Circles', 'The minute hand of a clock is 14 cm long. Find the area swept by it in 5 minutes.',
    r`In 60 minutes the hand turns $360^\circ$, so in 5 minutes it turns $30^\circ$.

Area $= \dfrac{\theta}{360^\circ}\pi r^2 = \dfrac{30}{360} \times \dfrac{22}{7} \times 14 \times 14 = \dfrac{154}{3} \approx 51.33$ cm².`, 2),
  describe(S, 'Areas Related to Circles', 'Find the area of a sector of a circle of radius 6 cm with angle 60°. (Use π = 3.14)',
    r`Area $= \dfrac{60}{360} \times 3.14 \times 6^2 = \dfrac{1}{6} \times 113.04 = 18.84$ cm².`, 2),

  // Surface Areas and Volumes
  mcq(S, 'Surface Areas and Volumes', 'Two cubes each of volume 64 cm³ are joined end to end. The surface area of the resulting cuboid is:', ['128 cm²', '160 cm²', '192 cm²', '96 cm²'], 1,
    r`Edge $= 4$ cm; cuboid $8 \times 4 \times 4$. Surface area $= 2(32 + 16 + 32) = 160$ cm².`),
  describe(S, 'Surface Areas and Volumes', 'A toy is in the form of a cone of radius 3.5 cm mounted on a hemisphere of the same radius. The total height of the toy is 15.5 cm. Find its total surface area.',
    r`Height of cone $h = 15.5 - 3.5 = 12$ cm. Slant height $l = \sqrt{12^2 + 3.5^2} = \sqrt{156.25} = 12.5$ cm.

TSA $=$ CSA of cone $+$ CSA of hemisphere $= \pi r l + 2\pi r^2$

$= \dfrac{22}{7} \times 3.5 \times 12.5 + 2 \times \dfrac{22}{7} \times 3.5^2 = 137.5 + 77 = 214.5$ cm².

*Common mistake: adding the flat base areas — they are hidden where the solids join.*`, 3),
  describe(S, 'Surface Areas and Volumes', 'A solid is in the shape of a cylinder with a hemisphere at each end. The total length is 19 cm and the diameter is 7 cm. Find its volume. (π = 22/7)',
    r`$r = 3.5$ cm. Length of cylinder $= 19 - 2(3.5) = 12$ cm.

Volume $= \pi r^2 h + 2 \times \tfrac23 \pi r^3 = \pi r^2\left(h + \tfrac43 r\right) = \dfrac{22}{7} \times 12.25 \times \left(12 + \tfrac{14}{3}\right)$

$= 38.5 \times \dfrac{50}{3} \approx 641.67$ cm³.`, 3),

  // Statistics
  mcq(S, 'Statistics', 'The empirical relationship between mean, median and mode is:', ['3 Median = Mode + 2 Mean', '3 Mean = Mode + 2 Median', '2 Median = Mode + 3 Mean', 'Mode = Mean + Median'], 0,
    'For moderately skewed data: **3 Median = Mode + 2 Mean**.'),
  describe(S, 'Statistics', 'Find the mean of the data: class 0–10, 10–20, 20–30, 30–40, 40–50 with frequencies 4, 6, 10, 6, 4.',
    r`Class marks $x_i$: 5, 15, 25, 35, 45. $f_i x_i$: 20, 90, 250, 210, 180.

$\Sigma f_i = 30$, $\Sigma f_i x_i = 750$.

Mean $= \dfrac{\Sigma f_i x_i}{\Sigma f_i} = \dfrac{750}{30} = 25$.`, 3),
  describe(S, 'Statistics', 'For the data above (frequencies 4, 6, 10, 6, 4 for classes 0–10 … 40–50), find the mode.',
    r`Modal class $= 20$–$30$ (highest frequency 10). $l = 20$, $f_1 = 10$, $f_0 = 6$, $f_2 = 6$, $h = 10$.

Mode $= l + \dfrac{f_1 - f_0}{2f_1 - f_0 - f_2} \times h = 20 + \dfrac{4}{8} \times 10 = 25$.`, 3),
  mcq(S, 'Statistics', 'For the classes 0–10, 10–20, 20–30, 30–40, 40–50 with frequencies 4, 6, 10, 6, 4, the median class is:', ['10–20', '20–30', '30–40', '40–50'], 1,
    r`Cumulative frequencies: 4, 10, 20, 26, 30. $\tfrac{N}{2} = 15$, which first falls in $20$–$30$.`),

  // Probability
  mcq(S, 'Probability', 'A die is thrown once. The probability of getting a prime number is:', [r`$\tfrac{1}{3}$`, r`$\tfrac{1}{2}$`, r`$\tfrac{2}{3}$`, r`$\tfrac{1}{6}$`], 1,
    r`Primes on a die: 2, 3, 5. $P = \dfrac{3}{6} = \dfrac{1}{2}$.`),
  mcq(S, 'Probability', 'One card is drawn from a well-shuffled deck of 52 cards. The probability that it is a red king is:', [r`$\tfrac{1}{13}$`, r`$\tfrac{1}{26}$`, r`$\tfrac{1}{52}$`, r`$\tfrac{2}{13}$`], 1,
    r`There are 2 red kings. $P = \dfrac{2}{52} = \dfrac{1}{26}$.`),
  mcq(S, 'Probability', r`If $P(E) = 0.05$, then $P(\text{not } E)$ is:`, ['0.05', '0.5', '0.95', '0.9'], 2,
    r`$P(\bar E) = 1 - P(E) = 0.95$.`),
  describe(S, 'Probability', 'Two dice are thrown together. Find the probability that the sum of the numbers is 8.',
    r`Total outcomes $= 36$. Favourable: (2, 6), (3, 5), (4, 4), (5, 3), (6, 2) — 5 outcomes.

$P(\text{sum} = 8) = \dfrac{5}{36}$.`, 2),
];
