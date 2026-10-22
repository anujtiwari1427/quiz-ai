import { BookModel } from '../types/schemas';

/**
 * Official Maharashtra State Board (Balbharati / MSBSHSE) Free Curriculum Textbooks
 * Provided for free, open-access reading and AI-assisted study.
 */
export const MAHARASHTRA_BOARD_TEXTBOOKS: BookModel[] = [
  // ── 1. Science & Technology Part 1 (Class 10 SSC) ──
  {
    id: 'mh_ssc_science_1',
    userId: 'system_curriculum',
    title: 'Maharashtra Board Class 10: Science & Technology Part 1 (SSC)',
    author: 'Maharashtra State Bureau of Textbook Production (Balbharati)',
    subject: 'Science',
    board: 'Maharashtra State Board',
    fileUrl: 'https://ebalbharati.in/books/ssc_science_1.pdf',
    fileType: 'pdf',
    fileSizeBytes: 24500000,
    status: 'ready',
    totalPages: 142,
    coverGradient: 'from-orange-600 via-amber-700 to-stone-900',
    createdAt: '2026-06-01T00:00:00.000Z',
    chapters: [
      {
        id: 'mh_sci1_ch1',
        bookId: 'mh_ssc_science_1',
        name: 'Chapter 1: Gravitation',
        orderIndex: 1,
        pageStart: 1,
        pageEnd: 15,
        contentPreview: 'Gravitation, circular motion and centripetal force, Kepler’s three laws, Newton’s universal law of gravitation, acceleration due to gravity (g), free fall, and escape velocity.',
        content: `## Chapter 1: Gravitation
*Maharashtra State Board (Balbharati) — Science & Technology Part 1*

---

### 1. Gravitational Force & Centripetal Force
Gravitation is a universal attractive force that acts between any two objects in the universe. 
When an object moves in a circular path at a constant speed, a force acts upon it directed towards the center of the circle. This force is called **Centripetal Force** ($F_c = \\frac{m v^2}{r}$).

---

### 2. Kepler’s Three Laws of Planetary Motion
1. **Kepler’s First Law (The Law of Orbits):**
   The orbit of a planet is an ellipse with the Sun at one of the two foci.
2. **Kepler’s Second Law (The Law of Areas):**
   The straight line joining the planet and the Sun sweeps equal areas in equal intervals of time ($A_1 = A_2$ for $\\Delta t_1 = \\Delta t_2$).
3. **Kepler’s Third Law (The Law of Periods):**
   The square of its period of revolution around the Sun is directly proportional to the cube of the mean distance of a planet from the Sun:
   $$\\frac{T^2}{r^3} = \\text{Constant} = K$$

---

### 3. Newton’s Universal Law of Gravitation
Every object in the universe attracts every other object with a definite force that is directly proportional to the product of their masses and inversely proportional to the square of the distance between them:
$$F = G \\frac{m_1 m_2}{d^2}$$

- **Universal Gravitational Constant ($G$):** In SI units, $G = 6.673 \\times 10^{-11} \\text{ N}\\cdot\\text{m}^2/\\text{kg}^2$.

---

### 4. Acceleration Due to Gravity ($g$)
The acceleration produced in an object under the influence of the Earth's gravitational force alone is called acceleration due to gravity:
$$g = \\frac{GM}{R^2}$$

- On Earth's surface (mean): $g \\approx 9.8 \\text{ m/s}^2$ ($9.83 \\text{ m/s}^2$ at poles, $9.78 \\text{ m/s}^2$ at equator).
- **Variation of $g$:**
  1. *Along surface:* Maximum at poles, minimum at equator due to Earth's equatorial bulge.
  2. *With height ($h$):* Decreases as distance increases: $g' = \\frac{GM}{(R+h)^2}$.
  3. *With depth:* Decreases inside the Earth and becomes $0$ at the center.

---

### 5. Mass vs Weight
| Property | Mass ($m$) | Weight ($W$) |
|---|---|---|
| Definition | Amount of matter present in object | Gravitational force with which Earth attracts it |
| Formula | Fundamental scalar | $W = m \\cdot g$ (Vector) |
| SI Unit | Kilogram (kg) | Newton (N) |
| Location | Constant everywhere | Changes with $g$; zero at Earth's center |

---

### 6. Free Fall & Escape Velocity
- **Free Fall:** When a body falls towards Earth solely under gravitational force, its equations of motion are:
  $$v = gt, \\quad s = \\frac{1}{2}gt^2, \\quad v^2 = 2gs$$
- **Escape Velocity ($v_{esc}$):** The minimum velocity with which an object must be projected vertically upward from Earth's surface so that it overcomes Earth's gravitational pull and escapes into space:
  $$v_{esc} = \\sqrt{\\frac{2GM}{R}} = \\sqrt{2gR} \\approx 11.2 \\text{ km/s}$$`
      },
      {
        id: 'mh_sci1_ch2',
        bookId: 'mh_ssc_science_1',
        name: 'Chapter 2: Periodic Classification of Elements',
        orderIndex: 2,
        pageStart: 16,
        pageEnd: 29,
        contentPreview: 'Historical classification: Döbereiner’s triads, Newlands’ octaves, Mendeleev’s periodic table, Henry Moseley’s modern periodic law, group and period trends in atomic size, valency, and metallic nature.',
        content: `## Chapter 2: Periodic Classification of Elements
*Maharashtra State Board (Balbharati) — Science & Technology Part 1*

---

### 1. Historical Evolution of Classification
1. **Döbereiner’s Triads (1817):**
   Grouped elements into sets of three (triads) with similar chemical properties. The atomic mass of the middle element was approximately the mean of the other two:
   - Example: Lithium ($6.9$), Sodium ($23.0$), Potassium ($39.1$) $\\rightarrow \\frac{6.9 + 39.1}{2} = 23.0$.
2. **Newlands’ Law of Octaves (1866):**
   When elements were arranged in increasing order of atomic masses, every eighth element possessed properties similar to the first (like musical notes *Sa, Re, Ga, Ma, Pa, Dha, Ni, Sa*).
3. **Mendeleev’s Periodic Law (1869):**
   *"Properties of elements are periodic functions of their atomic masses."*
   - *Merits:* Corrected atomic mass of Beryllium; predicted unknown elements (Eka-Boron $\\rightarrow$ Scandium, Eka-Aluminium $\\rightarrow$ Gallium, Eka-Silicon $\\rightarrow$ Germanium).
   - *Demerits:* Ambiguity in position of Hydrogen and isotopes; anomalous pairs (Cobalt 58.9 before Nickel 58.7).

---

### 2. Modern Periodic Law (Henry Moseley, 1913)
*"Properties of elements are periodic functions of their atomic numbers ($Z$)."*

---

### 3. Structure of the Modern Periodic Table
- **7 Horizontal Rows:** Called **Periods**.
- **18 Vertical Columns:** Called **Groups**.
- **4 Blocks:**
  - **s-block:** Groups 1 and 2 (Alkali & Alkaline earth metals).
  - **p-block:** Groups 13 to 18 (Non-metals, metalloids, halogens, noble gases).
  - **d-block:** Groups 3 to 12 (Transition elements).
  - **f-block:** Lanthanides and Actinides placed at the bottom.

---

### 4. Periodic Trends
| Trend | Down a Group ($\\\\downarrow$) | Across a Period (Left to Right $\\\\rightarrow$) |
|---|---|---|
| **Valency** | Remains constant | Increases from 1 to 4, then decreases to 0 |
| **Atomic Radius** | **Increases** (new electron shell added) | **Decreases** (increased nuclear charge pulls electrons closer) |
| **Metallic Character** | **Increases** (easier to lose valence electrons) | **Decreases** (higher effective nuclear pull) |
| **Electronegativity** | Decreases | Increases (Halogens in Group 17 are highest) |`
      },
      {
        id: 'mh_sci1_ch3',
        bookId: 'mh_ssc_science_1',
        name: 'Chapter 3: Chemical Reactions and Equations',
        orderIndex: 3,
        pageStart: 30,
        pageEnd: 45,
        contentPreview: 'Chemical equation writing, balancing chemical reactions, four core reaction types, exothermic and endothermic processes, oxidation, reduction, redox, corrosion, and rancidity.',
        content: `## Chapter 3: Chemical Reactions and Equations
*Maharashtra State Board (Balbharati) — Science & Technology Part 1*

---

### 1. Chemical Equations & Balancing
A chemical equation represents reactants transforming into products:
$$\\text{Reactants} \\xrightarrow{\\text{conditions}} \\text{Products}$$
- **Law of Conservation of Mass:** The total mass of reactants must equal the total mass of products. Number of atoms of each element must balance on both sides.

---

### 2. Types of Chemical Reactions
1. **Combination Reaction:** Two or more reactants combine to form a single product:
   $$\\text{NH}_3\\text{(g)} + \\text{HCl(g)} \\rightarrow \\text{NH}_4\\text{Cl(s)}$$
2. **Decomposition Reaction:** A single reactant splits into two or more products upon heating, light, or electricity:
   $$2\\text{H}_2\\text{O(l)} \\xrightarrow{\\text{Electric current}} 2\\text{H}_2\\text{(g)} + \\text{O}_2\\text{(g)}$$
3. **Displacement Reaction:** A more reactive element takes the place of a less reactive element:
   $$\\text{Fe(s)} + \\text{CuSO}_4\\text{(aq)} \\rightarrow \\text{FeSO}_4\\text{(aq)} + \\text{Cu(s)}$$
4. **Double Displacement Reaction:** An exchange of ions takes place between reactants to form an insoluble precipitate:
   $$\\text{BaCl}_2\\text{(aq)} + \\text{Na}_2\\text{SO}_4\\text{(aq)} \\rightarrow \\text{BaSO}_4\\downarrow\\text{(white ppt)} + 2\\text{NaCl(aq)}$$

---

### 3. Endothermic vs Exothermic Reactions
- **Exothermic:** Heat is released: $\\text{CaO} + \\text{H}_2\\text{O} \\rightarrow \\text{Ca(OH)}_2 + \\text{Heat}$.
- **Endothermic:** Heat is absorbed from surroundings: $\\text{CaCO}_3 + \\text{Heat} \\rightarrow \\text{CaO} + \\text{CO}_2$.

---

### 4. Oxidation, Reduction & Redox Reactions
- **Oxidation:** Gain of Oxygen OR loss of Hydrogen/electrons.
- **Reduction:** Gain of Hydrogen/electrons OR loss of Oxygen.
- **Redox Reaction:** Oxidation and reduction occur simultaneously:
  $$\\text{CuO} + \\text{H}_2 \\xrightarrow{\\Delta} \\text{Cu} + \\text{H}_2\\text{O}$$
  *(CuO is reduced to Cu; $\\text{H}_2$ is oxidized to $\\text{H}_2\\text{O}$)*

---

### 5. Corrosion & Rancidity
- **Corrosion:** Slow oxidation of metals caused by moist air, acid, or salts:
  $$2\\text{Fe} + \\text{O}_2 + x\\text{H}_2\\text{O} \\rightarrow \\text{Fe}_2\\text{O}_3 \\cdot x\\text{H}_2\\text{O} \\text{ (Rust)}$$
- **Rancidity:** When fats and oils are oxidized on long storage, they develop an unpleasant odor and taste. Prevented by adding antioxidants and flushing packaging with Nitrogen gas.`
      },
      {
        id: 'mh_sci1_ch4',
        bookId: 'mh_ssc_science_1',
        name: 'Chapter 4: Effects of Electric Current',
        orderIndex: 4,
        pageStart: 46,
        pageEnd: 61,
        contentPreview: 'Heating effect of electric current (Joule’s Law), electric power, fuse wire, magnetic effect of electric current, Right-Hand Thumb Rule, Fleming’s Left-Hand and Right-Hand rules, DC Motor, and AC/DC Generator.',
        content: `## Chapter 4: Effects of Electric Current
*Maharashtra State Board (Balbharati) — Science & Technology Part 1*

---

### 1. Heating Effect of Electric Current (Joule’s Law)
When current $I$ passes through a conductor of resistance $R$ for time $t$, heat produced $H$ is:
$$H = I^2 R t = V I t = \\frac{V^2}{R} t$$

- **Electric Power ($P$):** Rate of electrical energy consumption:
  $$P = V \\cdot I = I^2 R = \\frac{V^2}{R} \\quad (\\text{Unit: Watt, W})$$
- **Commercial Unit of Energy:** $1 \\text{ kWh} = 1 \\text{ Unit} = 3.6 \\times 10^6 \\text{ Joules}$.
- **Fuse Wire:** An alloy wire with a low melting point (lead-tin alloy) that melts during short circuits or overloading to protect home appliances.

---

### 2. Magnetic Effect of Electric Current (Oersted’s Experiment)
An electric current flowing through a conductor creates a magnetic field around it.
- **Right-Hand Thumb Rule (Maxwell’s Corkscrew Rule):**
  Imagine holding a current-carrying straight conductor in your right hand with the thumb pointing in the direction of current; then your curled fingers show the direction of concentric magnetic field lines.

---

### 3. Fleming’s Left-Hand Rule (Electric Motor Principle)
Stretch the thumb, forefinger, and middle finger of the left hand mutually perpendicular:
- **Forefinger:** Magnetic Field ($B$).
- **Middle Finger:** Current ($I$).
- **Thumb:** Direction of Force / Motion on the conductor ($F$).
- **Electric Motor:** Converts Electrical Energy into Mechanical Energy.

---

### 4. Electromagnetic Induction (Michael Faraday)
Whenever the magnetic flux linked with a circuit changes, an induced electromotive force (EMF) and current are produced.
- **Fleming’s Right-Hand Rule (Generator Principle):**
  - **Forefinger:** Magnetic Field.
  - **Thumb:** Motion of conductor.
  - **Middle Finger:** Direction of Induced Current.
- **Electric Generator:** Converts Mechanical Energy into Electrical Energy.
  - **AC (Alternating Current):** Reverses direction periodically (In India: $50 \\text{ Hz}$, changes direction every $1/100 \\text{ s}$).
  - **DC (Direct Current):** Flows strictly in one direction.`
      },
      {
        id: 'mh_sci1_ch6',
        bookId: 'mh_ssc_science_1',
        name: 'Chapter 6: Refraction of Light',
        orderIndex: 5,
        pageStart: 62,
        pageEnd: 79,
        contentPreview: 'Laws of refraction, Snell’s law, absolute and relative refractive index, twinkling of stars, advanced sunrise and delayed sunset, dispersion through prism, total internal reflection, and rainbow formation.',
        content: `## Chapter 6: Refraction of Light
*Maharashtra State Board (Balbharati) — Science & Technology Part 1*

---

### 1. What is Refraction of Light?
Light changes its direction of propagation when passing obliquely from one transparent medium to another of different optical density. This phenomenon is called **Refraction**.

---

### 2. Laws of Refraction & Snell's Law
1. The incident ray, the refracted ray, and the normal to the interface at the point of incidence all lie in the same plane.
2. The incident ray and refracted ray lie on opposite sides of the normal.
3. **Snell's Law:** For a given pair of media, the ratio of the sine of the angle of incidence ($i$) to the sine of the angle of refraction ($r$) is constant:
   $$\\frac{\\sin i}{\\sin r} = n \\quad (\\text{Refractive Index})$$

- **Refraction Cases:**
  - *Rarer to Denser (e.g. Air to Glass):* Ray bends **towards** the normal ($r < i$).
  - *Denser to Rarer (e.g. Glass to Air):* Ray bends **away from** the normal ($r > i$).

---

### 3. Natural Refraction Phenomena
1. **Twinkling of Stars:** Caused by atmospheric refraction across constantly moving air layers with fluctuating temperatures and refractive indices. Planets do not twinkle because they are much closer and act as a collection of point sources.
2. **Advanced Sunrise & Delayed Sunset:** Due to atmospheric refraction, the Sun is visible about 2 minutes before actual horizon crossing, and 2 minutes after setting.

---

### 4. Total Internal Reflection & Rainbow Formation
- **Critical Angle ($i_c$):** When light travels from a denser to rarer medium, the angle of incidence for which the angle of refraction is $90^\\circ$.
- **Total Internal Reflection:** When angle of incidence $i > i_c$, the ray is reflected completely back into the denser medium.
- **Rainbow:** Combined effect of **Refraction, Dispersion, and Internal Reflection** of sunlight by suspended water droplets in the atmosphere.`
      }
    ]
  },

  // ── 2. Science & Technology Part 2 (Class 10 SSC) ──
  {
    id: 'mh_ssc_science_2',
    userId: 'system_curriculum',
    title: 'Maharashtra Board Class 10: Science & Technology Part 2 (SSC)',
    author: 'Maharashtra State Bureau of Textbook Production (Balbharati)',
    subject: 'Science',
    board: 'Maharashtra State Board',
    fileUrl: 'https://ebalbharati.in/books/ssc_science_2.pdf',
    fileType: 'pdf',
    fileSizeBytes: 22000000,
    status: 'ready',
    totalPages: 136,
    coverGradient: 'from-emerald-600 via-teal-700 to-slate-900',
    createdAt: '2026-06-01T00:00:00.000Z',
    chapters: [
      {
        id: 'mh_sci2_ch1',
        bookId: 'mh_ssc_science_2',
        name: 'Chapter 1: Heredity and Evolution',
        orderIndex: 1,
        pageStart: 1,
        pageEnd: 12,
        contentPreview: 'Central dogma of molecular biology: transcription, translation, translocation; mutation; morphological and anatomical evidences of evolution; Darwin’s theory of natural selection and human evolution.',
        content: `## Chapter 1: Heredity and Evolution
*Maharashtra State Board (Balbharati) — Science & Technology Part 2*

---

### 1. Central Dogma of Protein Synthesis
Information for protein synthesis is stored in DNA and synthesized by RNA:
$$\\text{DNA} \\xrightarrow{\\text{Transcription}} \\text{mRNA} \\xrightarrow{\\text{Translation}} \\text{Protein}$$

1. **Transcription:** Synthesis of mRNA from DNA template strand inside the nucleus by RNA polymerase enzyme (Uracil replaces Thymine in mRNA).
2. **Translation:** mRNA moves into cytoplasm where tRNA brings matching amino acids based on triplet codons (Code discovered by Dr. Har Gobind Khorana).
3. **Translocation:** The ribosome moves along mRNA by the distance of one triplet codon at a time.
4. **Mutation:** Sudden permanent change in the nucleotide sequence of a gene.

---

### 2. Evidences of Evolution
1. **Morphological Evidences:** Similarities in external characters like mouth structure, eye position, ear pinnae across different mammals.
2. **Anatomical Evidences:** Similarity in bone and joint architecture in human hand, cat's foreleg, flipper of whale, and bat's patagium (Homologous structures).
3. **Vestigial Organs:** Degenerated or underdeveloped non-functional organs (e.g. Appendix, wisdom teeth, coccyx / tailbone, ear pinna muscles).
4. **Paleontological Evidences:** Fossils preserved under Earth's crust; dated using Carbon-14 dating method ($^{14}\\text{C}$ to $^{12}\\text{C}$ ratio).
5. **Connecting Links:** Organisms with intermediate characteristics connecting two distinct phyla (e.g. *Peripatus* connects Annelida and Arthropoda; *Duck-billed platypus* connects Reptiles and Mammals).
6. **Embryological Evidences:** Extreme similarity in initial embryonic stages of fish, salamander, tortoise, chick, and human.

---

### 3. Darwin’s Theory of Natural Selection
- Organisms reproduce prolifically and engage in a struggle for existence.
- Organisms with favorable adaptations survive and reproduce ("Survival of the Fittest").
- Unfit organisms perish; accumulated variations over generations lead to the origin of new species.`
      },
      {
        id: 'mh_sci2_ch2',
        bookId: 'mh_ssc_science_2',
        name: 'Chapter 2: Life Processes in Living Organisms Part - 1',
        orderIndex: 2,
        pageStart: 13,
        pageEnd: 25,
        contentPreview: 'Respiration and cellular energy production: Glycolysis (EMP pathway), TCA / Krebs cycle, Electron Transfer Chain, anaerobic fermentation, and cell division: Mitosis and Meiosis.',
        content: `## Chapter 2: Life Processes in Living Organisms Part - 1
*Maharashtra State Board (Balbharati) — Science & Technology Part 2*

---

### 1. Cellular Respiration & ATP Production
Aerobic oxidation of glucose ($C_6H_{12}O_6$) yields **38 ATP molecules**:

1. **Step 1: Glycolysis (EMP Pathway - Cytoplasm):**
   - 1 molecule of Glucose is converted into **2 molecules of Pyruvic acid**, **2 ATP**, **2 $\\text{NADH}_2$**, and **2 $\\text{H}_2\\text{O}$**.
   - Pyruvic acid is converted into **Acetyl-CoA** producing $2 \\text{NADH}_2$ and $2 \\text{CO}_2$.
2. **Step 2: Tricarboxylic Acid (TCA / Krebs Cycle - Mitochondria):**
   - Acetyl part of Acetyl-CoA is completely oxidized into $\\text{CO}_2, \\text{H}_2\\text{O}, \\text{NADH}_2, \\text{FADH}_2,$ and $\\text{ATP}$.
3. **Step 3: Electron Transfer Chain (ETC - Mitochondrial Inner Membrane):**
   - Each $\\text{NADH}_2$ yields **3 ATP molecules**; each $\\text{FADH}_2$ yields **2 ATP molecules**.

---

### 2. Cell Division: Mitosis vs Meiosis
- **Mitosis (Somatic Cells & Stem Cells):**
  - Essential for body growth, tissue repair, and wound healing.
  - 1 Diploid ($2n$) parent cell divides into **2 identical Diploid ($2n$) daughter cells**.
  - Stages: Prophase $\\rightarrow$ Metaphase (chromosomes align at equatorial plane) $\\rightarrow$ Anaphase (sister chromatids pull to opposite poles) $\\rightarrow$ Telophase $\\rightarrow$ Cytokinesis.
- **Meiosis (Germ / Reproductive Cells):**
  - Produces gametes and spores.
  - 1 Diploid ($2n$) parent cell undergoes two divisions to produce **4 Haploid ($n$) daughter cells**.
  - Genetic crossing-over occurs during Prophase I (Pachytene), creating genetic diversity.`
      }
    ]
  },

  // ── 3. Mathematics Part 1: Algebra (Class 10 SSC) ──
  {
    id: 'mh_ssc_math_1',
    userId: 'system_curriculum',
    title: 'Maharashtra Board Class 10: Mathematics Part 1 (Algebra - SSC)',
    author: 'Maharashtra State Bureau of Textbook Production (Balbharati)',
    subject: 'Mathematics',
    board: 'Maharashtra State Board',
    fileUrl: 'https://ebalbharati.in/books/ssc_math_1.pdf',
    fileType: 'pdf',
    fileSizeBytes: 21500000,
    status: 'ready',
    totalPages: 160,
    coverGradient: 'from-blue-600 via-indigo-700 to-slate-900',
    createdAt: '2026-06-01T00:00:00.000Z',
    chapters: [
      {
        id: 'mh_math1_ch1',
        bookId: 'mh_ssc_math_1',
        name: 'Chapter 1: Linear Equations in Two Variables',
        orderIndex: 1,
        pageStart: 1,
        pageEnd: 29,
        contentPreview: 'General form ax + by + c = 0, simultaneous linear equations, graphical solution method, determinants, and Cramer’s Rule with solved board problems.',
        content: `## Chapter 1: Linear Equations in Two Variables
*Maharashtra State Board (Balbharati) — Mathematics Part 1 (Algebra)*

---

### 1. Definition & Standard Form
An equation of the form:
$$ax + by + c = 0$$
where $a, b, c$ are real numbers and $a \\neq 0, b \\neq 0$ is a linear equation in two variables $x$ and $y$. The degree of each variable is always 1.

---

### 2. Solving Simultaneous Equations: Cramer’s Rule
For a system of linear equations:
$$a_1 x + b_1 y = c_1$$
$$a_2 x + b_2 y = c_2$$

Calculate determinants:
$$D = \\begin{vmatrix} a_1 & b_1 \\\\ a_2 & b_2 \\end{vmatrix} = a_1 b_2 - a_2 b_1$$
$$D_x = \\begin{vmatrix} c_1 & b_1 \\\\ c_2 & b_2 \\end{vmatrix} = c_1 b_2 - c_2 b_1$$
$$D_y = \\begin{vmatrix} a_1 & c_1 \\\\ a_2 & c_2 \\end{vmatrix} = a_1 c_2 - a_2 c_1$$

By Cramer’s Rule (provided $D \\neq 0$):
$$x = \\frac{D_x}{D}, \\quad y = \\frac{D_y}{D}$$

---

### 3. Solved Practice Board Example
**Problem:** Solve by Cramer's Rule:
$$3x - 4y = 10$$
$$4x + 3y = 5$$

**Solution:**
$$D = (3)(3) - (4)(-4) = 9 + 16 = 25$$
$$D_x = (10)(3) - (5)(-4) = 30 + 20 = 50$$
$$D_y = (3)(5) - (4)(10) = 15 - 40 = -25$$
$$x = \\frac{50}{25} = 2, \\quad y = \\frac{-25}{25} = -1$$
**Answer:** $(x, y) = (2, -1)$.`
      },
      {
        id: 'mh_math1_ch2',
        bookId: 'mh_ssc_math_1',
        name: 'Chapter 2: Quadratic Equations',
        orderIndex: 2,
        pageStart: 30,
        pageEnd: 54,
        contentPreview: 'Standard form ax² + bx + c = 0, solution methods: factorization, completing the square, quadratic formula method, discriminant Δ = b² - 4ac, and nature of roots.',
        content: `## Chapter 2: Quadratic Equations
*Maharashtra State Board (Balbharati) — Mathematics Part 1 (Algebra)*

---

### 1. Standard Form
$$ax^2 + bx + c = 0 \\quad (a \\neq 0, \\; a,b,c \\in \\mathbb{R})$$

---

### 2. Solution by Quadratic Formula Method
Roots of the quadratic equation are given by:
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

---

### 3. Discriminant ($\\Delta$) and Nature of Roots
The value $\\Delta = b^2 - 4ac$ determines the nature of roots:
1. If $\\Delta > 0$: Roots are **Real and Unequal**.
2. If $\\Delta = 0$: Roots are **Real and Equal** ($x = -\\frac{b}{2a}$).
3. If $\\Delta < 0$: Roots are **Not Real** (Complex).

---

### 4. Relation Between Roots & Coefficients
If $\\alpha$ and $\\beta$ are the roots of $ax^2 + bx + c = 0$:
$$\\alpha + \\beta = -\\frac{b}{a}, \\quad \\alpha \\cdot \\beta = \\frac{c}{a}$$
The quadratic equation whose roots are $\\alpha$ and $\\beta$ is:
$$x^2 - (\\alpha + \\beta)x + \\alpha\\beta = 0$$`
      },
      {
        id: 'mh_math1_ch3',
        bookId: 'mh_ssc_math_1',
        name: 'Chapter 3: Arithmetic Progression (A.P.)',
        orderIndex: 3,
        pageStart: 55,
        pageEnd: 79,
        contentPreview: 'Sequence, arithmetic progression, common difference d, nth term tn = a + (n-1)d, and sum of first n terms Sn = n/2[2a + (n-1)d].',
        content: `## Chapter 3: Arithmetic Progression (A.P.)
*Maharashtra State Board (Balbharati) — Mathematics Part 1 (Algebra)*

---

### 1. Definition of an A.P.
A sequence in which the difference between any two consecutive terms ($t_{n+1} - t_n$) is constant is called an **Arithmetic Progression**.
- First term: $a = t_1$.
- Common difference: $d = t_n - t_{n-1}$.

---

### 2. $n^{\\text{th}}$ Term of an A.P.
$$t_n = a + (n - 1)d$$

---

### 3. Sum of First $n$ Terms ($S_n$)
$$S_n = \\frac{n}{2} [2a + (n - 1)d] = \\frac{n}{2} [t_1 + t_n]$$

---

### 4. Board Application Problem
**Problem:** In an A.P., if $a = 7, d = 3$, find $t_{20}$ and the sum of first 20 terms ($S_{20}$).
- $t_{20} = 7 + (20 - 1)(3) = 7 + 57 = 64$.
- $S_{20} = \\frac{20}{2} [7 + 64] = 10 \\times 71 = 710$.`
      }
    ]
  },

  // ── 4. Mathematics Part 2: Geometry (Class 10 SSC) ──
  {
    id: 'mh_ssc_math_2',
    userId: 'system_curriculum',
    title: 'Maharashtra Board Class 10: Mathematics Part 2 (Geometry - SSC)',
    author: 'Maharashtra State Bureau of Textbook Production (Balbharati)',
    subject: 'Mathematics',
    board: 'Maharashtra State Board',
    fileUrl: 'https://ebalbharati.in/books/ssc_math_2.pdf',
    fileType: 'pdf',
    fileSizeBytes: 23800000,
    status: 'ready',
    totalPages: 168,
    coverGradient: 'from-purple-600 via-violet-700 to-slate-900',
    createdAt: '2026-06-01T00:00:00.000Z',
    chapters: [
      {
        id: 'mh_geom_ch1',
        bookId: 'mh_ssc_math_2',
        name: 'Chapter 1: Similarity',
        orderIndex: 1,
        pageStart: 1,
        pageEnd: 29,
        contentPreview: 'Ratio of areas of two triangles, Basic Proportionality Theorem (BPT), angle bisector property, tests of similarity (AAA, SAS, SSS), and theorem of areas of similar triangles.',
        content: `## Chapter 1: Similarity
*Maharashtra State Board (Balbharati) — Mathematics Part 2 (Geometry)*

---

### 1. Ratio of Areas of Two Triangles
The ratio of the areas of two triangles is equal to the ratio of the products of their bases and corresponding heights:
$$\\frac{A(\\triangle_1)}{A(\\triangle_2)} = \\frac{b_1 \\times h_1}{b_2 \\times h_2}$$
- **If heights are equal ($h_1 = h_2$):** $\\frac{A(\\triangle_1)}{A(\\triangle_2)} = \\frac{b_1}{b_2}$.
- **If bases are equal ($b_1 = b_2$):** $\\frac{A(\\triangle_1)}{A(\\triangle_2)} = \\frac{h_1}{h_2}$.

---

### 2. Basic Proportionality Theorem (B.P.T. / Thales Theorem)
**Statement:** If a line parallel to a side of a triangle intersects the remaining two sides in two distinct points, then the line divides the sides in the same proportion.
$$\\text{In } \\triangle ABC, \\text{ if } DE \\parallel BC \\implies \\frac{AD}{DB} = \\frac{AE}{EC}$$

---

### 3. Theorem of Areas of Similar Triangles
When two triangles are similar, the ratio of areas of those triangles is equal to the ratio of the squares of their corresponding sides:
$$\\triangle ABC \\sim \\triangle PQR \\implies \\frac{A(\\triangle ABC)}{A(\\triangle PQR)} = \\frac{AB^2}{PQ^2} = \\frac{BC^2}{QR^2} = \\frac{AC^2}{PR^2}$$`
      },
      {
        id: 'mh_geom_ch2',
        bookId: 'mh_ssc_math_2',
        name: 'Chapter 2: Pythagoras Theorem',
        orderIndex: 2,
        pageStart: 30,
        pageEnd: 50,
        contentPreview: 'Similarity of right-angled triangles, Theorem of Geometric Mean, Pythagoras theorem proof, converse of Pythagoras theorem, and Apollonius theorem.',
        content: `## Chapter 2: Pythagoras Theorem
*Maharashtra State Board (Balbharati) — Mathematics Part 2 (Geometry)*

---

### 1. Theorem of Geometric Mean
In a right-angled triangle, the perpendicular segment to the hypotenuse from the opposite vertex is the geometric mean of the segments into which the hypotenuse is divided:
$$QS^2 = PS \\times SR$$

---

### 2. Pythagoras Theorem
In a right-angled triangle, the square of the hypotenuse is equal to the sum of the squares of the remaining two sides:
$$AC^2 = AB^2 + BC^2$$

---

### 3. Apollonius Theorem
In $\\triangle ABC$, if $M$ is the midpoint of side $BC$ (i.e. $AM$ is a median):
$$AB^2 + AC^2 = 2AM^2 + 2BM^2$$`
      },
      {
        id: 'mh_geom_ch3',
        bookId: 'mh_ssc_math_2',
        name: 'Chapter 3: Circle',
        orderIndex: 3,
        pageStart: 51,
        pageEnd: 89,
        contentPreview: 'Tangent theorem, tangent segment theorem, touching circles, Inscribed Angle Theorem, Cyclic Quadrilateral Theorem, and tangent-secant theorem.',
        content: `## Chapter 3: Circle
*Maharashtra State Board (Balbharati) — Mathematics Part 2 (Geometry)*

---

### 1. Tangent Theorem & Tangent Segment Theorem
- **Tangent Theorem:** A tangent at any point of a circle is perpendicular to the radius at the point of contact ($OA \\perp l$).
- **Tangent Segment Theorem:** Tangent segments drawn from an external point to a circle are congruent ($PA = PB$).

---

### 2. Inscribed Angle Theorem & Cyclic Quadrilaterals
- **Inscribed Angle Theorem:** The measure of an inscribed angle is half of the measure of the arc intercepted by it:
  $$\\angle ABC = \\frac{1}{2} m(\\text{arc } AC)$$
- **Cyclic Quadrilateral Theorem:** Opposite angles of a cyclic quadrilateral are supplementary:
  $$\\angle A + \\angle C = 180^\\circ, \\quad \\angle B + \\angle D = 180^\\circ$$`
      }
    ]
  }
];
