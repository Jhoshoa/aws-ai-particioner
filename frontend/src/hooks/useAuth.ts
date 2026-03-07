import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../config/firebase.config';
import {
  setUser,
  setLoading,
  setError,
  clearAuth,
  selectUser,
  selectIsAuthenticated,
  selectIsAdmin,
  selectIsLoading,
  selectIsInitialized,
  selectAuthError,
  AuthUser,
} from '../store/slices/authSlice';
import type { AppDispatch, RootState } from '../store/store';

/**
 * Convert Firebase user to AuthUser
 */
async function firebaseUserToAuthUser(user: FirebaseUser): Promise<AuthUser> {
  const tokenResult = await user.getIdTokenResult();
  const isAdmin = tokenResult.claims.admin === true;

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    isAdmin,
  };
}

/**
 * Custom hook for Firebase authentication
 */
export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => selectUser(state));
  const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state));
  const isAdmin = useSelector((state: RootState) => selectIsAdmin(state));
  const isLoading = useSelector((state: RootState) => selectIsLoading(state));
  const isInitialized = useSelector((state: RootState) => selectIsInitialized(state));
  const error = useSelector((state: RootState) => selectAuthError(state));

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const authUser = await firebaseUserToAuthUser(firebaseUser);
          dispatch(setUser(authUser));
        } catch (err) {
          console.error('Error processing auth user:', err);
          dispatch(setError('Failed to process authentication'));
        }
      } else {
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  // Sign in with email/password
  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const authUser = await firebaseUserToAuthUser(result.user);
        dispatch(setUser(authUser));
        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Sign in failed';
        dispatch(setError(message));
        return { success: false, error: message };
      }
    },
    [dispatch]
  );

  // Sign up with email/password
  const signUpWithEmail = useCallback(
    async (email: string, password: string, displayName?: string) => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        const result = await createUserWithEmailAndPassword(auth, email, password);

        if (displayName) {
          await updateProfile(result.user, { displayName });
        }

        const authUser = await firebaseUserToAuthUser(result.user);
        dispatch(setUser(authUser));
        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Sign up failed';
        dispatch(setError(message));
        return { success: false, error: message };
      }
    },
    [dispatch]
  );

  // Sign in with Google
  const signInWithGoogle = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const authUser = await firebaseUserToAuthUser(result.user);
      dispatch(setUser(authUser));
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google sign in failed';
      dispatch(setError(message));
      return { success: false, error: message };
    }
  }, [dispatch]);

  // Sign out
  const signOut = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      await firebaseSignOut(auth);
      dispatch(clearAuth());
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign out failed';
      dispatch(setError(message));
      return { success: false, error: message };
    }
  }, [dispatch]);

  // Reset password
  const resetPassword = useCallback(
    async (email: string) => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        await sendPasswordResetEmail(auth, email);
        dispatch(setLoading(false));
        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Password reset failed';
        dispatch(setError(message));
        return { success: false, error: message };
      }
    },
    [dispatch]
  );

  // Refresh user token (to get updated claims)
  const refreshUser = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await currentUser.getIdToken(true);
      const authUser = await firebaseUserToAuthUser(currentUser);
      dispatch(setUser(authUser));
    }
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isAdmin,
    isLoading,
    isInitialized,
    error,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    resetPassword,
    refreshUser,
  };
}
