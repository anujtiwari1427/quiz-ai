import { db } from '../db';
import { PaperBlueprint, SectionBlueprint } from '../types';

export interface BlueprintValidationResult {
  isValid: boolean;
  errors: string[];
  calculatedMarks: number;
  totalQuestionCount: number;
}

export class BlueprintService {
  /**
   * Calculate marks for a single section
   */
  calculateSectionMarks(section: SectionBlueprint): number {
    const effectiveCount = Math.max(0, (section.questionCount || 0) - (section.internalChoiceCount || 0));
    return effectiveCount * (section.marksPerQuestion || 0);
  }

  /**
   * Calculate total marks across all sections in the blueprint
   */
  calculateTotalMarks(blueprint: PaperBlueprint): number {
    if (!blueprint.sections || blueprint.sections.length === 0) return 0;
    return blueprint.sections.reduce((acc, sec) => acc + this.calculateSectionMarks(sec), 0);
  }

  /**
   * Calculate total questions across all sections
   */
  calculateTotalQuestions(blueprint: PaperBlueprint): number {
    if (!blueprint.sections) return 0;
    return blueprint.sections.reduce((acc, sec) => acc + (sec.questionCount || 0), 0);
  }

  /**
   * Deterministic Validation of Blueprint
   * Verifies section counts, marks arithmetic, weightages, and splits.
   * Blocks generation if invalid with clear explanations.
   */
  validateBlueprint(blueprint: PaperBlueprint): BlueprintValidationResult {
    const errors: string[] = [];
    const calculatedMarks = this.calculateTotalMarks(blueprint);
    const totalQuestionCount = this.calculateTotalQuestions(blueprint);

    // 1. Basic Metadata validation
    if (!blueprint.name?.trim()) {
      errors.push('Blueprint title cannot be empty.');
    }
    if (!blueprint.subject?.trim()) {
      errors.push('Subject must be specified.');
    }
    if (!blueprint.grade || blueprint.grade < 1 || blueprint.grade > 12) {
      errors.push('Class/Grade must be between 1 and 12.');
    }
    if (!blueprint.totalMarks || blueprint.totalMarks <= 0) {
      errors.push('Total marks must be greater than 0.');
    }
    if (!blueprint.durationMinutes || blueprint.durationMinutes <= 0) {
      errors.push('Duration must be greater than 0 minutes.');
    }

    // 2. Sections validation
    if (!blueprint.sections || blueprint.sections.length === 0) {
      errors.push('Blueprint must contain at least one examination section.');
    } else {
      blueprint.sections.forEach((sec, idx) => {
        const secLabel = sec.name || `Section #${idx + 1}`;
        if (!sec.questionCount || sec.questionCount <= 0) {
          errors.push(`${secLabel}: Question count must be at least 1.`);
        }
        if (!sec.marksPerQuestion || sec.marksPerQuestion <= 0) {
          errors.push(`${secLabel}: Marks per question must be greater than 0.`);
        }
        if (sec.internalChoiceCount && sec.internalChoiceCount > sec.questionCount) {
          errors.push(`${secLabel}: Internal choice (${sec.internalChoiceCount}) cannot exceed total questions (${sec.questionCount}).`);
        }
      });
    }

    // 3. Deterministic Marks Arithmetic check
    if (calculatedMarks !== blueprint.totalMarks) {
      errors.push(
        `Total marks mismatch: Section sums equal ${calculatedMarks} marks, but blueprint target is set to ${blueprint.totalMarks} marks.`
      );
    }

    // 4. Chapter Weightage validation (if defined)
    if (blueprint.chapterWeightages && blueprint.chapterWeightages.length > 0) {
      const sumWeightage = blueprint.chapterWeightages.reduce((sum, c) => sum + (c.weightagePercent || 0), 0);
      if (Math.abs(sumWeightage - 100) > 1) { // Tolerance of 1%
        errors.push(`Chapter weightages must sum to 100% (currently ${sumWeightage}%).`);
      }
    }

    // 5. Difficulty Split validation (if defined)
    if (blueprint.difficultySplit) {
      const diffSum = 
        (blueprint.difficultySplit.easy || 0) + 
        (blueprint.difficultySplit.medium || 0) + 
        (blueprint.difficultySplit.hard || 0);
      if (diffSum > 0 && Math.abs(diffSum - 100) > 1) {
        errors.push(`Difficulty split (Easy + Medium + Hard) must sum to 100% (currently ${diffSum}%).`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      calculatedMarks,
      totalQuestionCount
    };
  }

  /**
   * Save blueprint to IndexedDB
   */
  async saveBlueprint(blueprint: PaperBlueprint): Promise<string> {
    const bpToSave: PaperBlueprint = {
      ...blueprint,
      id: blueprint.id || `bp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      updatedAt: Date.now(),
      createdAt: blueprint.createdAt || Date.now()
    };
    await db.blueprints.put(bpToSave);
    return bpToSave.id;
  }

  /**
   * Clone an existing blueprint
   */
  async cloneBlueprint(id: string): Promise<PaperBlueprint | null> {
    const original = await db.blueprints.get(id);
    if (!original) return null;

    const cloned: PaperBlueprint = {
      ...original,
      id: `bp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: `${original.name} (Copy)`,
      isBuiltIn: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    await db.blueprints.put(cloned);
    return cloned;
  }

  /**
   * Delete custom blueprint
   */
  async deleteBlueprint(id: string): Promise<boolean> {
    const bp = await db.blueprints.get(id);
    if (bp?.isBuiltIn) {
      throw new Error('Built-in blueprints cannot be deleted.');
    }
    await db.blueprints.delete(id);
    return true;
  }
}

export const BLUEPRINT_SERVICE = new BlueprintService();
