import { baseApi } from './baseApi';
import type { User, ApiSuccessResponse } from '../../types';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get current user profile
    getCurrentUser: builder.query<User, void>({
      query: () => '/users/me',
      transformResponse: (response: ApiSuccessResponse<User>) => response.data,
      providesTags: [{ type: 'User', id: 'CURRENT' }],
    }),

    // Update current user profile
    updateCurrentUser: builder.mutation<User, Partial<Pick<User, 'displayName' | 'photoURL'>>>({
      query: (body) => ({
        url: '/users/me',
        method: 'PUT',
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<User>) => response.data,
      invalidatesTags: [{ type: 'User', id: 'CURRENT' }],
    }),

    // Delete current user account
    deleteCurrentUser: builder.mutation<void, void>({
      query: () => ({
        url: '/users/me',
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'User', id: 'CURRENT' }],
    }),

    // Admin: Get user by ID
    getUserById: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      transformResponse: (response: ApiSuccessResponse<User>) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),

    // Admin: Set admin status
    setAdminStatus: builder.mutation<void, { userId: string; isAdmin: boolean }>({
      query: ({ userId, isAdmin }) => ({
        url: `/users/${userId}/admin`,
        method: 'PUT',
        body: { isAdmin },
      }),
      invalidatesTags: (_result, _error, { userId }) => [{ type: 'User', id: userId }],
    }),

    // Admin: Delete user
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
  useDeleteCurrentUserMutation,
  useGetUserByIdQuery,
  useSetAdminStatusMutation,
  useDeleteUserMutation,
} = userApi;
