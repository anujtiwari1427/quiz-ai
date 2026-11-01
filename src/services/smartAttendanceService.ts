import { 
  AttendanceRecord, 
  AttendanceStatus, 
  AttendanceMethod, 
  StudentAttendanceSummary,
  Student 
} from '../types';
import { INITIAL_STUDENTS } from '../mock/initialData';

const ATTENDANCE_STORAGE_KEY = 'edupulse_smart_attendance';

export const SMART_ATTENDANCE_SERVICE = {
  getStoredRecords(): AttendanceRecord[] {
    try {
      const data = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      const seeded = this.seedInitialAttendance();
      localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    } catch {
      return this.seedInitialAttendance();
    }
  },

  saveRecords(records: AttendanceRecord[]): void {
    try {
      localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save attendance records', e);
    }
  },

  /**
   * Get attendance records for a specific date and class
   */
  getAttendanceForDateAndClass(dateStr: string, classGrade: number, section: string): AttendanceRecord[] {
    const all = this.getStoredRecords();
    return all.filter(r => r.date === dateStr && r.classGrade === classGrade && r.section.toUpperCase() === section.toUpperCase());
  },

  /**
   * Mark individual student attendance
   */
  recordStudentAttendance(
    student: Student,
    dateStr: string,
    status: AttendanceStatus,
    method: AttendanceMethod = 'manual',
    remarks?: string
  ): AttendanceRecord {
    const records = this.getStoredRecords();
    const existingIndex = records.findIndex(
      r => r.studentGsid === student.gsid && r.date === dateStr
    );

    const nowTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const newRecord: AttendanceRecord = {
      id: existingIndex >= 0 ? records[existingIndex].id : `att_${Date.now()}_${student.rollNumber}`,
      studentGsid: student.gsid,
      studentName: student.name,
      rollNumber: student.rollNumber,
      classGrade: student.classGrade,
      section: student.section,
      date: dateStr,
      status,
      checkInTime: status === 'present' || status === 'late' ? nowTime : undefined,
      method,
      remarks,
      parentNotified: false
    };

    if (existingIndex >= 0) {
      records[existingIndex] = newRecord;
    } else {
      records.push(newRecord);
    }

    this.saveRecords(records);
    return newRecord;
  },

  /**
   * Batch mark all students in a class for a specific date
   */
  batchMarkClassAttendance(
    students: Student[],
    dateStr: string,
    defaultStatus: AttendanceStatus = 'present'
  ): AttendanceRecord[] {
    const records = this.getStoredRecords();
    const nowTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const updated: AttendanceRecord[] = [];

    students.forEach(student => {
      const idx = records.findIndex(r => r.studentGsid === student.gsid && r.date === dateStr);
      const rec: AttendanceRecord = {
        id: idx >= 0 ? records[idx].id : `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        studentGsid: student.gsid,
        studentName: student.name,
        rollNumber: student.rollNumber,
        classGrade: student.classGrade,
        section: student.section,
        date: dateStr,
        status: defaultStatus,
        checkInTime: defaultStatus === 'present' ? nowTime : undefined,
        method: 'manual',
        parentNotified: false
      };

      if (idx >= 0) {
        records[idx] = rec;
      } else {
        records.push(rec);
      }
      updated.push(rec);
    });

    this.saveRecords(records);
    return updated;
  },

  /**
   * Calculate cumulative student attendance summaries & detect at-risk students (<75%)
   */
  getStudentAttendanceSummaries(students: Student[]): StudentAttendanceSummary[] {
    const records = this.getStoredRecords();

    return students.map(student => {
      const studentRecords = records.filter(r => r.studentGsid === student.gsid);
      const totalDays = studentRecords.length || 1;
      const presentDays = studentRecords.filter(r => r.status === 'present').length;
      const absentDays = studentRecords.filter(r => r.status === 'absent').length;
      const lateDays = studentRecords.filter(r => r.status === 'late').length;
      const excusedDays = studentRecords.filter(r => r.status === 'excused').length;

      // Late counts as 0.5 present, excused doesn't penalize
      const effectivePresent = presentDays + (lateDays * 0.5);
      const attendancePercentage = Math.round((effectivePresent / totalDays) * 100);

      // Check consecutive absences
      const sorted = [...studentRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      let consecutiveAbsences = 0;
      for (const rec of sorted) {
        if (rec.status === 'absent') consecutiveAbsences++;
        else break;
      }

      return {
        studentGsid: student.gsid,
        studentName: student.name,
        rollNumber: student.rollNumber,
        classGrade: student.classGrade,
        section: student.section,
        parentPhone: student.parentPhone,
        totalDays,
        presentDays,
        absentDays,
        lateDays,
        excusedDays,
        attendancePercentage,
        isAtRisk: attendancePercentage < 75,
        consecutiveAbsences
      };
    }).sort((a, b) => a.attendancePercentage - b.attendancePercentage);
  },

  /**
   * Generate parent WhatsApp / SMS notification text for absent student
   */
  generateParentAbsenceAlert(student: Student, dateStr: string): { message: string; whatsappUrl: string } {
    const formattedDate = new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const message = `Dear ${student.parentName || 'Parent'}, your ward ${student.name} (Roll No: ${student.rollNumber}, Class ${student.classGrade}-${student.section}) has been marked ABSENT today (${formattedDate}) at ${student.schoolName}. If this was an emergency or approved leave, please update the school portal or reply to this message. — Principal Office`;
    const cleanPhone = (student.parentPhone || '').replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    return { message, whatsappUrl };
  },

  /**
   * Seed realistic 14-day history for students
   */
  seedInitialAttendance(): AttendanceRecord[] {
    const records: AttendanceRecord[] = [];
    const students = INITIAL_STUDENTS;
    const today = new Date();

    for (let dayOffset = 13; dayOffset >= 0; dayOffset--) {
      const d = new Date(today);
      d.setDate(today.getDate() - dayOffset);
      
      // Skip Sundays
      if (d.getDay() === 0) continue;

      const dateStr = d.toISOString().split('T')[0];

      students.forEach((student, idx) => {
        let status: AttendanceStatus = 'present';
        let method: AttendanceMethod = (idx % 2 === 0) ? 'qr_code' : 'facial_id';
        let checkInTime: string | undefined = `07:${45 + (idx * 3) % 15}:${String((idx * 7) % 60).padStart(2, '0')}`;

        // Add realistic absences for demo
        if (student.rollNumber === '07B-12' && (dayOffset === 1 || dayOffset === 2 || dayOffset === 6)) {
          status = 'absent';
          checkInTime = undefined;
          method = 'manual';
        } else if (student.rollNumber === '10A-18' && (dayOffset === 0 || dayOffset === 4 || dayOffset === 7 || dayOffset === 8)) {
          status = 'absent';
          checkInTime = undefined;
          method = 'manual';
        } else if (idx === 2 && dayOffset === 3) {
          status = 'late';
          checkInTime = '08:15:20';
        }

        records.push({
          id: `seed_att_${student.rollNumber}_${dateStr}`,
          studentGsid: student.gsid,
          studentName: student.name,
          rollNumber: student.rollNumber,
          classGrade: student.classGrade,
          section: student.section,
          date: dateStr,
          status,
          checkInTime,
          method,
          parentNotified: status === 'absent'
        });
      });
    }

    return records;
  }
};
