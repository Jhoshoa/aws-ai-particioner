import { db } from '../config/firebase.config';
import { docToObject, serverTimestamp } from '../utils/firestore.utils';
import {
  QuestionProgress,
  ReviewQueueItem,
  ReviewStats,
  ReviewSubmission,
  Question,
} from '../types';

const PROGRESS_COLLECTION = 'questionProgress';
const QUESTIONS_COLLECTION = 'questions';

/**
 * Add days to a date
 */
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Spaced Repetition service - SM-2 algorithm implementation
 */
export const spacedRepetitionService = {
  /**
   * Calculate next review using SM-2 algorithm
   *
   * Quality ratings:
   * 0 - Complete blackout (failed)
   * 1 - Incorrect, wrong answer recognized
   * 2 - Incorrect, correct answer seemed easy to recall
   * 3 - Correct, with significant difficulty
   * 4 - Correct, after some hesitation
   * 5 - Perfect response (passed)
   */
  calculateNextReview(
    current: { easeFactor: number; interval: number; repetitions: number },
    quality: number
  ): { easeFactor: number; interval: number; repetitions: number; nextReviewDate: Date } {
    let { easeFactor, interval, repetitions } = current;

    // Update ease factor using SM-2 formula
    easeFactor = Math.max(
      1.3,
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );

    if (quality < 3) {
      // Failed - reset repetitions
      repetitions = 0;
      interval = 1;
    } else {
      // Passed - increase interval
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions += 1;
    }

    const nextReviewDate = addDays(new Date(), interval);

    return { easeFactor, interval, repetitions, nextReviewDate };
  },

  /**
   * Get review queue (questions due for review)
   */
  async getReviewQueue(userId: string, limit = 20): Promise<ReviewQueueItem[]> {
    // Get questions due today or overdue
    const snapshot = await db
      .collection(PROGRESS_COLLECTION)
      .where('userId', '==', userId)
      .where('nextReviewDate', '<=', new Date())
      .orderBy('nextReviewDate', 'asc')
      .limit(limit)
      .get();

    const queue: ReviewQueueItem[] = [];

    for (const doc of snapshot.docs) {
      const progress = docToObject<QuestionProgress>(doc);

      // Get question details
      const questionDoc = await db
        .collection(QUESTIONS_COLLECTION)
        .doc(progress.questionId)
        .get();

      if (questionDoc.exists) {
        const questionData = questionDoc.data() as Question;
        const dueDate = new Date(progress.nextReviewDate).toISOString().split('T')[0];
        const overdueDays = Math.floor(
          (new Date().getTime() - new Date(progress.nextReviewDate).getTime()) /
            (1000 * 60 * 60 * 24)
        );

        queue.push({
          questionId: progress.questionId,
          domainId: progress.domainId,
          question: questionData.question,
          options: questionData.options,
          dueDate,
          overdueDays: Math.max(0, overdueDays),
        });
      }
    }

    return queue;
  },

  /**
   * Submit review answer
   */
  async submitReview(
    userId: string,
    submission: ReviewSubmission
  ): Promise<{ progress: QuestionProgress; correct: boolean; correctAnswer: string; explanation: string }> {
    const progressId = `${userId}_${submission.questionId}`;
    const progressRef = db.collection(PROGRESS_COLLECTION).doc(progressId);
    const progressDoc = await progressRef.get();

    // Get correct answer
    const questionDoc = await db
      .collection(QUESTIONS_COLLECTION)
      .doc(submission.questionId)
      .get();

    if (!questionDoc.exists) {
      throw new Error('Question not found');
    }

    const questionData = questionDoc.data() as Question;
    const correctAnswer = questionData.correctAnswer;
    const explanation = questionData.explanation;
    const isCorrect = submission.selectedAnswer === correctAnswer;

    let progressData: Partial<QuestionProgress>;

    if (progressDoc.exists) {
      const existing = docToObject<QuestionProgress>(progressDoc);

      // Calculate new SM-2 values
      const nextReview = this.calculateNextReview(
        {
          easeFactor: existing.easeFactor,
          interval: existing.interval,
          repetitions: existing.repetitions,
        },
        submission.quality
      );

      progressData = {
        ...nextReview,
        lastReviewDate: serverTimestamp() as unknown as Date,
        totalAttempts: existing.totalAttempts + 1,
        correctAttempts: existing.correctAttempts + (isCorrect ? 1 : 0),
        averageQuality:
          (existing.averageQuality * existing.totalAttempts + submission.quality) /
          (existing.totalAttempts + 1),
        mastered: nextReview.repetitions >= 5 && nextReview.easeFactor >= 2.5,
      };

      await progressRef.update(progressData);
    } else {
      // First time seeing this question through review
      const nextReview = this.calculateNextReview(
        { easeFactor: 2.5, interval: 1, repetitions: 0 },
        submission.quality
      );

      progressData = {
        userId,
        questionId: submission.questionId,
        domainId: questionData.domainId,
        ...nextReview,
        lastReviewDate: serverTimestamp() as unknown as Date,
        totalAttempts: 1,
        correctAttempts: isCorrect ? 1 : 0,
        averageQuality: submission.quality,
        mastered: false,
      };

      await progressRef.set(progressData);
    }

    const updatedDoc = await progressRef.get();
    return {
      progress: docToObject<QuestionProgress>(updatedDoc),
      correct: isCorrect,
      correctAnswer,
      explanation,
    };
  },

  /**
   * Add question to review queue (after wrong answer in quiz)
   */
  async addToReviewQueue(
    userId: string,
    questionId: string,
    domainId: number
  ): Promise<void> {
    const progressId = `${userId}_${questionId}`;
    const progressRef = db.collection(PROGRESS_COLLECTION).doc(progressId);
    const progressDoc = await progressRef.get();

    if (!progressDoc.exists) {
      // Create new progress entry - due immediately
      await progressRef.set({
        userId,
        questionId,
        domainId,
        easeFactor: 2.5,
        interval: 1,
        repetitions: 0,
        nextReviewDate: new Date(),
        lastReviewDate: serverTimestamp(),
        totalAttempts: 1,
        correctAttempts: 0,
        averageQuality: 0,
        mastered: false,
      });
    }
  },

  /**
   * Get review statistics
   */
  async getReviewStats(userId: string): Promise<ReviewStats> {
    const snapshot = await db
      .collection(PROGRESS_COLLECTION)
      .where('userId', '==', userId)
      .get();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let dueToday = 0;
    let overdue = 0;
    let masteredCount = 0;
    let totalEaseFactor = 0;
    let earliestReviewDate: Date | null = null;

    for (const doc of snapshot.docs) {
      const progress = doc.data() as QuestionProgress;
      const reviewDate = new Date(progress.nextReviewDate);

      totalEaseFactor += progress.easeFactor;

      if (progress.mastered) {
        masteredCount++;
      }

      if (reviewDate < today) {
        overdue++;
        dueToday++;
      } else if (reviewDate < tomorrow) {
        dueToday++;
      }

      // Track next review date (earliest)
      if (earliestReviewDate === null || reviewDate < earliestReviewDate) {
        earliestReviewDate = reviewDate;
      }
    }

    return {
      totalCards: snapshot.size,
      dueToday,
      overdue,
      masteredCount,
      averageEaseFactor:
        snapshot.size > 0 ? Math.round((totalEaseFactor / snapshot.size) * 10) / 10 : 2.5,
      nextReviewDate: earliestReviewDate
        ? earliestReviewDate.toISOString().split('T')[0]
        : null,
    };
  },

  /**
   * Get question progress for a specific question
   */
  async getQuestionProgress(
    userId: string,
    questionId: string
  ): Promise<QuestionProgress | null> {
    const progressId = `${userId}_${questionId}`;
    const doc = await db.collection(PROGRESS_COLLECTION).doc(progressId).get();

    if (!doc.exists) return null;
    return docToObject<QuestionProgress>(doc);
  },

  /**
   * Get all question progress for a user (paginated)
   */
  async getAllProgress(
    userId: string,
    limit = 50,
    offset = 0
  ): Promise<QuestionProgress[]> {
    const snapshot = await db
      .collection(PROGRESS_COLLECTION)
      .where('userId', '==', userId)
      .orderBy('nextReviewDate', 'asc')
      .offset(offset)
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => docToObject<QuestionProgress>(doc));
  },
};
