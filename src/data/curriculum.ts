import type { Stream } from '../store';

/** Drives prompting and UI wording: English is literature/grammar, never numericals. */
export type SubjectKind = 'math' | 'science' | 'english' | 'hindi' | 'social' | 'commerce' | 'cs';

export interface Subject {
  name: string;
  kind: SubjectKind;
  icon: string; // key resolved in SubjectIcon
  color: string; // tailwind gradient classes
  chapters: string[]; // suggested NCERT chapters for the selected class
  examTag?: string; // competitive-exam crossover for senior grades
}

/* ---------- Suggested chapters (NCERT, rationalised syllabus) by subject and class ---------- */

const ENGLISH_SKILLS = ['Grammar', 'Writing Skills', 'Reading Comprehension'];

const CHAPTERS: Record<string, Record<number, string[]>> = {
  Mathematics: {
    7: ['Integers', 'Fractions and Decimals', 'Data Handling', 'Simple Equations', 'Lines and Angles', 'The Triangle and its Properties', 'Comparing Quantities', 'Rational Numbers', 'Perimeter and Area', 'Algebraic Expressions', 'Exponents and Powers', 'Symmetry', 'Visualising Solid Shapes'],
    8: ['Rational Numbers', 'Linear Equations in One Variable', 'Understanding Quadrilaterals', 'Data Handling', 'Squares and Square Roots', 'Cubes and Cube Roots', 'Comparing Quantities', 'Algebraic Expressions and Identities', 'Mensuration', 'Exponents and Powers', 'Direct and Inverse Proportions', 'Factorisation', 'Introduction to Graphs'],
    9: ['Number Systems', 'Polynomials', 'Coordinate Geometry', 'Linear Equations in Two Variables', "Introduction to Euclid's Geometry", 'Lines and Angles', 'Triangles', 'Quadrilaterals', 'Circles', "Heron's Formula", 'Surface Areas and Volumes', 'Statistics'],
    10: ['Real Numbers', 'Polynomials', 'Pair of Linear Equations in Two Variables', 'Quadratic Equations', 'Arithmetic Progressions', 'Triangles', 'Coordinate Geometry', 'Introduction to Trigonometry', 'Some Applications of Trigonometry', 'Circles', 'Areas Related to Circles', 'Surface Areas and Volumes', 'Statistics', 'Probability'],
    11: ['Sets', 'Relations and Functions', 'Trigonometric Functions', 'Complex Numbers and Quadratic Equations', 'Linear Inequalities', 'Permutations and Combinations', 'Binomial Theorem', 'Sequences and Series', 'Straight Lines', 'Conic Sections', 'Introduction to Three Dimensional Geometry', 'Limits and Derivatives', 'Statistics', 'Probability'],
    12: ['Relations and Functions', 'Inverse Trigonometric Functions', 'Matrices', 'Determinants', 'Continuity and Differentiability', 'Application of Derivatives', 'Integrals', 'Application of Integrals', 'Differential Equations', 'Vector Algebra', 'Three Dimensional Geometry', 'Linear Programming', 'Probability'],
  },
  Science: {
    7: ['Nutrition in Plants', 'Nutrition in Animals', 'Heat', 'Acids, Bases and Salts', 'Physical and Chemical Changes', 'Respiration in Organisms', 'Transportation in Animals and Plants', 'Reproduction in Plants', 'Motion and Time', 'Electric Current and its Effects', 'Light', 'Forests: Our Lifeline', 'Wastewater Story'],
    8: ['Crop Production and Management', 'Microorganisms: Friend and Foe', 'Coal and Petroleum', 'Combustion and Flame', 'Conservation of Plants and Animals', 'Reproduction in Animals', 'Reaching the Age of Adolescence', 'Force and Pressure', 'Friction', 'Sound', 'Chemical Effects of Electric Current', 'Some Natural Phenomena', 'Light'],
    9: ['Matter in Our Surroundings', 'Is Matter Around Us Pure?', 'Atoms and Molecules', 'Structure of the Atom', 'The Fundamental Unit of Life', 'Tissues', 'Motion', 'Force and Laws of Motion', 'Gravitation', 'Work and Energy', 'Sound', 'Improvement in Food Resources'],
    10: ['Chemical Reactions and Equations', 'Acids, Bases and Salts', 'Metals and Non-metals', 'Carbon and its Compounds', 'Life Processes', 'Control and Coordination', 'How do Organisms Reproduce?', 'Heredity', 'Light – Reflection and Refraction', 'The Human Eye and the Colourful World', 'Electricity', 'Magnetic Effects of Electric Current', 'Our Environment'],
  },
  'Social Science': {
    7: ['History: Tracing Changes through a Thousand Years', 'History: New Kings and Kingdoms', 'History: The Delhi Sultans', 'History: The Mughal Empire', 'History: Tribes, Nomads and Settled Communities', 'History: Devotional Paths to the Divine', 'Geography: Environment', 'Geography: Inside Our Earth', 'Geography: Our Changing Earth', 'Geography: Air', 'Geography: Water', 'Civics: On Equality', 'Civics: How the State Government Works', 'Civics: Growing up as Boys and Girls', 'Civics: Understanding Media', 'Civics: Markets Around Us'],
    8: ['History: How, When and Where', 'History: From Trade to Territory', 'History: Ruling the Countryside', 'History: When People Rebel', 'History: Women, Caste and Reform', 'History: The Making of the National Movement', 'Geography: Resources', 'Geography: Land, Soil, Water, Natural Vegetation and Wildlife', 'Geography: Agriculture', 'Geography: Industries', 'Civics: The Indian Constitution', 'Civics: Understanding Secularism', 'Civics: Parliament and the Making of Laws', 'Civics: Judiciary', 'Civics: Understanding Marginalisation'],
    9: ['History: The French Revolution', 'History: Socialism in Europe and the Russian Revolution', 'History: Nazism and the Rise of Hitler', 'History: Forest Society and Colonialism', 'History: Pastoralists in the Modern World', 'Geography: India – Size and Location', 'Geography: Physical Features of India', 'Geography: Drainage', 'Geography: Climate', 'Geography: Natural Vegetation and Wildlife', 'Geography: Population', 'Civics: What is Democracy? Why Democracy?', 'Civics: Constitutional Design', 'Civics: Electoral Politics', 'Civics: Working of Institutions', 'Civics: Democratic Rights', 'Economics: The Story of Village Palampur', 'Economics: People as Resource', 'Economics: Poverty as a Challenge', 'Economics: Food Security in India'],
    10: ['History: The Rise of Nationalism in Europe', 'History: Nationalism in India', 'History: The Making of a Global World', 'History: The Age of Industrialisation', 'History: Print Culture and the Modern World', 'Geography: Resources and Development', 'Geography: Forest and Wildlife Resources', 'Geography: Water Resources', 'Geography: Agriculture', 'Geography: Minerals and Energy Resources', 'Geography: Manufacturing Industries', 'Geography: Lifelines of National Economy', 'Civics: Power Sharing', 'Civics: Federalism', 'Civics: Gender, Religion and Caste', 'Civics: Political Parties', 'Civics: Outcomes of Democracy', 'Economics: Development', 'Economics: Sectors of the Indian Economy', 'Economics: Money and Credit', 'Economics: Globalisation and the Indian Economy'],
  },
  English: {
    7: ['Three Questions', 'A Gift of Chappals', 'Gopal and the Hilsa Fish', 'The Ashes That Made Trees Bloom', 'Quality', 'Expert Detectives', 'The Invention of Vita-Wonk', 'Fire: Friend and Foe', 'A Bicycle in Good Repair', 'The Story of Cricket', 'Poem: The Squirrel', 'Poem: The Rebel', 'Poem: The Shed', 'Poem: Chivvy', 'Poem: Trees', 'Poem: Garden Snake', ...ENGLISH_SKILLS],
    8: ['The Best Christmas Present in the World', 'The Tsunami', 'Glimpses of the Past', "Bepin Choudhury's Lapse of Memory", 'The Summit Within', "This is Jody's Fawn", 'A Visit to Cambridge', 'A Short Monsoon Diary', 'Poem: The Ant and the Cricket', 'Poem: Geography Lesson', 'Poem: Macavity: The Mystery Cat', 'Poem: The Last Bargain', 'Poem: The School Boy', 'Poem: On the Grasshopper and Cricket', ...ENGLISH_SKILLS],
    9: ['The Fun They Had', 'The Sound of Music', 'The Little Girl', 'A Truly Beautiful Mind', 'The Snake and the Mirror', 'My Childhood', 'Reach for the Top', 'Kathmandu', 'If I Were You', 'Poem: The Road Not Taken', 'Poem: Wind', 'Poem: Rain on the Roof', 'Poem: The Lake Isle of Innisfree', 'Poem: A Legend of the Northland', 'Poem: No Men Are Foreign', 'Poem: On Killing a Tree', 'Moments: The Lost Child', 'Moments: The Adventures of Toto', 'Moments: Iswaran the Storyteller', 'Moments: The Happy Prince', 'Moments: The Last Leaf', ...ENGLISH_SKILLS],
    10: ['A Letter to God', 'Nelson Mandela: Long Walk to Freedom', 'Two Stories about Flying', 'From the Diary of Anne Frank', 'Glimpses of India', 'Mijbil the Otter', 'Madam Rides the Bus', 'The Sermon at Benares', 'The Proposal', 'Poem: Dust of Snow', 'Poem: Fire and Ice', 'Poem: A Tiger in the Zoo', 'Poem: The Ball Poem', 'Poem: Amanda!', 'Poem: The Tale of Custard the Dragon', 'Poem: For Anne Gregory', 'Footprints: A Triumph of Surgery', "Footprints: The Thief's Story", 'Footprints: The Midnight Visitor', 'Footprints: The Necklace', 'Footprints: Bholi', ...ENGLISH_SKILLS],
    11: ['The Portrait of a Lady', "We're Not Afraid to Die", 'Discovering Tut: the Saga Continues', 'The Ailing Planet', 'The Adventure', 'Silk Road', 'Poem: A Photograph', 'Poem: The Voice of the Rain', 'Poem: Childhood', 'Poem: Father to Son', 'Snapshots: The Summer of the Beautiful White Horse', 'Snapshots: The Address', "Snapshots: Mother's Day", 'Snapshots: Birth', 'Snapshots: The Tale of Melon City', ...ENGLISH_SKILLS],
    12: ['The Last Lesson', 'Lost Spring', 'Deep Water', 'The Rattrap', 'Indigo', 'Poets and Pancakes', 'The Interview', 'Going Places', 'Poem: My Mother at Sixty-six', 'Poem: Keeping Quiet', 'Poem: A Thing of Beauty', 'Poem: A Roadside Stand', "Poem: Aunt Jennifer's Tigers", 'Vistas: The Third Level', 'Vistas: The Tiger King', 'Vistas: Journey to the End of the Earth', 'Vistas: The Enemy', 'Vistas: On the Face of It', 'Vistas: Memories of Childhood', ...ENGLISH_SKILLS],
  },
  Hindi: {
    7: ['Hum Panchhi Unmukt Gagan Ke', 'Dadi Maa', 'Himalaya ki Betiyan', 'Kathputli', 'Mithaiwala', 'Papa Kho Gaye', 'Chidiya ki Bachchi', 'Rahim ke Dohe', 'Kancha', 'Ek Tinka', 'Neelkanth', 'Veer Kunwar Singh', 'Vyakaran'],
    8: ['Lakh ki Chudiyan', 'Bus ki Yatra', 'Deewanon ki Hasti', 'Chitthiyon ki Anoothi Duniya', 'Bhagwan ke Daakiye', 'Kya Nirash Hua Jaaye', 'Kabir ki Saakhiyan', 'Sudama Charit', 'Akbari Lota', 'Surdas ke Pad', 'Pani ki Kahani', 'Topi', 'Vyakaran'],
    9: ['Do Bailon ki Katha', 'Lhasa ki Or', 'Upbhoktavad ki Sanskriti', 'Saanwle Sapnon ki Yaad', 'Premchand ke Phate Joote', 'Mere Bachpan ke Din', 'Saakhiyan evam Sabad', 'Vaakh', 'Savaiye', 'Kaidi aur Kokila', 'Gram Shree', 'Megh Aaye', 'Vyakaran'],
    10: ['Surdas ke Pad', 'Ram-Lakshman-Parshuram Samvad', 'Aatmakathya', 'Utsah aur At Nahin Rahi Hai', 'Yeh Danturit Muskaan aur Fasal', 'Netaji ka Chashma', 'Balgobin Bhagat', 'Lakhnavi Andaz', 'Ek Kahani Yeh Bhi', 'Naubatkhane Mein Ibadat', 'Sanskriti', 'Kritika: Mata ka Anchal', 'Kritika: Sana-Sana Hath Jodi', 'Kritika: Main Kyon Likhta Hoon', 'Vyakaran', 'Lekhan'],
  },
  Physics: {
    11: ['Units and Measurements', 'Motion in a Straight Line', 'Motion in a Plane', 'Laws of Motion', 'Work, Energy and Power', 'System of Particles and Rotational Motion', 'Gravitation', 'Mechanical Properties of Solids', 'Mechanical Properties of Fluids', 'Thermal Properties of Matter', 'Thermodynamics', 'Kinetic Theory', 'Oscillations', 'Waves'],
    12: ['Electric Charges and Fields', 'Electrostatic Potential and Capacitance', 'Current Electricity', 'Moving Charges and Magnetism', 'Magnetism and Matter', 'Electromagnetic Induction', 'Alternating Current', 'Electromagnetic Waves', 'Ray Optics and Optical Instruments', 'Wave Optics', 'Dual Nature of Radiation and Matter', 'Atoms', 'Nuclei', 'Semiconductor Electronics'],
  },
  Chemistry: {
    11: ['Some Basic Concepts of Chemistry', 'Structure of Atom', 'Classification of Elements and Periodicity in Properties', 'Chemical Bonding and Molecular Structure', 'Thermodynamics', 'Equilibrium', 'Redox Reactions', 'Organic Chemistry – Some Basic Principles and Techniques', 'Hydrocarbons'],
    12: ['Solutions', 'Electrochemistry', 'Chemical Kinetics', 'The d- and f-Block Elements', 'Coordination Compounds', 'Haloalkanes and Haloarenes', 'Alcohols, Phenols and Ethers', 'Aldehydes, Ketones and Carboxylic Acids', 'Amines', 'Biomolecules'],
  },
  Biology: {
    11: ['The Living World', 'Biological Classification', 'Plant Kingdom', 'Animal Kingdom', 'Morphology of Flowering Plants', 'Anatomy of Flowering Plants', 'Structural Organisation in Animals', 'Cell: The Unit of Life', 'Biomolecules', 'Cell Cycle and Cell Division', 'Photosynthesis in Higher Plants', 'Respiration in Plants', 'Plant Growth and Development', 'Breathing and Exchange of Gases', 'Body Fluids and Circulation', 'Excretory Products and their Elimination', 'Locomotion and Movement', 'Neural Control and Coordination', 'Chemical Coordination and Integration'],
    12: ['Sexual Reproduction in Flowering Plants', 'Human Reproduction', 'Reproductive Health', 'Principles of Inheritance and Variation', 'Molecular Basis of Inheritance', 'Evolution', 'Human Health and Disease', 'Microbes in Human Welfare', 'Biotechnology: Principles and Processes', 'Biotechnology and its Applications', 'Organisms and Populations', 'Ecosystem', 'Biodiversity and Conservation'],
  },
  'Computer Science': {
    11: ['Computer Systems and Organisation', 'Introduction to Problem Solving', 'Getting Started with Python', 'Flow of Control', 'Functions', 'Strings', 'Lists', 'Tuples and Dictionaries', 'Societal Impact'],
    12: ['Python Revision Tour', 'Functions', 'Exception Handling', 'File Handling', 'Stack', 'Computer Networks', 'Database Concepts', 'Structured Query Language (SQL)', 'Interface Python with MySQL'],
  },
  Accountancy: {
    11: ['Introduction to Accounting', 'Theory Base of Accounting', 'Recording of Transactions I', 'Recording of Transactions II', 'Bank Reconciliation Statement', 'Trial Balance and Rectification of Errors', 'Depreciation, Provisions and Reserves', 'Financial Statements I', 'Financial Statements II'],
    12: ['Accounting for Partnership: Basic Concepts', 'Admission of a Partner', 'Retirement and Death of a Partner', 'Dissolution of Partnership Firm', 'Accounting for Share Capital', 'Issue and Redemption of Debentures', 'Financial Statements of a Company', 'Analysis of Financial Statements', 'Accounting Ratios', 'Cash Flow Statement'],
  },
  'Business Studies': {
    11: ['Nature and Purpose of Business', 'Forms of Business Organisation', 'Public, Private and Global Enterprises', 'Business Services', 'Emerging Modes of Business', 'Social Responsibility of Business and Business Ethics', 'Sources of Business Finance', 'Small Business and Entrepreneurship', 'Internal Trade', 'International Business'],
    12: ['Nature and Significance of Management', 'Principles of Management', 'Business Environment', 'Planning', 'Organising', 'Staffing', 'Directing', 'Controlling', 'Financial Management', 'Financial Markets', 'Marketing', 'Consumer Protection'],
  },
  Economics: {
    11: ['Statistics: Introduction', 'Statistics: Collection of Data', 'Statistics: Organisation of Data', 'Statistics: Presentation of Data', 'Statistics: Measures of Central Tendency', 'Statistics: Correlation', 'Statistics: Index Numbers', 'Micro: Introduction', 'Micro: Theory of Consumer Behaviour', 'Micro: Production and Costs', 'Micro: The Theory of the Firm under Perfect Competition', 'Micro: Market Equilibrium'],
    12: ['Macro: National Income Accounting', 'Macro: Money and Banking', 'Macro: Determination of Income and Employment', 'Macro: Government Budget and the Economy', 'Macro: Open Economy Macroeconomics', 'IED: Indian Economy on the Eve of Independence', 'IED: Indian Economy 1950–1990', 'IED: Liberalisation, Privatisation and Globalisation', 'IED: Human Capital Formation', 'IED: Rural Development', 'IED: Employment', 'IED: Environment and Sustainable Development', 'IED: Comparative Development Experiences of India and its Neighbours'],
  },
  'Applied Mathematics': {
    11: ['Numbers, Quantification and Numerical Applications', 'Algebra', 'Mathematical Reasoning', 'Calculus', 'Probability', 'Descriptive Statistics', 'Basics of Financial Mathematics', 'Coordinate Geometry'],
    12: ['Numbers, Quantification and Numerical Applications', 'Algebra (Matrices)', 'Calculus', 'Probability Distributions', 'Inferential Statistics', 'Index Numbers and Time-based Data', 'Financial Mathematics', 'Linear Programming'],
  },
  History: {
    11: ['Writing and City Life', 'An Empire Across Three Continents', 'Nomadic Empires', 'The Three Orders', 'Changing Cultural Traditions', 'Displacing Indigenous Peoples', 'Paths to Modernisation'],
    12: ['Bricks, Beads and Bones', 'Kings, Farmers and Towns', 'Kinship, Caste and Class', 'Thinkers, Beliefs and Buildings', 'Through the Eyes of Travellers', 'Bhakti–Sufi Traditions', 'An Imperial Capital: Vijayanagara', 'Peasants, Zamindars and the State', 'Colonialism and the Countryside', 'Rebels and the Raj', 'Mahatma Gandhi and the Nationalist Movement', 'Framing the Constitution'],
  },
  'Political Science': {
    11: ['Constitution: Why and How?', 'Rights in the Indian Constitution', 'Election and Representation', 'Executive', 'Legislature', 'Judiciary', 'Federalism', 'Local Governments', 'Constitution as a Living Document', 'Political Theory: An Introduction', 'Freedom', 'Equality', 'Social Justice', 'Rights', 'Citizenship', 'Nationalism', 'Secularism'],
    12: ['The End of Bipolarity', 'New Centres of Power', 'Contemporary South Asia', 'International Organisations', 'Security in the Contemporary World', 'Environment and Natural Resources', 'Globalisation', 'Challenges of Nation Building', 'Era of One-Party Dominance', 'Politics of Planned Development', "India's External Relations", 'The Crisis of Democratic Order', 'Regional Aspirations', 'Recent Developments in Indian Politics'],
  },
  Geography: {
    11: ['Geography as a Discipline', 'The Origin and Evolution of the Earth', 'Interior of the Earth', 'Distribution of Oceans and Continents', 'Geomorphic Processes', 'Landforms and their Evolution', 'Composition and Structure of Atmosphere', 'Solar Radiation, Heat Balance and Temperature', 'Atmospheric Circulation and Weather Systems', 'World Climate and Climate Change', 'Movements of Ocean Water', 'India: Structure and Physiography', 'India: Drainage System', 'India: Climate'],
    12: ['Human Geography: Nature and Scope', 'The World Population', 'Human Development', 'Primary Activities', 'Secondary Activities', 'Tertiary and Quaternary Activities', 'Transport and Communication', 'International Trade', 'Population: Distribution, Density, Growth and Composition', 'Human Settlements', 'Land Resources and Agriculture', 'Water Resources', 'Mineral and Energy Resources', 'Planning and Sustainable Development in Indian Context'],
  },
};

/** Suggested chapters for a subject in a class (students on ICSE / State books can type their own). */
export const chaptersFor = (grade: number, subject: string): string[] => CHAPTERS[subject]?.[grade] ?? [];

/* ---------- Subjects by class and stream ---------- */

const S = (name: string, kind: SubjectKind, icon: string, color: string, examTag?: string) => ({ name, kind, icon, color, examTag });

const BASE = {
  maths: S('Mathematics', 'math', 'sigma', 'from-violet-500 to-indigo-500'),
  science: S('Science', 'science', 'flask', 'from-emerald-500 to-teal-500'),
  sst: S('Social Science', 'social', 'globe', 'from-amber-500 to-orange-500'),
  english: S('English', 'english', 'book', 'from-sky-500 to-blue-500'),
  hindi: S('Hindi', 'hindi', 'languages', 'from-rose-500 to-pink-500'),
  physics: S('Physics', 'science', 'atom', 'from-indigo-500 to-blue-600', 'JEE/NEET Foundation'),
  chemistry: S('Chemistry', 'science', 'flask', 'from-emerald-500 to-green-600', 'JEE/NEET Foundation'),
  seniorMaths: S('Mathematics', 'math', 'sigma', 'from-violet-500 to-purple-600', 'JEE Foundation'),
  biology: S('Biology', 'science', 'dna', 'from-lime-500 to-emerald-600', 'NEET Foundation'),
  cs: S('Computer Science', 'cs', 'cpu', 'from-slate-500 to-slate-700'),
  accountancy: S('Accountancy', 'commerce', 'calculator', 'from-amber-500 to-orange-600', 'CA Foundation'),
  bst: S('Business Studies', 'commerce', 'briefcase', 'from-cyan-500 to-sky-600'),
  economics: S('Economics', 'commerce', 'trending', 'from-rose-500 to-red-600'),
  appliedMaths: S('Applied Mathematics', 'math', 'sigma', 'from-violet-500 to-purple-600'),
  history: S('History', 'social', 'landmark', 'from-amber-600 to-yellow-600', 'CUET Relevant'),
  polSci: S('Political Science', 'social', 'scale', 'from-indigo-500 to-violet-600'),
  geography: S('Geography', 'social', 'globe', 'from-emerald-500 to-teal-600'),
};

export const subjectsFor = (grade: number, stream: Stream): Subject[] => {
  const b = BASE;
  const list =
    grade <= 10
      ? [b.maths, b.science, b.sst, b.english, b.hindi]
      : stream === 'Science (PCM)'
        ? [b.physics, b.chemistry, b.seniorMaths, b.english, b.cs]
        : stream === 'Science (PCB)'
          ? [b.physics, b.chemistry, b.biology, b.english, b.cs]
          : stream === 'Commerce'
            ? [b.accountancy, b.bst, b.economics, b.appliedMaths, b.english]
            : [b.history, b.polSci, b.geography, b.economics, b.english];
  return list.map((s) => ({ ...s, chapters: chaptersFor(grade, s.name) }));
};

/** Kind of a subject name, for code that only has the name (e.g. the server). */
export const kindOf = (subject: string): SubjectKind =>
  Object.values(BASE).find((s) => s.name === subject)?.kind ?? 'social';

export const STREAMS: { value: Stream; blurb: string }[] = [
  { value: 'Science (PCM)', blurb: 'Physics, Chemistry, Mathematics — JEE track' },
  { value: 'Science (PCB)', blurb: 'Physics, Chemistry, Biology — NEET track' },
  { value: 'Commerce', blurb: 'Accountancy, Business Studies, Economics' },
  { value: 'Humanities', blurb: 'History, Political Science, Geography' },
];
