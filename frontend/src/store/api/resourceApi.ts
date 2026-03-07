import { baseApi } from './baseApi';
import type { Resource, ApiSuccessResponse } from '../../types';

export const resourceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all resources
    getResources: builder.query<Resource[], string | void>({
      query: (type) => (type ? `/resources?type=${type}` : '/resources'),
      transformResponse: (response: ApiSuccessResponse<Resource[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Resource' as const, id })),
              { type: 'Resource', id: 'LIST' },
            ]
          : [{ type: 'Resource', id: 'LIST' }],
    }),

    // Get resource by ID
    getResource: builder.query<Resource, string>({
      query: (id) => `/resources/${id}`,
      transformResponse: (response: ApiSuccessResponse<Resource>) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Resource', id }],
    }),

    // Create resource (admin)
    createResource: builder.mutation<Resource, Omit<Resource, 'id'>>({
      query: (body) => ({
        url: '/resources',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<Resource>) => response.data,
      invalidatesTags: [{ type: 'Resource', id: 'LIST' }],
    }),

    // Update resource (admin)
    updateResource: builder.mutation<Resource, { id: string; data: Partial<Resource> }>({
      query: ({ id, data }) => ({
        url: `/resources/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ApiSuccessResponse<Resource>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Resource', id },
        { type: 'Resource', id: 'LIST' },
      ],
    }),

    // Delete resource (admin)
    deleteResource: builder.mutation<void, string>({
      query: (id) => ({
        url: `/resources/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Resource', id },
        { type: 'Resource', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetResourcesQuery,
  useGetResourceQuery,
  useCreateResourceMutation,
  useUpdateResourceMutation,
  useDeleteResourceMutation,
} = resourceApi;
