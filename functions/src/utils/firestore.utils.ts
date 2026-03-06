import {
  DocumentSnapshot,
  QueryDocumentSnapshot,
  Timestamp,
  FieldValue,
} from 'firebase-admin/firestore';
import { db } from '../config/firebase.config';
import { PaginationParams, PaginatedResult } from '../types';

/**
 * Convert Firestore document to plain object with ID
 */
export function docToObject<T>(
  doc: DocumentSnapshot | QueryDocumentSnapshot
): T & { id: string } {
  const data = doc.data();
  if (!data) {
    throw new Error('Document does not exist');
  }

  // Convert Timestamps to ISO strings
  const converted = convertTimestamps(data);

  return {
    id: doc.id,
    ...converted,
  } as T & { id: string };
}

/**
 * Convert Firestore Timestamps to ISO date strings recursively
 */
export function convertTimestamps(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value instanceof Timestamp) {
      result[key] = value.toDate().toISOString();
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = convertTimestamps(value as Record<string, unknown>);
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        item && typeof item === 'object' && !(item instanceof Timestamp)
          ? convertTimestamps(item as Record<string, unknown>)
          : item instanceof Timestamp
            ? item.toDate().toISOString()
            : item
      );
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Get server timestamp
 */
export function serverTimestamp(): FieldValue {
  return FieldValue.serverTimestamp();
}

/**
 * Create a batch operation helper
 */
export function createBatch() {
  return db.batch();
}

/**
 * Run a transaction
 */
export async function runTransaction<T>(
  callback: (transaction: FirebaseFirestore.Transaction) => Promise<T>
): Promise<T> {
  return db.runTransaction(callback);
}

/**
 * Paginate a Firestore query
 */
export async function paginateQuery<T>(
  collectionRef: FirebaseFirestore.CollectionReference,
  params: PaginationParams,
  filters?: Array<{
    field: string;
    operator: FirebaseFirestore.WhereFilterOp;
    value: unknown;
  }>
): Promise<PaginatedResult<T & { id: string }>> {
  const { page, limit, sortBy = 'createdAt', sortOrder = 'desc' } = params;
  const offset = (page - 1) * limit;

  // Build query
  let query: FirebaseFirestore.Query = collectionRef;

  // Apply filters
  if (filters) {
    for (const filter of filters) {
      query = query.where(filter.field, filter.operator, filter.value);
    }
  }

  // Get total count (note: this requires reading all documents)
  const countSnapshot = await query.count().get();
  const total = countSnapshot.data().count;

  // Apply sorting and pagination
  query = query.orderBy(sortBy, sortOrder).offset(offset).limit(limit);

  const snapshot = await query.get();
  const data = snapshot.docs.map((doc) => docToObject<T>(doc));

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

/**
 * Check if a document exists
 */
export async function documentExists(
  collection: string,
  docId: string
): Promise<boolean> {
  const doc = await db.collection(collection).doc(docId).get();
  return doc.exists;
}

/**
 * Get a single document by ID
 */
export async function getDocumentById<T>(
  collection: string,
  docId: string
): Promise<(T & { id: string }) | null> {
  const doc = await db.collection(collection).doc(docId).get();
  if (!doc.exists) {
    return null;
  }
  return docToObject<T>(doc);
}
