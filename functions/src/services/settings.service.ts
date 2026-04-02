import { db } from '../config/firebase.config';
import { docToObject, serverTimestamp } from '../utils/firestore.utils';
import {
  UserSettings,
  NotificationSettings,
  UpdateNotificationSettingsInput,
  PushSubscriptionData,
} from '../types';

const SETTINGS_COLLECTION = 'userSettings';

/**
 * Default notification settings for new users
 */
function getDefaultSettings(): NotificationSettings {
  return {
    push: {
      enabled: false,
      verified: false,
    },
    email: {
      enabled: true,
      verified: false,
    },
    whatsapp: {
      enabled: false,
      verified: false,
    },
    studyReminders: true,
    reminderTime: '09:00',
    reminderDays: [1, 2, 3, 4, 5], // Monday to Friday
    streakAlerts: true,
    streakAlertTime: '20:00',
    quizDelivery: false,
    quizFrequency: 'medium',
    weeklyDigest: true,
    weeklyDigestDay: 0, // Sunday
    weeklyDigestTime: '10:00',
    quietHoursEnabled: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    timezone: 'America/New_York',
  };
}

export const settingsService = {
  /**
   * Get user settings (creates default if not exists)
   */
  async getSettings(userId: string): Promise<UserSettings> {
    const settingsRef = db.collection(SETTINGS_COLLECTION).doc(userId);
    const doc = await settingsRef.get();

    if (!doc.exists) {
      // Create default settings
      const defaultSettings = {
        userId,
        notifications: getDefaultSettings(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await settingsRef.set(defaultSettings);
      const newDoc = await settingsRef.get();
      return docToObject<UserSettings>(newDoc);
    }

    return docToObject<UserSettings>(doc);
  },

  /**
   * Update notification settings
   */
  async updateSettings(
    userId: string,
    input: UpdateNotificationSettingsInput
  ): Promise<UserSettings> {
    const settingsRef = db.collection(SETTINGS_COLLECTION).doc(userId);
    const doc = await settingsRef.get();

    let currentSettings: NotificationSettings;

    if (!doc.exists) {
      currentSettings = getDefaultSettings();
      await settingsRef.set({
        userId,
        notifications: currentSettings,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      currentSettings = doc.data()!.notifications;
    }

    // Merge updates with current settings
    const updatedNotifications: NotificationSettings = {
      ...currentSettings,
      push: input.push
        ? { ...currentSettings.push, ...input.push }
        : currentSettings.push,
      email: input.email
        ? { ...currentSettings.email, ...input.email }
        : currentSettings.email,
      whatsapp: input.whatsapp
        ? { ...currentSettings.whatsapp, ...input.whatsapp }
        : currentSettings.whatsapp,
      studyReminders: input.studyReminders ?? currentSettings.studyReminders,
      reminderTime: input.reminderTime ?? currentSettings.reminderTime,
      reminderDays: input.reminderDays ?? currentSettings.reminderDays,
      streakAlerts: input.streakAlerts ?? currentSettings.streakAlerts,
      streakAlertTime: input.streakAlertTime ?? currentSettings.streakAlertTime,
      quizDelivery: input.quizDelivery ?? currentSettings.quizDelivery,
      quizFrequency: input.quizFrequency ?? currentSettings.quizFrequency,
      weeklyDigest: input.weeklyDigest ?? currentSettings.weeklyDigest,
      weeklyDigestDay: input.weeklyDigestDay ?? currentSettings.weeklyDigestDay,
      weeklyDigestTime: input.weeklyDigestTime ?? currentSettings.weeklyDigestTime,
      quietHoursEnabled: input.quietHoursEnabled ?? currentSettings.quietHoursEnabled,
      quietHoursStart: input.quietHoursStart ?? currentSettings.quietHoursStart,
      quietHoursEnd: input.quietHoursEnd ?? currentSettings.quietHoursEnd,
      timezone: input.timezone ?? currentSettings.timezone,
    };

    await settingsRef.update({
      notifications: updatedNotifications,
      updatedAt: serverTimestamp(),
    });

    const updatedDoc = await settingsRef.get();
    return docToObject<UserSettings>(updatedDoc);
  },

  /**
   * Reset settings to defaults
   */
  async resetSettings(userId: string): Promise<UserSettings> {
    const settingsRef = db.collection(SETTINGS_COLLECTION).doc(userId);

    await settingsRef.set(
      {
        userId,
        notifications: getDefaultSettings(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    const doc = await settingsRef.get();
    return docToObject<UserSettings>(doc);
  },

  /**
   * Register push subscription
   */
  async registerPushSubscription(
    userId: string,
    subscription: PushSubscriptionData
  ): Promise<UserSettings> {
    return this.updateSettings(userId, {
      push: {
        enabled: true,
        verified: true,
        verifiedAt: new Date(),
        subscription,
      },
    });
  },

  /**
   * Unregister push subscription
   */
  async unregisterPushSubscription(userId: string): Promise<UserSettings> {
    return this.updateSettings(userId, {
      push: {
        enabled: false,
        verified: false,
        subscription: null,
      },
    });
  },

  /**
   * Check if within quiet hours
   */
  isQuietHours(settings: NotificationSettings): boolean {
    if (!settings.quietHoursEnabled) return false;

    const now = new Date();
    let userTime: Date;

    try {
      userTime = new Date(
        now.toLocaleString('en-US', { timeZone: settings.timezone })
      );
    } catch {
      userTime = now;
    }

    const currentMinutes = userTime.getHours() * 60 + userTime.getMinutes();

    const [startHour, startMinute] = settings.quietHoursStart.split(':').map(Number);
    const [endHour, endMinute] = settings.quietHoursEnd.split(':').map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    // Handle overnight quiet hours (e.g., 22:00 - 08:00)
    if (startMinutes > endMinutes) {
      return currentMinutes >= startMinutes || currentMinutes < endMinutes;
    }

    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  },

  /**
   * Get all users with specific notification enabled
   */
  async getUsersWithNotification(
    notificationType: 'studyReminders' | 'streakAlerts' | 'weeklyDigest'
  ): Promise<string[]> {
    const snapshot = await db
      .collection(SETTINGS_COLLECTION)
      .where(`notifications.${notificationType}`, '==', true)
      .get();

    return snapshot.docs.map((doc) => doc.data().userId);
  },
};
