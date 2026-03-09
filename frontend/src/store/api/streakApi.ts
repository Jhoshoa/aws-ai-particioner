import { baseApi } from './baseApi';
import type { StreakInfo, ApiSuccessResponse } from '../../types';

export const streakApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStreak: builder.query<StreakInfo, void>({
      query: () => '/streak',
      transformResponse: (response: ApiSuccessResponse<StreakInfo>) => response.data,
      providesTags: [{ type: 'Progress', id: 'STREAK' }],
    }),

    recordActivity: builder.mutation<StreakInfo, void>({
      query: () => ({
        url: '/streak/record',
        method: 'POST',
      }),
      transformResponse: (response: ApiSuccessResponse<StreakInfo>) => response.data,
      invalidatesTags: [{ type: 'Progress', id: 'STREAK' }],
    }),
  }),
});

export const { useGetStreakQuery, useRecordActivityMutation } = streakApi;
