import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../config/firebase.config';
import { docToObject, serverTimestamp } from '../utils/firestore.utils';
import { NotFoundError, ForbiddenError } from '../types/errors';
import {
  MockExam,
  MockExamQuestion,
  MockExamResults,
  Question,
} from '../types';

const COLLECTION = 'mockExams';
const QUESTIONS_COLLECTION = 'questions';
const USERS_COLLECTION = 'users';

// Domain question distribution for AWS AI Practitioner exam
// Domain question distribution for AWS AI Practitioner exam (65 total questions)
const DOMAIN_QUESTIONS: Record<number, number> = {
  1: 13, // AI/ML Fundamentals - 20%
  2: 16, // Generative AI - 24%
  3: 18, // Foundation Models - 28%
  4: 9,  // Responsible AI - 14%
  5: 9,  // Security & Compliance - 14%
};

const TIME_LIMIT_MINUTES = 90;
const PASSING_SCORE = 700;

/**
 * Mock Exam service - handles full-length practice exam operations
 */
export const mockExamService = {
  /**
   * Start a new mock exam
   */
  async startExam(userId: string): Promise<MockExam> {
    // Check for active exams and abandon them
    const activeExam = await this.getActiveExam(userId);
    if (activeExam) {
      await db.collection(COLLECTION).doc(activeExam.id).update({
        status: 'abandoned',
        completedAt: serverTimestamp(),
      });
    }

    // Get questions for each domain
    const allQuestions: MockExamQuestion[] = [];

    for (const [domainIdStr, count] of Object.entries(DOMAIN_QUESTIONS)) {
      const domainId = parseInt(domainIdStr);
      const snapshot = await db
        .collection(QUESTIONS_COLLECTION)
        .where('domainId', '==', domainId)
        .get();

      const questions = snapshot.docs.map((doc) => ({
        questionId: doc.id,
        domainId,
      }));

      // Shuffle and take required count
      const shuffled = questions.sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, count);

      selected.forEach((q) => {
        allQuestions.push({
          questionId: q.questionId,
          domainId: q.domainId,
          flagged: false,
          timeSpentSeconds: 0,
        });
      });
    }

    // Shuffle all questions
    const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);

    const examRef = db.collection(COLLECTION).doc();
    const examData = {
      userId,
      status: 'in_progress',
      startedAt: serverTimestamp(),
      timeLimitMinutes: TIME_LIMIT_MINUTES,
      timeSpentMinutes: 0,
      questions: shuffledQuestions,
    };

    await examRef.set(examData);

    const doc = await examRef.get();
    return docToObject<MockExam>(doc);
  },

  /**
   * Get active exam for user (in_progress only)
   */
  async getActiveExam(userId: string): Promise<MockExam | null> {
    const snapshot = await db
      .collection(COLLECTION)
      .where('userId', '==', userId)
      .where('status', '==', 'in_progress')
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    return docToObject<MockExam>(snapshot.docs[0]);
  },

  /**
   * Get exam by ID
   */
  async getExam(userId: string, examId: string): Promise<MockExam> {
    const doc = await db.collection(COLLECTION).doc(examId).get();

    if (!doc.exists) {
      throw new NotFoundError('Mock exam');
    }

    const exam = docToObject<MockExam>(doc);

    if (exam.userId !== userId) {
      throw new ForbiddenError('Not authorized to access this exam');
    }

    return exam;
  },

  /**
   * Get exam questions (without answers for in-progress exams)
   */
  async getExamQuestions(
    userId: string,
    examId: string
  ): Promise<{
    exam: MockExam;
    questions: Array<Omit<Question, 'correctAnswer' | 'explanation'> & { id: string }>;
  }> {
    const exam = await this.getExam(userId, examId);

    // Get full question data
    const questionIds = exam.questions.map((q) => q.questionId);
    const questions: Array<Omit<Question, 'correctAnswer' | 'explanation'> & { id: string }> = [];

    for (const qId of questionIds) {
      const doc = await db.collection(QUESTIONS_COLLECTION).doc(qId).get();
      if (doc.exists) {
        const data = doc.data() as Question;
        // Don't send answers if exam is in progress
        if (exam.status === 'in_progress') {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { correctAnswer, explanation, ...rest } = data;
          questions.push({ ...rest, id: doc.id });
        } else {
          questions.push({ ...data, id: doc.id });
        }
      }
    }

    return { exam, questions };
  },

  /**
   * Update answer for a question
   */
  async updateAnswer(
    userId: string,
    examId: string,
    questionId: string,
    answer: 'A' | 'B' | 'C' | 'D',
    timeSpent: number
  ): Promise<void> {
    const examRef = db.collection(COLLECTION).doc(examId);
    const doc = await examRef.get();

    if (!doc.exists) {
      throw new NotFoundError('Mock exam');
    }

    const exam = docToObject<MockExam>(doc);

    if (exam.userId !== userId) {
      throw new ForbiddenError('Not authorized');
    }

    if (exam.status !== 'in_progress') {
      throw new Error('Exam already completed');
    }

    // Update the specific question
    const questions = exam.questions.map((q) =>
      q.questionId === questionId
        ? { ...q, selectedAnswer: answer, timeSpentSeconds: timeSpent }
        : q
    );

    await examRef.update({ questions });
  },

  /**
   * Toggle flag on question
   */
  async toggleFlag(
    userId: string,
    examId: string,
    questionId: string
  ): Promise<boolean> {
    const exam = await this.getExam(userId, examId);

    if (exam.status !== 'in_progress') {
      throw new Error('Exam already completed');
    }

    let newFlagState = false;
    const questions = exam.questions.map((q) => {
      if (q.questionId === questionId) {
        newFlagState = !q.flagged;
        return { ...q, flagged: newFlagState };
      }
      return q;
    });

    await db.collection(COLLECTION).doc(examId).update({ questions });
    return newFlagState;
  },

  /**
   * Submit and score exam
   */
  async submitExam(
    userId: string,
    examId: string,
    timeSpent: number
  ): Promise<MockExamResults> {
    const exam = await this.getExam(userId, examId);

    if (exam.status !== 'in_progress') {
      throw new Error('Exam already submitted');
    }

    // Get correct answers
    const correctAnswers: Record<string, string> = {};
    for (const q of exam.questions) {
      const doc = await db.collection(QUESTIONS_COLLECTION).doc(q.questionId).get();
      if (doc.exists) {
        correctAnswers[q.questionId] = doc.data()?.correctAnswer;
      }
    }

    // Score the exam
    const domainScores: Record<number, { correct: number; total: number }> = {
      1: { correct: 0, total: 0 },
      2: { correct: 0, total: 0 },
      3: { correct: 0, total: 0 },
      4: { correct: 0, total: 0 },
      5: { correct: 0, total: 0 },
    };

    let correctCount = 0;
    let answeredCount = 0;

    for (const q of exam.questions) {
      domainScores[q.domainId].total++;

      if (q.selectedAnswer) {
        answeredCount++;
        if (q.selectedAnswer === correctAnswers[q.questionId]) {
          correctCount++;
          domainScores[q.domainId].correct++;
        }
      }
    }

    // Calculate AWS-style scaled score (100-1000)
    const rawPercentage = correctCount / exam.questions.length;
    const scaledScore = Math.round(100 + rawPercentage * 900);

    // Get previous best score for improvement tracking
    const history = await this.getExamHistory(userId, 1);
    const previousBest = history.length > 0 && history[0].results
      ? history[0].results.score
      : undefined;

    const results: MockExamResults = {
      totalQuestions: exam.questions.length,
      answeredCount,
      correctCount,
      score: scaledScore,
      passed: scaledScore >= PASSING_SCORE,
      passingScore: PASSING_SCORE,
      domainScores: Object.fromEntries(
        Object.entries(domainScores).map(([domainId, scores]) => [
          domainId,
          {
            ...scores,
            percentage: scores.total > 0
              ? Math.round((scores.correct / scores.total) * 100)
              : 0,
          },
        ])
      ),
      improvement: previousBest !== undefined ? scaledScore - previousBest : undefined,
    };

    // Update exam
    await db.collection(COLLECTION).doc(examId).update({
      status: 'completed',
      completedAt: serverTimestamp(),
      timeSpentMinutes: timeSpent,
      results,
    });

    // Update user stats
    const userRef = db.collection(USERS_COLLECTION).doc(userId);
    await userRef.set(
      {
        stats: {
          mockExamsTaken: FieldValue.increment(1),
        },
      },
      { merge: true }
    );

    // Update best score if higher
    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      const currentBest = userDoc.data()?.stats?.bestMockScore || 0;
      if (scaledScore > currentBest) {
        transaction.update(userRef, { 'stats.bestMockScore': scaledScore });
      }
    });

    return results;
  },

  /**
   * Get user's exam history
   */
  async getExamHistory(userId: string, limit = 10): Promise<MockExam[]> {
    const snapshot = await db
      .collection(COLLECTION)
      .where('userId', '==', userId)
      .where('status', '==', 'completed')
      .orderBy('completedAt', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => docToObject<MockExam>(doc));
  },

  /**
   * Get exam summary stats
   */
  async getExamStats(userId: string): Promise<{
    totalExams: number;
    averageScore: number;
    bestScore: number;
    passRate: number;
  }> {
    const exams = await this.getExamHistory(userId, 100);

    if (exams.length === 0) {
      return {
        totalExams: 0,
        averageScore: 0,
        bestScore: 0,
        passRate: 0,
      };
    }

    const scores = exams
      .filter((e) => e.results)
      .map((e) => e.results!.score);

    const passedCount = exams.filter((e) => e.results?.passed).length;

    return {
      totalExams: exams.length,
      averageScore: scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0,
      bestScore: scores.length > 0 ? Math.max(...scores) : 0,
      passRate: Math.round((passedCount / exams.length) * 100),
    };
  },
};
