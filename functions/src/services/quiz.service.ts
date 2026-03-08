import { db } from '../config/firebase.config';
import { docToObject, serverTimestamp } from '../utils/firestore.utils';
import { NotFoundError, ForbiddenError } from '../types/errors';
import { Question, QuizConfig, QuizAttempt, QuizSubmission } from '../types';

const QUESTIONS_COLLECTION = 'questions';
const ATTEMPTS_COLLECTION = 'quizAttempts';

/**
 * Quiz service - handles quiz operations
 */
export const quizService = {
  /**
   * Get all questions (optionally filtered by domain)
   */
  async getQuestions(domainId?: number): Promise<Question[]> {
    let query: FirebaseFirestore.Query = db
      .collection(QUESTIONS_COLLECTION)
      .orderBy('order', 'asc');

    if (domainId) {
      query = query.where('domainId', '==', domainId);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => docToObject<Question>(doc));
  },

  /**
   * Get question by ID
   */
  async getQuestionById(questionId: string): Promise<Question> {
    const doc = await db.collection(QUESTIONS_COLLECTION).doc(questionId).get();

    if (!doc.exists) {
      throw new NotFoundError('Question');
    }

    return docToObject<Question>(doc);
  },

  /**
   * Start a quiz session - returns questions without answers
   */
  async startQuiz(
    userId: string,
    config: QuizConfig
  ): Promise<{ attemptId: string; questions: Omit<Question, 'correctAnswer' | 'explanation'>[] }> {
    let questions = await this.getQuestions(config.domainId);

    // Shuffle questions
    questions = questions.sort(() => Math.random() - 0.5);

    // Limit to requested count
    questions = questions.slice(0, config.questionCount);

    if (questions.length === 0) {
      throw new NotFoundError('No questions available for the selected criteria');
    }

    // Create attempt record
    const attemptRef = db.collection(ATTEMPTS_COLLECTION).doc();
    const attempt: Omit<QuizAttempt, 'id'> = {
      userId,
      mode: config.mode,
      domainId: config.domainId,
      questions: questions.map((q) => ({
        questionId: q.id,
        selectedAnswer: null,
        correctAnswer: q.correctAnswer,
        correct: false,
        timeSpentSeconds: 0,
      })),
      score: 0,
      totalQuestions: questions.length,
      correctCount: 0,
      startedAt: serverTimestamp() as unknown as Date,
      timeSpentSeconds: 0,
    };

    await attemptRef.set(attempt);

    // Remove answers from response
    const sanitizedQuestions = questions.map(
      ({ correctAnswer, explanation, ...rest }) => rest
    );

    return {
      attemptId: attemptRef.id,
      questions: sanitizedQuestions,
    };
  },

  /**
   * Submit answer for a question
   */
  async submitAnswer(
    userId: string,
    attemptId: string,
    submission: QuizSubmission
  ): Promise<{ correct: boolean; correctAnswer: string; explanation: string }> {
    const attemptRef = db.collection(ATTEMPTS_COLLECTION).doc(attemptId);
    const attemptDoc = await attemptRef.get();

    if (!attemptDoc.exists) {
      throw new NotFoundError('Quiz attempt');
    }

    const attempt = docToObject<QuizAttempt>(attemptDoc);

    if (attempt.userId !== userId) {
      throw new ForbiddenError('You do not have access to this quiz attempt');
    }

    if (attempt.completedAt) {
      throw new ForbiddenError('This quiz has already been completed');
    }

    // Get the question to check answer
    const question = await this.getQuestionById(submission.questionId);
    const correct = submission.selectedAnswer === question.correctAnswer;

    // Update the question result in the attempt
    const questionIndex = attempt.questions.findIndex(
      (q) => q.questionId === submission.questionId
    );

    if (questionIndex === -1) {
      throw new NotFoundError('Question not part of this quiz');
    }

    // Check if question was already answered
    if (attempt.questions[questionIndex].selectedAnswer !== null) {
      throw new ForbiddenError('This question has already been answered');
    }

    attempt.questions[questionIndex] = {
      ...attempt.questions[questionIndex],
      selectedAnswer: submission.selectedAnswer,
      correct,
      timeSpentSeconds: submission.timeSpentSeconds,
    };

    // Recalculate score
    const correctCount = attempt.questions.filter((q) => q.correct).length;
    const score = Math.round((correctCount / attempt.totalQuestions) * 100);

    await attemptRef.update({
      questions: attempt.questions,
      correctCount,
      score,
      timeSpentSeconds: attempt.questions.reduce((sum, q) => sum + q.timeSpentSeconds, 0),
      updatedAt: serverTimestamp(),
    });

    return {
      correct,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
    };
  },

  /**
   * Complete quiz and get final results
   */
  async completeQuiz(userId: string, attemptId: string): Promise<QuizAttempt> {
    const attemptRef = db.collection(ATTEMPTS_COLLECTION).doc(attemptId);
    const attemptDoc = await attemptRef.get();

    if (!attemptDoc.exists) {
      throw new NotFoundError('Quiz attempt');
    }

    const attempt = docToObject<QuizAttempt>(attemptDoc);

    if (attempt.userId !== userId) {
      throw new ForbiddenError('You do not have access to this quiz attempt');
    }

    if (attempt.completedAt) {
      // Already completed, just return it
      return attempt;
    }

    await attemptRef.update({
      completedAt: serverTimestamp(),
    });

    return {
      ...attempt,
      completedAt: new Date().toISOString(),
    };
  },

  /**
   * Get a specific quiz attempt
   */
  async getAttemptById(userId: string, attemptId: string): Promise<QuizAttempt> {
    const attemptRef = db.collection(ATTEMPTS_COLLECTION).doc(attemptId);
    const attemptDoc = await attemptRef.get();

    if (!attemptDoc.exists) {
      throw new NotFoundError('Quiz attempt');
    }

    const attempt = docToObject<QuizAttempt>(attemptDoc);

    if (attempt.userId !== userId) {
      throw new ForbiddenError('You do not have access to this quiz attempt');
    }

    return attempt;
  },

  /**
   * Get user's quiz history
   */
  async getUserAttempts(userId: string, limit = 10): Promise<QuizAttempt[]> {
    const snapshot = await db
      .collection(ATTEMPTS_COLLECTION)
      .where('userId', '==', userId)
      .orderBy('startedAt', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => docToObject<QuizAttempt>(doc));
  },

  /**
   * Get user's quiz statistics
   */
  async getUserStats(userId: string): Promise<{
    totalAttempts: number;
    averageScore: number;
    totalQuestionsAnswered: number;
    correctAnswers: number;
    domainStats: Record<number, { attempts: number; averageScore: number }>;
  }> {
    const attempts = await this.getUserAttempts(userId, 100);

    if (attempts.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        totalQuestionsAnswered: 0,
        correctAnswers: 0,
        domainStats: {},
      };
    }

    const completedAttempts = attempts.filter((a) => a.completedAt);
    const totalScore = completedAttempts.reduce((sum, a) => sum + a.score, 0);
    const totalQuestions = completedAttempts.reduce((sum, a) => sum + a.totalQuestions, 0);
    const totalCorrect = completedAttempts.reduce((sum, a) => sum + a.correctCount, 0);

    // Calculate domain-specific stats
    const domainStats: Record<number, { attempts: number; totalScore: number }> = {};

    for (const attempt of completedAttempts) {
      if (attempt.domainId) {
        if (!domainStats[attempt.domainId]) {
          domainStats[attempt.domainId] = { attempts: 0, totalScore: 0 };
        }
        domainStats[attempt.domainId].attempts += 1;
        domainStats[attempt.domainId].totalScore += attempt.score;
      }
    }

    const formattedDomainStats: Record<number, { attempts: number; averageScore: number }> = {};
    for (const [domainId, stats] of Object.entries(domainStats)) {
      formattedDomainStats[Number(domainId)] = {
        attempts: stats.attempts,
        averageScore: Math.round(stats.totalScore / stats.attempts),
      };
    }

    return {
      totalAttempts: completedAttempts.length,
      averageScore: completedAttempts.length > 0
        ? Math.round(totalScore / completedAttempts.length)
        : 0,
      totalQuestionsAnswered: totalQuestions,
      correctAnswers: totalCorrect,
      domainStats: formattedDomainStats,
    };
  },
};
