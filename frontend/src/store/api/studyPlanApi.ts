import { baseApi } from './baseApi';
import type { StudyWeek, ApiSuccessResponse } from '../../types';

export const studyPlanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all study weeks
    getStudyPlan: builder.query<StudyWeek[], string | void>({
      query: (phase) => (phase ? `/study-plan?phase=${phase}` : '/study-plan'),
      transformResponse: (response: ApiSuccessResponse<StudyWeek[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'StudyWeek' as const, id })),
              { type: 'StudyWeek', id: 'LIST' },
            ]
          : [{ type: 'StudyWeek', id: 'LIST' }],
    }),

    // Get study week by ID
    getStudyWeek: builder.query<StudyWeek, string>({
      query: (id) => `/study-plan/${id}`,
      transformResponse: (response: ApiSuccessResponse<StudyWeek>) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'StudyWeek', id }],
    }),

    // Get study week by week number
    getStudyWeekByNumber: builder.query<StudyWeek, number>({
      query: (weekNumber) => `/study-plan/week/${weekNumber}`,
      transformResponse: (response: ApiSuccessResponse<StudyWeek>) => response.data,
      providesTags: (result) => (result ? [{ type: 'StudyWeek', id: result.id }] : []),
    }),

    // Create study week (admin)
    createStudyWeek: builder.mutation<StudyWeek, Omit<StudyWeek, 'id'>>({
      query: (body) => ({
        url: '/study-plan',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<StudyWeek>) => response.data,
      invalidatesTags: [{ type: 'StudyWeek', id: 'LIST' }],
    }),

    // Update study week (admin)
    updateStudyWeek: builder.mutation<StudyWeek, { id: string; data: Partial<StudyWeek> }>({
      query: ({ id, data }) => ({
        url: `/study-plan/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ApiSuccessResponse<StudyWeek>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'StudyWeek', id },
        { type: 'StudyWeek', id: 'LIST' },
      ],
    }),

    // Delete study week (admin)
    deleteStudyWeek: builder.mutation<void, string>({
      query: (id) => ({
        url: `/study-plan/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'StudyWeek', id },
        { type: 'StudyWeek', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetStudyPlanQuery,
  useGetStudyWeekQuery,
  useGetStudyWeekByNumberQuery,
  useCreateStudyWeekMutation,
  useUpdateStudyWeekMutation,
  useDeleteStudyWeekMutation,
} = studyPlanApi;
