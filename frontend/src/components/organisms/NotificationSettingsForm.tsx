import { useState, useEffect } from 'react';
import { Text, Button, Toggle, TimeInput, DayPicker, Spinner } from '../atoms';
import { SettingsCard, ChannelStatus } from '../molecules';
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useResetSettingsMutation,
} from '../../store/api';
import { usePushNotifications } from '../../hooks';
import type { UpdateNotificationSettingsInput, NotificationSettings } from '../../types';
import { cn } from '../../lib/utils';

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const FREQUENCY_OPTIONS = [
  { value: 'low', label: '1 quiz/day' },
  { value: 'medium', label: '3 quizzes/day' },
  { value: 'high', label: '5 quizzes/day' },
] as const;

export interface NotificationSettingsFormProps {
  className?: string;
}

export function NotificationSettingsForm({ className }: NotificationSettingsFormProps) {
  const { data: settings, isLoading } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();
  const [resetSettings, { isLoading: isResetting }] = useResetSettingsMutation();

  const {
    isSupported: isPushSupported,
    permission: pushPermission,
    subscription: pushSubscription,
    isLoading: isPushLoading,
    subscribe: subscribePush,
    unsubscribe: unsubscribePush,
  } = usePushNotifications();

  const [localSettings, setLocalSettings] = useState<UpdateNotificationSettingsInput>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (settings) {
      setLocalSettings({});
      setHasChanges(false);
    }
  }, [settings]);

  const handleChange = <K extends keyof UpdateNotificationSettingsInput>(
    key: K,
    value: UpdateNotificationSettingsInput[K]
  ) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await updateSettings(localSettings).unwrap();
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset all settings to defaults?')) {
      try {
        await resetSettings().unwrap();
      } catch (error) {
        console.error('Failed to reset settings:', error);
      }
    }
  };

  const handlePushToggle = async () => {
    if (pushSubscription) {
      await unsubscribePush();
    } else {
      await subscribePush();
    }
  };

  const handleEmailToggle = () => {
    const currentEnabled = getValue('email')?.enabled ?? settings?.notifications.email.enabled;
    handleChange('email', { enabled: !currentEnabled });
  };

  const handleWhatsAppToggle = () => {
    const currentEnabled = getValue('whatsapp')?.enabled ?? settings?.notifications.whatsapp.enabled;
    handleChange('whatsapp', { enabled: !currentEnabled });
  };

  if (isLoading || !settings) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const n = settings.notifications;

  // Helper to get the effective value (local change or current setting)
  const getValue = <K extends keyof NotificationSettings>(key: K): NotificationSettings[K] => {
    const localValue = localSettings[key as keyof UpdateNotificationSettingsInput];
    if (localValue !== undefined) {
      return localValue as NotificationSettings[K];
    }
    return n[key];
  };

  const isPushEnabled = pushSubscription !== null;
  const isPushVerified = isPushEnabled && pushPermission === 'granted';

  return (
    <div className={cn('space-y-6', className)}>
      {/* Notification Channels */}
      <SettingsCard
        title="Notification Channels"
        description="Choose how you want to receive notifications"
        icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        }
      >
        <div className="space-y-3">
          {isPushSupported ? (
            <ChannelStatus
              channel="push"
              enabled={isPushEnabled}
              verified={isPushVerified}
              onToggle={handlePushToggle}
              isLoading={isPushLoading}
            />
          ) : (
            <div className="p-4 rounded-lg bg-cyber-bg border border-cyber-border">
              <Text variant="small" className="text-cyber-muted">
                Push notifications are not supported in this browser
              </Text>
            </div>
          )}
          <ChannelStatus
            channel="email"
            enabled={getValue('email')?.enabled ?? n.email.enabled}
            verified={n.email.verified ?? false}
            detail={n.email.email}
            onToggle={handleEmailToggle}
            isLoading={isUpdating}
          />
          <ChannelStatus
            channel="whatsapp"
            enabled={getValue('whatsapp')?.enabled ?? n.whatsapp.enabled}
            verified={n.whatsapp.verified ?? false}
            detail={n.whatsapp.phoneNumber}
            onToggle={handleWhatsAppToggle}
            isLoading={isUpdating}
          />
        </div>
      </SettingsCard>

      {/* Study Reminders */}
      <SettingsCard
        title="Study Reminders"
        description="Get reminded to study at your preferred time"
        icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      >
        <Toggle
          label="Enable study reminders"
          checked={getValue('studyReminders')}
          onChange={(v) => handleChange('studyReminders', v)}
        />
        {getValue('studyReminders') && (
          <>
            <TimeInput
              label="Reminder time"
              value={getValue('reminderTime')}
              onChange={(v) => handleChange('reminderTime', v)}
            />
            <div>
              <Text variant="small" className="text-cyber-muted mb-2">
                Reminder days
              </Text>
              <DayPicker
                selectedDays={getValue('reminderDays')}
                onChange={(v) => handleChange('reminderDays', v)}
              />
            </div>
          </>
        )}
      </SettingsCard>

      {/* Streak Alerts */}
      <SettingsCard
        title="Streak Alerts"
        description="Get notified when your streak is at risk"
        icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
            />
          </svg>
        }
      >
        <Toggle
          label="Enable streak alerts"
          checked={getValue('streakAlerts')}
          onChange={(v) => handleChange('streakAlerts', v)}
        />
        {getValue('streakAlerts') && (
          <TimeInput
            label="Alert time"
            value={getValue('streakAlertTime')}
            onChange={(v) => handleChange('streakAlertTime', v)}
          />
        )}
      </SettingsCard>

      {/* WhatsApp Quiz Delivery */}
      <SettingsCard
        title="WhatsApp Quiz Delivery"
        description="Receive quiz questions via WhatsApp"
        icon={
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        }
      >
        <Toggle
          label="Enable quiz delivery"
          description="Requires WhatsApp to be verified"
          checked={getValue('quizDelivery')}
          onChange={(v) => handleChange('quizDelivery', v)}
          disabled={!n.whatsapp.verified}
        />
        {getValue('quizDelivery') && (
          <div>
            <Text variant="small" className="text-cyber-muted mb-2">
              Quiz frequency
            </Text>
            <div className="flex gap-2">
              {FREQUENCY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleChange('quizFrequency', opt.value)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm transition-colors',
                    getValue('quizFrequency') === opt.value
                      ? 'bg-accent-cyan text-cyber-bg'
                      : 'bg-cyber-card border border-cyber-border text-cyber-muted hover:border-accent-cyan/50'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </SettingsCard>

      {/* Weekly Digest */}
      <SettingsCard
        title="Weekly Digest"
        description="Receive a summary of your weekly progress"
        icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        }
      >
        <Toggle
          label="Enable weekly digest"
          checked={getValue('weeklyDigest')}
          onChange={(v) => handleChange('weeklyDigest', v)}
        />
        {getValue('weeklyDigest') && (
          <div className="flex flex-wrap gap-4">
            <div>
              <Text variant="small" className="text-cyber-muted mb-2">
                Day
              </Text>
              <select
                value={getValue('weeklyDigestDay')}
                onChange={(e) => handleChange('weeklyDigestDay', parseInt(e.target.value))}
                className={cn(
                  'px-3 py-2 bg-cyber-card border border-cyber-border rounded-lg',
                  'text-cyber-text text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-accent-cyan/50'
                )}
              >
                {DAYS_OF_WEEK.map((day, i) => (
                  <option key={i} value={i}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <TimeInput
              label="Time"
              value={getValue('weeklyDigestTime')}
              onChange={(v) => handleChange('weeklyDigestTime', v)}
            />
          </div>
        )}
      </SettingsCard>

      {/* Quiet Hours */}
      <SettingsCard
        title="Quiet Hours"
        description="Pause notifications during specific hours"
        icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        }
      >
        <Toggle
          label="Enable quiet hours"
          checked={getValue('quietHoursEnabled')}
          onChange={(v) => handleChange('quietHoursEnabled', v)}
        />
        {getValue('quietHoursEnabled') && (
          <div className="flex flex-wrap gap-4">
            <TimeInput
              label="Start"
              value={getValue('quietHoursStart')}
              onChange={(v) => handleChange('quietHoursStart', v)}
            />
            <TimeInput
              label="End"
              value={getValue('quietHoursEnd')}
              onChange={(v) => handleChange('quietHoursEnd', v)}
            />
          </div>
        )}
      </SettingsCard>

      {/* Timezone */}
      <SettingsCard
        title="Timezone"
        description="Set your timezone for accurate scheduling"
        icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      >
        <select
          value={getValue('timezone')}
          onChange={(e) => handleChange('timezone', e.target.value)}
          className={cn(
            'w-full px-3 py-2 bg-cyber-card border border-cyber-border rounded-lg',
            'text-cyber-text text-sm',
            'focus:outline-none focus:ring-2 focus:ring-accent-cyan/50'
          )}
        >
          <option value="America/New_York">Eastern Time (ET)</option>
          <option value="America/Chicago">Central Time (CT)</option>
          <option value="America/Denver">Mountain Time (MT)</option>
          <option value="America/Los_Angeles">Pacific Time (PT)</option>
          <option value="America/Anchorage">Alaska Time (AKT)</option>
          <option value="Pacific/Honolulu">Hawaii Time (HT)</option>
          <option value="Europe/London">London (GMT/BST)</option>
          <option value="Europe/Paris">Paris (CET/CEST)</option>
          <option value="Europe/Berlin">Berlin (CET/CEST)</option>
          <option value="Asia/Tokyo">Tokyo (JST)</option>
          <option value="Asia/Shanghai">Shanghai (CST)</option>
          <option value="Asia/Kolkata">India (IST)</option>
          <option value="Australia/Sydney">Sydney (AEST/AEDT)</option>
        </select>
      </SettingsCard>

      {/* Actions */}
      <div className="flex justify-between pt-4 border-t border-cyber-border">
        <Button
          variant="ghost"
          onClick={handleReset}
          disabled={isResetting}
        >
          {isResetting ? 'Resetting...' : 'Reset to Defaults'}
        </Button>
        <Button
          onClick={handleSave}
          disabled={!hasChanges || isUpdating}
        >
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
