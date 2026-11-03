import type { Question } from '../types/quiz';
import { describe, mcq } from './authoring';

const SST = 'Social Science';
const EN = 'English';

/** Class 10 Social Science and English: chapter-wise important questions with model answers. */
export const CLASS10_SST: Question[] = [
  // History
  mcq(SST, 'History: The Rise of Nationalism in Europe', 'The Treaty of Vienna (1815) was drawn up mainly to:', ['unify Germany', 'undo most of the changes made during the Napoleonic wars', 'create the European Union', 'grant independence to Greece'], 1,
    'The Congress of Vienna, hosted by Metternich, aimed to **undo the changes** of the Napoleonic wars and restore conservative monarchies.'),
  describe(SST, 'History: The Rise of Nationalism in Europe', 'Describe any three measures introduced under the Napoleonic Code (Civil Code of 1804).',
    `1. **Abolished privileges based on birth** and established equality before the law.
2. **Secured the right to property.**
3. **Simplified administration**, abolished the feudal system and freed peasants from serfdom and manorial dues.
4. In towns, **guild restrictions were removed**; transport and communication were improved; a uniform system of weights and measures was introduced. *(any three)*`, 3),
  describe(SST, 'History: The Rise of Nationalism in Europe', 'Explain the role of Giuseppe Mazzini in the unification of Italy.',
    `1. Mazzini, an Italian revolutionary, founded the secret society **Young Italy** (1831) in Marseilles, and later **Young Europe** in Berne.
2. He believed nations were the natural units of mankind, so Italy had to be **a unified republic**, not a patchwork of small states.
3. His ideas inspired secret societies across Europe; Metternich called him **"the most dangerous enemy of our social order"**.`, 3),
  mcq(SST, 'History: Nationalism in India', 'The Jallianwala Bagh massacre took place on:', ['13 April 1919', '6 April 1919', '26 January 1930', '12 March 1930'], 0,
    'On **13 April 1919**, General Dyer ordered troops to fire on an unarmed crowd at Jallianwala Bagh in Amritsar.'),
  describe(SST, 'History: Nationalism in India', 'Why did Gandhiji decide to withdraw the Non-Cooperation Movement in February 1922?',
    `1. The movement was turning **violent** in many places.
2. At **Chauri Chaura** (Gorakhpur), a peaceful demonstration turned into a violent clash in which a police station was set on fire and policemen were killed.
3. Gandhiji felt that **satyagrahis needed proper training** before mass struggles, so he called off the movement.`, 3),
  describe(SST, 'History: Nationalism in India', 'Why was the Salt March (Dandi March) an effective symbol of resistance against British rule?',
    `1. **Salt was consumed by rich and poor alike**, so the salt tax touched every Indian — the issue united everyone.
2. Gandhiji walked **240 miles from Sabarmati to Dandi** with 78 volunteers; the march drew wide public attention and support.
3. On **6 April 1930** he broke the salt law by making salt, starting the **Civil Disobedience Movement** — people across India broke colonial laws.`, 3),
  describe(SST, 'History: The Making of a Global World', 'How did rinderpest change the lives of people in Africa in the 1890s?',
    `1. Rinderpest, a fast-spreading **cattle plague**, killed about **90% of the cattle** in Africa.
2. Africans depended on **land and livestock**; losing cattle destroyed their livelihoods.
3. European colonisers used this to **monopolise scarce resources**, forcing Africans into the **wage labour market** on plantations and in mines.`, 3),
  describe(SST, 'History: The Age of Industrialisation', 'Why did some industrialists in nineteenth-century Britain prefer hand labour over machines?',
    `1. **Labour was cheap and plentiful** — poor peasants and vagrants moved to cities for work.
2. Many industries had **seasonal demand**; employers preferred workers they could hire for the season rather than costly machines.
3. Many products needed **variety and fine designs** that only skilled hand labour could produce; the aristocracy preferred **handmade goods** as symbols of refinement.`, 3),
  mcq(SST, 'History: Print Culture and the Modern World', "Martin Luther's Ninety Five Theses (1517) criticised:", ['the printing press', 'practices and rituals of the Roman Catholic Church', 'the French monarchy', 'the Mughal empire'], 1,
    'Luther challenged the **Roman Catholic Church**; printing spread his ideas widely and led to the **Protestant Reformation**.'),

  // Geography
  mcq(SST, 'Geography: Resources and Development', 'Black soil is best suited for growing:', ['Rice', 'Cotton', 'Tea', 'Wheat'], 1,
    'Black (regur) soil retains moisture well and is ideal for **cotton** — hence called "black cotton soil".'),
  describe(SST, 'Geography: Resources and Development', 'Suggest three measures to control soil erosion in hilly areas.',
    `1. **Contour ploughing** — ploughing along contour lines slows water flow down the slopes.
2. **Terrace (step) farming** — cutting steps on slopes restricts erosion.
3. **Strip cropping and shelter belts** — strips of grass between crops and rows of trees break the force of wind and water.`, 3),
  mcq(SST, 'Geography: Forest and Wildlife Resources', 'The Chipko Movement is associated with:', ['saving rivers', 'protecting trees from being cut', 'wildlife sanctuaries', 'organic farming'], 1,
    'The Chipko Movement in the Himalayas resisted **deforestation** — people hugged trees to stop them being felled.'),
  describe(SST, 'Geography: Water Resources', 'Describe any three methods of rainwater harvesting practised in India.',
    `1. **Guls or kuls** — diversion channels in the western Himalayas for agriculture.
2. **Rooftop rainwater harvesting** — common in Rajasthan; stored in underground tanks (**tankas**) for drinking water.
3. **Inundation channels** in the flood plains of Bengal and **khadins/johads** in Rajasthan to store rainwater for agriculture.`, 3),
  mcq(SST, 'Geography: Agriculture', 'Which of the following is a kharif crop?', ['Wheat', 'Mustard', 'Rice', 'Gram'], 2,
    'Kharif crops are sown with the onset of the monsoon (June–July) — **rice**, maize, jowar, cotton, jute. Wheat, mustard and gram are rabi crops.'),
  mcq(SST, 'Geography: Minerals and Energy Resources', 'The finest iron ore, with up to 70% iron content, is:', ['Hematite', 'Magnetite', 'Limonite', 'Siderite'], 1,
    '**Magnetite** is the finest iron ore (up to 70% iron) and has excellent magnetic qualities.'),
  mcq(SST, 'Geography: Lifelines of National Economy', 'The Golden Quadrilateral links:', ['Delhi–Kolkata–Chennai–Mumbai', 'Srinagar–Kanyakumari–Silchar–Porbandar', 'Delhi–Jaipur–Agra–Lucknow', 'Mumbai–Pune–Nagpur–Hyderabad'], 0,
    'The Golden Quadrilateral super highways link **Delhi, Kolkata, Chennai and Mumbai**.'),

  // Political Science
  mcq(SST, 'Civics: Power Sharing', 'In 1956, Sri Lanka passed an Act to recognise which language as the only official language?', ['Tamil', 'Sinhala', 'English', 'Hindi'], 1,
    'The 1956 Act made **Sinhala** the only official language — a majoritarian measure that alienated Sri Lankan Tamils.'),
  describe(SST, 'Civics: Power Sharing', 'Describe three elements of the Belgian model of power sharing.',
    `1. The number of **Dutch- and French-speaking ministers** in the central government is **equal**.
2. Many powers of the central government were given to **state governments** of the two regions.
3. **Brussels** has a separate government with equal representation of both communities.
4. A third kind of government — the **community government** — is elected by people of each language community and handles cultural, educational and language issues. *(any three)*`, 3),
  describe(SST, 'Civics: Federalism', 'Explain the three-fold distribution of legislative powers between the Union and the State governments.',
    `1. **Union List** — subjects of national importance such as defence, foreign affairs, banking and currency; only the **Union government** makes laws on them.
2. **State List** — subjects of state and local importance such as police, trade, agriculture and irrigation; **state governments** make laws on them.
3. **Concurrent List** — subjects of common interest such as education, forests, marriage and adoption; **both** can make laws, but if they conflict, the **Union law prevails**.
4. **Residuary subjects** (e.g. computer software) are with the Union government.`, 5),
  describe(SST, 'Civics: Political Parties', 'Describe any three functions of political parties in a democracy.',
    `1. **Contest elections** by putting up candidates.
2. **Put forward policies and programmes** for voters to choose from.
3. **Make laws** — legislators usually follow their party's decisions.
4. **Form and run governments**; parties that lose play the role of **opposition**.
5. **Shape public opinion** and provide people access to government machinery and welfare schemes. *(any three)*`, 3),
  describe(SST, 'Civics: Outcomes of Democracy', 'Why is democracy considered a better form of government than other alternatives?',
    `1. It produces an **accountable, responsive and legitimate government**.
2. It promotes **equality among citizens** and enhances the **dignity of the individual**.
3. It **improves the quality of decision-making** through discussion and deliberation.
4. It provides a method to **resolve conflicts** and **allows room to correct mistakes**.`, 3),

  // Economics
  mcq(SST, 'Economics: Development', 'The Human Development Report, which compares countries on the HDI, is published by:', ['World Bank', 'UNDP', 'IMF', 'WTO'], 1,
    'The **United Nations Development Programme (UNDP)** publishes the Human Development Report.'),
  mcq(SST, 'Economics: Sectors of the Indian Economy', 'MGNREGA 2005 guarantees employment of how many days in a year?', ['50', '100', '150', '365'], 1,
    'The Mahatma Gandhi National Rural Employment Guarantee Act guarantees **100 days** of work in a year to rural households.'),
  describe(SST, 'Economics: Sectors of the Indian Economy', 'What is disguised unemployment? Explain with an example.',
    `**Disguised unemployment:** more people are employed in a job than are actually needed, so some appear to work but contribute nothing to output.

**Example:** a family of five works on a small farm that needs only three people. If two members leave, **production does not fall** — those two are disguisedly unemployed. It is common in agriculture.`, 3),
  describe(SST, 'Economics: Money and Credit', "What is 'double coincidence of wants'? How does money solve this problem?",
    `**Double coincidence of wants:** in a barter system, what one person wants to sell is exactly what the other wants to buy, and vice versa. Such coincidence is rare.

**Money solves it** by acting as a **medium of exchange** — a person can sell goods for money and use the money to buy what they need from anyone.`, 3),
  mcq(SST, 'Economics: Money and Credit', 'An asset that a borrower owns and uses as a guarantee to a lender until the loan is repaid is called:', ['interest', 'collateral', 'deposit', 'credit'], 1,
    '**Collateral** (land, building, vehicle, deposits) — the lender can sell it if the loan is not repaid.'),
  describe(SST, 'Economics: Globalisation and the Indian Economy', 'How do multinational corporations (MNCs) spread their production across countries?',
    `1. **Setting up partnerships** (joint production) with local companies.
2. **Buying up local companies** and expanding production.
3. **Placing orders with small producers** (e.g. garments, footwear) and selling under their own brand names.

MNCs choose places close to markets, with skilled and cheap labour and favourable government policies.`, 3),
];

export const CLASS10_ENGLISH: Question[] = [
  describe(EN, 'A Letter to God', 'Why did Lencho call the post office employees "a bunch of crooks"?',
    `Lencho had **unshakeable faith in God** and was sure God had sent him the full **hundred pesos**. When he received only **seventy**, he concluded that the **post office employees had stolen** the rest.

The **irony** is that the postmaster and employees had **collected the money themselves** out of kindness.`, 3),
  describe(EN, 'Nelson Mandela: Long Walk to Freedom', 'What "twin obligations" does Mandela mention?',
    `Every man has **twin obligations**:
1. to his **family, parents, wife and children**, and
2. to his **people, community and country**.

In apartheid South Africa, a black man who tried to fulfil his duty to his people was **punished and isolated**, so he could not fulfil his duty to his family either.`, 3),
  describe(EN, 'Two Stories about Flying', 'Why was the young seagull afraid to fly? How did he finally fly?',
    `**Afraid:** he believed his **wings would not support him**; the sea below looked vast and frightening.

**Flew:** his mother hovered near him with a **piece of fish** but stopped just short. **Maddened by hunger**, he dived at the fish, fell, and then **spread his wings** — and flew.`, 3),
  describe(EN, 'From the Diary of Anne Frank', 'How did Anne turn the punishment from Mr Keesing into a success?',
    `Mr Keesing gave Anne extra homework for talking in class: essays titled **"A Chatterbox"**, **"An Incorrigible Chatterbox"** and finally **"Quack, Quack, Quack, Said Mistress Chatterbox"**.

Anne argued **talking is a student's trait inherited from her mother**, and wrote the last as a witty **poem**. Mr Keesing **took the joke in the right way** and stopped punishing her.`, 3),
  describe(EN, 'Glimpses of India', 'What traditions associated with bakers in Goa are mentioned in "A Baker from Goa"?',
    `1. Bakers (**pader**) are an essential part of Goan life; **marriage gifts are meaningless without sweet bread (bol)**.
2. **Bolinhas** (cakes) are a must for **Christmas** and festivals; **sandwiches** are prepared for a daughter's engagement.
3. The baker wore a **kabai** (single-piece frock) and later shirt and trousers; bills were recorded on walls and **collected monthly**.`, 3),
  describe(EN, 'Mijbil the Otter', 'How did Maxwell take Mijbil to England?',
    `Maxwell booked a flight and was told animals had to travel **in a box**. Mij hated the box: he **tore at its lining** and wounded himself.

On the plane Maxwell **let Mij out**; Mij ran around causing chaos. With the **air hostess's** help, Maxwell kept Mij on his knee, and **reached London** safely.`, 3),
  describe(EN, 'Madam Rides the Bus', 'What did Valli learn from the dead cow she saw on her bus journey?',
    `On the way to town, Valli laughed at a **young cow** running ahead of the bus. On the return journey she saw the **same cow lying dead** by the road.

The sight **shocked her into silence**. She lost her excitement and realised the **uncertainty of life and death** — her first lesson about life's harsh realities.`, 3),
  describe(EN, 'The Sermon at Benares', 'How did the Buddha help Kisa Gotami understand the truth about death?',
    `Kisa Gotami begged for a cure for her dead son. The Buddha asked for **a handful of mustard seed from a house where no one had lost a child, husband, parent or friend**.

She found **no such house**. She realised that **death is common to all** and that grieving selfishly is futile. She took her son to the burial ground.`, 3),
  describe(EN, 'The Proposal', 'What were the two quarrels between Lomov and Natalya about? What does the play satirise?',
    `**Quarrel 1:** ownership of the **Oxen Meadows**. **Quarrel 2:** whose dog was better — Lomov's **Guess** or Natalya's **Squeezer**.

The play is a **farce** that satirises the 19th-century Russian **landowning class**, where **marriage was a matter of property and convenience**, not love.`, 3),
  describe(EN, 'Poem: Fire and Ice', 'What do "fire" and "ice" stand for in Robert Frost\'s poem?',
    `**Fire** symbolises **desire** — greed, lust and endless wanting. **Ice** symbolises **hatred** — coldness, rigidity and indifference.

Frost says either could **destroy the world**: desire spreads quickly like fire, while hatred freezes human relationships.`, 2),
  describe(EN, 'Poem: A Tiger in the Zoo', 'How does the poet contrast the tiger in the zoo with the tiger in the wild?',
    `**In the zoo:** the tiger **stalks a few steps of his cage**, quiet with rage; he ignores visitors and **stares at the brilliant stars**.

**In the wild:** he would **lurk in the shadows** near the water hole, **terrorise the village** with his snarls and hunt deer.

The contrast shows the **cruelty of caging** wild animals and the loss of freedom.`, 3),
  describe(EN, 'Footprints: The Thief\'s Story', 'Why did Hari Singh return to Anil?',
    `Hari Singh stole **₹600** but could not get on the train. He realised Anil had **trusted him** and was teaching him to **read and write**, which would make him **a full man**.

He valued **education and trust more than money**, so he returned and put the money back.`, 3),
  describe(EN, 'Footprints: The Necklace', "What was Matilda's mistake, and what did it cost her?",
    `Matilda borrowed a **diamond necklace** from Madame Forestier for a ball and **lost it**. Instead of admitting it, she and her husband **bought a replacement for 36,000 francs**.

They spent **ten years in poverty** repaying the debt — only to learn that **the original necklace was fake**, worth at most 500 francs. Her **vanity and dishonesty** ruined her life.`, 3),
  describe(EN, 'Footprints: Bholi', 'How did Bholi change from a timid girl into a confident young woman?',
    `Bholi was neglected and **stammered** after an accident and smallpox scars. Her **teacher's kindness and encouragement** gave her confidence and education.

At her wedding, when the lame, old groom **Bishamber** demanded **dowry**, Bholi **refused to marry him** — speaking without stammering. Education made her **self-reliant and fearless**.`, 3),

  // Grammar and writing
  mcq(EN, 'Grammar', 'Choose the correct option: "You ___ not shout in the library."', ['must', 'can', 'may', 'would'], 0,
    '**Must not** expresses prohibition — a rule.'),
  mcq(EN, 'Grammar', 'Choose the correct tense: "By the time we reached the station, the train ___."', ['leaves', 'has left', 'had left', 'was leaving'], 2,
    'The **past perfect** ("had left") shows the earlier of two past actions.'),
  describe(EN, 'Writing Skills', 'What is the correct format of a formal letter (e.g. letter of complaint)?',
    `1. **Sender's address** and **date**.
2. **Receiver's designation and address**.
3. **Subject** line — short and specific.
4. **Salutation** — Sir/Madam.
5. **Body** — introduction (purpose), details of the issue, the action requested.
6. **Complimentary close** — Yours faithfully/sincerely, with **signature and name**.

*Format carries marks: keep to the word limit (100–120 words).*`, 5),
];
