import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../config/firebase.config';
import { docToObject, serverTimestamp } from '../utils/firestore.utils';
import { NotFoundError, ForbiddenError } from '../types/errors';
import {
  StudySession,
  CreateSessionInput,
  UpdateSessionInput,
  EndSessionInput,
  SessionStats,
} from '../types';
import { streakService } from './streak.service';

const COLLECTION = 'studySessions';
const USERS_COLLECTION = 'users';

/**
 * Session service - handles study session tracking with Pomodoro technique
 */
export const sessionService = {
  /**
   * Start a new study session
   */
  async startSession(userId: string, input: CreateSessionInput): Promise<StudySession> {
    // Check for active sessions
    const activeSession = await this.getActiveSession(userId);
    if (activeSession) {
      // Auto-abandon old session
      await this.endSession(userId, activeSession.id, {
        durationMinutes: activeSession.durationMinutes,
        status: 'abandoned',
      });
    }

    const sessionRef = db.collection(COLLECTION).doc();
    const sessionData = {
      userId,
      domainId: input.domainId,
      topicIndex: input.topicIndex,
      startedAt: serverTimestamp(),
      durationMinutes: 0,
      pausedMinutes: 0,
      pomodorosCompleted: 0,
      status: 'active',
    };

    await sessionRef.set(sessionData);

    const doc = await sessionRef.get();
    return docToObject<StudySession>(doc);
  },

  /**
   * Get active session for user
   */
  async getActiveSession(userId: string): Promise<StudySession | null> {
    const snapshot = await db
      .collection(COLLECTION)
      .where('userId', '==', userId)
      .where('status', 'in', ['active', 'paused'])
      .orderBy('startedAt', 'desc')
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    return docToObject<StudySession>(snapshot.docs[0]);
  },

  /**
   * Get session by ID
   */
  async getSessionById(sessionId: string): Promise<StudySession | null> {
    const doc = await db.collection(COLLECTION).doc(sessionId).get();
    if (!doc.exists) return null;
    return docToObject<StudySession>(doc);
  },

  /**
   * Update session (progress update)
   */
  async updateSession(
    userId: string,
    sessionId: string,
    input: UpdateSessionInput
  ): Promise<StudySession> {
    const sessionRef = db.collection(COLLECTION).doc(sessionId);
    const doc = await sessionRef.get();

    if (!doc.exists) {
      throw new NotFoundError('Session');
    }

    const session = docToObject<StudySession>(doc);

    if (session.userId !== userId) {
      throw new ForbiddenError('Not authorized to update this session');
    }

    await sessionRef.update({
      ...input,
      updatedAt: serverTimestamp(),
    });

    const updatedDoc = await sessionRef.get();
    return docToObject<StudySession>(updatedDoc);
  },

  /**
   * End a study session
   */
  async endSession(
    userId: string,
    sessionId: string,
    input: EndSessionInput
  ): Promise<StudySession> {
    const sessionRef = db.collection(COLLECTION).doc(sessionId);
    const doc = await sessionRef.get();

    if (!doc.exists) {
      throw new NotFoundError('Session');
    }

    const session = docToObject<StudySession>(doc);

    if (session.userId !== userId) {
      throw new ForbiddenError('Not authorized to end this session');
    }

    const status = input.status || 'completed';

    await sessionRef.update({
      durationMinutes: input.durationMinutes,
      pausedMinutes: input.pausedMinutes || 0,
      pomodorosCompleted: input.pomodorosCompleted || 0,
      notes: input.notes || null,
      status,
      endedAt: serverTimestamp(),
    });

    // Update user stats if session was completed
    if (status === 'completed' && input.durationMinutes > 0) {
      const userRef = db.collection(USERS_COLLECTION).doc(userId);
      await userRef.set(
        {
          stats: {
            totalStudyMinutes: FieldValue.increment(input.durationMinutes),
          },
        },
        { merge: true }
      );

      // Record streak activity
      await streakService.recordStudyActivity(userId);
    }

    const updatedDoc = await sessionRef.get();
    return docToObject<StudySession>(updatedDoc);
  },

  /**
   * Get session history
   */
  async getSessionHistory(userId: string, limit = 20): Promise<StudySession[]> {
    const snapshot = await db
      .collection(COLLECTION)
      .where('userId', '==', userId)
      .orderBy('startedAt', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => docToObject<StudySession>(doc));
  },

  /**
   * Get session statistics
   */
  async getSessionStats(userId: string): Promise<SessionStats> {
    const snapshot = await db
      .collection(COLLECTION)
      .where('userId', '==', userId)
      .where('status', '==', 'completed')
      .get();

    const sessions = snapshot.docs.map((doc) => docToObject<StudySession>(doc));

    const totalSessions = sessions.length;
    const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    const totalPomodoros = sessions.reduce((sum, s) => sum + s.pomodorosCompleted, 0);

    // This week's stats
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const thisWeekSessions = sessions.filter((s) => {
      const startedAt = typeof s.startedAt === 'string' ? new Date(s.startedAt) : s.startedAt;
      return startedAt >= weekAgo;
    });

    return {
      totalSessions,
      totalMinutes,
      totalPomodoros,
      averageSessionLength: totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0,
      sessionsThisWeek: thisWeekSessions.length,
      minutesThisWeek: thisWeekSessions.reduce((sum, s) => sum + s.durationMinutes, 0),
    };
  },
};
