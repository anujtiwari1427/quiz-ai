/**
 * Grade Calculation Utility for Quiz-AI
 * 
 * Easy to modify grading system:
 * 90–100 = A+
 * 80–89  = A
 * 70–79  = B+
 * 60–69  = B
 * 50–59  = C
 * 40–49  = D
 * Below 40 = F
 */

export interface GradeResult {
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';
  label: string;
  badgeClass: string;
  textColor: string;
  bgGradient: string;
  borderColor: string;
  passed: boolean;
}

export function calculateGrade(percentage: number): GradeResult {
  const rounded = Math.round(percentage);

  if (rounded >= 90) {
    return {
      grade: 'A+',
      label: 'Outstanding Mastery',
      badgeClass: 'badge-emerald',
      textColor: '#34d399',
      bgGradient: 'from-emerald-500 to-teal-400',
      borderColor: 'rgba(16, 185, 129, 0.4)',
      passed: true
    };
  }
  if (rounded >= 80) {
    return {
      grade: 'A',
      label: 'Excellent Performance',
      badgeClass: 'badge-emerald',
      textColor: '#10b981',
      bgGradient: 'from-emerald-600 to-emerald-500',
      borderColor: 'rgba(16, 185, 129, 0.3)',
      passed: true
    };
  }
  if (rounded >= 70) {
    return {
      grade: 'B+',
      label: 'Very Good Competency',
      badgeClass: 'badge-indigo',
      textColor: '#818cf8',
      bgGradient: 'from-indigo-500 to-blue-400',
      borderColor: 'rgba(99, 102, 241, 0.3)',
      passed: true
    };
  }
  if (rounded >= 60) {
    return {
      grade: 'B',
      label: 'Good Understanding',
      badgeClass: 'badge-indigo',
      textColor: '#a5b4fc',
      bgGradient: 'from-indigo-600 to-indigo-500',
      borderColor: 'rgba(99, 102, 241, 0.25)',
      passed: true
    };
  }
  if (rounded >= 50) {
    return {
      grade: 'C',
      label: 'Satisfactory / Average',
      badgeClass: 'badge-amber',
      textColor: '#fbbf24',
      bgGradient: 'from-amber-500 to-yellow-400',
      borderColor: 'rgba(245, 158, 11, 0.3)',
      passed: true
    };
  }
  if (rounded >= 40) {
    return {
      grade: 'D',
      label: 'Needs Improvement',
      badgeClass: 'badge-amber',
      textColor: '#f59e0b',
      bgGradient: 'from-amber-600 to-orange-500',
      borderColor: 'rgba(245, 158, 11, 0.25)',
      passed: true
    };
  }
  return {
    grade: 'F',
    label: 'Critical Revision Required',
    badgeClass: 'badge-rose',
    textColor: '#fb7185',
    bgGradient: 'from-rose-500 to-red-400',
    borderColor: 'rgba(244, 63, 94, 0.35)',
    passed: false
  };
}
