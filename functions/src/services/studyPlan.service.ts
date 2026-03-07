import { db } from '../config/firebase.config';
import { docToObject, serverTimestamp } from '../utils/firestore.utils';
import { NotFoundError } from '../types/errors';
import { StudyWeek } from '../types';

const COLLECTION = 'studyPlans';

/**
 * Study Plan service - handles study week CRUD operations
 */
export const studyPlanService = {
  /**
   * Get all study weeks
   */
  async getAll(): Promise<StudyWeek[]> {
    const snapshot = await db
      .collection(COLLECTION)
      .orderBy('order', 'asc')
      .get();

    return snapshot.docs.map((doc) => docToObject<StudyWeek>(doc));
  },

  /**
   * Get study weeks by phase
   */
  async getByPhase(phase: string): Promise<StudyWeek[]> {
    const snapshot = await db
      .collection(COLLECTION)
      .where('phase', '==', phase)
      .orderBy('order', 'asc')
      .get();

    return snapshot.docs.map((doc) => docToObject<StudyWeek>(doc));
  },

  /**
   * Get study week by ID
   */
  async getById(weekId: string): Promise<StudyWeek> {
    const doc = await db.collection(COLLECTION).doc(weekId).get();

    if (!doc.exists) {
      throw new NotFoundError('StudyWeek');
    }

    return docToObject<StudyWeek>(doc);
  },

  /**
   * Get study week by week number
   */
  async getByWeekNumber(weekNumber: number): Promise<StudyWeek> {
    const snapshot = await db
      .collection(COLLECTION)
      .where('week', '==', weekNumber)
      .limit(1)
      .get();

    if (snapshot.empty) {
      throw new NotFoundError('StudyWeek');
    }

    return docToObject<StudyWeek>(snapshot.docs[0]);
  },

  /**
   * Create a new study week
   */
  async create(data: Omit<StudyWeek, 'id'>): Promise<StudyWeek> {
    const docRef = db.collection(COLLECTION).doc(`week-${data.week}`);

    await docRef.set({
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const doc = await docRef.get();
    return docToObject<StudyWeek>(doc);
  },

  /**
   * Update a study week
   */
  async update(weekId: string, data: Partial<StudyWeek>): Promise<StudyWeek> {
    const docRef = db.collection(COLLECTION).doc(weekId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundError('StudyWeek');
    }

    await docRef.update({
      ...data,
      updatedAt: serverTimestamp(),
    });

    const updatedDoc = await docRef.get();
    return docToObject<StudyWeek>(updatedDoc);
  },

  /**
   * Delete a study week
   */
  async delete(weekId: string): Promise<void> {
    const docRef = db.collection(COLLECTION).doc(weekId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundError('StudyWeek');
    }

    await docRef.delete();
  },
};
