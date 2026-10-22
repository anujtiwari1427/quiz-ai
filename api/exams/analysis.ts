// Vercel Serverless Function: /api/exams/analysis
import type { IncomingMessage, ServerResponse } from 'http';
import { AIStudyPlanSchema, AIStudyPlan } from '../../src/types/schemas';

interface VercelRequest extends IncomingMessage {
  body: any;
  query: { [key: string]: string | string[] };
}

interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (data: any) => VercelResponse;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const { structuredResults } = req.body || {};

    if (!structuredResults) {
      return res.status(400).json({ error: 'structuredResults is required' });
    }

    const { weakChapters, carelessCount, conceptGapCount, timePressureCount, percentage } = structuredResults;

    const priorityChapters = (weakChapters && weakChapters.length > 0)
      ? weakChapters.slice(0, 3).map((w: any) => w.name || w)
      : ['Fundamental Principles', 'Applied Theory'];

    const topicsToRevise = (weakChapters && weakChapters.length > 0)
      ? weakChapters.flatMap((w: any) => w.missedTopics || ['Core Definitions', 'Practice Formulae']).slice(0, 4)
      : ['Core Definitions', 'Formula Derivations', 'Objective Recall'];

    const tips: string[] = [];

    // Tailored tips based on student mistake pattern
    if (carelessCount > 1) {
      tips.push('Eliminate Careless Slips: Underline negative qualifiers ("NOT", "EXCEPT", "ALWAYS") during your first pass before picking an option.');
    } else {
      tips.push('Precision Reading: Spend the first 10 seconds of each question mapping the given variables and units.');
    }

    if (conceptGapCount > 1 || percentage < 60) {
      tips.push('Address Core Gaps: Review the referenced textbook pages highlighted in your hardest questions list before attempting more practice.');
    } else {
      tips.push('Strengthen Retention: Convert key definitions and theorems from your weakest chapters into active-recall flashcards.');
    }

    if (timePressureCount > 1) {
      tips.push('Master Time Budgeting: Allocate a strict 60 seconds max per objective question; flag uncertain items for review rather than stalling.');
    } else {
      tips.push('Exam Simulation: Practice 15-minute high-intensity micro-quizzes to maintain your cognitive pacing.');
    }

    const studyPlan: AIStudyPlan = {
      priorityChapters,
      topicsToRevise,
      suggestedDailyMinutes: percentage < 50 ? 45 : percentage < 75 ? 30 : 20,
      tips: tips.slice(0, 3) as [string, string, string]
    };

    const validatedPlan = AIStudyPlanSchema.parse(studyPlan);

    return res.status(200).json({
      success: true,
      studyPlan: validatedPlan
    });
  } catch (error: any) {
    console.error('Study plan error:', error);
    return res.status(500).json({ error: error.message || 'Study plan generation failed' });
  }
}
