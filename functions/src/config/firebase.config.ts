import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin SDK
// In Cloud Functions, this uses Application Default Credentials
if (!admin.apps.length) {
  admin.initializeApp();
}

// Export Firestore instance
export const db = getFirestore();

// Export Storage bucket
export const storage = getStorage();

// Export Auth instance
export const auth = getAuth();

// Export admin for advanced usage
export { admin };

// Firestore settings
db.settings({
  ignoreUndefinedProperties: true,
});
