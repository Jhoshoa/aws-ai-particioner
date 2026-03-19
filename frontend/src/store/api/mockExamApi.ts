import { baseApi } from './baseApi';
import type {
  MockExam,
  MockExamResults,
  MockExamStats,
  MockExamWithQuestions,
  Question,
  ApiSuccessResponse,
} from '../../types';

export const mockExamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveExam: builder.query<MockExam | null, void>({
      query: () => '/mock-exams/active',
      transformResponse: (response: ApiSuccessResponse<MockExam | null>) =>
        response.data,
      providesTags: ['Progress'],
    }),

    getExamStats: builder.query<MockExamStats, void>({
      query: () => '/mock-exams/stats',
      transformResponse: (response: ApiSuccessResponse<MockExamStats>) =>
        response.data,
      providesTags: ['Progress'],
    }),

    getExamHistory: builder.query<MockExam[], number | void>({
      query: (limit = 10) => `/mock-exams?limit=${limit}`,
      transformResponse: (response: ApiSuccessResponse<MockExam[]>) =>
        response.data,
      providesTags: ['Progress'],
    }),

    getMockExam: builder.query<MockExamWithQuestions, string>({
      query: (examId) => `/mock-exams/${examId}`,
      transformResponse: (
        response: ApiSuccessResponse<{
          exam: MockExam;
          questions: Array<Omit<Question, 'correctAnswer' | 'explanation'> & { id: string }>;
        }>
      ) => response.data,
      providesTags: ['Progress'],
    }),

    startExam: builder.mutation<MockExam, void>({
      query: () => ({
        url: '/mock-exams/start',
        method: 'POST',
      }),
      transformResponse: (response: ApiSuccessResponse<MockExam>) =>
        response.data,
      invalidatesTags: ['Progress'],
    }),

    updateAnswer: builder.mutation<
      void,
      { examId: string; questionId: string; answer: 'A' | 'B' | 'C' | 'D'; timeSpent: number }
    >({
      query: ({ examId, questionId, answer, timeSpent }) => ({
        url: `/mock-exams/${examId}/answer`,
        method: 'PUT',
        body: { questionId, answer, timeSpent },
      }),
      // Don't invalidate tags on every answer to avoid refetching
    }),

    toggleFlag: builder.mutation<{ flagged: boolean }, { examId: string; questionId: string }>({
      query: ({ examId, questionId }) => ({
        url: `/mock-exams/${examId}/flag`,
        method: 'POST',
        body: { questionId },
      }),
      transformResponse: (response: ApiSuccessResponse<{ flagged: boolean }>) =>
        response.data,
    }),

    submitExam: builder.mutation<MockExamResults, { examId: string; timeSpent: number }>({
      query: ({ examId, timeSpent }) => ({
        url: `/mock-exams/${examId}/submit`,
        method: 'POST',
        body: { timeSpent },
      }),
      transformResponse: (response: ApiSuccessResponse<MockExamResults>) =>
        response.data,
      invalidatesTags: ['Progress'],
    }),
  }),
});

export const {
  useGetActiveExamQuery,
  useGetExamStatsQuery,
  useGetExamHistoryQuery,
  useGetMockExamQuery,
  useStartExamMutation,
  useUpdateAnswerMutation,
  useToggleFlagMutation,
  useSubmitExamMutation,
} = mockExamApi;
