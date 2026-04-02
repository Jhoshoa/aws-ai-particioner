import { baseApi } from './baseApi';
import type {
  StudySession,
  CreateSessionInput,
  UpdateSessionInput,
  EndSessionInput,
  SessionStats,
  ApiSuccessResponse,
} from '../../types';

export const sessionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveSession: builder.query<StudySession | null, void>({
      query: () => '/sessions/active',
      transformResponse: (response: ApiSuccessResponse<StudySession | null>) =>
        response.data,
      providesTags: ['Progress'],
    }),

    getSessionStats: builder.query<SessionStats, void>({
      query: () => '/sessions/stats',
      transformResponse: (response: ApiSuccessResponse<SessionStats>) =>
        response.data,
      providesTags: ['Progress'],
    }),

    getSessionHistory: builder.query<StudySession[], number | void>({
      query: (limit = 20) => `/sessions?limit=${limit}`,
      transformResponse: (response: ApiSuccessResponse<StudySession[]>) =>
        response.data,
      providesTags: ['Progress'],
    }),

    startSession: builder.mutation<StudySession, CreateSessionInput>({
      query: (input) => ({
        url: '/sessions/start',
        method: 'POST',
        body: input,
      }),
      transformResponse: (response: ApiSuccessResponse<StudySession>) =>
        response.data,
      invalidatesTags: ['Progress'],
    }),

    updateSession: builder.mutation<
      StudySession,
      { sessionId: string; input: UpdateSessionInput }
    >({
      query: ({ sessionId, input }) => ({
        url: `/sessions/${sessionId}`,
        method: 'PUT',
        body: input,
      }),
      transformResponse: (response: ApiSuccessResponse<StudySession>) =>
        response.data,
      invalidatesTags: ['Progress'],
    }),

    endSession: builder.mutation<
      StudySession,
      { sessionId: string; input: EndSessionInput }
    >({
      query: ({ sessionId, input }) => ({
        url: `/sessions/${sessionId}/end`,
        method: 'POST',
        body: input,
      }),
      transformResponse: (response: ApiSuccessResponse<StudySession>) =>
        response.data,
      invalidatesTags: ['Progress'],
    }),
  }),
});

export const {
  useGetActiveSessionQuery,
  useGetSessionStatsQuery,
  useGetSessionHistoryQuery,
  useStartSessionMutation,
  useUpdateSessionMutation,
  useEndSessionMutation,
} = sessionApi;
