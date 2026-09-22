import { INITIAL_ORGANIZATIONS, INITIAL_STUDENTS, INITIAL_TESTS, INITIAL_ATTEMPTS, INITIAL_AUDIT_LOGS, INITIAL_NOTIFICATIONS } from '../mock/initialData';
import { Organization, Student, Test, TestAttempt, AuditLog, NotificationItem } from '../types';

const STORAGE_KEYS = {
  ORGANIZATIONS: 'edupulse_organizations',
  STUDENTS: 'edupulse_students',
  TESTS: 'edupulse_tests',
  ATTEMPTS: 'edupulse_attempts',
  AUDIT_LOGS: 'edupulse_audit_logs',
  NOTIFICATIONS: 'edupulse_notifications',
  PARENT_PHONE: 'edupulse_parent_phone',
  ACTIVE_CHILD_GSID: 'edupulse_active_child_gsid',
  CURRENT_ROLE: 'edupulse_current_role'
};

export const STORAGE_SERVICE = {
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

  resetToDemo() {
    localStorage.clear();
    window.location.reload();
  }
};
