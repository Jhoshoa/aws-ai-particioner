import * as functions from 'firebase-functions';
import { userService } from '../services';

/**
 * Trigger: On user creation in Firebase Auth
 * Creates a corresponding user document in Firestore
 */
export const onUserCreated = functions.auth.user().onCreate(async (user) => {
  functions.logger.info('New user created:', {
    uid: user.uid,
    email: user.email,
  });

  try {
    await userService.create(user.uid, {
      email: user.email || '',
      displayName: user.displayName,
      photoURL: user.photoURL,
    });

    functions.logger.info('User document created successfully:', user.uid);
  } catch (error) {
    functions.logger.error('Error creating user document:', error);
    throw error;
  }
});

/**
 * Trigger: On user deletion in Firebase Auth
 * Deletes the corresponding user document and all associated data
 */
export const onUserDeleted = functions.auth.user().onDelete(async (user) => {
  functions.logger.info('User deleted:', {
    uid: user.uid,
    email: user.email,
  });

  try {
    // Check if user document exists before trying to delete
    const exists = await userService.exists(user.uid);

    if (exists) {
      await userService.delete(user.uid);
      functions.logger.info('User document deleted successfully:', user.uid);
    } else {
      functions.logger.info('No user document to delete:', user.uid);
    }
  } catch (error) {
    functions.logger.error('Error deleting user document:', error);
    throw error;
  }
});
