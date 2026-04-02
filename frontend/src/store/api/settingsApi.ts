import { baseApi } from './baseApi';
import type {
  UserSettings,
  UpdateNotificationSettingsInput,
  ApiSuccessResponse,
} from '../../types';

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<UserSettings, void>({
      query: () => '/settings',
      transformResponse: (response: ApiSuccessResponse<UserSettings>) =>
        response.data,
      providesTags: ['Settings'],
    }),

    updateSettings: builder.mutation<UserSettings, UpdateNotificationSettingsInput>({
      query: (body) => ({
        url: '/settings',
        method: 'PUT',
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<UserSettings>) =>
        response.data,
      invalidatesTags: ['Settings'],
    }),

    resetSettings: builder.mutation<UserSettings, void>({
      query: () => ({
        url: '/settings/reset',
        method: 'POST',
      }),
      transformResponse: (response: ApiSuccessResponse<UserSettings>) =>
        response.data,
      invalidatesTags: ['Settings'],
    }),

    registerPushSubscription: builder.mutation<UserSettings, PushSubscriptionJSON>({
      query: (subscription) => ({
        url: '/settings/push/register',
        method: 'POST',
        body: subscription,
      }),
      transformResponse: (response: ApiSuccessResponse<UserSettings>) =>
        response.data,
      invalidatesTags: ['Settings'],
    }),

    unregisterPushSubscription: builder.mutation<UserSettings, void>({
      query: () => ({
        url: '/settings/push/unregister',
        method: 'POST',
      }),
      transformResponse: (response: ApiSuccessResponse<UserSettings>) =>
        response.data,
      invalidatesTags: ['Settings'],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useResetSettingsMutation,
  useRegisterPushSubscriptionMutation,
  useUnregisterPushSubscriptionMutation,
} = settingsApi;
