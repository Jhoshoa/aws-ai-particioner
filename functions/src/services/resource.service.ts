import { db } from '../config/firebase.config';
import { docToObject, serverTimestamp } from '../utils/firestore.utils';
import { NotFoundError } from '../types/errors';
import { Resource } from '../types';
import { v4 as uuidv4 } from 'uuid';

const COLLECTION = 'resources';

/**
 * Resource service - handles study resource CRUD operations
 */
export const resourceService = {
  /**
   * Get all resources
   */
  async getAll(): Promise<(Resource & { id: string })[]> {
    const snapshot = await db.collection(COLLECTION).get();
    return snapshot.docs.map((doc) => docToObject<Resource>(doc));
  },

  /**
   * Get resources by type
   */
  async getByType(type: string): Promise<(Resource & { id: string })[]> {
    const snapshot = await db
      .collection(COLLECTION)
      .where('type', '==', type)
      .get();

    return snapshot.docs.map((doc) => docToObject<Resource>(doc));
  },

  /**
   * Get resource by ID
   */
  async getById(resourceId: string): Promise<Resource & { id: string }> {
    const doc = await db.collection(COLLECTION).doc(resourceId).get();

    if (!doc.exists) {
      throw new NotFoundError('Resource');
    }

    return docToObject<Resource>(doc);
  },

  /**
   * Create a new resource
   */
  async create(
    data: Omit<Resource, 'id'>
  ): Promise<Resource & { id: string }> {
    const id = uuidv4();
    const docRef = db.collection(COLLECTION).doc(id);

    await docRef.set({
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const doc = await docRef.get();
    return docToObject<Resource>(doc);
  },

  /**
   * Update a resource
   */
  async update(
    resourceId: string,
    data: Partial<Resource>
  ): Promise<Resource & { id: string }> {
    const docRef = db.collection(COLLECTION).doc(resourceId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundError('Resource');
    }

    await docRef.update({
      ...data,
      updatedAt: serverTimestamp(),
    });

    const updatedDoc = await docRef.get();
    return docToObject<Resource>(updatedDoc);
  },

  /**
   * Delete a resource
   */
  async delete(resourceId: string): Promise<void> {
    const docRef = db.collection(COLLECTION).doc(resourceId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundError('Resource');
    }

    await docRef.delete();
  },
};
