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
  Question,
  ActiveAppView,
  TextSizeTheme,
  AdminUser,
  ParentUser,
  MarkRecord,
  Syllabus,
  Book,
  BookHighlight,
  BookNote,
  QuestionSet,
  QuestionSetAttempt
} from '../types';
import { ExamModel, AttemptModel } from '../types/schemas';
import { STORAGE_SERVICE } from '../services/storageService';
import { LIBRARY_SERVICE } from '../services/libraryService';
import { SUBSCRIPTION_PLANS } from '../mock/initialData';
import { calculateGrade } from '../utils/gradeUtils';

interface AppContextType {
  // Navigation & Role
  currentView: ActiveAppView;
  setCurrentView: (view: ActiveAppView) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;

  // Text Size Theme
  textSizeTheme: TextSizeTheme;
  setTextSizeTheme: (size: TextSizeTheme) => void;

  // Teacher Subview
  teacherTab: 'tests' | 'builder' | 'proctor' | 'grading' | 'mastery';
  setTeacherTab: (tab: 'tests' | 'builder' | 'proctor' | 'grading' | 'mastery') => void;

  // Parent Subview & Auth
  parentTab: 'overview' | 'tutor' | 'billing';
  setParentTab: (tab: 'overview' | 'tutor' | 'billing') => void;
  activeChildGsid: string;
  setActiveChildGsid: (gsid: string) => void;
  isParentLoggedIn: boolean;
  setIsParentLoggedIn: (loggedIn: boolean) => void;
  parentUser: ParentUser | null;
  setParentUser: (user: ParentUser | null) => void;
  parentLogin: (phone: string, childGsid?: string, parentName?: string) => void;
  parentLogout: () => void;

  // Admin Subview & Auth
  adminTab: 'branches' | 'roster' | 'dpdp';
  setAdminTab: (tab: 'branches' | 'roster' | 'dpdp') => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (loggedIn: boolean) => void;
  adminUser: AdminUser | null;
  setAdminUser: (user: AdminUser | null) => void;
  adminLogin: (user: AdminUser) => void;
  adminLogout: () => void;

  // Data Collections
  tests: Test[];
  students: Student[];
  attempts: TestAttempt[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  organizations: Organization[];

  // Student Feature Collections
  marks: MarkRecord[];
  syllabi: Syllabus[];
  books: Book[];
  questionSets: QuestionSet[];
  questionSetAttempts: QuestionSetAttempt[];

  // Active Cross-Feature Selections
  activeBookToRead: Book | null;
  setActiveBookToRead: (book: Book | null) => void;
  activeQuestionSetToPractice: QuestionSet | null;
  setActiveQuestionSetToPractice: (set: QuestionSet | null) => void;

  // Student Features Handlers
  addMarkRecord: (record: MarkRecord) => void;
  saveSyllabus: (syl: Syllabus) => void;
  deleteSyllabus: (id: string) => void;
  saveBook: (book: Book) => void;
  updateReadingProgress: (bookId: string, progressPct: number, currentChapterId?: string, isCompletedChapterId?: string) => void;
  addBookHighlight: (bookId: string, highlight: BookHighlight) => void;
  addBookNote: (bookId: string, note: BookNote) => void;
  toggleBookBookmark: (bookId: string, chapterId: string) => void;
  saveQuestionSet: (set: QuestionSet) => void;
  deleteQuestionSet: (id: string) => void;
  saveQuestionSetAttempt: (att: QuestionSetAttempt) => void;
  startQuizFromSyllabus: (subject: string, chapter?: string, topic?: string) => void;
  openBookForSubjectOrChapter: (subject: string, chapter?: string) => void;

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

  // AI Exam Generator & Performance Analysis
  activeExamToRun: ExamModel | null;
  setActiveExamToRun: (exam: ExamModel | null) => void;
  activeExamAnalysis: { exam: ExamModel; attempt: AttemptModel } | null;
  setActiveExamAnalysis: (data: { exam: ExamModel; attempt: AttemptModel } | null) => void;
  launchExamCreator: (sourceBookId?: string) => void;
  startExamRunner: (exam: ExamModel) => void;
  showExamAnalysis: (exam: ExamModel, attempt: AttemptModel) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Text Size Theme (Default to 'large' to maintain large text size theme)
  const [textSizeTheme, setTextSizeThemeState] = useState<TextSizeTheme>(() => {
    const saved = localStorage.getItem('edupulse_text_size_theme') as TextSizeTheme;
    return saved === 'normal' || saved === 'large' || saved === 'extra-large' ? saved : 'large';
  });

  const setTextSizeTheme = (size: TextSizeTheme) => {
    setTextSizeThemeState(size);
    localStorage.setItem('edupulse_text_size_theme', size);
  };

  useEffect(() => {
    document.documentElement.classList.remove('theme-text-normal', 'theme-text-large', 'theme-text-extra-large');
    document.documentElement.classList.add(`theme-text-${textSizeTheme}`);
  }, [textSizeTheme]);

  // Initial view from URL hash or query if present
  const getInitialView = (): ActiveAppView => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#\/?/, '').trim();
      if (
        hash === 'ai-paper-gen' || 
        hash === 'teacher' || 
        hash === 'smart-attendance' || 
        hash === 'score-upload' || 
        hash === 'create-exam' ||
        hash === 'marketing' ||
        hash === 'take-exam' ||
        hash === 'exam-analysis'
      ) {
        return hash as ActiveAppView;
      }
      const params = new URLSearchParams(window.location.search);
      const v = params.get('view');
      if (v === 'ai-paper-gen' || v === 'teacher' || v === 'marketing') {
        return v as ActiveAppView;
      }
    }
    return 'marketing';
  };

  const [currentView, setCurrentViewState] = useState<ActiveAppView>(getInitialView);
  const [userRole, setUserRole] = useState<UserRole>('teacher');

  const setCurrentView = (view: ActiveAppView) => {
    setCurrentViewState(view);
    if (typeof window !== 'undefined') {
      window.location.hash = `#/${view}`;
    }
  };

  // Listen to hash changes for direct deep linking
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').trim() as ActiveAppView;
      const validViews: ActiveAppView[] = [
        'marketing', 'teacher', 'ai-paper-gen', 'smart-attendance', 'score-upload',
        'create-exam', 'take-exam', 'exam-analysis'
      ];
      if (validViews.includes(hash)) {
        setCurrentViewState(hash);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);
  
  // Navigation tabs
  const [teacherTab, setTeacherTab] = useState<'tests' | 'builder' | 'proctor' | 'grading' | 'mastery'>('tests');
  const [parentTab, setParentTab] = useState<'overview' | 'tutor' | 'billing'>('overview');
  const [adminTab, setAdminTab] = useState<'branches' | 'roster' | 'dpdp'>('branches');

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('edupulse_admin_logged_in') === 'true';
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const raw = localStorage.getItem('edupulse_admin_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const adminLogin = (user: AdminUser) => {
    setIsAdminLoggedIn(true);
    setAdminUser(user);
    localStorage.setItem('edupulse_admin_logged_in', 'true');
    localStorage.setItem('edupulse_admin_user', JSON.stringify(user));
    setUserRole('admin');
    setCurrentView('admin');
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    localStorage.removeItem('edupulse_admin_logged_in');
    localStorage.removeItem('edupulse_admin_user');
    setCurrentView('admin-login');
  };

  // Parent Auth State
  const [isParentLoggedIn, setIsParentLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('edupulse_parent_logged_in') === 'true';
  });
  const [parentUser, setParentUser] = useState<ParentUser | null>(() => {
    try {
      const raw = localStorage.getItem('edupulse_parent_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [activeChildGsid, setActiveChildGsid] = useState<string>('GSID-IND-2026-8819');

  const parentLogin = (phone: string, childGsid?: string, parentName?: string) => {
    const matchedChild = students.find(s => s.gsid === childGsid) || students[0];
    const user: ParentUser = {
      name: parentName || 'Verified Guardian',
      phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      activeChildGsid: matchedChild?.gsid || 'GSID-IND-2026-8819',
      childName: matchedChild?.name || 'Aarav Sharma'
    };
    setIsParentLoggedIn(true);
    setParentUser(user);
    if (matchedChild) {
      setActiveChildGsid(matchedChild.gsid);
    }
    localStorage.setItem('edupulse_parent_logged_in', 'true');
    localStorage.setItem('edupulse_parent_user', JSON.stringify(user));
    setUserRole('parent');
    setCurrentView('parent');
  };

  const parentLogout = () => {
    setIsParentLoggedIn(false);
    setParentUser(null);
    localStorage.removeItem('edupulse_parent_logged_in');
    localStorage.removeItem('edupulse_parent_user');
    setCurrentView('parent-login');
  };

  // Core Data
  const [tests, setTests] = useState<Test[]>(() => STORAGE_SERVICE.getTests());
  const [students, setStudents] = useState<Student[]>(() => STORAGE_SERVICE.getStudents());
  const [attempts, setAttempts] = useState<TestAttempt[]>(() => STORAGE_SERVICE.getAttempts());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => STORAGE_SERVICE.getAuditLogs());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => STORAGE_SERVICE.getNotifications());
  const [organizations, setOrganizations] = useState<Organization[]>(() => STORAGE_SERVICE.getOrganizations());
  const [activePlan, setActivePlan] = useState<SubscriptionPlan>(SUBSCRIPTION_PLANS[1]);

  // Student Features Data
  const [marks, setMarks] = useState<MarkRecord[]>(() => STORAGE_SERVICE.getMarks());
  const [syllabi, setSyllabi] = useState<Syllabus[]>(() => STORAGE_SERVICE.getSyllabi());
  const [books, setBooks] = useState<Book[]>(() => STORAGE_SERVICE.getBooks());
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>(() => STORAGE_SERVICE.getQuestionSets());
  const [questionSetAttempts, setQuestionSetAttempts] = useState<QuestionSetAttempt[]>(() => STORAGE_SERVICE.getQuestionSetAttempts());

  // Cross-feature active selections
  const [activeBookToRead, setActiveBookToRead] = useState<Book | null>(null);
  const [activeQuestionSetToPractice, setActiveQuestionSetToPractice] = useState<QuestionSet | null>(null);

  // AI Exam & Performance Analysis states
  const [activeExamToRun, setActiveExamToRun] = useState<ExamModel | null>(null);
  const [activeExamAnalysis, setActiveExamAnalysis] = useState<{ exam: ExamModel; attempt: AttemptModel } | null>(null);

  const launchExamCreator = (sourceBookId?: string) => {
    if (sourceBookId) {
      localStorage.setItem('edupulse_preselect_book', sourceBookId);
    }
    setCurrentView('create-exam');
  };

  const startExamRunner = (exam: ExamModel) => {
    setActiveExamToRun(exam);
    setCurrentView('take-exam');
  };

  const showExamAnalysis = (exam: ExamModel, attempt: AttemptModel) => {
    setActiveExamAnalysis({ exam, attempt });
    setCurrentView('exam-analysis');
  };

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

  // Student feature syncs
  useEffect(() => {
    STORAGE_SERVICE.saveMarks(marks);
  }, [marks]);

  useEffect(() => {
    STORAGE_SERVICE.saveSyllabi(syllabi);
  }, [syllabi]);

  useEffect(() => {
    STORAGE_SERVICE.saveBooks(books);
  }, [books]);

  useEffect(() => {
    STORAGE_SERVICE.saveQuestionSets(questionSets);
  }, [questionSets]);

  // ── Student Feature Action Handlers ──
  const addMarkRecord = (record: MarkRecord) => {
    setMarks(prev => [record, ...prev]);
    logAuditEvent('MARKS_RECORD_ADDED', 'Grade', `New score record added: ${record.testName} (${record.percentage}%, Grade ${record.grade})`);
    addNotification('Marks Updated', `Recorded ${record.percentage}% in ${record.testName}.`, 'result_ready');
  };

  const saveSyllabusHandler = (syl: Syllabus) => {
    const updated = STORAGE_SERVICE.saveSyllabus(syl);
    setSyllabi(updated);
    addNotification('Syllabus Updated', `Saved syllabus "${syl.name}".`, 'test_published');
  };

  const deleteSyllabusHandler = (id: string) => {
    const updated = STORAGE_SERVICE.deleteSyllabus(id);
    setSyllabi(updated);
  };

  const saveBookHandler = (book: Book) => {
    const updated = STORAGE_SERVICE.saveBook(book);
    setBooks(updated);
  };

  const updateReadingProgressHandler = (bookId: string, progressPct: number, currentChapterId?: string, isCompletedChapterId?: string) => {
    const updated = STORAGE_SERVICE.updateReadingProgress(bookId, progressPct, currentChapterId, isCompletedChapterId);
    setBooks(updated);
  };

  const addBookHighlightHandler = (bookId: string, highlight: BookHighlight) => {
    const updated = STORAGE_SERVICE.addBookHighlight(bookId, highlight);
    setBooks(updated);
  };

  const addBookNoteHandler = (bookId: string, note: BookNote) => {
    const updated = STORAGE_SERVICE.addBookNote(bookId, note);
    setBooks(updated);
  };

  const toggleBookBookmarkHandler = (bookId: string, chapterId: string) => {
    const updated = STORAGE_SERVICE.toggleBookBookmark(bookId, chapterId);
    setBooks(updated);
  };

  const saveQuestionSetHandler = (set: QuestionSet) => {
    const updated = STORAGE_SERVICE.saveQuestionSet(set);
    setQuestionSets(updated);
  };

  const deleteQuestionSetHandler = (id: string) => {
    const updated = STORAGE_SERVICE.deleteQuestionSet(id);
    setQuestionSets(updated);
  };

  const saveQuestionSetAttemptHandler = (att: QuestionSetAttempt) => {
    const updated = STORAGE_SERVICE.saveQuestionSetAttempt(att);
    setQuestionSetAttempts(updated);
    // Refresh questionSets as attempt count & best score may have changed
    setQuestionSets(STORAGE_SERVICE.getQuestionSets());
  };

  // Cross-feature: Generate quiz from Syllabus
  const startQuizFromSyllabus = (subject: string, chapter?: string, topic?: string) => {
    // Find if a matching question set already exists or generate one
    const matchingSet = questionSets.find(s => 
      s.subject.toLowerCase() === subject.toLowerCase() && 
      (!chapter || (s.chapter && s.chapter.toLowerCase().includes(chapter.toLowerCase())))
    );

    if (matchingSet) {
      setActiveQuestionSetToPractice(matchingSet);
    } else {
      // Create targeted set
      const newSet: QuestionSet = {
        id: `qset_syl_${Date.now()}`,
        title: `${subject}: ${chapter || 'Comprehensive'} Practice`,
        subject,
        chapter,
        topic,
        difficulty: 'medium',
        questionCount: 10,
        totalMarks: 10,
        timeLimit: 15,
        presetType: 'custom',
        isCustom: true,
        createdAt: new Date().toISOString().split('T')[0],
        questions: Array.from({ length: 10 }).map((_, i) => ({
          id: `q_syl_${Date.now()}_${i}`,
          type: 'mcq',
          chapter: chapter || `${subject} Core Unit`,
          topic,
          marks: 1,
          difficulty: 'medium',
          bloomsLevel: 'Understand',
          questionText: `Syllabus aligned question ${i + 1} on ${chapter || subject}: In accordance with board curriculum standards, which principle correctly characterizes this concept?`,
          options: [
            { id: 'opt_1', text: 'Option A: Primary board derivation holds true', isCorrect: true },
            { id: 'opt_2', text: 'Option B: Magnitude varies inversely with boundary state', isCorrect: false },
            { id: 'opt_3', text: 'Option C: Null effect under standard ambient temperature', isCorrect: false },
            { id: 'opt_4', text: 'Option D: Excluded from general curriculum guidelines', isCorrect: false }
          ],
          correctAnswer: 'Option A: Primary board derivation holds true',
          explanation: 'Aligned with the official syllabus learning outcomes and NCERT chapter objectives.'
        }))
      };
      saveQuestionSetHandler(newSet);
      setActiveQuestionSetToPractice(newSet);
    }

    setUserRole('student');
    setCurrentView('questions');
  };

  // Cross-feature: Open matching book from Syllabus or Library
  const openBookForSubjectOrChapter = (subjectOrTitle: string, chapter?: string) => {
    const q = (subjectOrTitle || '').toLowerCase().trim();
    
    // 1. Check in LIBRARY_SERVICE (where user uploaded books are stored)
    const libBooks = LIBRARY_SERVICE.getBooks();
    const matchedLib = libBooks.find(b => 
      b.title.toLowerCase().includes(q) ||
      q.includes(b.title.toLowerCase()) ||
      b.subject.toLowerCase() === q ||
      q.includes(b.subject.toLowerCase())
    );

    if (matchedLib) {
      const appBook: Book = {
        id: matchedLib.id,
        title: matchedLib.title,
        author: matchedLib.author,
        subject: matchedLib.subject,
        grade: 10,
        coverGradient: matchedLib.coverGradient || 'from-indigo-600 via-purple-700 to-slate-900',
        fileName: `${matchedLib.title.replace(/\s+/g, '_')}.${matchedLib.fileType}`,
        progress: 0,
        lastOpened: new Date().toISOString().split('T')[0],
        chapters: matchedLib.chapters.map(c => ({
          id: c.id,
          chapterNumber: c.orderIndex,
          title: c.name,
          estimatedReadTimeMinutes: Math.max(5, Math.ceil((c.content?.length || 1500) / 800)),
          sections: ['Core Concepts', 'Formulas & Definitions', 'Worked Problems'],
          content: c.content || `## ${c.name}\n\n*Source: ${matchedLib.title}*\n\n### Overview\n${c.contentPreview || 'Chapter content extracted from textbook.'}`
        })),
        bookmarks: []
      };

      if (chapter) {
        const cLower = chapter.toLowerCase();
        const matchedCh = appBook.chapters.find(ch => 
          ch.title.toLowerCase().includes(cLower) || 
          cLower.includes(ch.title.toLowerCase())
        );
        if (matchedCh) {
          appBook.currentChapterId = matchedCh.id;
        }
      }

      setActiveBookToRead(appBook);
      setUserRole('student');
      setCurrentView('books');
      return;
    }

    // 2. Check legacy AppContext books
    const matchedBook = books.find(b => 
      b.title.toLowerCase().includes(q) || 
      b.subject.toLowerCase() === q ||
      q.includes(b.subject.toLowerCase())
    ) || books[0];

    if (matchedBook) {
      if (chapter) {
        const cLower = chapter.toLowerCase();
        const matchedCh = matchedBook.chapters.find(ch => 
          ch.title.toLowerCase().includes(cLower) || 
          cLower.includes(ch.title.toLowerCase())
        );
        if (matchedCh) {
          matchedBook.currentChapterId = matchedCh.id;
        }
      }
      setActiveBookToRead(matchedBook);
    }
    setUserRole('student');
    setCurrentView('books');
  };

  const logAuditEvent = (action: string, entityType: AuditLog['entityType'], details: string) => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      actorRole: userRole,
      actorName: userRole === 'teacher' ? 'Dr. Ramesh Kulkarni' : userRole === 'admin' ? 'Principal Archana Iyer' : 'Student Aarav Sharma',
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

    const calculatedPercentage = Math.round((totalScore / maxScore) * 100);

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
      percentage: calculatedPercentage,
      violations: attemptData.violations,
      timeSpentSeconds: attemptData.timeSpentSeconds,
      isReviewedByTeacher: false
    };

    setAttempts(prev => [newAttempt, ...prev]);
    logAuditEvent('TEST_ATTEMPT_SUBMITTED', 'Test', `Student ${attemptData.studentName} submitted test ${activeTestToTake.title} with score ${newAttempt.totalScore}/${maxScore}`);
    addNotification('New Test Submission', `${attemptData.studentName} scored ${newAttempt.percentage}% in ${activeTestToTake.title}.`, 'result_ready');

    // ── AUTO-SYNC TO MARKS DASHBOARD ──
    const newMarkRecord: MarkRecord = {
      id: `mark_${Date.now()}`,
      testId: activeTestToTake.id,
      testName: activeTestToTake.title,
      subject: activeTestToTake.subject,
      date: new Date().toISOString().split('T')[0],
      totalMarks: maxScore,
      obtainedMarks: Number(totalScore.toFixed(1)),
      percentage: calculatedPercentage,
      grade: calculateGrade(calculatedPercentage).grade,
      timeSpentSeconds: attemptData.timeSpentSeconds,
      questionCount: activeTestToTake.questions.length,
      correctCount: gradedAnswers.filter(a => a.isCorrect).length,
      incorrectCount: gradedAnswers.filter(a => a.isCorrect === false).length,
      skippedCount: gradedAnswers.filter(a => !a.selectedOptionId && !a.answerText).length
    };
    addMarkRecord(newMarkRecord);

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
        textSizeTheme,
        setTextSizeTheme,
        teacherTab,
        setTeacherTab,
        parentTab,
        setParentTab,
        activeChildGsid,
        setActiveChildGsid,
        isParentLoggedIn,
        setIsParentLoggedIn,
        parentUser,
        setParentUser,
        parentLogin,
        parentLogout,
        adminTab,
        setAdminTab,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        adminUser,
        setAdminUser,
        adminLogin,
        adminLogout,
        tests,
        students,
        attempts,
        auditLogs,
        notifications,
        organizations,
        marks,
        syllabi,
        books,
        questionSets,
        questionSetAttempts,
        activeBookToRead,
        setActiveBookToRead,
        activeQuestionSetToPractice,
        setActiveQuestionSetToPractice,
        addMarkRecord,
        saveSyllabus: saveSyllabusHandler,
        deleteSyllabus: deleteSyllabusHandler,
        saveBook: saveBookHandler,
        updateReadingProgress: updateReadingProgressHandler,
        addBookHighlight: addBookHighlightHandler,
        addBookNote: addBookNoteHandler,
        toggleBookBookmark: toggleBookBookmarkHandler,
        saveQuestionSet: saveQuestionSetHandler,
        deleteQuestionSet: deleteQuestionSetHandler,
        saveQuestionSetAttempt: saveQuestionSetAttemptHandler,
        startQuizFromSyllabus,
        openBookForSubjectOrChapter,
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
        resetAllDemoData,
        activeExamToRun,
        setActiveExamToRun,
        activeExamAnalysis,
        setActiveExamAnalysis,
        launchExamCreator,
        startExamRunner,
        showExamAnalysis
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
