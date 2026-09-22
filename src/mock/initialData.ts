import { Organization, Student, Test, TestAttempt, AuditLog, NotificationItem, SubscriptionPlan } from '../types';
import { SAMPLE_QUESTIONS_BANK } from './curriculumData';

export const INITIAL_ORGANIZATIONS: Organization[] = [
  {
    id: 'org_dps_rkp',
    name: 'Delhi Public School, R.K. Puram',
    branch: 'Main Campus',
    city: 'New Delhi',
    state: 'Delhi',
    board: 'CBSE',
    studentCount: 2450,
    teacherCount: 140,
    plan: 'Enterprise'
  },
  {
    id: 'org_cathedral_mum',
    name: 'The Cathedral & John Connon School',
    branch: 'Fort Campus',
    city: 'Mumbai',
    state: 'Maharashtra',
    board: 'ICSE',
    studentCount: 1680,
    teacherCount: 95,
    plan: 'Enterprise'
  },
  {
    id: 'org_nps_blr',
    name: 'National Public School, Indiranagar',
    branch: 'East Campus',
    city: 'Bengaluru',
    state: 'Karnataka',
    board: 'CBSE',
    studentCount: 1820,
    teacherCount: 110,
    plan: 'Standard'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    gsid: 'GSID-IND-2026-8819',
    name: 'Aarav Sharma',
    rollNumber: '10A-04',
    classGrade: 10,
    section: 'A',
    board: 'CBSE',
    schoolId: 'org_dps_rkp',
    schoolName: 'Delhi Public School, R.K. Puram',
    parentPhone: '+91 98765 43210',
    parentName: 'Vikram Sharma',
    overallMasteryPercentage: 88,
    subjectMastery: {
      'Science': 85,
      'Mathematics': 92,
      'Social Science': 86,
      'English': 89
    },
    isAtRisk: false
  },
  {
    gsid: 'GSID-IND-2026-9402',
    name: 'Ananya Sharma',
    rollNumber: '07B-12',
    classGrade: 7,
    section: 'B',
    board: 'CBSE',
    schoolId: 'org_dps_rkp',
    schoolName: 'Delhi Public School, R.K. Puram',
    parentPhone: '+91 98765 43210',
    parentName: 'Vikram Sharma',
    overallMasteryPercentage: 74,
    subjectMastery: {
      'Science': 70,
      'Mathematics': 62,
      'Social Science': 82,
      'English': 84
    },
    isAtRisk: true,
    riskReason: 'Declining trend in Mathematics (Algebra mastery at 54%)'
  },
  {
    gsid: 'GSID-IND-2026-3391',
    name: 'Rohan Deshmukh',
    rollNumber: '10A-18',
    classGrade: 10,
    section: 'A',
    board: 'CBSE',
    schoolId: 'org_dps_rkp',
    schoolName: 'Delhi Public School, R.K. Puram',
    parentPhone: '+91 91234 56789',
    parentName: 'Sneha Deshmukh',
    overallMasteryPercentage: 68,
    subjectMastery: {
      'Science': 61,
      'Mathematics': 66,
      'Social Science': 74,
      'English': 72
    },
    isAtRisk: true,
    riskReason: 'Scored < 60% on 3 consecutive Physics electricity modules'
  },
  {
    gsid: 'GSID-IND-2026-5520',
    name: 'Diya Sengupta',
    rollNumber: '10A-09',
    classGrade: 10,
    section: 'A',
    board: 'CBSE',
    schoolId: 'org_dps_rkp',
    schoolName: 'Delhi Public School, R.K. Puram',
    parentPhone: '+91 99887 76655',
    parentName: 'Amit Sengupta',
    overallMasteryPercentage: 94,
    subjectMastery: {
      'Science': 96,
      'Mathematics': 95,
      'Social Science': 92,
      'English': 93
    },
    isAtRisk: false
  },
  {
    gsid: 'GSID-IND-2026-7714',
    name: 'Kabir Verma',
    rollNumber: '10A-22',
    classGrade: 10,
    section: 'A',
    board: 'CBSE',
    schoolId: 'org_dps_rkp',
    schoolName: 'Delhi Public School, R.K. Puram',
    parentPhone: '+91 98450 11223',
    parentName: 'Pooja Verma',
    overallMasteryPercentage: 81,
    subjectMastery: {
      'Science': 79,
      'Mathematics': 84,
      'Social Science': 80,
      'English': 82
    },
    isAtRisk: false
  }
];

export const INITIAL_TESTS: Test[] = [
  {
    id: 'test_cbse_sci_midterm',
    title: 'Mid-Term Comprehensive Science Assessment',
    board: 'CBSE',
    classGrade: 10,
    subject: 'Science',
    chapters: [
      'Chemical Reactions and Equations',
      'Life Processes',
      'Light – Reflection and Refraction',
      'Electricity'
    ],
    totalMarks: 20,
    durationMinutes: 45,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    scheduledEnd: new Date(Date.now() + 3600000 * 48).toISOString(),
    status: 'published',
    accessCode: 'SCI-X-908',
    shareableLink: window ? `${window.location.origin}/test/token-sci-x-908` : 'http://localhost:3000/test/token-sci-x-908',
    questions: [
      {
        ...SAMPLE_QUESTIONS_BANK[0],
        id: 'q_test_1',
        testId: 'test_cbse_sci_midterm'
      },
      {
        ...SAMPLE_QUESTIONS_BANK[1],
        id: 'q_test_2',
        testId: 'test_cbse_sci_midterm'
      },
      {
        ...SAMPLE_QUESTIONS_BANK[2],
        id: 'q_test_3',
        testId: 'test_cbse_sci_midterm'
      },
      {
        ...SAMPLE_QUESTIONS_BANK[3],
        id: 'q_test_4',
        testId: 'test_cbse_sci_midterm'
      }
    ],
    blueprint: {
      chapterWeightages: [
        { chapter: 'Light – Reflection and Refraction', marks: 1 },
        { chapter: 'Electricity', marks: 3 },
        { chapter: 'Chemical Reactions and Equations', marks: 1 },
        { chapter: 'Life Processes', marks: 5 }
      ],
      difficultyMix: { easy: 20, medium: 40, hard: 40 }
    },
    proctoringSettings: {
      enforceFullscreen: true,
      detectTabSwitch: true,
      blockCopyPaste: true,
      maxTabSwitchesAllowed: 3
    }
  }
];

export const INITIAL_ATTEMPTS: TestAttempt[] = [
  {
    id: 'att_aarav_01',
    testId: 'test_cbse_sci_midterm',
    studentGsid: 'GSID-IND-2026-8819',
    studentName: 'Aarav Sharma',
    rollNumber: '10A-04',
    schoolName: 'Delhi Public School, R.K. Puram',
    startTime: new Date(Date.now() - 3600000 * 2).toISOString(),
    submitTime: new Date(Date.now() - 3600000 * 1.3).toISOString(),
    status: 'submitted',
    timeSpentSeconds: 2150,
    maxScore: 10,
    totalScore: 9,
    percentage: 90,
    violations: [
      {
        id: 'v1',
        timestamp: new Date(Date.now() - 3600000 * 1.7).toISOString(),
        type: 'tab_switch',
        description: 'Switched browser tab for 4 seconds',
        severity: 'low'
      }
    ],
    answers: [
      {
        questionId: 'q_test_1',
        answerText: 'Real, inverted and magnified',
        selectedOptionId: 'opt_1',
        isCorrect: true,
        scoreAwarded: 1,
        aiGraded: true,
        aiConfidence: 'High',
        aiFeedback: 'Exact correct option selected.'
      },
      {
        questionId: 'q_test_2',
        answerText: 'Each cut piece has resistance r = R/5. When 5 parts are in parallel, 1/R\' = 1/(R/5)*5 = 25/R => R\' = R/25 => R/R\' = 25.',
        isCorrect: true,
        scoreAwarded: 3,
        aiGraded: true,
        aiConfidence: 'High',
        aiFeedback: 'Clear logical steps and accurate algebraic simplification.',
        teacherOverridden: false
      },
      {
        questionId: 'q_test_3',
        answerText: 'Both (A) and (R) are true and (R) is the correct explanation of (A)',
        selectedOptionId: 'opt_a1',
        isCorrect: true,
        scoreAwarded: 1,
        aiGraded: true,
        aiConfidence: 'High',
        aiFeedback: 'Accurate deduction.'
      },
      {
        questionId: 'q_test_4',
        answerText: 'Double circulation involves pulmonary circulation where blood flows from heart to lungs and back, and systemic circulation where blood goes from heart to body organs. It is essential because warm-blooded animals require lots of ATP to maintain body temperature.',
        isCorrect: true,
        scoreAwarded: 4,
        aiGraded: true,
        aiConfidence: 'Medium',
        aiFeedback: 'Mentioned pulmonary and systemic paths clearly (+3 marks) and justified energy requirement (+1 mark). Missed diagrammatic naming specifics (-1 mark).',
        teacherOverridden: false
      }
    ]
  },
  {
    id: 'att_rohan_02',
    testId: 'test_cbse_sci_midterm',
    studentGsid: 'GSID-IND-2026-3391',
    studentName: 'Rohan Deshmukh',
    rollNumber: '10A-18',
    schoolName: 'Delhi Public School, R.K. Puram',
    startTime: new Date(Date.now() - 1800000).toISOString(),
    status: 'active',
    timeSpentSeconds: 1200,
    maxScore: 10,
    currentQuestionIndex: 2,
    violations: [
      {
        id: 'v_r1',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        type: 'fullscreen_exit',
        description: 'Exited fullscreen window',
        severity: 'medium'
      },
      {
        id: 'v_r2',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        type: 'tab_switch',
        description: 'Navigated outside test window to search engine',
        severity: 'high'
      }
    ],
    answers: [
      {
        questionId: 'q_test_1',
        answerText: 'Real, inverted and magnified',
        selectedOptionId: 'opt_1',
        isCorrect: true,
        scoreAwarded: 1,
        aiGraded: true
      },
      {
        questionId: 'q_test_2',
        answerText: 'R/R\' is 5 because there are 5 wires.',
        isCorrect: false,
        scoreAwarded: 0.5,
        aiGraded: true,
        aiConfidence: 'Low',
        aiFeedback: 'Calculated linear parts instead of parallel reciprocal summing.',
        teacherOverridden: false
      }
    ]
  },
  {
    id: 'att_diya_03',
    testId: 'test_cbse_sci_midterm',
    studentGsid: 'GSID-IND-2026-5520',
    studentName: 'Diya Sengupta',
    rollNumber: '10A-09',
    schoolName: 'Delhi Public School, R.K. Puram',
    startTime: new Date(Date.now() - 900000).toISOString(),
    status: 'active',
    timeSpentSeconds: 850,
    maxScore: 10,
    currentQuestionIndex: 3,
    violations: [],
    answers: [
      {
        questionId: 'q_test_1',
        answerText: 'Real, inverted and magnified',
        selectedOptionId: 'opt_1',
        isCorrect: true,
        scoreAwarded: 1,
        aiGraded: true
      }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_01',
    timestamp: new Date(Date.now() - 3600000 * 25).toISOString(),
    actorRole: 'teacher',
    actorName: 'Dr. Ramesh Kulkarni (Science HOD)',
    action: 'TEST_CREATED_AI',
    entityType: 'Test',
    details: 'Generated 4 questions across CBSE Class 10 Science using Claude 3.5 Sonnet blueprint'
  },
  {
    id: 'log_02',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    actorRole: 'teacher',
    actorName: 'Dr. Ramesh Kulkarni (Science HOD)',
    action: 'TEST_PUBLISHED',
    entityType: 'Test',
    details: 'Published access code SCI-X-908 with full proctoring enforcement'
  },
  {
    id: 'log_03',
    timestamp: new Date(Date.now() - 3600000 * 1.2).toISOString(),
    actorRole: 'teacher',
    actorName: 'Dr. Ramesh Kulkarni',
    action: 'GRADE_OVERRIDE_CONFIRMED',
    entityType: 'Grade',
    details: 'Approved subjective question #4 AI grade for Aarav Sharma (GSID-IND-2026-8819)'
  },
  {
    id: 'log_04',
    timestamp: new Date(Date.now() - 3600000 * 40).toISOString(),
    actorRole: 'admin',
    actorName: 'Principal Archana Iyer',
    action: 'DPDP_CONSENT_CAPTURED',
    entityType: 'DPDP_Consent',
    details: 'Captured Parent Data Minimization consent for Batch 2026 under India DPDP Act 2023'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_01',
    title: 'New Assessment Results Available',
    message: 'Aarav Sharma scored 90% (9/10) in Mid-Term Comprehensive Science.',
    timestamp: '1 hour ago',
    type: 'result_ready',
    read: false
  },
  {
    id: 'notif_02',
    title: 'Proctoring Alert — Tab Switch Detected',
    message: 'Student Rohan Deshmukh (10A-18) recorded 2 proctor violations in active test SCI-X-908.',
    timestamp: '15 mins ago',
    type: 'proctor_alert',
    read: false
  },
  {
    id: 'notif_03',
    title: 'At-Risk Diagnostic Flag',
    message: 'Ananya Sharma flagged for declining Math scores. AI Tutor intervention recommended.',
    timestamp: '3 hours ago',
    type: 'at_risk_alert',
    read: true
  }
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'parent_free',
    name: 'Parent Free',
    audience: 'parent',
    priceMonthlyINR: 0,
    priceAnnualINR: 0,
    gstRate: 0.18,
    features: [
      'Basic test report cards',
      'Test completion notifications on WhatsApp',
      'Global Student ID (GSID) record tracking',
      'Up to 3 AI Tutor queries per week'
    ]
  },
  {
    id: 'parent_pro',
    name: 'Parent Pro & AI Tutor',
    audience: 'parent',
    priceMonthlyINR: 499,
    priceAnnualINR: 4490,
    gstRate: 0.18,
    isPopular: true,
    features: [
      'Unlimited Multi-lingual AI Mistake Tutor',
      'Deep chapter-wise mastery radar & heatmap',
      'Predictive board exam score projections',
      'Instant WhatsApp report cards with audio notes',
      'Custom revision practice test generator',
      'Multi-child unified dashboard'
    ]
  },
  {
    id: 'school_standard',
    name: 'Institution Pro',
    audience: 'school',
    priceMonthlyINR: 2999,
    priceAnnualINR: 29990,
    gstRate: 0.18,
    features: [
      'Unlimited AI Test Builder (CBSE/ICSE/State)',
      'Live Proctoring HUD with cheat alerts',
      'AI Rubric Subjective Auto-Grader',
      'Multi-branch class analytics & mastery heatmaps',
      'India DPDP Act compliance audit logs',
      'CSV roster import & teacher permission tiers'
    ]
  }
];
