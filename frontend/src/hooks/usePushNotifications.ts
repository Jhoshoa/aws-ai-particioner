import { useState, useEffect, useCallback } from 'react';
import {
  useRegisterPushSubscriptionMutation,
  useUnregisterPushSubscriptionMutation,
} from '../store/api';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

/**
 * Convert base64 URL-encoded string to Uint8Array for VAPID key
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export interface UsePushNotificationsReturn {
  isSupported: boolean;
  permission: NotificationPermission;
  subscription: PushSubscription | null;
  isLoading: boolean;
  error: string | null;
  subscribe: () => Promise<PushSubscription | null>;
  unsubscribe: () => Promise<void>;
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [registerPush] = useRegisterPushSubscriptionMutation();
  const [unregisterPush] = useUnregisterPushSubscriptionMutation();

  useEffect(() => {
    const checkSupport = async () => {
      const supported = 'serviceWorker' in navigator && 'PushManager' in window;
      setIsSupported(supported);

      if (supported) {
        setPermission(Notification.permission);

        // Check existing subscription
        try {
          const registration = await navigator.serviceWorker.ready;
          const existingSub = await registration.pushManager.getSubscription();
          setSubscription(existingSub);
        } catch (err) {
          console.error('Error checking push subscription:', err);
        }
      }
    };

    checkSupport();
  }, []);

  const subscribe = useCallback(async (): Promise<PushSubscription | null> => {
    if (!isSupported) {
      setError('Push notifications are not supported in this browser');
      return null;
    }

    if (!VAPID_PUBLIC_KEY) {
      setError('Push notifications are not configured');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Request permission
      const permResult = await Notification.requestPermission();
      setPermission(permResult);

      if (permResult !== 'granted') {
        setError('Notification permission denied');
        return null;
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Subscribe to push notifications
      const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey.buffer as ArrayBuffer,
      });

      setSubscription(sub);

      // Register with backend
      await registerPush(sub.toJSON() as PushSubscriptionJSON).unwrap();

      return sub;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to enable push notifications';
      setError(message);
      console.error('Push subscription error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, registerPush]);

  const unsubscribe = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      if (subscription) {
        await subscription.unsubscribe();
      }

      // Unregister from backend
      await unregisterPush().unwrap();

      setSubscription(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to disable push notifications';
      setError(message);
      console.error('Push unsubscription error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [subscription, unregisterPush]);

  return {
    isSupported,
    permission,
    subscription,
    isLoading,
    error,
    subscribe,
    unsubscribe,
  };
}
