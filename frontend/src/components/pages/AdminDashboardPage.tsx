import { Helmet } from 'react-helmet-async';
import { AdminLayout } from '../templates';
import { Text, Spinner } from '../atoms';
import { Card } from '../molecules';
import { useGetDomainsQuery, useGetResourcesQuery } from '../../store/api';

export function AdminDashboardPage() {
  const { data: domains, isLoading: domainsLoading } = useGetDomainsQuery();
  const { data: resources, isLoading: resourcesLoading } = useGetResourcesQuery();

  const stats = [
    {
      label: 'Total Domains',
      value: domains?.length ?? 0,
      color: '#00D4FF',
      loading: domainsLoading,
    },
    {
      label: 'Total Resources',
      value: resources?.length ?? 0,
      color: '#FF6B35',
      loading: resourcesLoading,
    },
    {
      label: 'Total Topics',
      value: domains?.reduce((acc, d) => acc + d.topics.length, 0) ?? 0,
      color: '#FFD700',
      loading: domainsLoading,
    },
    {
      label: 'Active Users',
      value: '—',
      color: '#00FF88',
      loading: false,
    },
  ];

  return (
    <AdminLayout>
      <Helmet>
        <title>Admin Dashboard | AWS AI Practitioner</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <Text variant="h2" className="text-2xl mb-1">
            Dashboard
          </Text>
          <Text variant="small">Manage your study plan content</Text>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="relative overflow-hidden">
              <div
                className="absolute top-0 left-0 w-1 h-full"
                style={{ backgroundColor: stat.color }}
              />
              <div className="pl-3">
                <p className="text-xs text-cyber-muted font-mono uppercase tracking-wider">
                  {stat.label}
                </p>
                {stat.loading ? (
                  <Spinner size="sm" className="mt-2" />
                ) : (
                  <p
                    className="text-3xl font-display mt-1"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <Text variant="label" className="mb-4">
            QUICK ACTIONS
          </Text>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="/admin/domains"
              className="p-4 bg-cyber-bg rounded-lg border border-cyber-border hover:border-accent-cyan/50 transition-colors"
            >
              <p className="font-sans font-semibold text-cyber-text">
                Manage Domains
              </p>
              <p className="text-xs text-cyber-muted mt-1">
                Edit domain topics and weights
              </p>
            </a>
            <a
              href="/admin/resources"
              className="p-4 bg-cyber-bg rounded-lg border border-cyber-border hover:border-accent-cyan/50 transition-colors"
            >
              <p className="font-sans font-semibold text-cyber-text">
                Manage Resources
              </p>
              <p className="text-xs text-cyber-muted mt-1">
                Add or update learning resources
              </p>
            </a>
            <a
              href="/admin/users"
              className="p-4 bg-cyber-bg rounded-lg border border-cyber-border hover:border-accent-cyan/50 transition-colors"
            >
              <p className="font-sans font-semibold text-cyber-text">
                Manage Users
              </p>
              <p className="text-xs text-cyber-muted mt-1">
                View and manage user accounts
              </p>
            </a>
          </div>
        </Card>

        {/* Recent Activity Placeholder */}
        <Card>
          <Text variant="label" className="mb-4">
            RECENT ACTIVITY
          </Text>
          <div className="text-center py-8 text-cyber-muted text-sm">
            Activity tracking coming soon...
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
