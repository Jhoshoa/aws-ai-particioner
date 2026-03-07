import { db } from '../config/firebase.config';
import { docToObject, serverTimestamp } from '../utils/firestore.utils';
import { NotFoundError } from '../types/errors';
import { UserProgress, ProgressSummary, DomainProgress } from '../types';
import { domainService } from './domain.service';

const USERS_COLLECTION = 'users';
const PROGRESS_SUBCOLLECTION = 'progress';

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
};
