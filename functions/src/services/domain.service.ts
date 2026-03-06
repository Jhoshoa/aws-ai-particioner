import { db } from '../config/firebase.config';
import { docToObject, serverTimestamp } from '../utils/firestore.utils';
import { NotFoundError } from '../types/errors';
import { Domain } from '../types';

const COLLECTION = 'domains';

/**
 * Domain service - handles domain CRUD operations
 */
export const domainService = {
  /**
   * Get all domains
   */
  async getAll(): Promise<(Domain & { id: string })[]> {
    const snapshot = await db
      .collection(COLLECTION)
      .orderBy('id', 'asc')
      .get();

    return snapshot.docs.map((doc) => docToObject<Domain>(doc));
  },

  /**
   * Get domain by ID
   */
  async getById(domainId: string): Promise<Domain & { id: string }> {
    const doc = await db.collection(COLLECTION).doc(domainId).get();

    if (!doc.exists) {
      throw new NotFoundError('Domain');
    }

    return docToObject<Domain>(doc);
  },

  /**
   * Create a new domain
   */
  async create(
    data: Omit<Domain, 'id'>
  ): Promise<Domain & { id: string }> {
    const docRef = db.collection(COLLECTION).doc(String(data.id));

    await docRef.set({
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const doc = await docRef.get();
    return docToObject<Domain>(doc);
  },

  /**
   * Update a domain
   */
  async update(
    domainId: string,
    data: Partial<Domain>
  ): Promise<Domain & { id: string }> {
    const docRef = db.collection(COLLECTION).doc(domainId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundError('Domain');
    }

    await docRef.update({
      ...data,
      updatedAt: serverTimestamp(),
    });

    const updatedDoc = await docRef.get();
    return docToObject<Domain>(updatedDoc);
  },

  /**
   * Delete a domain
   */
  async delete(domainId: string): Promise<void> {
    const docRef = db.collection(COLLECTION).doc(domainId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundError('Domain');
    }

    await docRef.delete();
  },
};
