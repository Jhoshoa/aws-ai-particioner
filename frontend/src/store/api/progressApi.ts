import { baseApi } from './baseApi';
import type {
  UserProgress,
  ProgressSummary,
  EnhancedProgressSummary,
  DomainProgressDetail,
  UpdateTopicProgressInput,
  UserStats,
  ApiSuccessResponse,
} from '../../types';

export const progressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get user progress
    getProgress: builder.query<UserProgress[], void>({
      query: () => '/progress',
      transformResponse: (response: ApiSuccessResponse<UserProgress[]>) => response.data,
      providesTags: [{ type: 'Progress', id: 'LIST' }],
    }),

    // Get progress summary
    getProgressSummary: builder.query<ProgressSummary, void>({
      query: () => '/progress/summary',
      transformResponse: (response: ApiSuccessResponse<ProgressSummary>) => response.data,
      providesTags: [{ type: 'Progress', id: 'SUMMARY' }],
    }),

    // Get enhanced progress summary with user stats
    getEnhancedProgressSummary: builder.query<EnhancedProgressSummary, void>({
      query: () => '/progress/enhanced',
      transformResponse: (response: ApiSuccessResponse<EnhancedProgressSummary>) => response.data,
      providesTags: [{ type: 'Progress', id: 'ENHANCED' }],
    }),

    // Get progress by domain
    getProgressByDomain: builder.query<UserProgress[], number>({
      query: (domainId) => `/progress/domain/${domainId}`,
      transformResponse: (response: ApiSuccessResponse<UserProgress[]>) => response.data,
      providesTags: (_result, _error, domainId) => [
        { type: 'Progress', id: `DOMAIN_${domainId}` },
      ],
    }),

    // Get domain progress detail
    getDomainProgressDetail: builder.query<DomainProgressDetail, number>({
      query: (domainId) => `/progress/domains/${domainId}/detail`,
      transformResponse: (response: ApiSuccessResponse<DomainProgressDetail>) => response.data,
      providesTags: (_result, _error, domainId) => [
        { type: 'Progress', id: `DOMAIN_DETAIL_${domainId}` },
      ],
    }),

    // Get user stats
    getUserStats: builder.query<UserStats, void>({
      query: () => '/progress/stats',
      transformResponse: (response: ApiSuccessResponse<UserStats>) => response.data,
      providesTags: [{ type: 'Progress', id: 'STATS' }],
    }),

    // Update progress (legacy)
    updateProgress: builder.mutation<
      UserProgress,
      { domainId: number; topicIndex: number; completed: boolean }
    >({
      query: (body) => ({
        url: '/progress',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<UserProgress>) => response.data,
      invalidatesTags: (_result, _error, { domainId }) => [
        { type: 'Progress', id: 'LIST' },
        { type: 'Progress', id: 'SUMMARY' },
        { type: 'Progress', id: 'ENHANCED' },
        { type: 'Progress', id: `DOMAIN_${domainId}` },
        { type: 'Progress', id: `DOMAIN_DETAIL_${domainId}` },
      ],
    }),

    // Update topic progress (enhanced)
    updateTopicProgress: builder.mutation<UserProgress, UpdateTopicProgressInput>({
      query: (body) => ({
        url: '/progress/topics',
        method: 'PUT',
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<UserProgress>) => response.data,
      invalidatesTags: (_result, _error, { domainId }) => [
        { type: 'Progress', id: 'LIST' },
        { type: 'Progress', id: 'SUMMARY' },
        { type: 'Progress', id: 'ENHANCED' },
        { type: 'Progress', id: 'STATS' },
        { type: 'Progress', id: `DOMAIN_${domainId}` },
        { type: 'Progress', id: `DOMAIN_DETAIL_${domainId}` },
      ],
    }),

    // Batch update topics
    batchUpdateTopics: builder.mutation<void, UpdateTopicProgressInput[]>({
      query: (updates) => ({
        url: '/progress/topics/batch',
        method: 'PUT',
        body: { updates },
      }),
      invalidatesTags: [
        { type: 'Progress', id: 'LIST' },
        { type: 'Progress', id: 'SUMMARY' },
        { type: 'Progress', id: 'ENHANCED' },
        { type: 'Progress', id: 'STATS' },
      ],
    }),

    // Add study time
    addStudyTime: builder.mutation<void, number>({
      query: (minutes) => ({
        url: '/progress/study-time',
        method: 'POST',
        body: { minutes },
      }),
      invalidatesTags: [
        { type: 'Progress', id: 'ENHANCED' },
        { type: 'Progress', id: 'STATS' },
      ],
    }),

    // Reset all progress
    resetProgress: builder.mutation<void, void>({
      query: () => ({
        url: '/progress',
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Progress', id: 'LIST' },
        { type: 'Progress', id: 'SUMMARY' },
        { type: 'Progress', id: 'ENHANCED' },
        { type: 'Progress', id: 'STATS' },
      ],
    }),
  }),
});

export const {
  useGetProgressQuery,
  useGetProgressSummaryQuery,
  useGetEnhancedProgressSummaryQuery,
  useGetProgressByDomainQuery,
  useGetDomainProgressDetailQuery,
  useGetUserStatsQuery,
  useUpdateProgressMutation,
  useUpdateTopicProgressMutation,
  useBatchUpdateTopicsMutation,
  useAddStudyTimeMutation,
  useResetProgressMutation,
} = progressApi;
