import { db } from '../config/firebase.config';
import { serverTimestamp } from '../utils/firestore.utils';
import { StreakInfo } from '../types';
import { Timestamp } from 'firebase-admin/firestore';

const USERS_COLLECTION = 'users';

/**
 * Get today's date in YYYY-MM-DD format
 */
function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get yesterday's date in YYYY-MM-DD format
 */
function getYesterdayDate(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

/**
 * Streak service - handles study streak tracking
 */
export const streakService = {
  /**
   * Get user's streak information
   */
  async getStreakInfo(userId: string): Promise<StreakInfo> {
    const userDoc = await db.collection(USERS_COLLECTION).doc(userId).get();
    const userData = userDoc.data();
    const stats = userData?.stats || {};

    const today = getTodayDate();
    const lastStudyTimestamp = stats.lastStudyDate;
    const lastStudyDate = lastStudyTimestamp
      ? lastStudyTimestamp instanceof Timestamp
        ? lastStudyTimestamp.toDate().toISOString().split('T')[0]
        : new Date(lastStudyTimestamp).toISOString().split('T')[0]
      : null;

    const isActiveToday = lastStudyDate === today;

    // Check if streak should be reset
    let currentStreak = stats.currentStreakDays || 0;
    if (lastStudyDate && !isActiveToday) {
      const yesterday = getYesterdayDate();
      if (lastStudyDate !== yesterday) {
        // Streak is broken
        currentStreak = 0;
      }
    }

    return {
      currentStreak,
      longestStreak: stats.longestStreakDays || 0,
      lastStudyDate,
      isActiveToday,
      studyDates: stats.studyDates || [],
    };
  },

  /**
   * Record study activity for today
   */
  async recordStudyActivity(userId: string): Promise<StreakInfo> {
    const userRef = db.collection(USERS_COLLECTION).doc(userId);
    const today = getTodayDate();

    return db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      const userData = userDoc.data();
      const stats = userData?.stats || {};

      const lastStudyTimestamp = stats.lastStudyDate;
      const lastStudyDate = lastStudyTimestamp
        ? lastStudyTimestamp instanceof Timestamp
          ? lastStudyTimestamp.toDate().toISOString().split('T')[0]
          : new Date(lastStudyTimestamp).toISOString().split('T')[0]
        : null;

      // Already recorded today
      if (lastStudyDate === today) {
        return {
          currentStreak: stats.currentStreakDays || 1,
          longestStreak: stats.longestStreakDays || 1,
          lastStudyDate: today,
          isActiveToday: true,
          studyDates: stats.studyDates || [today],
        };
      }

      // Calculate new streak
      let newStreak = 1;
      if (lastStudyDate) {
        const yesterday = getYesterdayDate();
        if (lastStudyDate === yesterday) {
          // Continuing streak
          newStreak = (stats.currentStreakDays || 0) + 1;
        }
        // Otherwise streak resets to 1
      }

      const newLongestStreak = Math.max(newStreak, stats.longestStreakDays || 0);

      // Update study dates (keep last 90 days)
      let studyDates: string[] = stats.studyDates || [];
      if (!studyDates.includes(today)) {
        studyDates = [today, ...studyDates].slice(0, 90);
      }

      transaction.update(userRef, {
        'stats.currentStreakDays': newStreak,
        'stats.longestStreakDays': newLongestStreak,
        'stats.lastStudyDate': serverTimestamp(),
        'stats.studyDates': studyDates,
      });

      return {
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastStudyDate: today,
        isActiveToday: true,
        studyDates,
      };
    });
  },

  /**
   * Check and reset broken streaks (called by scheduled function)
   */
  async resetBrokenStreaks(): Promise<number> {
    const yesterday = getYesterdayDate();

    // Find users whose last study date is more than 1 day ago
    // and have an active streak
    const snapshot = await db
      .collection(USERS_COLLECTION)
      .where('stats.currentStreakDays', '>', 0)
      .get();

    let resetCount = 0;
    const batch = db.batch();

    snapshot.docs.forEach((doc) => {
      const stats = doc.data().stats;
      const lastStudyTimestamp = stats?.lastStudyDate;
      const lastStudyDate = lastStudyTimestamp
        ? lastStudyTimestamp instanceof Timestamp
          ? lastStudyTimestamp.toDate().toISOString().split('T')[0]
          : new Date(lastStudyTimestamp).toISOString().split('T')[0]
        : null;

      if (lastStudyDate && lastStudyDate < yesterday) {
        batch.update(doc.ref, {
          'stats.currentStreakDays': 0,
        });
        resetCount++;
      }
    });

    if (resetCount > 0) {
      await batch.commit();
    }

    return resetCount;
  },
};
