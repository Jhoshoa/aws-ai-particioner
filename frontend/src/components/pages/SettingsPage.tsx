import { Helmet } from 'react-helmet-async';
import { MainLayout } from '../templates';
import { Text } from '../atoms';
import { NotificationSettingsForm } from '../organisms';

export function SettingsPage() {
  return (
    <MainLayout>
      <Helmet>
        <title>Settings | AWS AI Practitioner</title>
      </Helmet>

      <div className="py-10 px-4 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Text variant="h1">Settings</Text>
          <Text variant="body" className="text-cyber-muted mt-2">
            Manage your notification preferences and account settings.
          </Text>
        </div>

        {/* Notification Settings */}
        <NotificationSettingsForm />
      </div>
    </MainLayout>
  );
}
