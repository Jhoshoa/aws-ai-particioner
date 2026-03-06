import { baseApi } from './baseApi';
import type {
  UserProgress,
  ProgressSummary,
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

    // Get progress by domain
    getProgressByDomain: builder.query<UserProgress[], number>({
      query: (domainId) => `/progress/domain/${domainId}`,
      transformResponse: (response: ApiSuccessResponse<UserProgress[]>) => response.data,
      providesTags: (_result, _error, domainId) => [
        { type: 'Progress', id: `DOMAIN_${domainId}` },
      ],
    }),

    // Update progress
    updateProgress: builder.mutation<
      UserProgress,
      { domainId: number; topicId: string; completed: boolean }
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
        { type: 'Progress', id: `DOMAIN_${domainId}` },
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
      ],
    }),
  }),
});

export const {
  useGetProgressQuery,
  useGetProgressSummaryQuery,
  useGetProgressByDomainQuery,
  useUpdateProgressMutation,
  useResetProgressMutation,
} = progressApi;
