import { baseApi } from './baseApi';
import type { Domain, ApiSuccessResponse } from '../../types';

export const domainApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all domains
    getDomains: builder.query<Domain[], void>({
      query: () => '/domains',
      transformResponse: (response: ApiSuccessResponse<Domain[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Domain' as const, id: String(id) })),
              { type: 'Domain', id: 'LIST' },
            ]
          : [{ type: 'Domain', id: 'LIST' }],
    }),

    // Get domain by ID
    getDomain: builder.query<Domain, string>({
      query: (id) => `/domains/${id}`,
      transformResponse: (response: ApiSuccessResponse<Domain>) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Domain', id }],
    }),

    // Create domain (admin)
    createDomain: builder.mutation<Domain, Omit<Domain, 'id'>>({
      query: (body) => ({
        url: '/domains',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<Domain>) => response.data,
      invalidatesTags: [{ type: 'Domain', id: 'LIST' }],
    }),

    // Update domain (admin)
    updateDomain: builder.mutation<Domain, { id: string; data: Partial<Domain> }>({
      query: ({ id, data }) => ({
        url: `/domains/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ApiSuccessResponse<Domain>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Domain', id },
        { type: 'Domain', id: 'LIST' },
      ],
    }),

    // Delete domain (admin)
    deleteDomain: builder.mutation<void, string>({
      query: (id) => ({
        url: `/domains/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Domain', id },
        { type: 'Domain', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetDomainsQuery,
  useGetDomainQuery,
  useCreateDomainMutation,
  useUpdateDomainMutation,
  useDeleteDomainMutation,
} = domainApi;
