import { baseApi } from './baseApi';
import type {
  Question,
  QuizConfig,
  QuizStartResponse,
  AnswerSubmitResponse,
  QuizAttempt,
  QuizStats,
  ApiSuccessResponse,
} from '../../types';

export const quizApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get questions (preview without answers)
    getQuestions: builder.query<Question[], number | void>({
      query: (domainId) => ({
        url: '/quiz/questions',
        params: domainId ? { domainId } : undefined,
      }),
      transformResponse: (response: ApiSuccessResponse<Question[]>) => response.data,
      providesTags: [{ type: 'Quiz', id: 'QUESTIONS' }],
    }),

    // Start a quiz session
    startQuiz: builder.mutation<QuizStartResponse, QuizConfig>({
      query: (config) => ({
        url: '/quiz/start',
        method: 'POST',
        body: config,
      }),
      transformResponse: (response: ApiSuccessResponse<QuizStartResponse>) => response.data,
    }),

    // Submit an answer
    submitAnswer: builder.mutation<
      AnswerSubmitResponse,
      {
        attemptId: string;
        questionId: string;
        selectedAnswer: 'A' | 'B' | 'C' | 'D';
        timeSpentSeconds: number;
      }
    >({
      query: ({ attemptId, ...body }) => ({
        url: `/quiz/attempts/${attemptId}/submit`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<AnswerSubmitResponse>) => response.data,
    }),

    // Complete the quiz
    completeQuiz: builder.mutation<QuizAttempt, string>({
      query: (attemptId) => ({
        url: `/quiz/attempts/${attemptId}/complete`,
        method: 'POST',
      }),
      transformResponse: (response: ApiSuccessResponse<QuizAttempt>) => response.data,
      invalidatesTags: [
        { type: 'Quiz', id: 'HISTORY' },
        { type: 'Quiz', id: 'STATS' },
        { type: 'Progress', id: 'USER' },
      ],
    }),

    // Get a specific quiz attempt
    getQuizAttempt: builder.query<QuizAttempt, string>({
      query: (attemptId) => `/quiz/attempts/${attemptId}`,
      transformResponse: (response: ApiSuccessResponse<QuizAttempt>) => response.data,
    }),

    // Get quiz history
    getQuizHistory: builder.query<QuizAttempt[], number | void>({
      query: (limit) => ({
        url: '/quiz/attempts',
        params: limit ? { limit } : undefined,
      }),
      transformResponse: (response: ApiSuccessResponse<QuizAttempt[]>) => response.data,
      providesTags: [{ type: 'Quiz', id: 'HISTORY' }],
    }),

    // Get quiz statistics
    getQuizStats: builder.query<QuizStats, void>({
      query: () => '/quiz/stats',
      transformResponse: (response: ApiSuccessResponse<QuizStats>) => response.data,
      providesTags: [{ type: 'Quiz', id: 'STATS' }],
    }),
  }),
});

export const {
  useGetQuestionsQuery,
  useStartQuizMutation,
  useSubmitAnswerMutation,
  useCompleteQuizMutation,
  useGetQuizAttemptQuery,
  useGetQuizHistoryQuery,
  useGetQuizStatsQuery,
} = quizApi;
