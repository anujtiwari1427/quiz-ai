export type BoardType = 'CBSE' | 'ICSE' | 'State Board (Maharashtra)' | 'State Board (Karnataka)' | 'State Board (Tamil Nadu)';

export type UserRole = 'teacher' | 'admin' | 'parent' | 'student';

export type QuestionType = 'mcq' | 'short_answer' | 'long_answer' | 'case_study' | 'assertion_reason';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type BloomsLevel = 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';

export type ProctorEventStatus = 'active' | 'flagged' | 'submitted' | 'disconnected';

export interface RubricCriterion {
  id: string;
  criterion: string;
  maxMarks: number;
  description: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface Question {
  id: string;
  testId?: string;
  type: QuestionType;
  questionText: string;
  marks: number;
  difficulty: DifficultyLevel;
  bloomsLevel: BloomsLevel;
  chapter: string;
  topic?: string;
  options?: QuestionOption[]; // For MCQ
  correctAnswer?: string; // For MCQ or reference
  sampleAnswer?: string; // For subjective
  markingScheme?: string; // For subjective
  rubric?: RubricCriterion[];
  explanation?: string;
  language?: string;
}

export interface Test {
  id: string;
  title: string;
  board: BoardType;
  classGrade: number; // e.g., 9, 10, 11, 12
  subject: string;
  chapters: string[];
  totalMarks: number;
  durationMinutes: number;
  createdAt: string;
  scheduledEnd: string;
  status: 'draft' | 'published' | 'completed';
  accessCode: string;
  shareableLink: string;
  questions: Question[];
  blueprint: {
    chapterWeightages: { chapter: string; marks: number }[];
    difficultyMix: { easy: number; medium: number; hard: number };
  };
  proctoringSettings: {
    enforceFullscreen: boolean;
    detectTabSwitch: boolean;
    blockCopyPaste: boolean;
    maxTabSwitchesAllowed: number;
  };
}

export interface StudentAnswer {
  questionId: string;
  answerText: string;
  selectedOptionId?: string;
  isCorrect?: boolean;
  scoreAwarded?: number;
  aiGraded?: boolean;
  aiConfidence?: 'High' | 'Medium' | 'Low';
  aiFeedback?: string;
  teacherOverridden?: boolean;
  teacherRemarks?: string;
  gradedAt?: string;
}

export interface ProctorViolation {
  id: string;
  timestamp: string;
  type: 'tab_switch' | 'fullscreen_exit' | 'paste_attempt' | 'offline_anomaly' | 'idle_timeout';
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface TestAttempt {
  id: string;
  testId: string;
  studentGsid: string;
  studentName: string;
  rollNumber: string;
  schoolName: string;
  startTime: string;
  submitTime?: string;
  status: ProctorEventStatus;
  answers: StudentAnswer[];
  totalScore?: number;
  maxScore: number;
  percentage?: number;
  violations: ProctorViolation[];
  currentQuestionIndex?: number;
  ipAddress?: string;
  deviceInfo?: string;
  timeSpentSeconds: number;
  isReviewedByTeacher?: boolean;
}

export interface Student {
  gsid: string; // Global Student ID
  name: string;
  rollNumber: string;
  classGrade: number;
  section: string;
  board: BoardType;
  schoolId: string;
  schoolName: string;
  parentPhone: string;
  parentName: string;
  avatarUrl?: string;
  overallMasteryPercentage: number;
  subjectMastery: {
    [subject: string]: number; // Percentage
  };
  isAtRisk?: boolean;
  riskReason?: string;
}

export interface Organization {
  id: string;
  name: string;
  branch: string;
  city: string;
  state: string;
  board: BoardType;
  studentCount: number;
  teacherCount: number;
  plan: 'Trial' | 'Standard' | 'Enterprise';
}

export interface ParentStudentLink {
  parentPhone: string;
  parentName: string;
  studentGsids: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorRole: UserRole;
  actorName: string;
  action: string;
  entityType: 'Test' | 'Grade' | 'Student' | 'DPDP_Consent' | 'Subscription';
  details: string;
  ipAddress?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'test_published' | 'proctor_alert' | 'result_ready' | 'at_risk_alert' | 'billing';
  read: boolean;
  actionUrl?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  audience: 'parent' | 'school';
  priceMonthlyINR: number;
  priceAnnualINR: number;
  gstRate: number; // 0.18
  features: string[];
  isPopular?: boolean;
}

export interface TutorChatMessage {
  id: string;
  sender: 'student' | 'tutor';
  text: string;
  timestamp: string;
  language?: string;
  suggestedPrompts?: string[];
  relatedQuestionId?: string;
}
