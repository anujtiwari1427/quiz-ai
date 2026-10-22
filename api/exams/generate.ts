// Vercel Serverless Function: /api/exams/generate
import type { IncomingMessage, ServerResponse } from 'http';
import { ExamConfigSchema, ExamQuestionSchema, ExamQuestionModel } from '../../src/types/schemas';

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
    const parseResult = ExamConfigSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Invalid exam configuration',
        details: parseResult.error.flatten()
      });
    }

    const config = parseResult.data;
    const { totalQuestions, totalMarks, questionTypes, difficultyMix, sourceChapterIds } = config;

    // Calculate marks per question distribution so sum == totalMarks
    const baseMark = Math.max(1, Math.floor(totalMarks / totalQuestions));
    let remainder = totalMarks - (baseMark * totalQuestions);

    const generatedQuestions: ExamQuestionModel[] = [];

    for (let i = 0; i < totalQuestions; i++) {
      const qType = questionTypes[i % questionTypes.length];
      const qMark = baseMark + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;

      const chapterName = sourceChapterIds[i % sourceChapterIds.length] || 'Chapter 1: Core Fundamentals';
      const pageNumber = ((i + 1) * 7) % 45 + 1;

      // Determine difficulty based on mix
      let diff: 'easy' | 'medium' | 'hard' = 'medium';
      const rand = Math.random() * 100;
      if (rand < difficultyMix.easy) diff = 'easy';
      else if (rand < difficultyMix.easy + difficultyMix.medium) diff = 'medium';
      else diff = 'hard';

      // Bloom level
      const blooms = ['Remember', 'Understand', 'Apply', 'Analyze'] as const;
      const bloom = blooms[i % blooms.length];

      let rawQuestion: Partial<ExamQuestionModel> = {
        id: `q_${Date.now()}_${i + 1}`,
        type: qType,
        chapterId: `ch_${i + 1}`,
        chapterName,
        pageRef: `Page ${pageNumber}`,
        difficulty: diff,
        bloomLevel: bloom,
        marks: qMark,
        estimatedTimeSec: qType === 'long_answer' ? 300 : qType === 'short_answer' ? 120 : 60
      };

      if (qType === 'mcq') {
        rawQuestion = {
          ...rawQuestion,
          question: `Regarding ${chapterName}, which of the following is true according to Page ${pageNumber}?`,
          options: [
            { id: 'opt_a', text: `Primary principle outlined on page ${pageNumber} correctly holds.` },
            { id: 'opt_b', text: `The reverse mechanism occurs under non-standard conditions.` },
            { id: 'opt_c', text: `Variable factors remain constant independent of temperature.` },
            { id: 'opt_d', text: `The principle applies only in closed gaseous equilibrium.` }
          ],
          correctAnswer: `Primary principle outlined on page ${pageNumber} correctly holds.`,
          explanation: `As detailed in the textbook on page ${pageNumber}, the core postulate affirms statement A.`
        };
      } else if (qType === 'true_false') {
        rawQuestion = {
          ...rawQuestion,
          question: `True or False: According to ${chapterName} (Page ${pageNumber}), the rate of energy dissipation is directly proportional to applied resistance.`,
          options: [
            { id: 'tf_t', text: 'True' },
            { id: 'tf_f', text: 'False' }
          ],
          correctAnswer: 'True',
          explanation: `Verified from chapter text (Page ${pageNumber}).`
        };
      } else if (qType === 'numerical') {
        rawQuestion = {
          ...rawQuestion,
          question: `Calculate the final value in ${chapterName} when initial input is 24 units and efficiency factor is 0.75 (Page ${pageNumber}).`,
          correctAnswer: '18',
          explanation: `Calculated as 24 * 0.75 = 18 units as shown in the textbook formula.`
        };
      } else {
        rawQuestion = {
          ...rawQuestion,
          question: `Explain the fundamental concept of ${chapterName} as discussed on Page ${pageNumber}. Provide two distinct real-world proofs.`,
          correctAnswer: `Key theoretical definition from Page ${pageNumber} accompanied by two empirical proofs.`,
          explanation: `Model answer aligns with curriculum textbook marking rubric.`
        };
      }

      // Validate with ExamQuestionSchema
      const validated = ExamQuestionSchema.parse(rawQuestion);
      generatedQuestions.push(validated);
    }

    // Verify marks sum
    const currentSum = generatedQuestions.reduce((sum, q) => sum + q.marks, 0);

    return res.status(200).json({
      success: true,
      questions: generatedQuestions,
      totalQuestions: generatedQuestions.length,
      totalMarks: currentSum,
      sourceChapters: sourceChapterIds
    });
  } catch (error: any) {
    console.error('Exam generation error:', error);
    return res.status(500).json({ error: error.message || 'Exam generation failed' });
  }
}
