import { baseApi } from './baseApi';
import type {
  ReviewQueueItem,
  ReviewStats,
  ReviewResult,
  QuestionProgress,
  ApiSuccessResponse,
} from '../../types';

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviewQueue: builder.query<ReviewQueueItem[], number | void>({
      query: (limit = 20) => `/review/queue?limit=${limit}`,
      transformResponse: (response: ApiSuccessResponse<ReviewQueueItem[]>) =>
        response.data,
      providesTags: [{ type: 'Progress', id: 'REVIEW' }],
    }),

    getReviewStats: builder.query<ReviewStats, void>({
      query: () => '/review/stats',
      transformResponse: (response: ApiSuccessResponse<ReviewStats>) =>
        response.data,
      providesTags: [{ type: 'Progress', id: 'REVIEW_STATS' }],
    }),

    submitReview: builder.mutation<
      ReviewResult,
      {
        questionId: string;
        selectedAnswer: 'A' | 'B' | 'C' | 'D';
        quality: number;
        timeSpentSeconds: number;
      }
    >({
      query: (body) => ({
        url: '/review/submit',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<ReviewResult>) =>
        response.data,
      invalidatesTags: [
        { type: 'Progress', id: 'REVIEW' },
        { type: 'Progress', id: 'REVIEW_STATS' },
      ],
    }),

    addToReviewQueue: builder.mutation<void, { questionId: string; domainId: number }>({
      query: (body) => ({
        url: '/review/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Progress', id: 'REVIEW' },
        { type: 'Progress', id: 'REVIEW_STATS' },
      ],
    }),

    getReviewProgress: builder.query<
      QuestionProgress[],
      { limit?: number; offset?: number } | void
    >({
      query: (params) => ({
        url: '/review/progress',
        params: params || undefined,
      }),
      transformResponse: (response: ApiSuccessResponse<QuestionProgress[]>) =>
        response.data,
      providesTags: [{ type: 'Progress', id: 'REVIEW' }],
    }),
  }),
});

export const {
  useGetReviewQueueQuery,
  useGetReviewStatsQuery,
  useSubmitReviewMutation,
  useAddToReviewQueueMutation,
  useGetReviewProgressQuery,
} = reviewApi;
