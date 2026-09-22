import { BoardType, Question } from '../types';

export interface ChapterInfo {
  id: string;
  name: string;
  recommendedMarks: number;
  topics: string[];
  keyCompetencies: string[];
}

export interface SubjectInfo {
  name: string;
  chapters: ChapterInfo[];
}

export interface CurriculumHierarchy {
  [board: string]: {
    [grade: number]: {
      [subject: string]: ChapterInfo[];
    };
  };
}

export const CURRICULUM_DATA: CurriculumHierarchy = {
  'CBSE': {
    10: {
      'Science': [
        {
          id: 'sci_10_01',
          name: 'Chemical Reactions and Equations',
          recommendedMarks: 6,
          topics: ['Balancing chemical equations', 'Types of chemical reactions (Combination, Decomposition, Displacement, Redox)', 'Corrosion & Rancidity'],
          keyCompetencies: ['Understanding', 'Application', 'Analysis']
        },
        {
          id: 'sci_10_02',
          name: 'Acids, Bases and Salts',
          recommendedMarks: 7,
          topics: ['Properties of acids and bases', 'pH scale importance', 'Preparation & uses of Bleaching Powder, Baking Soda, Plaster of Paris'],
          keyCompetencies: ['Recall', 'Application']
        },
        {
          id: 'sci_10_03',
          name: 'Metals and Non-metals',
          recommendedMarks: 8,
          topics: ['Reactivity series', 'Ionic compound properties', 'Metallurgy and corrosion prevention'],
          keyCompetencies: ['Analysis', 'Reasoning']
        },
        {
          id: 'sci_10_06',
          name: 'Life Processes',
          recommendedMarks: 9,
          topics: ['Autotrophic & Heterotrophic Nutrition', 'Respiration (Aerobic vs Anaerobic)', 'Transportation in humans & plants', 'Excretion in humans'],
          keyCompetencies: ['Conceptual Clarity', 'Diagrammatic Analysis']
        },
        {
          id: 'sci_10_10',
          name: 'Light – Reflection and Refraction',
          recommendedMarks: 10,
          topics: ['Mirror formula & magnification', 'Refraction through glass slab', 'Lens formula & power of lens', 'Ray diagrams'],
          keyCompetencies: ['Numerical Problem Solving', 'Ray Diagram Construction']
        },
        {
          id: 'sci_10_12',
          name: 'Electricity',
          recommendedMarks: 10,
          topics: ["Ohm's Law", 'Resistors in series and parallel', "Joule's Law of Heating", 'Electric Power and cost calculation'],
          keyCompetencies: ['Circuit Calculation', 'Application']
        },
        {
          id: 'sci_10_13',
          name: 'Magnetic Effects of Electric Current',
          recommendedMarks: 6,
          topics: ['Magnetic field lines', "Right-hand thumb rule", "Fleming's Left-hand rule", 'Domestic electric circuits'],
          keyCompetencies: ['Conceptual Application', 'Rule Analysis']
        }
      ],
      'Mathematics': [
        {
          id: 'math_10_01',
          name: 'Real Numbers',
          recommendedMarks: 6,
          topics: ['Fundamental Theorem of Arithmetic', 'Proof of irrationality of √2, √3, √5'],
          keyCompetencies: ['Deductive Reasoning', 'Proof Construction']
        },
        {
          id: 'math_10_02',
          name: 'Polynomials',
          recommendedMarks: 6,
          topics: ['Zeroes of a polynomial', 'Relationship between zeroes and coefficients of quadratic polynomials'],
          keyCompetencies: ['Algebraic Manipulation', 'Graph Analysis']
        },
        {
          id: 'math_10_04',
          name: 'Quadratic Equations',
          recommendedMarks: 8,
          topics: ['Standard form', 'Factoring & Quadratic Formula', 'Nature of roots (Discriminant)'],
          keyCompetencies: ['Word Problem Formulation', 'Calculations']
        },
        {
          id: 'math_10_05',
          name: 'Arithmetic Progressions',
          recommendedMarks: 7,
          topics: ['nth term of an A.P.', 'Sum of first n terms of an A.P.', 'Daily life word problems'],
          keyCompetencies: ['Pattern Recognition', 'Application']
        },
        {
          id: 'math_10_08',
          name: 'Introduction to Trigonometry',
          recommendedMarks: 9,
          topics: ['Trigonometric ratios', 'Values of ratios at 0°, 30°, 45°, 60°, 90°', 'Trigonometric identities (sin²θ + cos²θ = 1)'],
          keyCompetencies: ['Identity Proofs', 'Evaluation']
        },
        {
          id: 'math_10_14',
          name: 'Statistics & Probability',
          recommendedMarks: 11,
          topics: ['Mean, Median, Mode of grouped data', 'Empirical relationship', 'Classical definition of probability'],
          keyCompetencies: ['Data Interpretation', 'Calculations']
        }
      ],
      'Social Science': [
        {
          id: 'sst_10_01',
          name: 'The Rise of Nationalism in Europe',
          recommendedMarks: 6,
          topics: ['French Revolution & the Idea of the Nation', 'Unification of Germany & Italy', 'Visualizing the Nation'],
          keyCompetencies: ['Historical Analysis', 'Chronology']
        },
        {
          id: 'sst_10_02',
          name: 'Nationalism in India',
          recommendedMarks: 8,
          topics: ['Non-Cooperation Movement', 'Civil Disobedience Movement', 'Sense of Collective Belonging'],
          keyCompetencies: ['Source Analysis', 'Significance Evaluation']
        },
        {
          id: 'sst_10_03',
          name: 'Resources and Development',
          recommendedMarks: 6,
          topics: ['Types of resources', 'Resource planning in India', 'Land degradation and conservation'],
          keyCompetencies: ['Environmental Assessment', 'Application']
        },
        {
          id: 'sst_10_04',
          name: 'Power Sharing & Federalism',
          recommendedMarks: 7,
          topics: ['Belgium vs Sri Lanka models', 'Key features of Federalism', 'Decentralization in India'],
          keyCompetencies: ['Comparative Analysis', 'Civic Principles']
        }
      ]
    },
    9: {
      'Science': [
        {
          id: 'sci_9_01',
          name: 'Matter in Our Surroundings',
          recommendedMarks: 8,
          topics: ['States of Matter', 'Evaporation and factors affecting it', 'Latent heat'],
          keyCompetencies: ['Conceptual Understanding']
        },
        {
          id: 'sci_9_05',
          name: 'The Fundamental Unit of Life',
          recommendedMarks: 9,
          topics: ['Cell structure & organelles', 'Prokaryotic vs Eukaryotic cells', 'Osmosis & Diffusion'],
          keyCompetencies: ['Microscopic Analysis', 'Recall']
        },
        {
          id: 'sci_9_08',
          name: 'Motion & Laws of Motion',
          recommendedMarks: 12,
          topics: ['Equations of motion by graphical method', "Newton's 3 Laws", 'Conservation of Momentum'],
          keyCompetencies: ['Graphical Derivation', 'Calculations']
        }
      ],
      'Mathematics': [
        {
          id: 'math_9_01',
          name: 'Number Systems',
          recommendedMarks: 8,
          topics: ['Rational & Irrational numbers', 'Rationalisation of denominators', 'Laws of Exponents'],
          keyCompetencies: ['Computation', 'Logic']
        },
        {
          id: 'math_9_07',
          name: 'Triangles & Quadrilaterals',
          recommendedMarks: 10,
          topics: ['Congruence criteria (SAS, ASA, AAS, SSS, RHS)', 'Properties of Parallelograms'],
          keyCompetencies: ['Geometric Proofs', 'Deductive Logic']
        }
      ]
    },
    12: {
      'Physics': [
        {
          id: 'phy_12_01',
          name: 'Electrostatics & Electric Potential',
          recommendedMarks: 10,
          topics: ["Coulomb's Law", 'Electric Field lines & Gauss Law', 'Capacitors and energy stored'],
          keyCompetencies: ['Calculations', 'Derivations']
        },
        {
          id: 'phy_12_04',
          name: 'Electromagnetic Induction & AC',
          recommendedMarks: 10,
          topics: ["Faraday's & Lenz's Law", 'AC Generator & Transformers', 'LCR series circuit resonance'],
          keyCompetencies: ['Phase Diagrams', 'Analytical Reasoning']
        },
        {
          id: 'phy_12_09',
          name: 'Ray Optics and Optical Instruments',
          recommendedMarks: 12,
          topics: ['Total Internal Reflection & applications', 'Lens Maker formula', 'Astronomical Telescope & Microscope'],
          keyCompetencies: ['Derivation', 'Diagram Analysis']
        }
      ]
    }
  },
  'ICSE': {
    10: {
      'Physics': [
        {
          id: 'icse_phy_10_01',
          name: 'Force, Work, Power and Energy',
          recommendedMarks: 10,
          topics: ['Turning effect of force (Moment)', 'Equilibrium of bodies', 'Principle of Conservation of Energy'],
          keyCompetencies: ['Analytical Problem Solving', 'Formulas']
        },
        {
          id: 'icse_phy_10_02',
          name: 'Light: Refraction at Plane Surfaces & Lenses',
          recommendedMarks: 12,
          topics: ['Refraction through prism & critical angle', 'Total Internal Reflection in prisms', 'Power and sign convention of lenses'],
          keyCompetencies: ['Ray Diagrams', 'Calculations']
        },
        {
          id: 'icse_phy_10_03',
          name: 'Sound & Current Electricity',
          recommendedMarks: 12,
          topics: ['Echoes and determination of speed of sound', 'Internal resistance of cell & terminal voltage', 'Household wiring and ring system'],
          keyCompetencies: ['Application', 'Numerical Analysis']
        }
      ],
      'Mathematics': [
        {
          id: 'icse_math_10_01',
          name: 'Commercial Mathematics (GST & Banking)',
          recommendedMarks: 10,
          topics: ['GST computation (Intra-state & Inter-state)', 'Recurring Deposit Account Interest'],
          keyCompetencies: ['Financial Math', 'Exact Calculation']
        },
        {
          id: 'icse_math_10_02',
          name: 'Algebra (Matrices & Coordinate Geometry)',
          recommendedMarks: 12,
          topics: ['Matrix multiplication & order', 'Section & Midpoint Formula', 'Equation of a line'],
          keyCompetencies: ['Matrix Algebra', 'Geometric Analysis']
        }
      ]
    }
  }
};

export const SAMPLE_QUESTIONS_BANK: Question[] = [
  {
    id: 'q_cbse_sci_01',
    chapter: 'Light – Reflection and Refraction',
    type: 'mcq',
    marks: 1,
    difficulty: 'easy',
    bloomsLevel: 'Understand',
    questionText: 'An object is placed at a distance of 15 cm in front of a concave mirror of focal length 10 cm. The image formed will be:',
    options: [
      { id: 'opt_1', text: 'Real, inverted and magnified', isCorrect: true },
      { id: 'opt_2', text: 'Real, inverted and diminished', isCorrect: false },
      { id: 'opt_3', text: 'Virtual, erect and magnified', isCorrect: false },
      { id: 'opt_4', text: 'Virtual, erect and diminished', isCorrect: false }
    ],
    correctAnswer: 'Real, inverted and magnified',
    explanation: 'Since the object is placed between the Focus (F = 10 cm) and the Centre of Curvature (C = 20 cm), the concave mirror forms a real, inverted and magnified image beyond C.'
  },
  {
    id: 'q_cbse_sci_02',
    chapter: 'Electricity',
    type: 'short_answer',
    marks: 3,
    difficulty: 'medium',
    bloomsLevel: 'Apply',
    questionText: 'A piece of wire having resistance R is cut into five equal parts. These parts are then connected in parallel. If the equivalent resistance of this combination is R\', calculate the ratio R / R\'.',
    markingScheme: '1 mark for identifying resistance of each piece as R/5. 1 mark for parallel equivalent formula (1/R\' = 5 / (R/5) = 25/R). 1 mark for final ratio R/R\' = 25.',
    sampleAnswer: 'When the wire of resistance R is cut into 5 equal parts, the resistance of each part becomes r = R/5. In parallel connection: 1/R\' = 1/r + 1/r + 1/r + 1/r + 1/r = 5/r = 5/(R/5) = 25/R. Therefore, R\' = R/25, which gives the ratio R/R\' = 25.',
    rubric: [
      { id: 'r1', criterion: 'Resistance of each section identified', maxMarks: 1, description: 'Correctly states r = R/5' },
      { id: 'r2', criterion: 'Parallel formula application', maxMarks: 1, description: 'Applies 1/R_eq = sum of 1/r' },
      { id: 'r3', criterion: 'Final simplified ratio', maxMarks: 1, description: 'R/R\' = 25' }
    ]
  },
  {
    id: 'q_cbse_sci_03',
    chapter: 'Chemical Reactions and Equations',
    type: 'assertion_reason',
    marks: 1,
    difficulty: 'medium',
    bloomsLevel: 'Analyze',
    questionText: 'Assertion (A): Silver chloride turns grey when exposed to sunlight for some time.\nReason (R): It undergoes a photochemical decomposition reaction to produce silver metal and chlorine gas.',
    options: [
      { id: 'opt_a1', text: 'Both (A) and (R) are true and (R) is the correct explanation of (A)', isCorrect: true },
      { id: 'opt_a2', text: 'Both (A) and (R) are true but (R) is NOT the correct explanation of (A)', isCorrect: false },
      { id: 'opt_a3', text: '(A) is true but (R) is false', isCorrect: false },
      { id: 'opt_a4', text: '(A) is false but (R) is true', isCorrect: false }
    ],
    correctAnswer: 'Both (A) and (R) are true and (R) is the correct explanation of (A)',
    explanation: '2AgCl(s) --[Sunlight]--> 2Ag(s) + Cl2(g). White silver chloride decomposes into grey silver metal in presence of sunlight.'
  },
  {
    id: 'q_cbse_sci_04',
    chapter: 'Life Processes',
    type: 'long_answer',
    marks: 5,
    difficulty: 'hard',
    bloomsLevel: 'Evaluate',
    questionText: 'Explain the mechanism of double circulation in human beings with a schematic pathway diagram. Why is double circulation necessary in mammals and birds?',
    markingScheme: '2 marks for explaining pulmonary circulation. 2 marks for systemic circulation. 1 mark for justifying high energy & separation of oxygenated/deoxygenated blood for warm-blooded thermoregulation.',
    sampleAnswer: 'Double circulation consists of two distinct pathways: (1) Pulmonary Circulation: Deoxygenated blood is pumped from the right ventricle via pulmonary artery to lungs for oxygenation, and returns as oxygenated blood via pulmonary veins to left atrium. (2) Systemic Circulation: Oxygenated blood from left ventricle is pumped through the aorta to tissues, and deoxygenated blood is collected via vena cava back to right atrium. Necessity: Mammals and birds are warm-blooded (endothermic) and need constant high energy to maintain stable body temperature; separating oxygenated and deoxygenated blood ensures highly efficient oxygen supply.',
    rubric: [
      { id: 'r1', criterion: 'Pulmonary Circuit Explanation', maxMarks: 2, description: 'Accurate flow from right ventricle to lungs to left atrium' },
      { id: 'r2', criterion: 'Systemic Circuit Explanation', maxMarks: 2, description: 'Accurate flow from left ventricle to tissues to right atrium' },
      { id: 'r3', criterion: 'Endothermic Justification', maxMarks: 1, description: 'Explains requirement for constant body temperature and peak metabolic efficiency' }
    ]
  }
];
