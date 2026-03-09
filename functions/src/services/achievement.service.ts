import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../config/firebase.config';
import { docToObject, serverTimestamp } from '../utils/firestore.utils';
import {
  Achievement,
  UserAchievement,
  AchievementWithStatus,
  AchievementConditionType,
  AchievementSummary,
} from '../types';

const ACHIEVEMENTS_COLLECTION = 'achievements';
const USER_ACHIEVEMENTS_COLLECTION = 'userAchievements';
const USERS_COLLECTION = 'users';

/**
 * Achievement service - handles achievement definitions and user unlocks
 */
export const achievementService = {
  /**
   * Get all achievement definitions
   */
  async getAllAchievements(): Promise<Achievement[]> {
    const snapshot = await db
      .collection(ACHIEVEMENTS_COLLECTION)
      .orderBy('order', 'asc')
      .get();

    return snapshot.docs.map((doc) => docToObject<Achievement>(doc));
  },

  /**
   * Get achievement by ID
   */
  async getAchievementById(achievementId: string): Promise<Achievement | null> {
    const doc = await db.collection(ACHIEVEMENTS_COLLECTION).doc(achievementId).get();
    if (!doc.exists) {
      return null;
    }
    return docToObject<Achievement>(doc);
  },

  /**
   * Get user's achievements with unlock status
   */
  async getUserAchievements(userId: string): Promise<AchievementWithStatus[]> {
    // Get all achievements
    const achievements = await this.getAllAchievements();

    // Get user's unlocked achievements
    const unlockedSnapshot = await db
      .collection(USER_ACHIEVEMENTS_COLLECTION)
      .where('userId', '==', userId)
      .get();

    const unlockedMap = new Map<string, UserAchievement>();
    unlockedSnapshot.docs.forEach((doc) => {
      const data = docToObject<UserAchievement>(doc);
      unlockedMap.set(data.achievementId, data);
    });

    // Combine with status
    return achievements.map((achievement) => {
      const userAchievement = unlockedMap.get(achievement.id);
      return {
        ...achievement,
        unlocked: !!userAchievement,
        unlockedAt: userAchievement?.unlockedAt,
        progress: userAchievement?.progress,
        target: achievement.condition.value,
      };
    });
  },

  /**
   * Get user's unlocked achievements only
   */
  async getUserUnlockedAchievements(userId: string): Promise<AchievementWithStatus[]> {
    const allAchievements = await this.getUserAchievements(userId);
    return allAchievements.filter((a) => a.unlocked);
  },

  /**
   * Check and unlock achievements based on user stats
   */
  async checkAndUnlockAchievements(
    userId: string,
    stats: Record<string, number>
  ): Promise<Achievement[]> {
    const achievements = await this.getAllAchievements();
    const newlyUnlocked: Achievement[] = [];

    // Get existing unlocked achievements
    const unlockedSnapshot = await db
      .collection(USER_ACHIEVEMENTS_COLLECTION)
      .where('userId', '==', userId)
      .get();

    const unlockedIds = new Set(
      unlockedSnapshot.docs.map((doc) => doc.data().achievementId)
    );

    // Check each achievement
    for (const achievement of achievements) {
      if (unlockedIds.has(achievement.id)) continue;

      const { type, value } = achievement.condition;
      const currentValue = this.getStatValue(stats, type);

      if (currentValue >= value) {
        // Unlock achievement
        await db.collection(USER_ACHIEVEMENTS_COLLECTION).add({
          userId,
          achievementId: achievement.id,
          unlockedAt: serverTimestamp(),
        });

        newlyUnlocked.push(achievement);
      }
    }

    // Update user's total achievement points
    if (newlyUnlocked.length > 0) {
      const totalPoints = newlyUnlocked.reduce((sum, a) => sum + a.points, 0);
      const userRef = db.collection(USERS_COLLECTION).doc(userId);
      await userRef.set(
        {
          stats: {
            achievementPoints: FieldValue.increment(totalPoints),
          },
        },
        { merge: true }
      );
    }

    return newlyUnlocked;
  },

  /**
   * Map condition type to stat value
   */
  getStatValue(stats: Record<string, number>, type: AchievementConditionType): number {
    const mapping: Record<AchievementConditionType, string> = {
      topics_completed: 'totalTopicsCompleted',
      quizzes_completed: 'quizzesTaken',
      notes_created: 'totalNotes',
      domain_completed: 'domainsCompleted',
      streak_days: 'currentStreakDays',
      perfect_quiz: 'perfectQuizzes',
      correct_answers: 'correctAnswers',
      study_minutes: 'totalStudyMinutes',
      mock_exams_completed: 'mockExamsTaken',
      mock_score: 'bestMockScore',
      total_progress: 'percentComplete',
    };

    return stats[mapping[type]] || 0;
  },

  /**
   * Get user's total achievement points
   */
  async getTotalPoints(userId: string): Promise<number> {
    const unlockedSnapshot = await db
      .collection(USER_ACHIEVEMENTS_COLLECTION)
      .where('userId', '==', userId)
      .get();

    const achievementIds = unlockedSnapshot.docs.map(
      (doc) => doc.data().achievementId
    );

    if (achievementIds.length === 0) return 0;

    const achievements = await this.getAllAchievements();
    return achievements
      .filter((a) => achievementIds.includes(a.id))
      .reduce((sum, a) => sum + a.points, 0);
  },

  /**
   * Get user's achievement summary
   */
  async getAchievementSummary(userId: string): Promise<AchievementSummary> {
    const achievements = await this.getUserAchievements(userId);
    const totalPoints = await this.getTotalPoints(userId);

    const unlockedAchievements = achievements.filter((a) => a.unlocked);
    const recentUnlocks = unlockedAchievements
      .sort((a, b) => {
        const dateA = a.unlockedAt ? new Date(a.unlockedAt).getTime() : 0;
        const dateB = b.unlockedAt ? new Date(b.unlockedAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5);

    return {
      totalAchievements: achievements.length,
      unlockedCount: unlockedAchievements.length,
      totalPoints,
      recentUnlocks,
    };
  },

  /**
   * Manually unlock an achievement for a user (admin use)
   */
  async unlockAchievement(userId: string, achievementId: string): Promise<boolean> {
    // Check if already unlocked
    const existingSnapshot = await db
      .collection(USER_ACHIEVEMENTS_COLLECTION)
      .where('userId', '==', userId)
      .where('achievementId', '==', achievementId)
      .get();

    if (!existingSnapshot.empty) {
      return false; // Already unlocked
    }

    // Get achievement for points
    const achievement = await this.getAchievementById(achievementId);
    if (!achievement) {
      return false;
    }

    // Unlock
    await db.collection(USER_ACHIEVEMENTS_COLLECTION).add({
      userId,
      achievementId,
      unlockedAt: serverTimestamp(),
    });

    // Update user points
    const userRef = db.collection(USERS_COLLECTION).doc(userId);
    await userRef.set(
      {
        stats: {
          achievementPoints: FieldValue.increment(achievement.points),
        },
      },
      { merge: true }
    );

    return true;
  },
};
