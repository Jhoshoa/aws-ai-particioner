import { baseApi } from './baseApi';
import type {
  Note,
  CreateNoteInput,
  UpdateNoteInput,
  NotesSummary,
  ApiSuccessResponse,
} from '../../types';

export const notesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all user notes (optionally filtered by domain)
    getNotes: builder.query<Note[], number | void>({
      query: (domainId) => ({
        url: '/notes',
        params: domainId ? { domainId } : undefined,
      }),
      transformResponse: (response: ApiSuccessResponse<Note[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Note' as const, id })),
              { type: 'Note', id: 'LIST' },
            ]
          : [{ type: 'Note', id: 'LIST' }],
    }),

    // Get notes summary
    getNotesSummary: builder.query<NotesSummary, void>({
      query: () => '/notes/summary',
      transformResponse: (response: ApiSuccessResponse<NotesSummary>) => response.data,
      providesTags: [{ type: 'Note', id: 'SUMMARY' }],
    }),

    // Search notes
    searchNotes: builder.query<Note[], string>({
      query: (q) => ({
        url: '/notes/search',
        params: { q },
      }),
      transformResponse: (response: ApiSuccessResponse<Note[]>) => response.data,
    }),

    // Get notes for a specific topic
    getTopicNotes: builder.query<Note[], { domainId: number; topicIndex: number }>({
      query: ({ domainId, topicIndex }) => `/notes/topic/${domainId}/${topicIndex}`,
      transformResponse: (response: ApiSuccessResponse<Note[]>) => response.data,
      providesTags: (result, _error, { domainId, topicIndex }) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Note' as const, id })),
              { type: 'Note', id: `TOPIC-${domainId}-${topicIndex}` },
            ]
          : [{ type: 'Note', id: `TOPIC-${domainId}-${topicIndex}` }],
    }),

    // Get note by ID
    getNoteById: builder.query<Note, string>({
      query: (noteId) => `/notes/${noteId}`,
      transformResponse: (response: ApiSuccessResponse<Note>) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Note', id }],
    }),

    // Create a new note
    createNote: builder.mutation<Note, CreateNoteInput>({
      query: (input) => ({
        url: '/notes',
        method: 'POST',
        body: input,
      }),
      transformResponse: (response: ApiSuccessResponse<Note>) => response.data,
      invalidatesTags: [
        { type: 'Note', id: 'LIST' },
        { type: 'Note', id: 'SUMMARY' },
      ],
    }),

    // Update a note
    updateNote: builder.mutation<Note, { noteId: string; input: UpdateNoteInput }>({
      query: ({ noteId, input }) => ({
        url: `/notes/${noteId}`,
        method: 'PUT',
        body: input,
      }),
      transformResponse: (response: ApiSuccessResponse<Note>) => response.data,
      invalidatesTags: (_result, _error, { noteId }) => [
        { type: 'Note', id: noteId },
        { type: 'Note', id: 'LIST' },
        { type: 'Note', id: 'SUMMARY' },
      ],
    }),

    // Delete a note
    deleteNote: builder.mutation<void, string>({
      query: (noteId) => ({
        url: `/notes/${noteId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, noteId) => [
        { type: 'Note', id: noteId },
        { type: 'Note', id: 'LIST' },
        { type: 'Note', id: 'SUMMARY' },
      ],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useGetNotesSummaryQuery,
  useSearchNotesQuery,
  useGetTopicNotesQuery,
  useGetNoteByIdQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApi;
