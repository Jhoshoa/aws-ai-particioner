import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../config/firebase.config';
import { docToObject, serverTimestamp } from '../utils/firestore.utils';
import { NotFoundError } from '../types/errors';
import {
  UserProgress,
  ProgressSummary,
  DomainProgress,
  EnhancedProgressSummary,
  DomainProgressDetail,
  TopicProgress,
  UpdateTopicProgressInput,
  UserStats,
  RecentActivity,
  DomainProgressStats,
} from '../types';
import { domainService } from './domain.service';

const USERS_COLLECTION = 'users';
const PROGRESS_SUBCOLLECTION = 'progress';

/**
 * Default user stats
 */
const DEFAULT_USER_STATS: UserStats = {
  totalStudyMinutes: 0,
  totalTopicsCompleted: 0,
  currentStreakDays: 0,
  longestStreakDays: 0,
  lastStudyDate: null,
  questionsAnswered: 0,
  correctAnswers: 0,
  quizzesTaken: 0,
};

/**
 * Progress service - handles user study progress
 */
export const progressService = {
  /**
   * Get all progress for a user
   */
  async getUserProgress(userId: string): Promise<(UserProgress & { id: string })[]> {
    const snapshot = await db
      .collection(USERS_COLLECTION)
      .doc(userId)
      .collection(PROGRESS_SUBCOLLECTION)
      .get();

    return snapshot.docs.map((doc) => docToObject<UserProgress>(doc));
  },

  /**
   * Get progress for a specific domain
   */
  async getProgressByDomain(
    userId: string,
    domainId: number
  ): Promise<(UserProgress & { id: string })[]> {
    const snapshot = await db
      .collection(USERS_COLLECTION)
      .doc(userId)
      .collection(PROGRESS_SUBCOLLECTION)
      .where('domainId', '==', domainId)
      .get();

    return snapshot.docs.map((doc) => docToObject<UserProgress>(doc));
  },

  /**
   * Update progress for a topic
   */
  async updateProgress(
    userId: string,
    domainId: number,
    topicIndex: number,
    completed: boolean
  ): Promise<UserProgress & { id: string }> {
    const progressId = `${domainId}-${topicIndex}`;
    const docRef = db
      .collection(USERS_COLLECTION)
      .doc(userId)
      .collection(PROGRESS_SUBCOLLECTION)
      .doc(progressId);

    const data: Partial<UserProgress> = {
      userId,
      domainId: String(domainId),
      topicIndex,
      completed,
      completedAt: completed ? new Date() : null,
      updatedAt: new Date(),
    };

    await docRef.set(
      {
        ...data,
        updatedAt: serverTimestamp(),
        completedAt: completed ? serverTimestamp() : null,
      },
      { merge: true }
    );

    const doc = await docRef.get();
    return docToObject<UserProgress>(doc);
  },

  /**
   * Get progress summary for a user
   */
  async getProgressSummary(userId: string): Promise<ProgressSummary> {
    // Get all domains
    const domains = await domainService.getAll();

    // Get all user progress
    const progress = await this.getUserProgress(userId);

    // Calculate totals
    let totalTopics = 0;
    let completedTopics = 0;

    const domainProgress: DomainProgress[] = domains.map((domain) => {
      const domainTopics = domain.topics.length;
      totalTopics += domainTopics;

      const completedInDomain = progress.filter(
        (p) => p.domainId === String(domain.domainNumber) && p.completed
      ).length;
      completedTopics += completedInDomain;

      return {
        domainId: domain.domainNumber,
        domainName: domain.name,
        totalTopics: domainTopics,
        completedTopics: completedInDomain,
        percentComplete:
          domainTopics > 0
            ? Math.round((completedInDomain / domainTopics) * 100)
            : 0,
      };
    });

    return {
      totalTopics,
      completedTopics,
      percentComplete:
        totalTopics > 0
          ? Math.round((completedTopics / totalTopics) * 100)
          : 0,
      domainProgress,
    };
  },

  /**
   * Reset all progress for a user
   */
  async resetProgress(userId: string): Promise<void> {
    const snapshot = await db
      .collection(USERS_COLLECTION)
      .doc(userId)
      .collection(PROGRESS_SUBCOLLECTION)
      .get();

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  },

  /**
   * Delete progress for a specific topic
   */
  async deleteProgress(
    userId: string,
    domainId: number,
    topicIndex: number
  ): Promise<void> {
    const progressId = `${domainId}-${topicIndex}`;
    const docRef = db
      .collection(USERS_COLLECTION)
      .doc(userId)
      .collection(PROGRESS_SUBCOLLECTION)
      .doc(progressId);

    const doc = await docRef.get();
    if (!doc.exists) {
      throw new NotFoundError('Progress');
    }

    await docRef.delete();
  },

  /**
   * Get enhanced progress summary with user stats
   */
  async getEnhancedProgressSummary(userId: string): Promise<EnhancedProgressSummary> {
    // Get user document for stats
    const userDoc = await db.collection(USERS_COLLECTION).doc(userId).get();
    const userData = userDoc.exists ? userDoc.data() : {};
    const stats: UserStats = userData?.stats || DEFAULT_USER_STATS;

    // Get all domains
    const domains = await domainService.getAll();

    // Get all user progress
    const progress = await this.getUserProgress(userId);

    // Calculate totals
    let totalTopics = 0;
    let completedTopics = 0;

    // Build domain progress map
    const domainProgressMap: Record<number, DomainProgressStats> = {};

    for (const domain of domains) {
      const domainTopics = domain.topics.length;
      totalTopics += domainTopics;

      const completedInDomain = progress.filter(
        (p) => p.domainId === String(domain.domainNumber) && p.completed
      ).length;
      completedTopics += completedInDomain;

      domainProgressMap[domain.domainNumber] = {
        completed: completedInDomain,
        total: domainTopics,
      };
    }

    // Get recent activity (last 10 completed topics)
    const recentProgressSnapshot = await db
      .collection(USERS_COLLECTION)
      .doc(userId)
      .collection(PROGRESS_SUBCOLLECTION)
      .where('completed', '==', true)
      .orderBy('completedAt', 'desc')
      .limit(10)
      .get();

    const recentActivity: RecentActivity[] = recentProgressSnapshot.docs
      .filter((doc) => doc.data().completedAt)
      .map((doc) => {
        const data = doc.data();
        const domainId = parseInt(String(data.domainId), 10);
        const domain = domains.find((d) => d.domainNumber === domainId);
        const topicName = domain?.topics[data.topicIndex] || `Topic ${data.topicIndex + 1}`;
        return {
          type: 'topic_completed' as const,
          description: `Completed "${topicName}" in ${domain?.name || 'Unknown Domain'}`,
          timestamp: data.completedAt,
          domainId,
        };
      });

    return {
      stats: {
        ...stats,
        totalTopicsCompleted: completedTopics,
      },
      domainProgress: domainProgressMap,
      totalTopics,
      completedTopics,
      percentComplete: totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0,
      recentActivity,
    };
  },

  /**
   * Get detailed progress for a specific domain
   */
  async getDomainProgressDetail(
    userId: string,
    domainId: number
  ): Promise<DomainProgressDetail> {
    // Get domain info
    const domains = await domainService.getAll();
    const domain = domains.find((d) => d.domainNumber === domainId);

    if (!domain) {
      throw new NotFoundError('Domain');
    }

    // Get progress for this domain
    const progressDocs = await this.getProgressByDomain(userId, domainId);

    // Build a map of topicIndex -> progress
    const progressMap = new Map<number, UserProgress & { id: string }>();
    for (const prog of progressDocs) {
      progressMap.set(prog.topicIndex, prog);
    }

    // Build topic progress array
    const topics: TopicProgress[] = domain.topics.map((topicName, index) => {
      const progress = progressMap.get(index);
      return {
        index,
        name: topicName,
        completed: progress?.completed || false,
        completedAt: progress?.completedAt || undefined,
        notes: undefined, // Notes are stored separately in notes collection
      };
    });

    const completedCount = topics.filter((t) => t.completed).length;

    return {
      domainId: domain.domainNumber,
      domainName: domain.name,
      color: domain.color,
      topics,
      completedCount,
      totalCount: topics.length,
      percentComplete: topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0,
    };
  },

  /**
   * Update topic progress with enhanced data
   */
  async updateTopicProgressEnhanced(
    userId: string,
    input: UpdateTopicProgressInput
  ): Promise<UserProgress & { id: string }> {
    const progressId = `${input.domainId}-${input.topicIndex}`;
    const docRef = db
      .collection(USERS_COLLECTION)
      .doc(userId)
      .collection(PROGRESS_SUBCOLLECTION)
      .doc(progressId);

    const existingDoc = await docRef.get();
    const wasCompleted = existingDoc.exists && existingDoc.data()?.completed;
    const isNowCompleted = input.completed;

    const progressData: Record<string, unknown> = {
      userId,
      domainId: String(input.domainId),
      topicIndex: input.topicIndex,
      completed: input.completed,
      completedAt: input.completed ? serverTimestamp() : null,
      updatedAt: serverTimestamp(),
    };

    if (input.studyTimeMinutes !== undefined) {
      progressData.studyTimeMinutes = input.studyTimeMinutes;
    }

    if (input.notes !== undefined) {
      progressData.notes = input.notes;
    }

    await docRef.set(progressData, { merge: true });

    // Update user stats if completion status changed
    if (wasCompleted !== isNowCompleted) {
      const userRef = db.collection(USERS_COLLECTION).doc(userId);
      const increment = isNowCompleted ? 1 : -1;

      await userRef.set(
        {
          stats: {
            totalTopicsCompleted: FieldValue.increment(increment),
            lastStudyDate: serverTimestamp(),
          },
        },
        { merge: true }
      );
    }

    const updatedDoc = await docRef.get();
    return docToObject<UserProgress>(updatedDoc);
  },

  /**
   * Batch update multiple topics
   */
  async batchUpdateProgress(
    userId: string,
    updates: UpdateTopicProgressInput[]
  ): Promise<void> {
    const batch = db.batch();
    let completedDelta = 0;

    for (const input of updates) {
      const progressId = `${input.domainId}-${input.topicIndex}`;
      const progressRef = db
        .collection(USERS_COLLECTION)
        .doc(userId)
        .collection(PROGRESS_SUBCOLLECTION)
        .doc(progressId);

      const existingDoc = await progressRef.get();
      const wasCompleted = existingDoc.exists && existingDoc.data()?.completed;

      if (wasCompleted !== input.completed) {
        completedDelta += input.completed ? 1 : -1;
      }

      batch.set(
        progressRef,
        {
          userId,
          domainId: String(input.domainId),
          topicIndex: input.topicIndex,
          completed: input.completed,
          completedAt: input.completed ? serverTimestamp() : null,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }

    await batch.commit();

    // Update user stats
    if (completedDelta !== 0) {
      const userRef = db.collection(USERS_COLLECTION).doc(userId);
      await userRef.set(
        {
          stats: {
            totalTopicsCompleted: FieldValue.increment(completedDelta),
            lastStudyDate: serverTimestamp(),
          },
        },
        { merge: true }
      );
    }
  },

  /**
   * Add study time to user stats
   */
  async addStudyTime(userId: string, minutes: number): Promise<void> {
    const userRef = db.collection(USERS_COLLECTION).doc(userId);
    await userRef.set(
      {
        stats: {
          totalStudyMinutes: FieldValue.increment(minutes),
          lastStudyDate: serverTimestamp(),
        },
      },
      { merge: true }
    );
  },

  /**
   * Get user stats
   */
  async getUserStats(userId: string): Promise<UserStats> {
    const userDoc = await db.collection(USERS_COLLECTION).doc(userId).get();
    const userData = userDoc.exists ? userDoc.data() : {};
    return userData?.stats || DEFAULT_USER_STATS;
  },
};
