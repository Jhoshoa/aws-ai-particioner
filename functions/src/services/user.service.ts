import { db, auth } from '../config/firebase.config';
import { docToObject, serverTimestamp } from '../utils/firestore.utils';
import { NotFoundError, ConflictError } from '../types/errors';
import { User } from '../types';

const COLLECTION = 'users';

/**
 * User service - handles user CRUD operations
 */
export const userService = {
  /**
   * Get user by ID
   */
  async getById(userId: string): Promise<User & { id: string }> {
    const doc = await db.collection(COLLECTION).doc(userId).get();

    if (!doc.exists) {
      throw new NotFoundError('User');
    }

    return docToObject<User>(doc);
  },

  /**
   * Get user by email
   */
  async getByEmail(email: string): Promise<(User & { id: string }) | null> {
    const snapshot = await db
      .collection(COLLECTION)
      .where('email', '==', email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    return docToObject<User>(snapshot.docs[0]);
  },

  /**
   * Create a new user (usually called from auth trigger)
   */
  async create(
    userId: string,
    data: {
      email: string;
      displayName?: string | null;
      photoURL?: string | null;
    }
  ): Promise<User & { id: string }> {
    const existingUser = await this.getByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    const docRef = db.collection(COLLECTION).doc(userId);

    const userData = {
      email: data.email,
      displayName: data.displayName || null,
      photoURL: data.photoURL || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await docRef.set(userData);

    const doc = await docRef.get();
    return docToObject<User>(doc);
  },

  /**
   * Update user profile
   */
  async update(
    userId: string,
    data: Partial<Pick<User, 'displayName' | 'photoURL'>>
  ): Promise<User & { id: string }> {
    const docRef = db.collection(COLLECTION).doc(userId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundError('User');
    }

    await docRef.update({
      ...data,
      updatedAt: serverTimestamp(),
    });

    const updatedDoc = await docRef.get();
    return docToObject<User>(updatedDoc);
  },

  /**
   * Delete user and all associated data
   */
  async delete(userId: string): Promise<void> {
    const docRef = db.collection(COLLECTION).doc(userId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundError('User');
    }

    // Delete progress subcollection
    const progressSnapshot = await docRef.collection('progress').get();
    const batch = db.batch();

    progressSnapshot.docs.forEach((progressDoc) => {
      batch.delete(progressDoc.ref);
    });

    // Delete user document
    batch.delete(docRef);

    await batch.commit();
  },

  /**
   * Set admin claim for user
   */
  async setAdminClaim(userId: string, isAdmin: boolean): Promise<void> {
    await auth.setCustomUserClaims(userId, { admin: isAdmin });
  },

  /**
   * Check if user exists
   */
  async exists(userId: string): Promise<boolean> {
    const doc = await db.collection(COLLECTION).doc(userId).get();
    return doc.exists;
  },
};
