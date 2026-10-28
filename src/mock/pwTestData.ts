import { ExamModel, AttemptModel, ExamQuestionModel } from '../types/schemas';

export interface PwTopperItem {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  maxScore: number;
  percentage: number;
  accuracy: number;
  timeSpentSec: number;
  city: string;
  isCurrentUser?: boolean;
}

export interface PwVideoSolutionData {
  instructor: string;
  title: string;
  duration: string;
  timestamps: { time: string; label: string }[];
  whiteboardNotes: string[];
}

export const PW_SAMPLE_QUESTIONS: (ExamQuestionModel & {
  subject: 'Physics' | 'Chemistry' | 'Mathematics' | 'Biology';
  pwTrick?: string;
  conceptName?: string;
  avgTimeSec?: number;
  topperTimeSec?: number;
  videoSolution?: PwVideoSolutionData;
})[] = [
  // ── Physics (Q1 - Q8) ──
  {
    id: 'pw_q_01',
    type: 'mcq',
    chapterId: 'phy_10_12',
    chapterName: 'Electricity & Circuit Theory',
    subject: 'Physics',
    conceptName: "Resistor Networks & Ohm's Law",
    pageRef: 'NCERT Physics Class 10, Ch 12, Page 209',
    difficulty: 'medium',
    bloomLevel: 'Apply',
    marks: 4,
    estimatedTimeSec: 60,
    avgTimeSec: 65,
    topperTimeSec: 26,
    question: 'A wire of resistance R is cut into five equal pieces. These pieces are then connected in parallel. If the equivalent resistance of this combination is R\', what is the ratio R / R\'?',
    options: [
      { id: 'opt_1', text: '1/25' },
      { id: 'opt_2', text: '1/5' },
      { id: 'opt_3', text: '5' },
      { id: 'opt_4', text: '25' }
    ],
    correctAnswer: '25',
    explanation: 'When a wire of resistance R is cut into 5 equal parts, each piece will have resistance r = R / 5. Connecting all 5 pieces in parallel gives 1/R\' = 1/r + 1/r + 1/r + 1/r + 1/r = 5/r = 5 / (R/5) = 25/R. Therefore, R / R\' = 25.',
    pwTrick: 'EduPlus Shortcut Formula: If a wire of resistance R is divided into n equal parts and connected in parallel, R / R\' = n². Here n = 5, so n² = 25 in just 3 seconds!',
    videoSolution: {
      instructor: 'Alakh Sir (Physics Dept)',
      title: 'Current Electricity: Quick Parallel Cutting Trick',
      duration: '2m 45s',
      timestamps: [
        { time: '0:00', label: 'Question Breakdown' },
        { time: '0:50', label: 'Resistance proportionality to length' },
        { time: '1:30', label: 'EduPlus 3-Second Shortcut (R/R\' = n²)' },
        { time: '2:15', label: 'Common Exam Traps to Avoid' }
      ],
      whiteboardNotes: [
        'R is directly proportional to length (R ∝ L)',
        'Each piece: r = R/n',
        'Parallel combination of n identical resistors: R\' = r/n = R/n²',
        'Ratio R/R\' = n² (Always memorize this for JEE/NEET!)'
      ]
    }
  },
  {
    id: 'pw_q_02',
    type: 'mcq',
    chapterId: 'phy_10_10',
    chapterName: 'Light – Reflection and Refraction',
    subject: 'Physics',
    conceptName: 'Concave Mirrors & Real Inverted Images',
    pageRef: 'NCERT Physics Class 10, Ch 10, Page 166',
    difficulty: 'easy',
    bloomLevel: 'Understand',
    marks: 4,
    estimatedTimeSec: 45,
    avgTimeSec: 48,
    topperTimeSec: 18,
    question: 'Where should an object be placed in front of a concave mirror so that a real, inverted and same-sized image is obtained on the screen?',
    options: [
      { id: 'opt_1', text: 'At the Principal Focus (F)' },
      { id: 'opt_2', text: 'At the Centre of Curvature (C)' },
      { id: 'opt_3', text: 'Between Focus and Pole (F and P)' },
      { id: 'opt_4', text: 'At Infinity (∞)' }
    ],
    correctAnswer: 'At the Centre of Curvature (C)',
    explanation: 'When an object is placed at the centre of curvature (C) of a concave mirror, the reflected rays converge at C itself, forming a real, inverted image of the exact same size as the object (magnification m = -1).',
    pwTrick: 'EduPlus Memory Matrix: Center = Center (Object at C gives image at C, m = -1). If at Focus → Image at Infinity; if at Infinity → Image at Focus.',
    videoSolution: {
      instructor: 'Alakh Sir (Physics Dept)',
      title: 'Ray Optics: Concave Mirror Image Positions Made Simple',
      duration: '3m 10s',
      timestamps: [
        { time: '0:00', label: 'Ray Diagram Construction' },
        { time: '1:10', label: 'Why magnification equals -1 at C' },
        { time: '2:20', label: 'Complete Table Summary' }
      ],
      whiteboardNotes: [
        'Concave Mirror Key Rule: Object at C ⇒ Image at C',
        'Image nature: Real, Inverted',
        'Size: Same size (h\' = -h ⇒ m = -1)'
      ]
    }
  },
  {
    id: 'pw_q_03',
    type: 'mcq',
    chapterId: 'phy_10_12',
    chapterName: 'Electricity & Circuit Theory',
    subject: 'Physics',
    conceptName: "Joule's Law of Heating & Electric Power",
    pageRef: 'NCERT Physics Class 10, Ch 12, Page 218',
    difficulty: 'medium',
    bloomLevel: 'Apply',
    marks: 4,
    estimatedTimeSec: 60,
    avgTimeSec: 72,
    topperTimeSec: 32,
    question: 'An electric bulb is rated 220 V and 100 W. When it is operated on 110 V, what will be the power consumed by the bulb?',
    options: [
      { id: 'opt_1', text: '100 W' },
      { id: 'opt_2', text: '75 W' },
      { id: 'opt_3', text: '50 W' },
      { id: 'opt_4', text: '25 W' }
    ],
    correctAnswer: '25 W',
    explanation: 'The filament resistance remains constant: R = V² / P = (220)² / 100 = 484 Ω. When operated at V\' = 110 V: P\' = (V\')² / R = (110)² / 484 = 12100 / 484 = 25 W.',
    pwTrick: 'EduPlus Pro Trick: Power is proportional to V² for constant resistance. If voltage is halved (V/2), power becomes (1/2)² = 1/4th! 100 W / 4 = 25 W immediately without computing resistance!',
    videoSolution: {
      instructor: 'Alakh Sir (Physics Dept)',
      title: 'Electric Power: Voltage Scaling Shortcut',
      duration: '2m 15s',
      timestamps: [
        { time: '0:00', label: 'Concept of Fixed Resistance' },
        { time: '0:45', label: 'Proportionality P ∝ V²' },
        { time: '1:30', label: 'Instant Mental Math Technique' }
      ],
      whiteboardNotes: [
        'Resistance of bulb is invariant: R = V²/P',
        'If voltage changes to V\' = V / k, then P\' = P / k²',
        'Here k = 220 / 110 = 2 ⇒ P\' = 100 / 2² = 25 W'
      ]
    }
  },
  {
    id: 'pw_q_04',
    type: 'mcq',
    chapterId: 'phy_10_11',
    chapterName: 'Human Eye and Colorful World',
    subject: 'Physics',
    conceptName: 'Atmospheric Refraction & Rayleigh Scattering',
    pageRef: 'NCERT Physics Class 10, Ch 11, Page 194',
    difficulty: 'hard',
    bloomLevel: 'Analyze',
    marks: 4,
    estimatedTimeSec: 70,
    avgTimeSec: 85,
    topperTimeSec: 40,
    question: 'The clear sky appears blue because of Rayleigh scattering. If the Earth had no atmosphere, what would the sky look like to an observer on Earth during daytime?',
    options: [
      { id: 'opt_1', text: 'White, due to direct sunlight without filtering' },
      { id: 'opt_2', text: 'Dark / Black, because there would be no particles to scatter sunlight' },
      { id: 'opt_3', text: 'Reddish, due to longer wavelength transmission' },
      { id: 'opt_4', text: 'Light yellow, reflecting the true solar radiation' }
    ],
    correctAnswer: 'Dark / Black, because there would be no particles to scatter sunlight',
    explanation: 'Scattering of light takes place through minute gas molecules and atmospheric particles. Without an atmosphere, sunlight travels in straight lines into space without scattering towards the observer\'s eyes, causing the sky to appear completely pitch black (just like astronauts see in outer space or on the Moon).',
    pwTrick: 'EduPlus Concept Card: No atmosphere = No scattering = Pitch Black Sky (Same as observed on the Moon or Apollo missions).',
    videoSolution: {
      instructor: 'Alakh Sir (Physics Dept)',
      title: 'Scattering of Light & Why the Sky is Blue / Space is Black',
      duration: '3m 40s',
      timestamps: [
        { time: '0:00', label: 'Rayleigh Scattering Law (I ∝ 1/λ⁴)' },
        { time: '1:20', label: 'Atmospheric particles role' },
        { time: '2:15', label: 'Earth without atmosphere simulation' }
      ],
      whiteboardNotes: [
        'Rayleigh Scattering Law: Intensity ∝ 1/λ⁴',
        'Blue light scatters ~16 times more than red light',
        'No particles = zero scattering ⇒ complete black darkness'
      ]
    }
  },

  // ── Chemistry (Q5 - Q8) ──
  {
    id: 'pw_q_05',
    type: 'mcq',
    chapterId: 'chem_10_01',
    chapterName: 'Chemical Reactions & Equations',
    subject: 'Chemistry',
    conceptName: 'Redox Reactions & Oxidizing Agents',
    pageRef: 'NCERT Chemistry Class 10, Ch 1, Page 12',
    difficulty: 'medium',
    bloomLevel: 'Analyze',
    marks: 4,
    estimatedTimeSec: 50,
    avgTimeSec: 62,
    topperTimeSec: 24,
    question: 'In the reaction: CuO(s) + H₂(g) → Cu(s) + H₂O(l), which substance undergoes oxidation and which acts as the reducing agent?',
    options: [
      { id: 'opt_1', text: 'CuO is oxidized, H₂ is reducing agent' },
      { id: 'opt_2', text: 'H₂ is oxidized, H₂ is reducing agent' },
      { id: 'opt_3', text: 'Cu is oxidized, H₂O is reducing agent' },
      { id: 'opt_4', text: 'H₂ is reduced, CuO is reducing agent' }
    ],
    correctAnswer: 'H₂ is oxidized, H₂ is reducing agent',
    explanation: 'In this redox reaction: Hydrogen gains oxygen to become H₂O, so H₂ is oxidized. The substance that is oxidized acts as the reducing agent. CuO loses oxygen to become Cu, so CuO is reduced and acts as the oxidizing agent.',
    pwTrick: 'EduPlus Redox Gold Rule: The substance that gets oxidized is ALWAYS the reducing agent! Since H₂ gains O → oxidized ⇒ H₂ is reducing agent.',
    videoSolution: {
      instructor: 'EduPlus Chemistry Faculty',
      title: 'Mastering Redox: Identifying Oxidized, Reduced, and Agents',
      duration: '3m 05s',
      timestamps: [
        { time: '0:00', label: 'Definition of Oxidation & Reduction' },
        { time: '1:10', label: 'Agent vs Substance trick' },
        { time: '2:00', label: 'Cross-verifying with oxidation numbers' }
      ],
      whiteboardNotes: [
        'Oxidation: Gain of O / Loss of H / Increase in O.N.',
        'Reduction: Loss of O / Gain of H / Decrease in O.N.',
        'Redox Pair: Substance Oxidized = Reducing Agent'
      ]
    }
  },
  {
    id: 'pw_q_06',
    type: 'mcq',
    chapterId: 'chem_10_02',
    chapterName: 'Acids, Bases and Salts',
    subject: 'Chemistry',
    conceptName: 'pH Scale & Logarithmic Hydronium Concentration',
    pageRef: 'NCERT Chemistry Class 10, Ch 2, Page 26',
    difficulty: 'hard',
    bloomLevel: 'Apply',
    marks: 4,
    estimatedTimeSec: 65,
    avgTimeSec: 78,
    topperTimeSec: 35,
    question: 'Solution A has a pH of 3 and Solution B has a pH of 6. How many times higher is the hydronium ion concentration [H₃O⁺] in Solution A compared to Solution B?',
    options: [
      { id: 'opt_1', text: '2 times' },
      { id: 'opt_2', text: '3 times' },
      { id: 'opt_3', text: '100 times' },
      { id: 'opt_4', text: '1000 times' }
    ],
    correctAnswer: '1000 times',
    explanation: 'The pH scale is logarithmic: pH = -log₁₀[H⁺]. For Solution A, [H⁺] = 10⁻³ M. For Solution B, [H⁺] = 10⁻⁶ M. Ratio [H⁺]_A / [H⁺]_B = 10⁻³ / 10⁻⁶ = 10³ = 1000. Therefore, Solution A is 1000 times more acidic than Solution B.',
    pwTrick: 'EduPlus Logarithm Trick: Difference in pH units ΔpH = 6 - 3 = 3. Each unit is a factor of 10. So 10^(ΔpH) = 10³ = 1000 times! Never subtract pH linearly!',
    videoSolution: {
      instructor: 'EduPlus Chemistry Faculty',
      title: 'pH Calculations: Logarithmic Factor Tricks',
      duration: '2m 50s',
      timestamps: [
        { time: '0:00', label: 'Understanding pH = -log[H+]' },
        { time: '1:00', label: '10^ΔpH rule' },
        { time: '1:50', label: 'Dilution and buffer examples' }
      ],
      whiteboardNotes: [
        'pH = -log₁₀[H₃O⁺]',
        '[H⁺] = 10^(-pH)',
        'ΔpH = 1 ⇒ 10x, ΔpH = 2 ⇒ 100x, ΔpH = 3 ⇒ 1000x'
      ]
    }
  },
  {
    id: 'pw_q_07',
    type: 'mcq',
    chapterId: 'chem_10_03',
    chapterName: 'Metals and Non-metals',
    subject: 'Chemistry',
    conceptName: 'Thermite Process & Amphoteric Oxides',
    pageRef: 'NCERT Chemistry Class 10, Ch 3, Page 45',
    difficulty: 'medium',
    bloomLevel: 'Understand',
    marks: 4,
    estimatedTimeSec: 50,
    avgTimeSec: 55,
    topperTimeSec: 20,
    question: 'Which of the following pairs of oxides are both AMPHOTERIC, reacting with both acids and bases to yield salt and water?',
    options: [
      { id: 'opt_1', text: 'Na₂O and K₂O' },
      { id: 'opt_2', text: 'Al₂O₃ and ZnO' },
      { id: 'opt_3', text: 'CO₂ and SO₂' },
      { id: 'opt_4', text: 'CaO and MgO' }
    ],
    correctAnswer: 'Al₂O₃ and ZnO',
    explanation: 'Most metallic oxides are basic, but Aluminium oxide (Al₂O₃) and Zinc oxide (ZnO) exhibit both acidic as well as basic behavior. Hence they are called amphoteric oxides (e.g. Al₂O₃ + 6HCl → 2AlCl₃ + 3H₂O and Al₂O₃ + 2NaOH → 2NaAlO₂ + H₂O).',
    pwTrick: 'EduPlus Mnemonics: "Ali aur Zan" = Aluminium & Zinc oxides are Amphoteric! Memorize this keyword for instant answer on any board or competitive exam.',
    videoSolution: {
      instructor: 'EduPlus Chemistry Faculty',
      title: 'Amphoteric Oxides: Reactions with HCl and NaOH',
      duration: '2m 30s',
      timestamps: [
        { time: '0:00', label: 'Definition of Amphoteric' },
        { time: '1:05', label: 'Sodium Aluminate & Zincate equations' },
        { time: '1:55', label: 'Summary table' }
      ],
      whiteboardNotes: [
        'Amphoteric Oxides: React with both Acid and Base',
        'Key Examples: Al₂O₃, ZnO, PbO, SnO',
        'Product with NaOH: NaAlO₂ (Sodium aluminate) + H₂O'
      ]
    }
  },

  // ── Mathematics / Biology (Q8 - Q10) ──
  {
    id: 'pw_q_08',
    type: 'mcq',
    chapterId: 'bio_10_06',
    chapterName: 'Life Processes & Plant Physiology',
    subject: 'Biology',
    conceptName: 'Xylem Transpiration Pull & Guard Cells',
    pageRef: 'NCERT Biology Class 10, Ch 6, Page 108',
    difficulty: 'medium',
    bloomLevel: 'Understand',
    marks: 4,
    estimatedTimeSec: 45,
    avgTimeSec: 50,
    topperTimeSec: 22,
    question: 'The major driving force in the movement of water in the xylem during the daytime is:',
    options: [
      { id: 'opt_1', text: 'Root pressure alone' },
      { id: 'opt_2', text: 'Transpiration pull generated by water evaporation from stomata' },
      { id: 'opt_3', text: 'Active translocation via companion cells' },
      { id: 'opt_4', text: 'Gravitational potential gradient' }
    ],
    correctAnswer: 'Transpiration pull generated by water evaporation from stomata',
    explanation: 'During the daytime when stomata are open, the loss of water in the form of vapor from the aerial parts of the plant (transpiration) creates a suction force called transpiration pull, which draws water up through the xylem vessels of the entire tall plant.',
    pwTrick: 'EduPlus Day vs Night Rule: Day = Transpiration Pull (Suction); Night = Root Pressure (Push). Always check if the question mentions daytime or night!',
    videoSolution: {
      instructor: 'EduPlus Biology Faculty',
      title: 'Water Transportation in Plants: Transpiration Pull vs Root Pressure',
      duration: '3m 15s',
      timestamps: [
        { time: '0:00', label: 'Cohesion-Tension Theory' },
        { time: '1:15', label: 'Why stomata open in daytime' },
        { time: '2:20', label: 'Day vs Night exam distinction' }
      ],
      whiteboardNotes: [
        'Xylem transports Water and Minerals',
        'Daytime primary force: Transpiration Pull (Suction)',
        'Nighttime primary force: Root Pressure (Hydrostatic push)'
      ]
    }
  },
  {
    id: 'pw_q_09',
    type: 'mcq',
    chapterId: 'math_10_04',
    chapterName: 'Quadratic Equations & Roots',
    subject: 'Mathematics',
    conceptName: 'Discriminant & Nature of Roots',
    pageRef: 'NCERT Mathematics Class 10, Ch 4, Page 88',
    difficulty: 'hard',
    bloomLevel: 'Apply',
    marks: 4,
    estimatedTimeSec: 65,
    avgTimeSec: 75,
    topperTimeSec: 30,
    question: 'For what positive value of k does the quadratic equation 2x² + kx + 8 = 0 have two equal real roots?',
    options: [
      { id: 'opt_1', text: '4' },
      { id: 'opt_2', text: '8' },
      { id: 'opt_3', text: '16' },
      { id: 'opt_4', text: '64' }
    ],
    correctAnswer: '8',
    explanation: 'For a quadratic equation ax² + bx + c = 0 to have equal real roots, the discriminant D must be zero: D = b² - 4ac = 0. Here a = 2, b = k, c = 8. So k² - 4(2)(8) = 0 ⇒ k² - 64 = 0 ⇒ k² = 64 ⇒ k = ±8. Since positive value is asked, k = 8.',
    pwTrick: 'EduPlus Mental Calculation: For 2x² + kx + 8 = 0, D = k² - 4(2)(8) = k² - 64 = 0 ⇒ k = √64 = 8 in 10 seconds!',
    videoSolution: {
      instructor: 'EduPlus Maths Faculty',
      title: 'Nature of Roots: Equal Roots Condition & Common Sign Traps',
      duration: '2m 40s',
      timestamps: [
        { time: '0:00', label: 'Discriminant Formula D = b² - 4ac' },
        { time: '1:00', label: 'Setting D = 0 for equal roots' },
        { time: '1:50', label: 'Positive vs negative root trap' }
      ],
      whiteboardNotes: [
        'Equal real roots ⇒ D = 0',
        'k² = 4ac = 4 * 2 * 8 = 64',
        'k = ±8, Question specifies positive ⇒ k = +8'
      ]
    }
  },
  {
    id: 'pw_q_10',
    type: 'mcq',
    chapterId: 'phy_10_12',
    chapterName: 'Electricity & Circuit Theory',
    subject: 'Physics',
    conceptName: 'Internal Resistance & Maximum Power Transfer',
    pageRef: 'NCERT Physics Class 10, Ch 12, Page 214',
    difficulty: 'hard',
    bloomLevel: 'Evaluate',
    marks: 4,
    estimatedTimeSec: 75,
    avgTimeSec: 90,
    topperTimeSec: 38,
    question: 'Three identical resistors of 6 Ω each are connected. Which of the following equivalent resistances is IMPOSSIBLE to achieve with any combination of these three resistors?',
    options: [
      { id: 'opt_1', text: '18 Ω' },
      { id: 'opt_2', text: '9 Ω' },
      { id: 'opt_3', text: '4 Ω' },
      { id: 'opt_4', text: '12 Ω' }
    ],
    correctAnswer: '12 Ω',
    explanation: 'There are only 4 possible configurations for 3 identical 6 Ω resistors: (1) All 3 in series: 6 + 6 + 6 = 18 Ω. (2) All 3 in parallel: 6 / 3 = 2 Ω. (3) 2 in parallel, in series with 1: (6||6) + 6 = 3 + 6 = 9 Ω. (4) 2 in series, in parallel with 1: (6+6)||6 = 12||6 = (12*6)/(12+6) = 4 Ω. Therefore, 12 Ω is completely impossible to achieve.',
    pwTrick: 'EduPlus Permutation Check: 3 identical resistors can only form 4 unique values: 3R (18), R/3 (2), 3R/2 (9), and 2R/3 (4). 12 Ω is not in this set, so it is impossible!',
    videoSolution: {
      instructor: 'Alakh Sir (Physics Dept)',
      title: '3-Resistor Combinations: The 4 Fixed Value Theorems',
      duration: '3m 20s',
      timestamps: [
        { time: '0:00', label: 'Listing all 4 topological permutations' },
        { time: '1:20', label: 'Series-parallel and parallel-series math' },
        { time: '2:30', label: 'Elimination technique for JEE/NEET' }
      ],
      whiteboardNotes: [
        '3 identical resistors R can only give 4 values:',
        '1) 3R = 18 Ω',
        '2) R/3 = 2 Ω',
        '3) 3R/2 = 9 Ω',
        '4) 2R/3 = 4 Ω',
        '12 Ω is impossible!'
      ]
    }
  }
];

export const DEFAULT_PW_EXAM: ExamModel = {
  id: 'pw_test_6a7aa8fddbe819551c937691',
  userId: 'user_pw_student',
  title: 'EduPlus All-India Practice Test Series (AITS) - Physics, Chemistry & Math Mock 04',
  totalMarks: 40,
  timeLimitMinutes: 45,
  createdAt: new Date().toISOString(),
  config: {
    title: 'EduPlus All-India Practice Test Series (AITS)',
    sourceBookIds: ['pw_book_jee_neet'],
    sourceChapterIds: ['all'],
    totalQuestions: 10,
    totalMarks: 40,
    questionTypes: ['mcq'],
    difficultyMode: 'custom',
    difficultyMix: { easy: 20, medium: 50, hard: 30 },
    timeLimitMinutes: 45,
    negativeMarking: true,
    negativeMarkingValue: 1,
    language: 'English',
    focusOnWeakChapters: false
  },
  questions: PW_SAMPLE_QUESTIONS
};

export const DEFAULT_PW_ATTEMPT: AttemptModel = {
  id: 'att_pw_6a7aa8fddbe819551c937691',
  examId: DEFAULT_PW_EXAM.id,
  userId: 'user_pw_student',
  startedAt: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
  submittedAt: new Date().toISOString(),
  score: 27, // 7 correct (+28), 1 incorrect (-1), 2 unattempted (0)
  total: 40,
  timeSpentSeconds: 32 * 60 + 15,
  status: 'submitted',
  createdAt: new Date().toISOString(),
  answers: [
    {
      id: 'ans_1',
      attemptId: 'att_pw_6a7aa8fddbe819551c937691',
      questionId: 'pw_q_01',
      answer: '25',
      isCorrect: true,
      marksAwarded: 4,
      timeSpentSec: 28,
      timesChanged: 0,
      markedReview: false,
      difficultyScore: 18,
      aiFeedback: 'Excellent! Applied the n² shortcut formula immediately.'
    },
    {
      id: 'ans_2',
      attemptId: 'att_pw_6a7aa8fddbe819551c937691',
      questionId: 'pw_q_02',
      answer: 'At the Centre of Curvature (C)',
      isCorrect: true,
      marksAwarded: 4,
      timeSpentSec: 20,
      timesChanged: 0,
      markedReview: false,
      difficultyScore: 12,
      aiFeedback: 'Accurate recall of concave mirror optics.'
    },
    {
      id: 'ans_3',
      attemptId: 'att_pw_6a7aa8fddbe819551c937691',
      questionId: 'pw_q_03',
      answer: '50 W', // incorrect! selected 50 W instead of 25 W
      isCorrect: false,
      marksAwarded: -1,
      timeSpentSec: 92,
      timesChanged: 2,
      markedReview: true,
      difficultyScore: 78,
      aiFeedback: 'Common error: Divided linearly by 2 instead of quadratic (1/4) for P = V²/R.'
    },
    {
      id: 'ans_4',
      attemptId: 'att_pw_6a7aa8fddbe819551c937691',
      questionId: 'pw_q_04',
      answer: 'Dark / Black, because there would be no particles to scatter sunlight',
      isCorrect: true,
      marksAwarded: 4,
      timeSpentSec: 44,
      timesChanged: 1,
      markedReview: false,
      difficultyScore: 25,
      aiFeedback: 'Solid understanding of Rayleigh scattering requirements.'
    },
    {
      id: 'ans_5',
      attemptId: 'att_pw_6a7aa8fddbe819551c937691',
      questionId: 'pw_q_05',
      answer: 'H₂ is oxidized, H₂ is reducing agent',
      isCorrect: true,
      marksAwarded: 4,
      timeSpentSec: 36,
      timesChanged: 0,
      markedReview: false,
      difficultyScore: 22,
      aiFeedback: 'Correct identification of oxidized species and reducing agent.'
    },
    {
      id: 'ans_6',
      attemptId: 'att_pw_6a7aa8fddbe819551c937691',
      questionId: 'pw_q_06',
      answer: '', // unattempted
      isCorrect: false,
      marksAwarded: 0,
      timeSpentSec: 15,
      timesChanged: 0,
      markedReview: true,
      difficultyScore: 40,
      aiFeedback: 'Unattempted. Revisit logarithmic pH concentration relationship.'
    },
    {
      id: 'ans_7',
      attemptId: 'att_pw_6a7aa8fddbe819551c937691',
      questionId: 'pw_q_07',
      answer: 'Al₂O₃ and ZnO',
      isCorrect: true,
      marksAwarded: 4,
      timeSpentSec: 25,
      timesChanged: 0,
      markedReview: false,
      difficultyScore: 16,
      aiFeedback: 'Mastered amphoteric oxides definition.'
    },
    {
      id: 'ans_8',
      attemptId: 'att_pw_6a7aa8fddbe819551c937691',
      questionId: 'pw_q_08',
      answer: 'Transpiration pull generated by water evaporation from stomata',
      isCorrect: true,
      marksAwarded: 4,
      timeSpentSec: 29,
      timesChanged: 0,
      markedReview: false,
      difficultyScore: 19,
      aiFeedback: 'Clear distinction between daytime transpiration pull and night root pressure.'
    },
    {
      id: 'ans_9',
      attemptId: 'att_pw_6a7aa8fddbe819551c937691',
      questionId: 'pw_q_09',
      answer: '8',
      isCorrect: true,
      marksAwarded: 4,
      timeSpentSec: 42,
      timesChanged: 1,
      markedReview: false,
      difficultyScore: 30,
      aiFeedback: 'Accurately solved D = b² - 4ac = 0 and selected positive root.'
    },
    {
      id: 'ans_10',
      attemptId: 'att_pw_6a7aa8fddbe819551c937691',
      questionId: 'pw_q_10',
      answer: '', // unattempted
      isCorrect: false,
      marksAwarded: 0,
      timeSpentSec: 22,
      timesChanged: 0,
      markedReview: false,
      difficultyScore: 45,
      aiFeedback: 'Unattempted. Try practicing circuit topology permutations.'
    }
  ]
};

export const PW_TOPPERS_LIST: PwTopperItem[] = [
  {
    rank: 1,
    name: 'Aryan Gupta',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    score: 40,
    maxScore: 40,
    percentage: 100,
    accuracy: 100,
    timeSpentSec: 24 * 60 + 10,
    city: 'Kota, Rajasthan'
  },
  {
    rank: 2,
    name: 'Sneha Kulkarni',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces',
    score: 39,
    maxScore: 40,
    percentage: 97.5,
    accuracy: 96,
    timeSpentSec: 26 * 60 + 35,
    city: 'Pune, Maharashtra'
  },
  {
    rank: 3,
    name: 'Devansh Verma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    score: 36,
    maxScore: 40,
    percentage: 90,
    accuracy: 92,
    timeSpentSec: 28 * 60 + 12,
    city: 'Lucknow, Uttar Pradesh'
  },
  {
    rank: 4,
    name: 'Ishita Sen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
    score: 35,
    maxScore: 40,
    percentage: 87.5,
    accuracy: 90,
    timeSpentSec: 29 * 60 + 40,
    city: 'Kolkata, West Bengal'
  },
  {
    rank: 5,
    name: 'Aarav Sharma (You)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
    score: 27,
    maxScore: 40,
    percentage: 67.5,
    accuracy: 87.5,
    timeSpentSec: 32 * 60 + 15,
    city: 'Delhi, NCR',
    isCurrentUser: true
  },
  {
    rank: 6,
    name: 'Tanvi Reddy',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces',
    score: 26,
    maxScore: 40,
    percentage: 65,
    accuracy: 85,
    timeSpentSec: 34 * 60 + 20,
    city: 'Hyderabad, Telangana'
  },
  {
    rank: 7,
    name: 'Manish Rawat',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=faces',
    score: 25,
    maxScore: 40,
    percentage: 62.5,
    accuracy: 80,
    timeSpentSec: 36 * 60 + 5,
    city: 'Dehradun, Uttarakhand'
  },
  {
    rank: 8,
    name: 'Pooja Iyer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces',
    score: 24,
    maxScore: 40,
    percentage: 60,
    accuracy: 78,
    timeSpentSec: 37 * 60 + 45,
    city: 'Chennai, Tamil Nadu'
  }
];
