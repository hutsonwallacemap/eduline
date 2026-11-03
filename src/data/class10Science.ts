import type { Question } from '../types/quiz';
import { describe, mcq } from './authoring';

const r = String.raw;
const S = 'Science';

/** Class 10 Science: chapter-wise important questions with board-style answers. */
export const CLASS10_SCIENCE: Question[] = [
  // Chemical Reactions and Equations
  mcq(S, 'Chemical Reactions and Equations', 'Which of the following is a decomposition reaction?',
    [r`$\mathrm{CaCO_3 \rightarrow CaO + CO_2}$`, r`$\mathrm{CaO + H_2O \rightarrow Ca(OH)_2}$`, r`$\mathrm{Fe + CuSO_4 \rightarrow FeSO_4 + Cu}$`, r`$\mathrm{NaOH + HCl \rightarrow NaCl + H_2O}$`], 0,
    'A single reactant (calcium carbonate) breaks down into two products on heating — a **thermal decomposition** reaction.'),
  mcq(S, 'Chemical Reactions and Equations', r`The reaction $\mathrm{Fe + CuSO_4 \rightarrow FeSO_4 + Cu}$ is an example of:`, ['combination', 'decomposition', 'displacement', 'double displacement'], 2,
    'Iron is more reactive than copper, so it **displaces** copper from copper sulphate. The blue solution turns pale green.'),
  describe(S, 'Chemical Reactions and Equations', 'Why is respiration considered an exothermic reaction? Write the equation.',
    r`During respiration, glucose is oxidised in our cells and **energy is released**, so it is exothermic:

$$\mathrm{C_6H_{12}O_6(aq) + 6O_2(g) \rightarrow 6CO_2(g) + 6H_2O(l) + \text{energy}}$$`, 2),
  describe(S, 'Chemical Reactions and Equations', 'What is rancidity? Write two ways to prevent it.',
    r`**Rancidity:** the **oxidation** of fats and oils in food, which changes their smell and taste.

**Prevention (any two):** adding **antioxidants**; storing in **airtight containers**; flushing packets with **nitrogen** (e.g. chips); keeping food in the **refrigerator**.`, 2),

  // Acids, Bases and Salts
  mcq(S, 'Acids, Bases and Salts', 'A solution turns red litmus blue. Its pH is likely to be:', ['1', '4', '5', '10'], 3,
    'Bases turn red litmus blue and have **pH more than 7**.'),
  mcq(S, 'Acids, Bases and Salts', 'The chemical formula of bleaching powder is:', [r`$\mathrm{CaOCl_2}$`, r`$\mathrm{CaCO_3}$`, r`$\mathrm{NaHCO_3}$`, r`$\mathrm{CaSO_4}$`], 0,
    r`Bleaching powder is calcium oxychloride, $\mathrm{CaOCl_2}$, made by passing chlorine over dry slaked lime.`),
  describe(S, 'Acids, Bases and Salts', 'How is Plaster of Paris prepared? Write the reaction that occurs when it is mixed with water.',
    r`**Preparation:** heat gypsum at **373 K**:
$$\mathrm{CaSO_4 \cdot 2H_2O \xrightarrow{373\,K} CaSO_4 \cdot \tfrac12 H_2O + 1\tfrac12 H_2O}$$

**With water** it sets into a hard mass of gypsum:
$$\mathrm{CaSO_4 \cdot \tfrac12 H_2O + 1\tfrac12 H_2O \rightarrow CaSO_4 \cdot 2H_2O}$$

Used for plasters on fractured bones, toys and decorative work.`, 3),
  describe(S, 'Acids, Bases and Salts', 'Why does tooth decay start when the pH of the mouth falls below 5.5? How can it be prevented?',
    r`Bacteria break down sugar and food particles into **acids**. Below pH 5.5, the acid **corrodes tooth enamel** (calcium hydroxyapatite, the hardest substance in the body).

**Prevention:** brush with toothpaste, which is **basic** and **neutralises the excess acid**; rinse the mouth after eating.`, 2),

  // Metals and Non-metals
  mcq(S, 'Metals and Non-metals', 'Which metal is stored in kerosene oil?', ['Iron', 'Sodium', 'Copper', 'Aluminium'], 1,
    'Sodium reacts vigorously with oxygen and moisture and can catch fire, so it is kept **under kerosene**.'),
  mcq(S, 'Metals and Non-metals', 'A non-metal that is liquid at room temperature is:', ['Mercury', 'Bromine', 'Iodine', 'Sulphur'], 1,
    '**Bromine** is the only liquid non-metal. Mercury is a liquid **metal**.'),
  describe(S, 'Metals and Non-metals', 'Show the formation of NaCl and MgCl₂ by the transfer of electrons.',
    r`**NaCl:** $\mathrm{Na}$ (2, 8, 1) loses 1 electron $\rightarrow \mathrm{Na^+}$; $\mathrm{Cl}$ (2, 8, 7) gains it $\rightarrow \mathrm{Cl^-}$. $\;\mathrm{Na^+Cl^-}$.

**MgCl₂:** $\mathrm{Mg}$ (2, 8, 2) loses 2 electrons $\rightarrow \mathrm{Mg^{2+}}$; each of two $\mathrm{Cl}$ atoms gains one $\rightarrow 2\mathrm{Cl^-}$. $\;\mathrm{Mg^{2+}(Cl^-)_2}$.

*In the exam, draw electron-dot structures with arrows showing the transfer.*`, 3),
  describe(S, 'Metals and Non-metals', 'Why do ionic compounds have high melting points and conduct electricity in the molten state but not in the solid state?',
    r`**High melting point:** strong **electrostatic forces of attraction** between oppositely charged ions need a lot of energy to break.

**Conduction:** in the solid state the ions are **fixed** in the lattice; when molten (or dissolved in water) the **ions become free to move** and carry current.`, 3),

  // Carbon and its Compounds
  mcq(S, 'Carbon and its Compounds', 'The functional group present in ethanoic acid is:', ['–OH', '–CHO', '–COOH', '>C=O'], 2,
    'Ethanoic acid (CH₃COOH) has the **carboxylic acid group –COOH**.'),
  mcq(S, 'Carbon and its Compounds', 'The general formula of alkynes is:', [r`$\mathrm{C_nH_{2n+2}}$`, r`$\mathrm{C_nH_{2n}}$`, r`$\mathrm{C_nH_{2n-2}}$`, r`$\mathrm{C_nH_n}$`], 2,
    r`Alkynes have a triple bond: $\mathrm{C_nH_{2n-2}}$ (e.g. ethyne $\mathrm{C_2H_2}$).`),
  describe(S, 'Carbon and its Compounds', 'Explain the cleansing action of soap.',
    r`A soap molecule has an **ionic (hydrophilic) end** that dissolves in water and a long **hydrocarbon (hydrophobic) tail** that dissolves in oil.

In water, soap molecules form **micelles**: the tails point inward and trap oily dirt, while the ionic ends face the water.

The micelles stay suspended in water (an emulsion), so the dirt is **washed away** when rinsed.`, 3),
  describe(S, 'Carbon and its Compounds', 'What is esterification? Write the chemical equation and one use of esters.',
    r`**Esterification:** a carboxylic acid reacts with an alcohol in the presence of an acid catalyst to form a sweet-smelling **ester**.

$$\mathrm{CH_3COOH + C_2H_5OH \xrightarrow{\text{conc. } H_2SO_4} CH_3COOC_2H_5 + H_2O}$$

**Use:** esters are used in **perfumes** and as **flavouring agents**.`, 3),

  // Life Processes
  mcq(S, 'Life Processes', 'The site of photosynthesis in a plant cell is:', ['Mitochondria', 'Chloroplast', 'Ribosome', 'Nucleus'], 1,
    '**Chloroplasts** contain chlorophyll, which absorbs light energy for photosynthesis.'),
  mcq(S, 'Life Processes', 'Double circulation in humans means that blood:', ['flows in two directions', 'passes through the heart twice in one complete cycle', 'has two types of cells', 'is pumped by two hearts'], 1,
    'Blood goes **twice through the heart** in one cycle: once to the lungs (pulmonary) and once to the body (systemic).'),
  describe(S, 'Life Processes', 'Describe the structure and functioning of a nephron.',
    r`A nephron is the **filtration unit** of the kidney.

1. **Glomerulus** (a cluster of capillaries) inside **Bowman's capsule** filters blood: water, glucose, salts and urea pass into the tubule.
2. In the **tubule**, useful substances (glucose, amino acids, salts and much of the water) are **selectively reabsorbed**.
3. The remaining fluid becomes **urine**, which flows to the collecting duct, ureter and urinary bladder.

*Draw and label: glomerulus, Bowman's capsule, tubule, collecting duct.*`, 5),
  describe(S, 'Life Processes', 'What are the functions of stomata?',
    r`1. **Exchange of gases** — $\mathrm{CO_2}$ in for photosynthesis, $\mathrm{O_2}$ out.
2. **Transpiration** — loss of water vapour, which creates a pull for water transport.

Guard cells open and close the stomatal pore depending on water availability.`, 2),

  // Control and Coordination
  mcq(S, 'Control and Coordination', 'The hormone that regulates blood sugar level is:', ['Thyroxine', 'Insulin', 'Adrenaline', 'Growth hormone'], 1,
    '**Insulin**, secreted by the pancreas, lowers blood sugar. Its deficiency causes diabetes.'),
  mcq(S, 'Control and Coordination', 'The part of the brain that maintains posture and balance is:', ['Cerebrum', 'Medulla', 'Cerebellum', 'Hypothalamus'], 2,
    'The **cerebellum** (hindbrain) controls posture, balance and precision of voluntary movements.'),
  describe(S, 'Control and Coordination', 'What is a reflex arc? Explain with a flow diagram.',
    r`A **reflex arc** is the pathway taken by nerve impulses in a reflex action.

**Receptor** (e.g. skin) → **sensory neuron** → **relay neuron in the spinal cord** → **motor neuron** → **effector** (muscle).

Reflex arcs work through the spinal cord, so the response is quick, before the brain processes it.`, 3),
  describe(S, 'Control and Coordination', 'How does auxin cause a plant shoot to bend towards light (phototropism)?',
    r`Auxin is made at the **shoot tip**. When light falls from one side, auxin **diffuses to the shaded side**.

Auxin makes cells **elongate**, so the shaded side grows faster than the lit side, and the shoot **bends towards the light**.`, 2),

  // How do Organisms Reproduce?
  mcq(S, 'How do Organisms Reproduce?', 'Hydra reproduces asexually by:', ['binary fission', 'budding', 'spore formation', 'fragmentation'], 1,
    'A bud grows from regenerative cells on the body of Hydra and detaches to form a new individual — **budding**.'),
  mcq(S, 'How do Organisms Reproduce?', 'Which contraceptive method also protects against sexually transmitted diseases?', ['Copper-T', 'Oral pills', 'Condom', 'Vasectomy'], 2,
    'A **condom** is a barrier method, so it also prevents the transfer of infections.'),
  describe(S, 'How do Organisms Reproduce?', 'List three advantages of vegetative propagation.',
    r`1. Plants that **do not produce viable seeds** (banana, rose, orange) can be grown.
2. New plants are **genetically identical** to the parent, so desirable traits are kept.
3. Plants **bear flowers and fruits earlier** than those grown from seeds.`, 3),
  describe(S, 'How do Organisms Reproduce?', 'What are the functions of the placenta?',
    r`The placenta is a disc-like tissue joining the embryo to the uterine wall.

1. Supplies **glucose and oxygen** from the mother's blood to the embryo.
2. Removes **waste products** from the embryo into the mother's blood.`, 2),

  // Heredity
  mcq(S, 'Heredity', "The phenotypic ratio in the F2 generation of Mendel's monohybrid cross is:", ['1 : 2 : 1', '3 : 1', '9 : 3 : 3 : 1', '1 : 1'], 1,
    'Tall : dwarf = **3 : 1**. (The genotypic ratio is 1 TT : 2 Tt : 1 tt.)'),
  describe(S, 'Heredity', 'How is the sex of a child determined in human beings?',
    r`Women have **XX** sex chromosomes; men have **XY**.

All eggs carry an **X**. Half the sperms carry **X** and half carry **Y**.

- Egg + X-sperm → **XX → girl**
- Egg + Y-sperm → **XY → boy**

So the sex of the child depends on the **father's** chromosome.`, 3),
  describe(S, 'Heredity', "Explain Mendel's dihybrid cross with round-yellow and wrinkled-green pea plants.",
    r`**Parents:** RRYY (round, yellow) × rryy (wrinkled, green).

**F1:** all RrYy — round and yellow (round and yellow are dominant).

**F2** (F1 self-pollinated): round-yellow 9 : round-green 3 : wrinkled-yellow 3 : wrinkled-green 1.

**Conclusion:** the traits for seed shape and seed colour are **inherited independently**.`, 5),

  // Light – Reflection and Refraction
  mcq(S, 'Light – Reflection and Refraction', 'Dentists use which mirror to see large images of teeth?', ['Plane', 'Convex', 'Concave', 'Cylindrical'], 2,
    'A **concave mirror** gives an enlarged, erect image when the object is between the pole and the focus.'),
  describe(S, 'Light – Reflection and Refraction', 'An object is placed 30 cm in front of a convex lens of focal length 20 cm. Find the position, nature and magnification of the image.',
    r`$u = -30$ cm, $f = +20$ cm. Lens formula: $\dfrac{1}{v} - \dfrac{1}{u} = \dfrac{1}{f}$.

$\dfrac{1}{v} = \dfrac{1}{20} + \dfrac{1}{-30} = \dfrac{3 - 2}{60} = \dfrac{1}{60} \Rightarrow v = +60$ cm.

$m = \dfrac{v}{u} = \dfrac{60}{-30} = -2$.

**Image:** 60 cm behind the lens, **real, inverted** and **twice the size** of the object.`, 3),
  describe(S, 'Light – Reflection and Refraction', 'Find the power of a concave lens of focal length 50 cm.',
    r`$f = -50$ cm $= -0.5$ m. $P = \dfrac{1}{f(\text{in m})} = \dfrac{1}{-0.5} = -2$ D.

*Always convert f to metres; the minus sign shows a diverging (concave) lens.*`, 2),

  // The Human Eye and the Colourful World
  mcq(S, 'The Human Eye and the Colourful World', 'Myopia (short-sightedness) is corrected using a:', ['convex lens', 'concave lens', 'bifocal lens', 'cylindrical lens'], 1,
    'In myopia the image forms **in front of the retina**; a **concave (diverging) lens** moves it back onto the retina.'),
  describe(S, 'The Human Eye and the Colourful World', 'Why does the clear sky appear blue?',
    r`Sunlight is **scattered** by the very fine particles (molecules) of air.

Fine particles scatter **shorter wavelengths (blue)** much more than longer ones (red). This scattered blue light reaches our eyes from all directions, so the **sky looks blue**.`, 2),
  describe(S, 'The Human Eye and the Colourful World', 'Why do stars twinkle but planets do not?',
    r`**Stars** are very far away and act as **point sources**. Their light undergoes continuous **atmospheric refraction** through layers of changing density, so the apparent position and brightness keep changing — they **twinkle**.

**Planets** are much closer and act as **extended sources** (many point sources). The variations average out, so they **do not twinkle**.`, 3),

  // Electricity
  mcq(S, 'Electricity', 'The SI unit of resistivity is:', ['ohm', 'ohm metre', 'ohm per metre', 'mho'], 1,
    r`$\rho = \dfrac{RA}{l}$ gives units $\Omega \cdot \mathrm{m^2/m} = \Omega\,\mathrm{m}$ (**ohm metre**).`),
  mcq(S, 'Electricity', '1 kWh is equal to:', [r`$3.6 \times 10^6$ J`, r`$3.6 \times 10^3$ J`, r`$1000$ J`, r`$3600$ J`], 0,
    r`$1\ \text{kWh} = 1000\ \text{W} \times 3600\ \text{s} = 3.6 \times 10^6$ J.`),
  describe(S, 'Electricity', 'Three resistors of 2 Ω, 3 Ω and 6 Ω are connected (a) in series and (b) in parallel. Find the equivalent resistance in each case.',
    r`**(a) Series:** $R_s = 2 + 3 + 6 = 11\ \Omega$.

**(b) Parallel:** $\dfrac{1}{R_p} = \dfrac12 + \dfrac13 + \dfrac16 = \dfrac{3 + 2 + 1}{6} = 1 \Rightarrow R_p = 1\ \Omega$.`, 3),
  describe(S, 'Electricity', 'A current of 2 A flows through a 5 Ω resistor for 1 minute. How much heat is produced?',
    r`Joule's law: $H = I^2 R t = (2)^2 \times 5 \times 60 = 1200$ J.

*Convert time to seconds — a common place to lose a mark.*`, 2),

  // Magnetic Effects of Electric Current
  mcq(S, 'Magnetic Effects of Electric Current', "Fleming's left-hand rule gives the direction of:", ['induced current', 'magnetic field around a wire', 'force on a current-carrying conductor in a magnetic field', 'flow of electrons in a cell'], 2,
    'Forefinger = field, middle finger = current, thumb = **force (motion)** on the conductor.'),
  describe(S, 'Magnetic Effects of Electric Current', 'What is the function of an earth wire? Why is it necessary to earth metallic appliances?',
    r`The earth wire connects the **metal body** of an appliance to the earth through a low-resistance path.

If live wire insulation fails and touches the metal body, current flows **to the earth** instead of through the user, so the user **does not get a severe electric shock**.`, 2),
  describe(S, 'Magnetic Effects of Electric Current', 'List three properties of magnetic field lines.',
    r`1. They emerge from the **north pole** and merge at the **south pole** (outside the magnet); inside they go from south to north — they are **closed curves**.
2. They are **closer where the field is stronger**.
3. **No two field lines intersect** — otherwise there would be two directions of the field at one point.`, 3),

  // Our Environment
  mcq(S, 'Our Environment', 'In the upper atmosphere, ozone is formed by the action of:', ['infrared rays on carbon dioxide', 'UV radiation on oxygen', 'visible light on water vapour', 'lightning on nitrogen'], 1,
    r`UV radiation splits $\mathrm{O_2}$ into free oxygen atoms, which combine with $\mathrm{O_2}$ to form $\mathrm{O_3}$.`),
  describe(S, 'Our Environment', 'What is the 10 percent law of energy flow?',
    r`Only about **10%** of the energy at one trophic level is passed on to the next; the rest is used for life processes or lost as heat.

**Example:** producers 1000 J → herbivores 100 J → carnivores 10 J.

So food chains usually have only **3–4 trophic levels**.`, 2),
  describe(S, 'Our Environment', 'What is biological magnification? Which organisms are most affected?',
    r`**Biological magnification:** the **increasing concentration** of non-biodegradable chemicals (like pesticides) at each higher trophic level of a food chain.

These chemicals are not broken down or excreted, so they accumulate. Organisms at the **highest trophic level** (e.g. humans, eagles) have the **maximum** concentration.`, 3),
];
