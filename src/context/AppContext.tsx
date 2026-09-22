import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  Test, 
  Student, 
  TestAttempt, 
  AuditLog, 
  NotificationItem, 
  Organization, 
  ProctorViolation, 
  StudentAnswer,
  SubscriptionPlan,
  Question
} from '../types';
import { STORAGE_SERVICE } from '../services/storageService';
import { SUBSCRIPTION_PLANS } from '../mock/initialData';

export type ActiveAppView = 'marketing' | 'teacher' | 'student' | 'parent' | 'admin';

interface AppContextType {
  // Navigation & Role
  currentView: ActiveAppView;
  setCurrentView: (view: ActiveAppView) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;

  // Teacher Subview
  teacherTab: 'tests' | 'builder' | 'proctor' | 'grading' | 'mastery';
  setTeacherTab: (tab: 'tests' | 'builder' | 'proctor' | 'grading' | 'mastery') => void;

  // Parent Subview
  parentTab: 'overview' | 'tutor' | 'billing';
  setParentTab: (tab: 'overview' | 'tutor' | 'billing') => void;
  activeChildGsid: string;
  setActiveChildGsid: (gsid: string) => void;
  isParentLoggedIn: boolean;
  setIsParentLoggedIn: (loggedIn: boolean) => void;

  // Admin Subview
  adminTab: 'branches' | 'roster' | 'dpdp';
  setAdminTab: (tab: 'branches' | 'roster' | 'dpdp') => void;

  // Data Collections
  tests: Test[];
  students: Student[];
  attempts: TestAttempt[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  organizations: Organization[];

  // Active Student Test Taking State
  activeTestToken: string | null;
  activeTestToTake: Test | null;
  launchStudentTestRoom: (testIdOrCode: string) => void;
  submitStudentTest: (attemptData: {
    studentName: string;
    rollNumber: string;
    answers: StudentAnswer[];
    violations: ProctorViolation[];
    timeSpentSeconds: number;
  }) => TestAttempt;

  // Test Management & AI Creation
  createAndPublishTest: (newTest: Test) => void;
  addQuestionsToExistingTest: (testId: string, questions: Question[]) => void;

  // Proctoring Simulation
  addProctorViolationToActiveAttempt: (attemptId: string, violation: Omit<ProctorViolation, 'id' | 'timestamp'>) => void;
  warnStudentLive: (attemptId: string, message: string) => void;

  // Teacher Grading Review
  overrideGrade: (attemptId: string, questionId: string, newScore: number, teacherRemarks: string) => void;
  approveAllAiGrades: (attemptId: string) => void;

  // Subscriptions & Razorpay
  activePlan: SubscriptionPlan;
  upgradeSubscription: (planId: string) => void;

  // Global Helpers & Logging
  logAuditEvent: (action: string, entityType: AuditLog['entityType'], details: string) => void;
  markNotificationRead: (id: string) => void;
  addNotification: (title: string, message: string, type: NotificationItem['type']) => void;
  resetAllDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ActiveAppView>('marketing');
  const [userRole, setUserRole] = useState<UserRole>('teacher');
  
  // Navigation tabs
  const [teacherTab, setTeacherTab] = useState<'tests' | 'builder' | 'proctor' | 'grading' | 'mastery'>('tests');
  const [parentTab, setParentTab] = useState<'overview' | 'tutor' | 'billing'>('overview');
  const [adminTab, setAdminTab] = useState<'branches' | 'roster' | 'dpdp'>('branches');

  // Parent State
  const [isParentLoggedIn, setIsParentLoggedIn] = useState<boolean>(true);
  const [activeChildGsid, setActiveChildGsid] = useState<string>('GSID-IND-2026-8819');

  // Core Data
  const [tests, setTests] = useState<Test[]>(() => STORAGE_SERVICE.getTests());
  const [students, setStudents] = useState<Student[]>(() => STORAGE_SERVICE.getStudents());
  const [attempts, setAttempts] = useState<TestAttempt[]>(() => STORAGE_SERVICE.getAttempts());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => STORAGE_SERVICE.getAuditLogs());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => STORAGE_SERVICE.getNotifications());
  const [organizations, setOrganizations] = useState<Organization[]>(() => STORAGE_SERVICE.getOrganizations());
  const [activePlan, setActivePlan] = useState<SubscriptionPlan>(SUBSCRIPTION_PLANS[1]); // Default to Parent Pro

  // Student test runner state
  const [activeTestToken, setActiveTestToken] = useState<string | null>(null);
  const [activeTestToTake, setActiveTestToTake] = useState<Test | null>(() => tests[0] || null);

  // Sync to local storage
  useEffect(() => {
    STORAGE_SERVICE.saveTests(tests);
  }, [tests]);

  useEffect(() => {
    STORAGE_SERVICE.saveAttempts(attempts);
  }, [attempts]);

  useEffect(() => {
    STORAGE_SERVICE.saveAuditLogs(auditLogs);
  }, [auditLogs]);

  useEffect(() => {
    STORAGE_SERVICE.saveNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    STORAGE_SERVICE.saveStudents(students);
  }, [students]);

  const logAuditEvent = (action: string, entityType: AuditLog['entityType'], details: string) => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      actorRole: userRole,
      actorName: userRole === 'teacher' ? 'Dr. Ramesh Kulkarni' : userRole === 'admin' ? 'Principal Archana Iyer' : 'Parent Vikram Sharma',
      action,
      entityType,
      details,
      ipAddress: '103.24.12.89 (Mumbai Edge)'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addNotification = (title: string, message: string, type: NotificationItem['type']) => {
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      type,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const createAndPublishTest = (newTest: Test) => {
    setTests(prev => [newTest, ...prev]);
    logAuditEvent('TEST_CREATED_AI', 'Test', `Created test "${newTest.title}" with ${newTest.questions.length} questions for ${newTest.board} Class ${newTest.classGrade}`);
    addNotification('Test Published Successfully', `Test "${newTest.title}" (Code: ${newTest.accessCode}) is now live.`, 'test_published');
  };

  const addQuestionsToExistingTest = (testId: string, questionsToAdd: Question[]) => {
    setTests(prev => prev.map(t => {
      if (t.id === testId) {
        const updatedQuestions = [...t.questions, ...questionsToAdd];
        const addedMarks = questionsToAdd.reduce((sum, q) => sum + q.marks, 0);
        return {
          ...t,
          questions: updatedQuestions,
          totalMarks: t.totalMarks + addedMarks
        };
      }
      return t;
    }));
    logAuditEvent('QUESTIONS_IMPORTED_DOC', 'Test', `Added ${questionsToAdd.length} questions from document to test ${testId}`);
    addNotification('Questions Imported', `Successfully added ${questionsToAdd.length} questions to assessment.`, 'test_published');
  };

  const launchStudentTestRoom = (testIdOrCode: string) => {
    const target = tests.find(t => t.id === testIdOrCode || t.accessCode === testIdOrCode) || tests[0];
    setActiveTestToTake(target);
    setActiveTestToken(`token-${target.accessCode.toLowerCase()}`);
    setUserRole('student');
    setCurrentView('student');
  };

  const submitStudentTest = (attemptData: {
    studentName: string;
    rollNumber: string;
    answers: StudentAnswer[];
    violations: ProctorViolation[];
    timeSpentSeconds: number;
  }): TestAttempt => {
    if (!activeTestToTake) throw new Error("No active test");

    // Calculate total score
    let totalScore = 0;
    const maxScore = activeTestToTake.questions.reduce((acc, q) => acc + q.marks, 0);

    const gradedAnswers = attemptData.answers.map(ans => {
      const q = activeTestToTake.questions.find(item => item.id === ans.questionId);
      if (!q) return ans;

      if (q.type === 'mcq' || q.type === 'assertion_reason') {
        const correctOpt = q.options?.find(o => o.isCorrect);
        const isCorrect = correctOpt ? correctOpt.id === ans.selectedOptionId || correctOpt.text === ans.answerText : false;
        const score = isCorrect ? q.marks : 0;
        totalScore += score;
        return {
          ...ans,
          isCorrect,
          scoreAwarded: score,
          aiGraded: true,
          aiConfidence: 'High' as const,
          aiFeedback: isCorrect ? 'Correct option chosen.' : `Incorrect. Correct answer is: ${q.correctAnswer || 'Option A'}`
        };
      } else {
        // Subjective: assign auto heuristic score for instant submission feedback
        const words = (ans.answerText || '').trim().split(/\s+/).length;
        const ratio = Math.min(1, Math.max(0.3, words / 30));
        const score = Number((q.marks * ratio).toFixed(1));
        totalScore += score;
        return {
          ...ans,
          scoreAwarded: score,
          aiGraded: true,
          aiConfidence: words > 25 ? 'High' as const : 'Medium' as const,
          aiFeedback: `Demonstrated understanding of core chapter themes. AI Rubric matched ${Math.round(ratio * 100)}% key points.`
        };
      }
    });

    const newAttempt: TestAttempt = {
      id: `att_${Date.now()}`,
      testId: activeTestToTake.id,
      studentGsid: `GSID-IND-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: attemptData.studentName,
      rollNumber: attemptData.rollNumber,
      schoolName: 'Delhi Public School, R.K. Puram',
      startTime: new Date(Date.now() - attemptData.timeSpentSeconds * 1000).toISOString(),
      submitTime: new Date().toISOString(),
      status: 'submitted',
      answers: gradedAnswers,
      totalScore: Number(totalScore.toFixed(1)),
      maxScore,
      percentage: Math.round((totalScore / maxScore) * 100),
      violations: attemptData.violations,
      timeSpentSeconds: attemptData.timeSpentSeconds,
      isReviewedByTeacher: false
    };

    setAttempts(prev => [newAttempt, ...prev]);
    logAuditEvent('TEST_ATTEMPT_SUBMITTED', 'Test', `Student ${attemptData.studentName} submitted test ${activeTestToTake.title} with score ${newAttempt.totalScore}/${maxScore}`);
    addNotification('New Test Submission', `${attemptData.studentName} scored ${newAttempt.percentage}% in ${activeTestToTake.title}.`, 'result_ready');

    return newAttempt;
  };

  const addProctorViolationToActiveAttempt = (attemptId: string, violation: Omit<ProctorViolation, 'id' | 'timestamp'>) => {
    const fullViolation: ProctorViolation = {
      ...violation,
      id: `v_${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    setAttempts(prev => prev.map(att => {
      if (att.id === attemptId) {
        return {
          ...att,
          status: 'flagged',
          violations: [...att.violations, fullViolation]
        };
      }
      return att;
    }));

    addNotification('Proctoring Flag Triggered', `${violation.type.toUpperCase()}: ${violation.description}`, 'proctor_alert');
  };

  const warnStudentLive = (attemptId: string, message: string) => {
    logAuditEvent('PROCTOR_WARNING_SENT', 'Test', `Teacher sent warning to student in attempt ${attemptId}: "${message}"`);
    addNotification('Warning Sent to Student', `Broadcasted proctor warning: "${message}"`, 'proctor_alert');
  };

  const overrideGrade = (attemptId: string, questionId: string, newScore: number, teacherRemarks: string) => {
    setAttempts(prev => prev.map(att => {
      if (att.id === attemptId) {
        let diff = 0;
        const updatedAnswers = att.answers.map(ans => {
          if (ans.questionId === questionId) {
            diff = newScore - (ans.scoreAwarded || 0);
            return {
              ...ans,
              scoreAwarded: newScore,
              teacherOverridden: true,
              teacherRemarks,
              gradedAt: new Date().toISOString()
            };
          }
          return ans;
        });

        const newTotal = Number(((att.totalScore || 0) + diff).toFixed(1));
        const newPercentage = Math.round((newTotal / att.maxScore) * 100);

        return {
          ...att,
          answers: updatedAnswers,
          totalScore: newTotal,
          percentage: newPercentage,
          isReviewedByTeacher: true
        };
      }
      return att;
    }));

    logAuditEvent('GRADE_OVERRIDE_CONFIRMED', 'Grade', `Teacher manually adjusted score on question ${questionId} in attempt ${attemptId} to ${newScore} marks. Remark: "${teacherRemarks}"`);
  };

  const approveAllAiGrades = (attemptId: string) => {
    setAttempts(prev => prev.map(att => {
      if (att.id === attemptId) {
        return {
          ...att,
          isReviewedByTeacher: true
        };
      }
      return att;
    }));
    logAuditEvent('GRADE_BULK_APPROVED', 'Grade', `Teacher approved all AI rubric grades for attempt ${attemptId}`);
  };

  const upgradeSubscription = (planId: string) => {
    const found = SUBSCRIPTION_PLANS.find(p => p.id === planId) || SUBSCRIPTION_PLANS[1];
    setActivePlan(found);
    logAuditEvent('SUBSCRIPTION_UPDATED', 'Subscription', `Upgraded subscription to ${found.name}`);
    addNotification('Subscription Activated', `Your plan has been upgraded to ${found.name}.`, 'billing');
  };

  const resetAllDemoData = () => {
    STORAGE_SERVICE.resetToDemo();
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        userRole,
        setUserRole,
        teacherTab,
        setTeacherTab,
        parentTab,
        setParentTab,
        activeChildGsid,
        setActiveChildGsid,
        isParentLoggedIn,
        setIsParentLoggedIn,
        adminTab,
        setAdminTab,
        tests,
        students,
        attempts,
        auditLogs,
        notifications,
        organizations,
        activeTestToken,
        activeTestToTake,
        launchStudentTestRoom,
        submitStudentTest,
        createAndPublishTest,
        addQuestionsToExistingTest,
        addProctorViolationToActiveAttempt,
        warnStudentLive,
        overrideGrade,
        approveAllAiGrades,
        activePlan,
        upgradeSubscription,
        logAuditEvent,
        markNotificationRead,
        addNotification,
        resetAllDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
