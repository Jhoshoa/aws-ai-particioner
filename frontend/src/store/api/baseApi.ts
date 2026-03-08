import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { auth } from '../../config/firebase.config';

/**
 * Base API configuration with Firebase Auth token injection
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || '/api',
    prepareHeaders: async (headers) => {
      // Get current user's ID token
      const user = auth.currentUser;
      if (user) {
        try {
          const token = await user.getIdToken();
          headers.set('Authorization', `Bearer ${token}`);
        } catch (error) {
          console.error('Error getting auth token:', error);
        }
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Domain', 'Resource', 'StudyWeek', 'Progress', 'User', 'Quiz'],
  endpoints: () => ({}),
});
