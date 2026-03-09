import { baseApi } from './baseApi';
import type {
  Achievement,
  AchievementWithStatus,
  AchievementSummary,
  ApiSuccessResponse,
} from '../../types';

export const achievementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all achievements (with user status if authenticated)
    getAchievements: builder.query<AchievementWithStatus[], void>({
      query: () => '/achievements',
      transformResponse: (response: ApiSuccessResponse<AchievementWithStatus[]>) =>
        response.data,
      providesTags: [{ type: 'Achievement', id: 'LIST' }],
    }),

    // Get achievement summary
    getAchievementSummary: builder.query<AchievementSummary, void>({
      query: () => '/achievements/summary',
      transformResponse: (response: ApiSuccessResponse<AchievementSummary>) =>
        response.data,
      providesTags: [{ type: 'Achievement', id: 'SUMMARY' }],
    }),

    // Get unlocked achievements only
    getUnlockedAchievements: builder.query<AchievementWithStatus[], void>({
      query: () => '/achievements/unlocked',
      transformResponse: (response: ApiSuccessResponse<AchievementWithStatus[]>) =>
        response.data,
      providesTags: [{ type: 'Achievement', id: 'UNLOCKED' }],
    }),

    // Get total points
    getAchievementPoints: builder.query<{ points: number }, void>({
      query: () => '/achievements/points',
      transformResponse: (response: ApiSuccessResponse<{ points: number }>) =>
        response.data,
      providesTags: [{ type: 'Achievement', id: 'POINTS' }],
    }),

    // Check for new achievements
    checkAchievements: builder.mutation<Achievement[], Record<string, number>>({
      query: (stats) => ({
        url: '/achievements/check',
        method: 'POST',
        body: { stats },
      }),
      transformResponse: (response: ApiSuccessResponse<Achievement[]>) =>
        response.data,
      invalidatesTags: [
        { type: 'Achievement', id: 'LIST' },
        { type: 'Achievement', id: 'SUMMARY' },
        { type: 'Achievement', id: 'UNLOCKED' },
        { type: 'Achievement', id: 'POINTS' },
      ],
    }),
  }),
});

export const {
  useGetAchievementsQuery,
  useGetAchievementSummaryQuery,
  useGetUnlockedAchievementsQuery,
  useGetAchievementPointsQuery,
  useCheckAchievementsMutation,
} = achievementApi;
