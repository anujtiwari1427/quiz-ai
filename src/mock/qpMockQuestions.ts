export interface BankQuestion {
  id: string;
  question: string;
  options?: string[] | null;
  answer: string;
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'mcq' | 'short' | 'long' | 'fill' | 'case_study';
  marks: number;
  tags?: string[];
  imageUrl?: string;
}

export interface PaperSection {
  id: string;
  title: string;
  questionIds: string[];
}

export interface PaperMeta {
  school: string;
  exam: string;
  subject: string;
  grade: string;
  time: string;
  targetMarks: number;
  instructions: string[];
}

export const DEFAULT_PAPER_META: PaperMeta = {
  school: "Apex Academy of Sciences",
  exam: "Terminal Examination 2026",
  subject: "General Science & Mathematics",
  grade: "Class X",
  time: "3 Hours",
  targetMarks: 80,
  instructions: [
    "All questions are compulsory unless internal choice is specified.",
    "Section A contains Multiple Choice Questions (1 mark each).",
    "Section B contains Short Answer Questions (2 or 3 marks each).",
    "Section C contains Long Answer & Analytical Questions (5 marks each).",
    "Section D contains Integrated Case Study Questions.",
    "Use of calculators is strictly prohibited. Write clean and legible steps."
  ]
};

export const DEFAULT_PAPER_SECTIONS: PaperSection[] = [
  {
    id: "sec-1",
    title: "Section A — Objective & Multiple Choice Questions",
    questionIds: ["mock-1", "mock-3", "mock-8", "mock-11"]
  },
  {
    id: "sec-2",
    title: "Section B — Short Answer Questions",
    questionIds: ["mock-6", "mock-7", "mock-10", "mock-13"]
  },
  {
    id: "sec-3",
    title: "Section C — Long Answer & Comprehensive Questions",
    questionIds: ["mock-2", "mock-4", "mock-12"]
  }
];

export const QP_MOCK_QUESTIONS: BankQuestion[] = [
  {
    id: "mock-1",
    question: "Which of the following elements has the highest electronegativity on the Pauling scale?",
    options: ["Oxygen", "Fluorine", "Chlorine", "Nitrogen"],
    answer: "Fluorine (Electronegativity = 3.98)",
    subject: "Chemistry",
    topic: "Periodic Classification",
    difficulty: "easy",
    type: "mcq",
    marks: 1,
    tags: ["periodic-table", "inorganic"]
  },
  {
    id: "mock-2",
    question: "Describe the process of photosynthesis, detailing the light-dependent and light-independent (Calvin cycle) reactions.",
    options: null,
    answer: "Photosynthesis occurs in two major stages:\n1. Light-dependent reactions (in thylakoid membranes): Chlorophyll absorbs light energy, photolyzes water (2H2O -> 4H+ + 4e- + O2), and generates ATP and NADPH.\n2. Light-independent reactions / Calvin Cycle (in chloroplast stroma): RuBisCO fixes CO2 into 3-PGA, reduced using ATP and NADPH into glyceraldehyde-3-phosphate (G3P) and subsequently glucose.",
    subject: "Biology",
    topic: "Plant Physiology",
    difficulty: "medium",
    type: "long",
    marks: 5,
    tags: ["chloroplast", "bio-energetics"]
  },
  {
    id: "mock-3",
    question: "Solve the quadratic equation: x² - 5x + 6 = 0.",
    options: ["x = 2, 3", "x = -2, -3", "x = 1, 6", "x = -1, -6"],
    answer: "x = 2, 3 (Factorizing gives (x - 2)(x - 3) = 0 => x = 2 or x = 3)",
    subject: "Mathematics",
    topic: "Quadratic Equations",
    difficulty: "easy",
    type: "mcq",
    marks: 1,
    tags: ["algebra", "polynomials"]
  },
  {
    id: "mock-4",
    question: "State and prove Gauss's Law in electrostatics. Derive the electric field due to an infinitely long straight charged wire.",
    options: null,
    answer: "Statement: The total electric flux through any closed Gaussian surface in vacuum is equal to 1/ε₀ times the total electric charge enclosed: ∮ E·dA = Q_enc / ε₀.\nProof for long wire: Choosing a coaxial cylindrical Gaussian surface of radius r and length L, flux through curved surface = E(2πrL) = λL/ε₀. Therefore, E = λ / (2πε₀r) pointing radially outwards.",
    subject: "Physics",
    topic: "Electrostatics",
    difficulty: "hard",
    type: "long",
    marks: 5,
    tags: ["electromagnetism", "derivation"]
  },
  {
    id: "mock-5",
    question: "The Treaty of Versailles, signed in 1919, officially concluded which major global conflict?",
    options: null,
    answer: "World War I (WWI)",
    subject: "History",
    topic: "Contemporary World History",
    difficulty: "easy",
    type: "fill",
    marks: 1,
    tags: ["world-war", "treaties"]
  },
  {
    id: "mock-6",
    question: "Find the derivative of f(x) = ln(sin(x)) with respect to x for 0 < x < π.",
    options: ["tan(x)", "cot(x)", "1/sin(x)", "-cot(x)"],
    answer: "cot(x) (By the chain rule: d/dx[ln(u)] = (1/u)(du/dx) => (1/sin(x))·cos(x) = cot(x))",
    subject: "Mathematics",
    topic: "Calculus",
    difficulty: "medium",
    type: "mcq",
    marks: 2,
    tags: ["calculus", "differentiation"]
  },
  {
    id: "mock-7",
    question: "Explain Heisenberg's Uncertainty Principle and state its mathematical inequality for position and momentum.",
    options: null,
    answer: "Heisenberg's Uncertainty Principle states that it is physically impossible to simultaneously determine both the exact position (Δx) and exact momentum (Δp) of a subatomic particle. Mathematical expression: Δx · Δp ≥ h / (4π), where h is Planck's constant.",
    subject: "Physics",
    topic: "Quantum Physics",
    difficulty: "hard",
    type: "short",
    marks: 3,
    tags: ["modern-physics", "quantum"]
  },
  {
    id: "mock-8",
    question: "What is the primary function of ribosomes in a living biological cell?",
    options: ["ATP Synthesis", "Protein Translation & Synthesis", "Lipid Hydrolysis", "Waste Exocytosis"],
    answer: "Protein Translation & Synthesis",
    subject: "Biology",
    topic: "Cell Biology",
    difficulty: "easy",
    type: "mcq",
    marks: 1,
    tags: ["cytology", "organelles"]
  },
  {
    id: "mock-9",
    question: "Define the term 'Allotropy' and name two allotropic crystal structures of carbon.",
    options: null,
    answer: "Allotropy is the phenomenon in which an element can exist in two or more different physical forms in the same state, having different physical properties but identical chemical reactions. Two allotropes of carbon: Diamond (sp3 tetrahedral) and Graphite (sp2 hexagonal layers).",
    subject: "Chemistry",
    topic: "Carbon & Its Compounds",
    difficulty: "medium",
    type: "short",
    marks: 2,
    tags: ["carbon", "bonding"]
  },
  {
    id: "mock-10",
    question: "Write down Snell's Law of refraction and calculate the refractive index of a medium if the angle of incidence in air is 45° and the angle of refraction is 30°.",
    options: null,
    answer: "Snell's Law: n1·sin(i) = n2·sin(r). For air (n1 = 1): n2 = sin(45°) / sin(30°) = (1/√2) / (1/2) = 2 / √2 = √2 ≈ 1.414.",
    subject: "Physics",
    topic: "Ray Optics",
    difficulty: "medium",
    type: "short",
    marks: 3,
    tags: ["optics", "numerical"]
  },
  {
    id: "mock-11",
    question: "Which asymptotic time complexity best describes searching for an element in a balanced Binary Search Tree (AVL / Red-Black Tree)?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    answer: "O(log n)",
    subject: "Computer Science",
    topic: "Data Structures",
    difficulty: "easy",
    type: "mcq",
    marks: 1,
    tags: ["algorithms", "trees"]
  },
  {
    id: "mock-12",
    question: "A copper calorimeter of mass 100 g contains 200 g of water at 10°C. If 50 g of steam at 100°C is passed into it, determine the resulting temperature of the mixture. (Take specific heat of copper = 0.1 cal/g°C, latent heat of vaporization = 540 cal/g).",
    options: null,
    answer: "Heat lost by steam condensing to water at 100°C = 50 * 540 = 27,000 cal.\nHeat required to raise calorimeter and water from 10°C to 100°C = (100 * 0.1 + 200 * 1) * (100 - 10) = 210 * 90 = 18,900 cal.\nSince available latent heat exceeds required heat, all water reaches 100°C and a fraction of steam remains uncondensed. Final equilibrium temperature = 100°C.",
    subject: "Physics",
    topic: "Thermodynamics",
    difficulty: "hard",
    type: "long",
    marks: 5,
    tags: ["calorimetry", "heat"]
  },
  {
    id: "mock-13",
    question: "State the law of segregation (Mendel's First Law) and represent it with a monohybrid cross between homozygous tall (TT) and dwarf (tt) pea plants.",
    options: null,
    answer: "Law of Segregation states that during gamete formation, the alleles for each gene segregate from each other so that each gamete carries only one allele for each gene.\nCross: Parental TT x tt -> F1 generation all Tt (Phenotypically Tall). Selfing F1 (Tt x Tt) yields Genotypes: 1 TT : 2 Tt : 1 tt (1:2:1 ratio) and Phenotypes: 3 Tall : 1 Dwarf (3:1 ratio).",
    subject: "Biology",
    topic: "Genetics & Evolution",
    difficulty: "medium",
    type: "short",
    marks: 3,
    tags: ["mendel", "inheritance"]
  },
  {
    id: "mock-14",
    question: "Evaluate the definite integral: ∫ from 0 to π/2 of (sin(x) / (sin(x) + cos(x))) dx.",
    options: ["π / 2", "π / 4", "1", "0"],
    answer: "π / 4 (Using King's property ∫[0 to a] f(x)dx = ∫[0 to a] f(a-x)dx, adding both integrals gives 2I = ∫[0 to π/2] 1 dx = π/2 => I = π/4)",
    subject: "Mathematics",
    topic: "Definite Integrals",
    difficulty: "hard",
    type: "mcq",
    marks: 2,
    tags: ["calculus", "integration"]
  },
  {
    id: "mock-15",
    question: "Define Le Chatelier's Principle and predict the effect of increasing pressure on the Haber process: N2(g) + 3H2(g) ⇌ 2NH3(g) (ΔH = -92.4 kJ/mol).",
    options: null,
    answer: "Principle: When a system at dynamic equilibrium is subjected to a change in concentration, temperature, or pressure, the equilibrium shifts in a direction that tends to counteract that change.\nFor Haber process: Reactants have 4 moles of gas (1 N2 + 3 H2) while products have 2 moles (2 NH3). Increasing pressure shifts equilibrium towards fewer moles of gas, favoring the forward reaction and increasing ammonia yield.",
    subject: "Chemistry",
    topic: "Chemical Equilibrium",
    difficulty: "medium",
    type: "short",
    marks: 3,
    tags: ["equilibrium", "physical-chemistry"]
  }
];
