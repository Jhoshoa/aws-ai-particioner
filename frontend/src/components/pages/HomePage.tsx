import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MainLayout } from '../templates';
import { Text, Badge, Spinner } from '../atoms';
import { Card, StatBox, TabButton, Alert } from '../molecules';
import { DomainCard } from '../organisms';
import {
  useGetDomainsQuery,
  useGetResourcesQuery,
  useGetStudyPlanQuery,
} from '../../store/api';

type TabType = 'overview' | 'domains' | 'study-plan' | 'resources';

export function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const { data: domains, isLoading: domainsLoading, error: domainsError } = useGetDomainsQuery();
  const { data: resources, isLoading: resourcesLoading } = useGetResourcesQuery();
  const { data: studyPlan, isLoading: studyPlanLoading } = useGetStudyPlanQuery();

  const getDomainColor = (domainNumber: number | null) => {
    if (!domainNumber || !domains) return '#6B7280';
    const domain = domains.find((d) => d.domainNumber === domainNumber);
    return domain?.color || '#6B7280';
  };

  if (domainsLoading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (domainsError) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Alert variant="error">
            Failed to load study plan data. Please try again later.
          </Alert>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Helmet>
        <title>AWS AI Practitioner Study Plan | AIF-C01</title>
        <meta
          name="description"
          content="12-week study plan for AWS AI Practitioner certification AIF-C01"
        />
      </Helmet>

      {/* Hero Section */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div>
            <Text variant="label" className="mb-2">
              AWS CERTIFICATION ROADMAP
            </Text>
            <Text variant="h1" className="mb-1">
              AI PRACTITIONER
            </Text>
            <div className="font-display text-2xl md:text-3xl tracking-widest text-accent-cyan">
              AIF-C01 · 12-WEEK BATTLE PLAN
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <StatBox icon="?" label="65 Questions" />
            <StatBox icon="⏱" label="90 Minutes" />
            <StatBox icon="🎯" label="Score 700+" />
            <StatBox icon="📅" label="1hr/day" />
          </div>
        </div>

        {/* Advantage Banner */}
        <Alert variant="success" className="mt-6">
          ✅ Cloud Practitioner certified — you already know AWS core services.
          Focus on AI/ML concepts & Bedrock. You can do this in 10–12 weeks.
        </Alert>

        {/* Tabs */}
        <div className="flex gap-1 mt-8 border-b border-cyber-border">
          {(['overview', 'domains', 'study-plan', 'resources'] as TabType[]).map((tab) => (
            <TabButton
              key={tab}
              active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'study-plan' ? '12-week plan' : tab}
            </TabButton>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto animate-fade-in">
        {activeTab === 'overview' && domains && (
          <div className="space-y-6">
            {/* Domain Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {domains.map((domain) => (
                <Card
                  key={domain.id}
                  accentColor={domain.color}
                  className="hover:scale-[1.02] transition-transform"
                >
                  <div className="flex justify-between items-start mb-3">
                    <Badge
                      variant="cyan"
                      size="sm"
                      style={{
                        backgroundColor: `${domain.color}22`,
                        color: domain.color,
                        borderColor: `${domain.color}44`,
                      }}
                    >
                      DOMAIN {domain.domainNumber}
                    </Badge>
                    <span
                      className="text-sm font-semibold px-2.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${domain.color}22`,
                        color: domain.color,
                      }}
                    >
                      {domain.weight}%
                    </span>
                  </div>
                  <h3 className="font-sans font-semibold text-cyber-text mb-2">
                    {domain.name}
                  </h3>
                  <div className="h-1 bg-cyber-border rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${domain.weight * 3.5}%`,
                        backgroundColor: domain.color,
                      }}
                    />
                  </div>
                  <p className="text-xs text-cyber-muted mt-2">
                    Weeks {domain.weeks} · {domain.topics.length} topics
                  </p>
                </Card>
              ))}
            </div>

            {/* Exam Strategy */}
            <Card>
              <Text variant="label" className="mb-4">
                EXAM STRATEGY
              </Text>
              <div className="space-y-3">
                {[
                  ['Domain 3 is worth 28%', 'Master RAG, Bedrock Agents, and Guardrails.'],
                  ['Domains 1+2 = 44% together', 'Strong AI/ML + GenAI fundamentals carry half your score.'],
                  ['Domains 4+5 = quick wins', 'Only 14% each, but highly learnable.'],
                  ['You need 700/1000 to pass', 'About 46/65 questions correct.'],
                ].map(([title, desc]) => (
                  <div key={title} className="flex gap-3">
                    <span className="text-accent-cyan flex-shrink-0">→</span>
                    <div>
                      <span className="font-semibold text-cyber-text">{title}: </span>
                      <span className="text-sm text-cyber-muted">{desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'domains' && domains && (
          <div className="space-y-3">
            {domains.map((domain) => (
              <DomainCard key={domain.id} domain={domain} />
            ))}
          </div>
        )}

        {activeTab === 'study-plan' && (
          <div className="space-y-6">
            <Card>
              <Text variant="label" className="mb-4">
                12-WEEK STUDY PLAN
              </Text>
              {studyPlanLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-cyber-border">
                        <th className="text-left py-3 px-3 font-sans font-semibold text-cyber-muted">
                          Week
                        </th>
                        <th className="text-left py-3 px-3 font-sans font-semibold text-cyber-muted">
                          Phase
                        </th>
                        <th className="text-left py-3 px-3 font-sans font-semibold text-cyber-muted">
                          Domain
                        </th>
                        <th className="text-left py-3 px-3 font-sans font-semibold text-cyber-muted">
                          Daily Tasks (1hr total)
                        </th>
                        <th className="text-left py-3 px-3 font-sans font-semibold text-cyber-muted">
                          Milestone
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {studyPlan?.map((week) => (
                        <tr
                          key={week.id}
                          className="border-b border-cyber-border/30 hover:bg-cyber-bg/30 transition-colors"
                        >
                          <td className="py-3 px-3">
                            <span
                              className="font-display text-lg"
                              style={{ color: getDomainColor(week.domainNumber) }}
                            >
                              {week.week}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <Badge
                              size="sm"
                              variant={
                                week.phase === 'Foundation'
                                  ? 'cyan'
                                  : week.phase === 'GenAI Core'
                                    ? 'orange'
                                    : week.phase === 'Applications'
                                      ? 'gold'
                                      : week.phase === 'Responsible AI'
                                        ? 'green'
                                        : week.phase === 'Security'
                                          ? 'pink'
                                          : 'cyan'
                              }
                            >
                              {week.phase}
                            </Badge>
                          </td>
                          <td className="py-3 px-3">
                            {week.domainNumber ? (
                              <span
                                className="font-semibold"
                                style={{ color: getDomainColor(week.domainNumber) }}
                              >
                                D{week.domainNumber}
                              </span>
                            ) : (
                              <span className="text-cyber-muted">—</span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <ul className="space-y-1">
                              {week.daily.map((task, i) => (
                                <li key={i} className="flex items-start gap-2 text-cyber-text/90">
                                  <span className="text-accent-cyan flex-shrink-0">•</span>
                                  {task}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-cyber-text font-semibold">{week.milestone}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-6">
            <Card>
              <Text variant="label" className="mb-4">
                RECOMMENDED RESOURCES
              </Text>
              {resourcesLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner />
                </div>
              ) : (
                <div className="divide-y divide-cyber-border/30">
                  {resources?.map((resource) => (
                    <div
                      key={resource.id}
                      className="py-3 flex items-start gap-3 hover:bg-cyber-bg/30 -mx-4 px-4 transition-colors"
                    >
                      <Badge
                        size="sm"
                        variant={
                          resource.type === 'FREE'
                            ? 'green'
                            : resource.type === 'PAID'
                              ? 'orange'
                              : resource.type === 'PRACTICE'
                                ? 'gold'
                                : 'cyan'
                        }
                      >
                        {resource.type}
                      </Badge>
                      <div>
                        <h4 className="font-sans font-semibold text-cyber-text text-sm">
                          {resource.name}
                        </h4>
                        <p className="text-xs text-cyber-muted mt-0.5">
                          {resource.note}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Practice Strategy */}
            <Card accentColor="#FFD700">
              <Text
                variant="label"
                className="mb-3"
                style={{ color: '#FFD700' }}
              >
                PRACTICE TEST STRATEGY
              </Text>
              <div className="space-y-2">
                {[
                  'Start practice tests after Week 4',
                  'Use section-based mode for weak domains',
                  'Target 80%+ before scheduling exam',
                  'Review EVERY wrong answer',
                  'Do 2+ full timed mocks before exam day',
                ].map((tip, i) => (
                  <div key={i} className="flex gap-2 text-sm text-cyber-text/90">
                    <span className="text-accent-gold flex-shrink-0">→</span>
                    {tip}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </section>
    </MainLayout>
  );
}
