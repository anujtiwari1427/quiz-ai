import { MarkRecord, Syllabus, Book, QuestionSet } from '../types';

export const INITIAL_MARKS: MarkRecord[] = [
  {
    id: 'mark_001',
    testId: 'test_cbse_math_01',
    testName: 'Quadratic Equations & Polynomials Unit Test',
    subject: 'Mathematics',
    date: '2026-09-18',
    totalMarks: 25,
    obtainedMarks: 23,
    percentage: 92,
    grade: 'A+',
    timeSpentSeconds: 1420,
    questionCount: 10,
    correctCount: 9,
    incorrectCount: 1,
    skippedCount: 0
  },
  {
    id: 'mark_002',
    testId: 'test_cbse_sci_01',
    testName: 'Electricity & Circuits Diagnostic Assessment',
    subject: 'Science',
    date: '2026-09-15',
    totalMarks: 30,
    obtainedMarks: 26,
    percentage: 87,
    grade: 'A',
    timeSpentSeconds: 1780,
    questionCount: 12,
    correctCount: 10,
    incorrectCount: 2,
    skippedCount: 0
  },
  {
    id: 'mark_003',
    testId: 'test_eng_01',
    testName: 'Analytical Reading & Grammar Master',
    subject: 'English',
    date: '2026-09-12',
    totalMarks: 20,
    obtainedMarks: 17,
    percentage: 85,
    grade: 'A',
    timeSpentSeconds: 1100,
    questionCount: 10,
    correctCount: 8,
    incorrectCount: 1,
    skippedCount: 1
  },
  {
    id: 'mark_004',
    testId: 'test_cs_01',
    testName: 'Python Control Flow & Loops Checkpoint',
    subject: 'Computer Science',
    date: '2026-09-10',
    totalMarks: 20,
    obtainedMarks: 19,
    percentage: 95,
    grade: 'A+',
    timeSpentSeconds: 980,
    questionCount: 10,
    correctCount: 9,
    incorrectCount: 0,
    skippedCount: 1
  },
  {
    id: 'mark_005',
    testId: 'test_hindi_01',
    testName: 'व्याकरण एवं अपठित बोध सत्रांत परीक्षा',
    subject: 'Hindi',
    date: '2026-09-06',
    totalMarks: 25,
    obtainedMarks: 19,
    percentage: 76,
    grade: 'B+',
    timeSpentSeconds: 1350,
    questionCount: 10,
    correctCount: 7,
    incorrectCount: 2,
    skippedCount: 1
  },
  {
    id: 'mark_006',
    testId: 'test_marathi_01',
    testName: 'मराठी व्याकरण व शब्दसंपत्ती चाचणी',
    subject: 'Marathi',
    date: '2026-09-02',
    totalMarks: 20,
    obtainedMarks: 16,
    percentage: 80,
    grade: 'A',
    timeSpentSeconds: 1020,
    questionCount: 8,
    correctCount: 6,
    incorrectCount: 1,
    skippedCount: 1
  },
  {
    id: 'mark_007',
    testId: 'test_cbse_sci_02',
    testName: 'Chemical Reactions & Stoichiometry Practice',
    subject: 'Science',
    date: '2026-08-28',
    totalMarks: 20,
    obtainedMarks: 15,
    percentage: 75,
    grade: 'B+',
    timeSpentSeconds: 1200,
    questionCount: 8,
    correctCount: 6,
    incorrectCount: 2,
    skippedCount: 0
  },
  {
    id: 'mark_008',
    testId: 'test_cbse_math_02',
    testName: 'Introduction to Trigonometry Challenge',
    subject: 'Mathematics',
    date: '2026-08-22',
    totalMarks: 20,
    obtainedMarks: 13,
    percentage: 65,
    grade: 'B',
    timeSpentSeconds: 1500,
    questionCount: 8,
    correctCount: 5,
    incorrectCount: 3,
    skippedCount: 0
  }
];

export const INITIAL_SYLLABI: Syllabus[] = [
  {
    id: 'syl_cbse_10_2026',
    name: 'CBSE Class 10 Comprehensive Board Syllabus (2025-2026)',
    fileName: 'CBSE_Class10_Curriculum_2026.pdf',
    fileSize: '2.4 MB',
    fileType: 'application/pdf',
    uploadedAt: '2026-09-14',
    board: 'CBSE',
    grade: 10,
    subjects: [
      {
        id: 'syl_sub_sci',
        name: 'Science',
        board: 'CBSE',
        grade: 10,
        chapters: [
          {
            id: 'syl_ch_sci_1',
            name: 'Chemical Reactions and Equations',
            unitName: 'Unit I: Chemical Substances - Nature and Behaviour',
            topics: [
              'Chemical equation and balancing',
              'Types of chemical reactions: combination, decomposition, displacement, double displacement',
              'Precipitation and neutralization reactions',
              'Oxidation and reduction in terms of gain or loss of oxygen and hydrogen',
              'Effects of oxidation in everyday life: Corrosion and Rancidity'
            ],
            completionPercentage: 85,
            isCompleted: false
          },
          {
            id: 'syl_ch_sci_2',
            name: 'Acids, Bases and Salts',
            unitName: 'Unit I: Chemical Substances - Nature and Behaviour',
            topics: [
              'Definitions in terms of furnishing H+ and OH- ions',
              'General chemical properties, examples and uses',
              'Concept of pH scale (Definition relating to logarithm not required)',
              'Importance of pH in everyday life',
              'Preparation and uses of Sodium Hydroxide, Bleaching powder, Baking soda, Washing soda and Plaster of Paris'
            ],
            completionPercentage: 70,
            isCompleted: false
          },
          {
            id: 'syl_ch_sci_3',
            name: 'Light – Reflection and Refraction',
            unitName: 'Unit III: Natural Phenomena',
            topics: [
              'Reflection of light by curved surfaces, spherical mirrors, centers of curvature',
              'Principal axis, principal focus, focal length, mirror formula (derivation not required)',
              'Magnification by spherical mirrors',
              'Refraction; Laws of refraction, refractive index',
              'Refraction of light by spherical lens; Image formed by spherical lenses; Lens formula'
            ],
            completionPercentage: 100,
            isCompleted: true
          },
          {
            id: 'syl_ch_sci_4',
            name: 'Electricity',
            unitName: 'Unit IV: Effects of Current',
            topics: [
              'Electric current, potential difference and electric current',
              "Ohm's law; Resistance, Resistivity, Factors on which resistance depends",
              'Series combination of resistors, parallel combination of resistors',
              "Joule's law of heating and practical applications in daily life",
              'Electric power, Interrelation between P, V, I and R'
            ],
            completionPercentage: 90,
            isCompleted: false
          },
          {
            id: 'syl_ch_sci_5',
            name: 'Life Processes',
            unitName: 'Unit II: World of Living',
            topics: [
              "'Living Being' concept and basic life processes",
              'Nutrition in plants and animals',
              'Respiration: Aerobic vs Anaerobic pathways',
              'Transportation in animals and plants',
              'Excretion in plants and animals (Nephron structure)'
            ],
            completionPercentage: 80,
            isCompleted: false
          }
        ]
      },
      {
        id: 'syl_sub_math',
        name: 'Mathematics',
        board: 'CBSE',
        grade: 10,
        chapters: [
          {
            id: 'syl_ch_math_1',
            name: 'Real Numbers',
            unitName: 'Unit I: Number Systems',
            topics: [
              'Fundamental Theorem of Arithmetic - statements after review',
              'Proof of irrationality of √2, √3, √5',
              'Decimal representation of rational numbers in terms of terminating/non-terminating recurring decimals'
            ],
            completionPercentage: 100,
            isCompleted: true
          },
          {
            id: 'syl_ch_math_2',
            name: 'Polynomials',
            unitName: 'Unit II: Algebra',
            topics: [
              'Zeros of a polynomial',
              'Relationship between zeros and coefficients of quadratic polynomials',
              'Geometrical representation of zeros of a polynomial'
            ],
            completionPercentage: 95,
            isCompleted: true
          },
          {
            id: 'syl_ch_math_3',
            name: 'Quadratic Equations',
            unitName: 'Unit II: Algebra',
            topics: [
              'Standard form of a quadratic equation ax² + bx + c = 0, (a ≠ 0)',
              'Solutions of quadratic equations by factorisation and by using quadratic formula',
              'Relationship between discriminant and nature of roots',
              'Situational problems based on quadratic equations related to day to day activities'
            ],
            completionPercentage: 90,
            isCompleted: false
          },
          {
            id: 'syl_ch_math_4',
            name: 'Introduction to Trigonometry',
            unitName: 'Unit V: Trigonometry',
            topics: [
              'Trigonometric ratios of an acute angle of a right-angled triangle',
              'Proof of their existence (well defined); values of the trigonometric ratios of 30°, 45° and 60°',
              'Relationships between the ratios',
              'Proof and applications of the identity sin²A + cos²A = 1'
            ],
            completionPercentage: 65,
            isCompleted: false
          }
        ]
      },
      {
        id: 'syl_sub_eng',
        name: 'English',
        board: 'CBSE',
        grade: 10,
        chapters: [
          {
            id: 'syl_ch_eng_1',
            name: 'Reading Skills & Comprehension',
            unitName: 'Section A: Reading',
            topics: [
              'Discursive passage (400-450 words) with inference questions',
              'Case-based factual passage (with visual input/statistical data)',
              'Vocabulary evaluation in context'
            ],
            completionPercentage: 85,
            isCompleted: false
          },
          {
            id: 'syl_ch_eng_2',
            name: 'Writing Skills & Grammar',
            unitName: 'Section B: Writing & Grammar',
            topics: [
              'Formal Letter based on a given situation',
              'Analytical Paragraph writing based on map/chart/report',
              'Tenses, Modals, Subject-verb concord, Reported speech'
            ],
            completionPercentage: 80,
            isCompleted: false
          }
        ]
      },
      {
        id: 'syl_sub_cs',
        name: 'Computer Science',
        board: 'CBSE',
        grade: 10,
        chapters: [
          {
            id: 'syl_ch_cs_1',
            name: 'Python Programming Fundamentals',
            unitName: 'Unit II: Computational Thinking',
            topics: [
              'Data types: integers, floats, booleans, strings, lists',
              'Operators and expressions in Python',
              'Conditional statements: if, elif, else',
              'Loops: while and for loops, range() function',
              'User defined functions, return statements'
            ],
            completionPercentage: 92,
            isCompleted: false
          },
          {
            id: 'syl_ch_cs_2',
            name: 'Cyber Ethics & Digital Safety',
            unitName: 'Unit III: Society, Law and Ethics',
            topics: [
              'Netiquettes and digital footprint',
              'Data protection and privacy principles',
              'Intellectual Property Rights and Open Source licensing',
              'Cyber safety measures: phishing, scams, and two-factor authentication'
            ],
            completionPercentage: 75,
            isCompleted: false
          }
        ]
      },
      {
        id: 'syl_sub_hindi',
        name: 'Hindi',
        board: 'CBSE',
        grade: 10,
        chapters: [
          {
            id: 'syl_ch_hin_1',
            name: 'व्याकरण एवं रचना (Hindi Grammar)',
            unitName: 'खण्ड ‘ख’: व्यावहारिक व्याकरण',
            topics: [
              'पदबंध (संज्ञा, सर्वनाम, विशेषण, क्रिया, क्रियाविशेषण)',
              'रचना के आधार पर वाक्य रूपांतरण (सरल, संयुक्त, मिश्र)',
              'समास (अव्ययीभाव, तत्पुरुष, कर्मधारय, द्विगु, द्वंद्व, बहुव्रीहि)',
              'मुहावरे (वाक्य प्रयोग आधारित)'
            ],
            completionPercentage: 78,
            isCompleted: false
          }
        ]
      },
      {
        id: 'syl_sub_marathi',
        name: 'Marathi',
        board: 'State Board (Maharashtra)',
        grade: 10,
        chapters: [
          {
            id: 'syl_ch_mar_1',
            name: 'भाषाभ्यास व व्याकरण (Marathi Grammar)',
            unitName: 'विभाग ४ : भाषाभ्यास',
            topics: [
              'वाक्यप्रकार व वाक्यरूपांतर (विधानार्थी, प्रश्नार्थी, उद्गारार्थी)',
              'वाक्प्रचार व त्यांचे अर्थ आणि वाक्यात उपयोग',
              'शब्दसंपत्ती (समानार्थी, विरुद्धार्थी, शब्दसमूहाबद्दल एक शब्द)',
              'लेखननियम व विरामचिन्हे'
            ],
            completionPercentage: 80,
            isCompleted: false
          }
        ]
      }
    ]
  }
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book_ncert_sci_10',
    title: 'NCERT Science: Class 10 Foundation Textbook',
    author: 'NCERT Academic Board',
    subject: 'Science',
    grade: 10,
    coverGradient: 'from-emerald-600 via-teal-700 to-slate-900',
    coverIcon: 'Atom',
    fileName: 'NCERT_Science_Class10_Full.pdf',
    progress: 42,
    currentChapterId: 'ch_sci_light',
    lastOpened: '2026-09-21',
    bookmarks: ['ch_sci_light'],
    highlights: [
      {
        id: 'hl_1',
        chapterId: 'ch_sci_light',
        text: 'The principal focus of a spherical mirror is a point on its principal axis where rays parallel to the principal axis converge after reflection.',
        color: 'yellow',
        createdAt: '2026-09-20'
      },
      {
        id: 'hl_2',
        chapterId: 'ch_sci_light',
        text: 'Mirror Formula: 1/f = 1/v + 1/u holds true for all spherical mirrors in all positions of the object.',
        color: 'emerald',
        createdAt: '2026-09-21'
      }
    ],
    notes: [
      {
        id: 'note_1',
        chapterId: 'ch_sci_light',
        selectedText: 'Magnification m = -v/u',
        noteText: 'Remember negative sign for mirrors! For lenses, magnification is positive: m = +v/u. Common exam trap in board papers.',
        createdAt: '2026-09-21'
      }
    ],
    chapters: [
      {
        id: 'ch_sci_chem_rxn',
        chapterNumber: 1,
        title: 'Chemical Reactions and Equations',
        estimatedReadTimeMinutes: 18,
        isCompleted: true,
        sections: [
          '1.1 Chemical Equations',
          '1.2 Balancing Chemical Equations',
          '1.3 Types of Chemical Reactions',
          '1.4 Oxidation and Reduction',
          '1.5 Corrosion and Rancidity'
        ],
        content: `## Chapter 1: Chemical Reactions and Equations

Consider situations of daily life and think over what happens when:
- milk is left at room temperature during summers.
- an iron tawa/pan/nail is left exposed to humid atmosphere.
- grapes get fermented.
- food is cooked.
- food gets digested in our body.
- we respire.

In all the above situations, the nature and the identity of the initial substance have somewhat changed. Whenever a chemical change occurs, we can say that a **chemical reaction has taken place**.

### 1.1 How Do We Know a Chemical Reaction Has Taken Place?
The following observations help us determine whether a chemical reaction has taken place:
1. **Change in state**
2. **Change in colour**
3. **Evolution of a gas**
4. **Change in temperature**

For example, when a Magnesium ribbon is burned in oxygen, it burns with a dazzling white flame and changes into a white powder called **Magnesium Oxide (MgO)**:

$$2Mg(s) + O_2(g) \\rightarrow 2MgO(s)$$

### 1.2 Balancing Chemical Equations
According to the **Law of Conservation of Mass**, mass can neither be created nor destroyed in a chemical reaction. That is, the total mass of elements present in the products must equal the total mass of elements present in the reactants.

Let us balance the reaction of iron with steam:
$$3Fe(s) + 4H_2O(g) \\rightarrow Fe_3O_4(s) + 4H_2(g)$$

### 1.3 Types of Chemical Reactions
1. **Combination Reaction**: A reaction in which a single product is formed from two or more reactants.
   - Example: $CaO(s) + H_2O(l) \\rightarrow Ca(OH)_2(aq) + \\text{Heat}$ (Slaking of lime).
2. **Decomposition Reaction**: When a single reactant breaks down to give simpler products.
   - Thermal decomposition: $2FeSO_4(s) \\xrightarrow{\\Delta} Fe_2O_3(s) + SO_2(g) + SO_3(g)$
   - Photochemical decomposition: $2AgCl(s) \\xrightarrow{\\text{Sunlight}} 2Ag(s) + Cl_2(g)$ (Used in black and white photography).
3. **Displacement Reaction**: An element displaces another element from its solution.
   - Example: $Fe(s) + CuSO_4(aq) \\rightarrow FeSO_4(aq) + Cu(s)$
4. **Double Displacement Reaction**: Reactions in which there is an exchange of ions between reactants.
   - Example: $Na_2SO_4(aq) + BaCl_2(aq) \\rightarrow BaSO_4(s) \\downarrow + 2NaCl(aq)$

### 1.4 Oxidation and Reduction (Redox)
- **Oxidation**: The gain of oxygen or loss of hydrogen.
- **Reduction**: The loss of oxygen or gain of hydrogen.
In the reaction:
$$CuO + H_2 \\xrightarrow{\\Delta} Cu + H_2O$$
Copper(II) oxide is reduced to copper, while hydrogen is oxidized to water.`
      },
      {
        id: 'ch_sci_light',
        chapterNumber: 2,
        title: 'Light – Reflection and Refraction',
        estimatedReadTimeMinutes: 24,
        isCompleted: false,
        sections: [
          '2.1 Reflection of Light & Spherical Mirrors',
          '2.2 Image Formation by Concave Mirrors',
          '2.3 Mirror Formula and Magnification',
          '2.4 Refraction of Light & Snell’s Law',
          '2.5 Refraction through Lenses and Lens Formula'
        ],
        content: `## Chapter 2: Light – Reflection and Refraction

We see a variety of objects in the world around us. However, we are unable to see anything in a dark room. On lighting up the room, things become visible. What makes things visible?

During the day, the sunlight helps us to see objects. An object reflects light that falls on it. This reflected light, when received by our eyes, enables us to see things.

### 2.1 Spherical Mirrors
A spherical mirror whose reflecting surface is curved inwards (facing towards the centre of the sphere) is called a **Concave Mirror**. A spherical mirror whose reflecting surface is curved outwards is called a **Convex Mirror**.

#### Important Terms:
- **Pole (P)**: The centre of the reflecting surface of a spherical mirror.
- **Centre of Curvature (C)**: The centre of the sphere of which the mirror forms a part.
- **Radius of Curvature (R)**: The radius of the sphere of which the mirror surface forms a part. $R = 2f$.
- **Principal Focus (F)**: Rays parallel to the principal axis after reflection converge to (in concave) or appear to diverge from (in convex) a point on the principal axis called the principal focus.
- **Focal Length (f)**: The distance between the pole and principal focus.

### 2.2 Image Formation by Concave Mirrors
- Object at Infinity: Image formed at F; real, inverted, highly diminished.
- Object beyond C: Image between F and C; real, inverted, diminished.
- Object at C: Image at C; real, inverted, same size!
- Object between C and F: Image beyond C; real, inverted, enlarged.
- Object at F: Image at infinity; real, inverted, highly enlarged.
- Object between P and F: Image behind mirror; **virtual, erect, enlarged** (used by dentists and shaving mirrors).

### 2.3 The Mirror Formula & Magnification
The distance of the object from its pole is called object distance ($u$). The distance of image from pole is image distance ($v$).
The relationship is given by:

$$\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}$$

**Magnification ($m$)**:
$$m = \\frac{\\text{Height of image } (h')}{\\text{Height of object } (h)} = -\\frac{v}{u}$$

- If $m$ is negative, the image is real and inverted.
- If $m$ is positive, the image is virtual and erect.

### 2.4 Refraction of Light and Snell's Law
When light travels obliquely from one transparent medium into another, it changes its direction in the second medium. This phenomenon is called **Refraction of Light**.

#### Laws of Refraction:
1. The incident ray, refracted ray and the normal to the interface of two transparent media at the point of incidence all lie in the same plane.
2. **Snell's Law**: The ratio of sine of angle of incidence to sine of angle of refraction is a constant:
$$\\frac{\\sin i}{\\sin r} = n_{21} = \\text{Constant}$$
where $n_{21}$ is the refractive index of medium 2 with respect to medium 1.`
      },
      {
        id: 'ch_sci_electricity',
        chapterNumber: 3,
        title: 'Electricity & Heating Effects',
        estimatedReadTimeMinutes: 22,
        isCompleted: false,
        sections: [
          '3.1 Electric Current & Circuit',
          '3.2 Electric Potential & Potential Difference',
          "3.3 Ohm's Law and Resistance",
          '3.4 Resistors in Series and Parallel',
          '3.5 Electric Power & Heating Effects'
        ],
        content: `## Chapter 3: Electricity & Heating Effects

Electricity has an important place in modern society. It is a controllable and convenient form of energy for a wide variety of uses in homes, schools, hospitals, industries and so on.

### 3.1 Electric Current
Electric current is expressed by the amount of charge flowing through a particular area in unit time:
$$I = \\frac{Q}{t}$$
The SI unit of electric charge is **Coulomb (C)**. The electric current is expressed in **Ampere (A)** (named after André-Marie Ampère).
One Ampere is constituted by the flow of one coulomb of charge per second ($1 A = 1 C/s$).

### 3.2 Electric Potential Difference
Electric potential difference ($V$) between two points in an electric circuit carrying some current is the work done ($W$) to move a unit charge ($Q$) from one point to the other:
$$V = \\frac{W}{Q}$$
The SI unit of electric potential difference is **Volt (V)**.

### 3.3 Ohm's Law
In 1827, German physicist Georg Simon Ohm stated:
> *The electric current flowing through a metallic wire is directly proportional to the potential difference across its ends, provided its temperature remains constant.*

$$V \\propto I \\implies V = IR$$
where $R$ is a constant for the given metallic wire at given temperature and is called its **resistance**. SI unit of resistance is **Ohm (\\Omega)**.

### 3.4 Series and Parallel Combinations
1. **Resistors in Series**: The current through each resistor is identical, and the total resistance is:
   $$R_s = R_1 + R_2 + R_3 + \\dots$$
2. **Resistors in Parallel**: The potential difference across each resistor is the same, and the equivalent resistance is:
   $$\\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\frac{1}{R_3} + \\dots$$`
      }
    ]
  },
  {
    id: 'book_cbse_math_10',
    title: 'CBSE Mathematics: Concepts, Proofs & Solved Problems',
    author: 'Prof. S. R. Ramanujan & EduPulse Faculty',
    subject: 'Mathematics',
    grade: 10,
    coverGradient: 'from-indigo-600 via-purple-700 to-slate-900',
    coverIcon: 'Binary',
    fileName: 'CBSE_Maths_Class10_Complete.pdf',
    progress: 60,
    currentChapterId: 'ch_math_quad',
    lastOpened: '2026-09-19',
    bookmarks: ['ch_math_quad'],
    highlights: [
      {
        id: 'hl_m1',
        chapterId: 'ch_math_quad',
        text: 'A quadratic equation in variable x is an equation of the form ax² + bx + c = 0, where a, b, c are real numbers and a ≠ 0.',
        color: 'emerald',
        createdAt: '2026-09-18'
      }
    ],
    notes: [],
    chapters: [
      {
        id: 'ch_math_real_num',
        chapterNumber: 1,
        title: 'Real Numbers & Fundamental Theorem of Arithmetic',
        estimatedReadTimeMinutes: 15,
        isCompleted: true,
        sections: [
          '1.1 Fundamental Theorem of Arithmetic',
          '1.2 Revisiting Irrational Numbers (√2, √3 Proofs)',
          '1.3 Revisiting Rational Numbers & Decimals'
        ],
        content: `## Chapter 1: Real Numbers

### 1.1 The Fundamental Theorem of Arithmetic
Every composite number can be expressed (factorised) as a product of primes, and this factorisation is unique, apart from the order in which the prime factors occur.

Given any composite number $x$, we can factorise it as:
$$x = p_1 \\cdot p_2 \\cdot \\dots \\cdot p_n$$
where $p_1 \\le p_2 \\le \\dots \\le p_n$ are prime numbers.

#### Key Theorem on HCF & LCM:
For any two positive integers $a$ and $b$:
$$\\text{HCF}(a, b) \\times \\text{LCM}(a, b) = a \\times b$$

### 1.2 Proof of Irrationality of √2
**Theorem**: $\\sqrt{2}$ is irrational.
*Proof by Contradiction*:
Assume to the contrary that $\\sqrt{2}$ is rational. Then there exist co-prime integers $a$ and $b$ ($b \\neq 0$) such that:
$$\\sqrt{2} = \\frac{a}{b} \\implies 2b^2 = a^2$$
This implies $2$ divides $a^2$, which means $2$ divides $a$ (since 2 is prime).
Let $a = 2c$. Substituting gives:
$$2b^2 = (2c)^2 = 4c^2 \\implies b^2 = 2c^2$$
This implies $2$ divides $b^2$, so $2$ divides $b$.
Thus $a$ and $b$ share a common factor $2$, contradicting that $a$ and $b$ are co-prime.
Hence, $\\sqrt{2}$ must be irrational.`
      },
      {
        id: 'ch_math_quad',
        chapterNumber: 2,
        title: 'Quadratic Equations & Discriminant Analysis',
        estimatedReadTimeMinutes: 20,
        isCompleted: false,
        sections: [
          '2.1 Standard Form of Quadratic Equations',
          '2.2 Solving by Factorisation',
          '2.3 Quadratic Formula (Sridharacharya’s Method)',
          '2.4 Nature of Roots & Discriminant'
        ],
        content: `## Chapter 2: Quadratic Equations

### 2.1 Standard Form
Any equation of the form:
$$ax^2 + bx + c = 0, \\quad a \\neq 0$$
is called a quadratic equation in one variable $x$.

### 2.2 Nature of Roots & The Discriminant ($D$)
For $ax^2 + bx + c = 0$, the roots are given by the Quadratic Formula:
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

The term $D = b^2 - 4ac$ is known as the **Discriminant**.
1. **$D > 0$**: Two distinct real roots exist:
   $$x_1 = \\frac{-b + \\sqrt{D}}{2a}, \\quad x_2 = \\frac{-b - \\sqrt{D}}{2a}$$
2. **$D = 0$**: Two equal real roots exist (repeated roots):
   $$x = -\\frac{b}{2a}$$
3. **$D < 0$**: No real roots exist (the roots are complex conjugates).`
      }
    ]
  },
  {
    id: 'book_python_cs_10',
    title: 'Computer Science: Python Programming & Logic',
    author: 'EduPulse Tech Lab',
    subject: 'Computer Science',
    grade: 10,
    coverGradient: 'from-amber-600 via-orange-700 to-slate-900',
    coverIcon: 'Code2',
    fileName: 'Python_Class10_StudyBook.pdf',
    progress: 75,
    currentChapterId: 'ch_py_loops',
    lastOpened: '2026-09-17',
    bookmarks: [],
    highlights: [],
    notes: [],
    chapters: [
      {
        id: 'ch_py_basics',
        chapterNumber: 1,
        title: 'Python Syntax, Variables and Expressions',
        estimatedReadTimeMinutes: 14,
        isCompleted: true,
        sections: [
          '1.1 Why Python?',
          '1.2 Variables and Identifiers',
          '1.3 Data Types: int, float, str, bool',
          '1.4 Basic Input and Output'
        ],
        content: `## Chapter 1: Python Syntax and Variables

Python is a high-level, interpreted programming language known for its clean, readable syntax and versatile applications across data science, web development, and artificial intelligence.

### 1.1 Variables and Assignment
Variables are created when you assign a value to them:
\`\`\`python
# Storing student test details
student_name = "Aarav Sharma"
roll_number = "10A-04"
marks_obtained = 92.5
is_passed = True

print(f"Student {student_name} scored {marks_obtained}%")
\`\`\`

### 1.2 Data Types
- **int**: Whole numbers like \`42\`, \`-5\`
- **float**: Real numbers like \`3.14159\`, \`-0.001\`
- **str**: Text enclosed in single or double quotes: \`"Quiz AI"\`
- **bool**: Logical values \`True\` or \`False\``
      },
      {
        id: 'ch_py_loops',
        chapterNumber: 2,
        title: 'Control Flow, Conditionals and Loops',
        estimatedReadTimeMinutes: 18,
        isCompleted: false,
        sections: [
          '2.1 If-Elif-Else Decision Making',
          '2.2 While Loop Iteration',
          '2.3 For Loops with range()',
          '2.4 Break and Continue Statements'
        ],
        content: `## Chapter 2: Control Flow and Loops

### 2.1 Conditionals
Conditional execution allows programs to make decisions based on runtime values:

\`\`\`python
score = 86

if score >= 90:
    grade = "A+"
elif score >= 80:
    grade = "A"
elif score >= 70:
    grade = "B+"
elif score >= 60:
    grade = "B"
else:
    grade = "Needs Practice"

print(f"Grade awarded: {grade}")
\`\`\`

### 2.2 For Loops with range()
\`\`\`python
# Calculating sum of squares from 1 to 5
total = 0
for i in range(1, 6):
    total += i ** 2
print("Sum of squares:", total) # Output: 55
\`\`\``
      }
    ]
  }
];

export const INITIAL_QUESTION_SETS: QuestionSet[] = [
  {
    id: 'qset_quick_practice',
    title: 'Quick Practice — 10 High-Yield Questions',
    subject: 'Science',
    chapter: 'Light & Electricity Mixed',
    topic: 'Formulas, Ray Optics & Circuits',
    difficulty: 'medium',
    questionCount: 10,
    totalMarks: 10,
    timeLimit: 15,
    presetType: 'quick',
    createdAt: '2026-09-18',
    attemptsCount: 3,
    bestScore: 9,
    questions: [
      {
        id: 'q_qp_1',
        type: 'mcq',
        chapter: 'Light – Reflection and Refraction',
        questionText: 'Which of the following mirror types is preferred by drivers as a rear-view mirror?',
        marks: 1,
        difficulty: 'easy',
        bloomsLevel: 'Remember',
        options: [
          { id: 'opt_1', text: 'Concave mirror', isCorrect: false },
          { id: 'opt_2', text: 'Convex mirror', isCorrect: true },
          { id: 'opt_3', text: 'Plane mirror', isCorrect: false },
          { id: 'opt_4', text: 'Inverted parabolic mirror', isCorrect: false }
        ],
        correctAnswer: 'Convex mirror',
        explanation: 'Convex mirrors always give an erect, diminished image and have a wider field of view because they are curved outwards.'
      },
      {
        id: 'q_qp_2',
        type: 'mcq',
        chapter: 'Electricity',
        questionText: 'What is the commercial unit of electrical energy consumed in households?',
        marks: 1,
        difficulty: 'easy',
        bloomsLevel: 'Remember',
        options: [
          { id: 'opt_1', text: 'Joule (J)', isCorrect: false },
          { id: 'opt_2', text: 'Kilowatt-hour (kWh)', isCorrect: true },
          { id: 'opt_3', text: 'Watt-second (W·s)', isCorrect: false },
          { id: 'opt_4', text: 'Ampere-hour (Ah)', isCorrect: false }
        ],
        correctAnswer: 'Kilowatt-hour (kWh)',
        explanation: '1 Kilowatt-hour (kWh) = 3.6 × 10^6 Joules, commonly referred to as one commercial unit of electricity.'
      },
      {
        id: 'q_qp_3',
        type: 'mcq',
        chapter: 'Light – Reflection and Refraction',
        questionText: 'A convex lens has a focal length of 25 cm. Its optical power in dioptres is:',
        marks: 1,
        difficulty: 'medium',
        bloomsLevel: 'Apply',
        options: [
          { id: 'opt_1', text: '+4 D', isCorrect: true },
          { id: 'opt_2', text: '-4 D', isCorrect: false },
          { id: 'opt_3', text: '+2.5 D', isCorrect: false },
          { id: 'opt_4', text: '+0.04 D', isCorrect: false }
        ],
        correctAnswer: '+4 D',
        explanation: 'Power P = 1 / f(in meters). Here f = 25 cm = 0.25 m. P = 1 / 0.25 = +4 D.'
      },
      {
        id: 'q_qp_4',
        type: 'mcq',
        chapter: 'Electricity',
        questionText: 'If the radius of a cylindrical conducting wire is doubled, keeping length constant, its electrical resistance becomes:',
        marks: 1,
        difficulty: 'medium',
        bloomsLevel: 'Apply',
        options: [
          { id: 'opt_1', text: 'One-half (1/2)', isCorrect: false },
          { id: 'opt_2', text: 'One-fourth (1/4)', isCorrect: true },
          { id: 'opt_3', text: 'Double (2x)', isCorrect: false },
          { id: 'opt_4', text: 'Four times (4x)', isCorrect: false }
        ],
        correctAnswer: 'One-fourth (1/4)',
        explanation: 'Resistance R = ρL/A = ρL/(πr²). When radius r is doubled, cross-sectional area increases by 2² = 4, so resistance becomes 1/4 of its original value.'
      },
      {
        id: 'q_qp_5',
        type: 'mcq',
        chapter: 'Light – Reflection and Refraction',
        questionText: 'When a ray of light passes obliquely from water (optically denser) into air (optically rarer), it bends:',
        marks: 1,
        difficulty: 'easy',
        bloomsLevel: 'Understand',
        options: [
          { id: 'opt_1', text: 'Towards the normal', isCorrect: false },
          { id: 'opt_2', text: 'Away from the normal', isCorrect: true },
          { id: 'opt_3', text: 'Without any deviation', isCorrect: false },
          { id: 'opt_4', text: 'Reflects back at 90 degrees', isCorrect: false }
        ],
        correctAnswer: 'Away from the normal',
        explanation: 'Light speeds up when entering an optically rarer medium like air from water, causing the wavefront to bend away from the normal.'
      },
      {
        id: 'q_qp_6',
        type: 'mcq',
        chapter: 'Electricity',
        questionText: 'Three identical resistors of 6 Ω each are connected in parallel. Their equivalent resistance is:',
        marks: 1,
        difficulty: 'medium',
        bloomsLevel: 'Apply',
        options: [
          { id: 'opt_1', text: '18 Ω', isCorrect: false },
          { id: 'opt_2', text: '2 Ω', isCorrect: true },
          { id: 'opt_3', text: '3 Ω', isCorrect: false },
          { id: 'opt_4', text: '1 Ω', isCorrect: false }
        ],
        correctAnswer: '2 Ω',
        explanation: '1/R = 1/6 + 1/6 + 1/6 = 3/6 = 1/2 => R = 2 Ω.'
      },
      {
        id: 'q_qp_7',
        type: 'mcq',
        chapter: 'Chemical Reactions and Equations',
        questionText: 'Rusting of iron is an example of which type of chemical reaction?',
        marks: 1,
        difficulty: 'easy',
        bloomsLevel: 'Remember',
        options: [
          { id: 'opt_1', text: 'Redox and combination reaction', isCorrect: true },
          { id: 'opt_2', text: 'Thermal decomposition reaction', isCorrect: false },
          { id: 'opt_3', text: 'Endothermic displacement reaction', isCorrect: false },
          { id: 'opt_4', text: 'Neutralization reaction', isCorrect: false }
        ],
        correctAnswer: 'Redox and combination reaction',
        explanation: 'Iron is oxidized in the presence of atmospheric oxygen and moisture: 4Fe + 3O2 + 2xH2O -> 2Fe2O3·xH2O.'
      },
      {
        id: 'q_qp_8',
        type: 'mcq',
        chapter: 'Life Processes',
        questionText: 'Which chamber of the human heart receives oxygenated blood directly from the lungs?',
        marks: 1,
        difficulty: 'medium',
        bloomsLevel: 'Understand',
        options: [
          { id: 'opt_1', text: 'Right atrium', isCorrect: false },
          { id: 'opt_2', text: 'Right ventricle', isCorrect: false },
          { id: 'opt_3', text: 'Left atrium', isCorrect: true },
          { id: 'opt_4', text: 'Left ventricle', isCorrect: false }
        ],
        correctAnswer: 'Left atrium',
        explanation: 'Oxygenated blood from the lungs travels via pulmonary veins into the thin-walled upper chamber on the left: the Left Atrium.'
      },
      {
        id: 'q_qp_9',
        type: 'mcq',
        chapter: 'Light – Reflection and Refraction',
        questionText: 'What is the value of the refractive index of absolute vacuum?',
        marks: 1,
        difficulty: 'easy',
        bloomsLevel: 'Remember',
        options: [
          { id: 'opt_1', text: '0.0', isCorrect: false },
          { id: 'opt_2', text: '1.0 exactly', isCorrect: true },
          { id: 'opt_3', text: '1.33', isCorrect: false },
          { id: 'opt_4', text: '3.0 × 10^8', isCorrect: false }
        ],
        correctAnswer: '1.0 exactly',
        explanation: 'By definition, the speed of light in vacuum c divided by speed in vacuum c is exactly 1.0.'
      },
      {
        id: 'q_qp_10',
        type: 'mcq',
        chapter: 'Electricity',
        questionText: 'According to Joule’s law of heating, the heat H produced in a resistor is proportional to:',
        marks: 1,
        difficulty: 'medium',
        bloomsLevel: 'Remember',
        options: [
          { id: 'opt_1', text: 'Square of electric current (I²)', isCorrect: true },
          { id: 'opt_2', text: 'Square root of current (√I)', isCorrect: false },
          { id: 'opt_3', text: 'Inverse of resistance (1/R)', isCorrect: false },
          { id: 'opt_4', text: 'Inverse of time (1/t)', isCorrect: false }
        ],
        correctAnswer: 'Square of electric current (I²)',
        explanation: 'Joule’s law states H = I²Rt. Heat generated is directly proportional to the square of current I, resistance R, and time t.'
      }
    ]
  },
  {
    id: 'qset_chapter_test_20',
    title: 'Chapter Test — 20 Questions (Light Optics Mastery)',
    subject: 'Science',
    chapter: 'Light – Reflection and Refraction',
    topic: 'Mirrors, Lenses, Magnification, Snell’s Law',
    difficulty: 'medium',
    questionCount: 20,
    totalMarks: 20,
    timeLimit: 30,
    presetType: 'chapter',
    createdAt: '2026-09-17',
    attemptsCount: 1,
    bestScore: 18,
    questions: [
      {
        id: 'q_ct_1',
        type: 'mcq',
        chapter: 'Light – Reflection and Refraction',
        questionText: 'An object 4 cm in height is placed 25 cm in front of a concave mirror of focal length 15 cm. At what distance from the mirror should a screen be placed to obtain a sharp image?',
        marks: 1,
        difficulty: 'hard',
        bloomsLevel: 'Apply',
        options: [
          { id: 'ct1_1', text: '-37.5 cm', isCorrect: true },
          { id: 'ct1_2', text: '-20.0 cm', isCorrect: false },
          { id: 'ct1_3', text: '-45.0 cm', isCorrect: false },
          { id: 'ct1_4', text: '+37.5 cm', isCorrect: false }
        ],
        correctAnswer: '-37.5 cm',
        explanation: 'Using 1/f = 1/v + 1/u: 1/(-15) = 1/v + 1/(-25) => 1/v = -1/15 + 1/25 = (-5 + 3)/75 = -2/75 => v = -37.5 cm.'
      },
      {
        id: 'q_ct_2',
        type: 'mcq',
        chapter: 'Light – Reflection and Refraction',
        questionText: 'What is the nature of the image formed by a concave mirror when the object is placed between the Pole and Focus?',
        marks: 1,
        difficulty: 'easy',
        bloomsLevel: 'Remember',
        options: [
          { id: 'ct2_1', text: 'Virtual, erect and enlarged', isCorrect: true },
          { id: 'ct2_2', text: 'Real, inverted and enlarged', isCorrect: false },
          { id: 'ct2_3', text: 'Real, inverted and diminished', isCorrect: false },
          { id: 'ct2_4', text: 'Virtual, erect and diminished', isCorrect: false }
        ],
        correctAnswer: 'Virtual, erect and enlarged',
        explanation: 'When placed between P and F, the reflected rays diverge and appear to meet behind the mirror, forming a virtual, erect, and magnified image.'
      },
      {
        id: 'q_ct_3',
        type: 'mcq',
        chapter: 'Light – Reflection and Refraction',
        questionText: 'A ray of light traveling in air enters obliquely into water. Does the light ray bend towards the normal or away from the normal?',
        marks: 1,
        difficulty: 'easy',
        bloomsLevel: 'Understand',
        options: [
          { id: 'ct3_1', text: 'Towards the normal', isCorrect: true },
          { id: 'ct3_2', text: 'Away from the normal', isCorrect: false },
          { id: 'ct3_3', text: 'Remains unbent', isCorrect: false },
          { id: 'ct3_4', text: 'Reflects symmetrically', isCorrect: false }
        ],
        correctAnswer: 'Towards the normal',
        explanation: 'Water is optically denser than air. When light travels from a rarer medium to a denser medium, its speed slows down and it bends towards the normal.'
      }
    ]
  },
  {
    id: 'qset_revision_25',
    title: 'Revision Set — 25 Board Style Questions',
    subject: 'Mathematics',
    chapter: 'Polynomials & Quadratic Equations',
    topic: 'Formula Application & Roots',
    difficulty: 'medium',
    questionCount: 25,
    totalMarks: 25,
    timeLimit: 40,
    presetType: 'revision',
    createdAt: '2026-09-16',
    attemptsCount: 2,
    bestScore: 24,
    questions: [
      {
        id: 'q_rev_1',
        type: 'mcq',
        chapter: 'Polynomials',
        questionText: 'If one of the zeroes of the quadratic polynomial (k - 1)x² + kx + 1 is -3, then the value of k is:',
        marks: 1,
        difficulty: 'medium',
        bloomsLevel: 'Apply',
        options: [
          { id: 'r1_1', text: '4/3', isCorrect: true },
          { id: 'r1_2', text: '-4/3', isCorrect: false },
          { id: 'r1_3', text: '2/3', isCorrect: false },
          { id: 'r1_4', text: '-2/3', isCorrect: false }
        ],
        correctAnswer: '4/3',
        explanation: 'Since -3 is a zero: (k - 1)(-3)² + k(-3) + 1 = 0 => 9(k - 1) - 3k + 1 = 0 => 9k - 9 - 3k + 1 = 0 => 6k = 8 => k = 4/3.'
      },
      {
        id: 'q_rev_2',
        type: 'mcq',
        chapter: 'Quadratic Equations',
        questionText: 'The discriminant of the quadratic equation 2x² - 4x + 3 = 0 is:',
        marks: 1,
        difficulty: 'easy',
        bloomsLevel: 'Remember',
        options: [
          { id: 'r2_1', text: '-8', isCorrect: true },
          { id: 'r2_2', text: '8', isCorrect: false },
          { id: 'r2_3', text: '-12', isCorrect: false },
          { id: 'r2_4', text: '16', isCorrect: false }
        ],
        correctAnswer: '-8',
        explanation: 'D = b² - 4ac = (-4)² - 4(2)(3) = 16 - 24 = -8. Since D < 0, no real roots exist.'
      }
    ]
  },
  {
    id: 'qset_exam_practice_50',
    title: 'Exam Practice — 50 Questions Full Mock Paper',
    subject: 'Science',
    chapter: 'All Chapters (CBSE Board Simulated)',
    topic: 'Full Term 1 & 2 Blueprint',
    difficulty: 'hard',
    questionCount: 50,
    totalMarks: 50,
    timeLimit: 60,
    presetType: 'exam',
    createdAt: '2026-09-14',
    attemptsCount: 0,
    questions: [
      {
        id: 'q_ex_1',
        type: 'mcq',
        chapter: 'Chemical Reactions and Equations',
        questionText: 'When lead nitrate crystals are heated in a dry test tube, brown fumes of which gas are evolved?',
        marks: 1,
        difficulty: 'medium',
        bloomsLevel: 'Remember',
        options: [
          { id: 'ex1_1', text: 'Nitrogen Dioxide (NO2)', isCorrect: true },
          { id: 'ex1_2', text: 'Nitric Oxide (NO)', isCorrect: false },
          { id: 'ex1_3', text: 'Dinitrogen Oxide (N2O)', isCorrect: false },
          { id: 'ex1_4', text: 'Oxygen (O2)', isCorrect: false }
        ],
        correctAnswer: 'Nitrogen Dioxide (NO2)',
        explanation: '2Pb(NO3)2(s) -> 2PbO(s) + 4NO2(g) [brown fumes] + O2(g).'
      }
    ]
  }
];
