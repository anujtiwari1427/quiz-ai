import { INITIAL_ORGANIZATIONS, INITIAL_STUDENTS, INITIAL_TESTS, INITIAL_ATTEMPTS, INITIAL_AUDIT_LOGS, INITIAL_NOTIFICATIONS } from '../mock/initialData';
import { INITIAL_MARKS, INITIAL_SYLLABI, INITIAL_BOOKS, INITIAL_QUESTION_SETS } from '../mock/studentFeaturesData';
import { 
  Organization, Student, Test, TestAttempt, AuditLog, NotificationItem,
  MarkRecord, Syllabus, Book, QuestionSet, QuestionSetAttempt, BookHighlight, BookNote
} from '../types';

const STORAGE_KEYS = {
  ORGANIZATIONS: 'edupulse_organizations',
  STUDENTS: 'edupulse_students',
  TESTS: 'edupulse_tests',
  ATTEMPTS: 'edupulse_attempts',
  AUDIT_LOGS: 'edupulse_audit_logs',
  NOTIFICATIONS: 'edupulse_notifications',
  PARENT_PHONE: 'edupulse_parent_phone',
  ACTIVE_CHILD_GSID: 'edupulse_active_child_gsid',
  CURRENT_ROLE: 'edupulse_current_role',
  // Student Features
  MARKS: 'edupulse_marks',
  SYLLABI: 'edupulse_syllabi',
  BOOKS: 'edupulse_books',
  QUESTION_SETS: 'edupulse_question_sets',
  QUESTION_SET_ATTEMPTS: 'edupulse_qset_attempts'
};

export const STORAGE_SERVICE = {
  // ── Existing Core Services ──
  getOrganizations(): Organization[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORGANIZATIONS);
      return data ? JSON.parse(data) : INITIAL_ORGANIZATIONS;
    } catch {
      return INITIAL_ORGANIZATIONS;
    }
  },

  saveOrganizations(orgs: Organization[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.ORGANIZATIONS, JSON.stringify(orgs));
    } catch (e) {
      console.error(e);
    }
  },

  getStudents(): Student[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return data ? JSON.parse(data) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  },

  saveStudents(students: Student[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.error(e);
    }
  },

  getTests(): Test[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TESTS);
      return data ? JSON.parse(data) : INITIAL_TESTS;
    } catch {
      return INITIAL_TESTS;
    }
  },

  saveTests(tests: Test[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(tests));
    } catch (e) {
      console.error(e);
    }
  },

  getAttempts(): TestAttempt[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
      return data ? JSON.parse(data) : INITIAL_ATTEMPTS;
    } catch {
      return INITIAL_ATTEMPTS;
    }
  },

  saveAttempts(attempts: TestAttempt[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
    } catch (e) {
      console.error(e);
    }
  },

  getAuditLogs(): AuditLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return data ? JSON.parse(data) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  },

  saveAuditLogs(logs: AuditLog[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
    } catch (e) {
      console.error(e);
    }
  },

  getNotifications(): NotificationItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },

  saveNotifications(notifs: NotificationItem[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    } catch (e) {
      console.error(e);
    }
  },

  // ── FEATURE 1: MARKS ──
  getMarks(): MarkRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MARKS);
      return data ? JSON.parse(data) : INITIAL_MARKS;
    } catch {
      return INITIAL_MARKS;
    }
  },

  saveMarks(marks: MarkRecord[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.MARKS, JSON.stringify(marks));
    } catch (e) {
      console.error('Failed to save marks to localStorage:', e);
    }
  },

  addMarkRecord(record: MarkRecord): MarkRecord[] {
    const current = this.getMarks();
    const updated = [record, ...current];
    this.saveMarks(updated);
    return updated;
  },

  // ── FEATURE 2: SYLLABI ──
  getSyllabi(): Syllabus[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SYLLABI);
      return data ? JSON.parse(data) : INITIAL_SYLLABI;
    } catch {
      return INITIAL_SYLLABI;
    }
  },

  saveSyllabi(syllabi: Syllabus[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.SYLLABI, JSON.stringify(syllabi));
    } catch (e) {
      console.error('Failed to save syllabi to localStorage:', e);
    }
  },

  saveSyllabus(syllabus: Syllabus): Syllabus[] {
    const current = this.getSyllabi();
    const existingIndex = current.findIndex(s => s.id === syllabus.id);
    let updated: Syllabus[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = syllabus;
    } else {
      updated = [syllabus, ...current];
    }
    this.saveSyllabi(updated);
    return updated;
  },

  deleteSyllabus(id: string): Syllabus[] {
    const current = this.getSyllabi();
    const updated = current.filter(s => s.id !== id);
    this.saveSyllabi(updated);
    return updated;
  },

  // ── FEATURE 3: BOOKS & READING PROGRESS ──
  getBooks(): Book[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKS);
      return data ? JSON.parse(data) : INITIAL_BOOKS;
    } catch {
      return INITIAL_BOOKS;
    }
  },

  saveBooks(books: Book[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
    } catch (e) {
      console.error('Failed to save books to localStorage:', e);
    }
  },

  saveBook(book: Book): Book[] {
    const current = this.getBooks();
    const existingIdx = current.findIndex(b => b.id === book.id);
    let updated: Book[];
    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = book;
    } else {
      updated = [book, ...current];
    }
    this.saveBooks(updated);
    return updated;
  },

  updateReadingProgress(bookId: string, progressPct: number, currentChapterId?: string, isCompletedChapterId?: string): Book[] {
    const current = this.getBooks();
    const updated = current.map(b => {
      if (b.id === bookId) {
        const updatedChapters = b.chapters.map(ch => {
          if (isCompletedChapterId && ch.id === isCompletedChapterId) {
            return { ...ch, isCompleted: true };
          }
          return ch;
        });
        return {
          ...b,
          progress: Math.min(100, Math.max(0, Math.round(progressPct))),
          currentChapterId: currentChapterId || b.currentChapterId,
          lastOpened: new Date().toISOString().split('T')[0],
          chapters: updatedChapters
        };
      }
      return b;
    });
    this.saveBooks(updated);
    return updated;
  },

  addBookHighlight(bookId: string, highlight: BookHighlight): Book[] {
    const current = this.getBooks();
    const updated = current.map(b => {
      if (b.id === bookId) {
        return {
          ...b,
          highlights: [...(b.highlights || []), highlight]
        };
      }
      return b;
    });
    this.saveBooks(updated);
    return updated;
  },

  addBookNote(bookId: string, note: BookNote): Book[] {
    const current = this.getBooks();
    const updated = current.map(b => {
      if (b.id === bookId) {
        return {
          ...b,
          notes: [...(b.notes || []), note]
        };
      }
      return b;
    });
    this.saveBooks(updated);
    return updated;
  },

  toggleBookBookmark(bookId: string, chapterId: string): Book[] {
    const current = this.getBooks();
    const updated = current.map(b => {
      if (b.id === bookId) {
        const bookmarks = b.bookmarks || [];
        const exists = bookmarks.includes(chapterId);
        return {
          ...b,
          bookmarks: exists ? bookmarks.filter(id => id !== chapterId) : [...bookmarks, chapterId]
        };
      }
      return b;
    });
    this.saveBooks(updated);
    return updated;
  },

  // ── FEATURE 4: QUESTION SETS & ATTEMPTS ──
  getQuestionSets(): QuestionSet[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTION_SETS);
      return data ? JSON.parse(data) : INITIAL_QUESTION_SETS;
    } catch {
      return INITIAL_QUESTION_SETS;
    }
  },

  saveQuestionSets(sets: QuestionSet[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTION_SETS, JSON.stringify(sets));
    } catch (e) {
      console.error('Failed to save question sets to localStorage:', e);
    }
  },

  saveQuestionSet(set: QuestionSet): QuestionSet[] {
    const current = this.getQuestionSets();
    const existingIdx = current.findIndex(s => s.id === set.id);
    let updated: QuestionSet[];
    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = set;
    } else {
      updated = [set, ...current];
    }
    this.saveQuestionSets(updated);
    return updated;
  },

  deleteQuestionSet(id: string): QuestionSet[] {
    const current = this.getQuestionSets();
    const updated = current.filter(s => s.id !== id);
    this.saveQuestionSets(updated);
    return updated;
  },

  getQuestionSetAttempts(): QuestionSetAttempt[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTION_SET_ATTEMPTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveQuestionSetAttempt(attempt: QuestionSetAttempt): QuestionSetAttempt[] {
    try {
      const current = this.getQuestionSetAttempts();
      const updated = [attempt, ...current];
      localStorage.setItem(STORAGE_KEYS.QUESTION_SET_ATTEMPTS, JSON.stringify(updated));

      // Also update attemptsCount and bestScore on the QuestionSet
      const sets = this.getQuestionSets();
      const targetSet = sets.find(s => s.id === attempt.questionSetId);
      if (targetSet) {
        const bestScore = Math.max(targetSet.bestScore || 0, attempt.obtainedMarks);
        const attemptsCount = (targetSet.attemptsCount || 0) + 1;
        this.saveQuestionSet({
          ...targetSet,
          bestScore,
          attemptsCount
        });
      }

      return updated;
    } catch (e) {
      console.error('Failed to save question set attempt:', e);
      return [];
    }
  },

  resetToDemo() {
    localStorage.clear();
    window.location.reload();
  }
};
