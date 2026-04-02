import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Timer } from 'lucide-react';
import { MainLayout } from '../templates';
import { Text, Spinner, Button } from '../atoms';
import { Card, Alert, SessionStatsBox } from '../molecules';
import { PomodoroTimer, SessionHistory } from '../organisms';
import {
  useGetSessionStatsQuery,
  useGetDomainsQuery,
  useStartSessionMutation,
  useEndSessionMutation,
  useGetActiveSessionQuery,
} from '../../store/api';

type ViewMode = 'select' | 'timer';

export function StudySessionPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('select');
  const [selectedDomain, setSelectedDomain] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const { data: stats, isLoading: statsLoading } = useGetSessionStatsQuery();
  const { data: domains, isLoading: domainsLoading } = useGetDomainsQuery();
  const { data: activeSession } = useGetActiveSessionQuery();
  const [startSession] = useStartSessionMutation();
  const [endSession] = useEndSessionMutation();

  // Check if there's an active session on load
  const handleResumeSession = useCallback(() => {
    if (activeSession) {
      setCurrentSessionId(activeSession.id);
      setSelectedDomain(activeSession.domainId);
      setSelectedTopic(activeSession.topicIndex);
      setViewMode('timer');
    }
  }, [activeSession]);

  const handleStartSession = useCallback(async () => {
    if (selectedDomain !== null && selectedTopic !== null) {
      const session = await startSession({
        domainId: selectedDomain,
        topicIndex: selectedTopic,
      }).unwrap();
      setCurrentSessionId(session.id);
      setViewMode('timer');
    }
  }, [selectedDomain, selectedTopic, startSession]);

  const handleSessionComplete = useCallback(
    async (minutes: number, pomodoros: number) => {
      if (currentSessionId) {
        await endSession({
          sessionId: currentSessionId,
          input: {
            durationMinutes: minutes,
            pomodorosCompleted: pomodoros,
            status: 'completed',
          },
        });
      }
      setViewMode('select');
      setCurrentSessionId(null);
      setSelectedDomain(null);
      setSelectedTopic(null);
    },
    [currentSessionId, endSession]
  );

  const selectedDomainData = domains?.find(
    (d) => d.domainNumber === selectedDomain
  );

  if (statsLoading || domainsLoading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Helmet>
        <title>Study Session | AWS AI Practitioner</title>
      </Helmet>

      <div className="py-10 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-accent-cyan/20 rounded-xl">
            <Timer className="w-8 h-8 text-accent-cyan" />
          </div>
          <div>
            <Text variant="h1">Study Session</Text>
            <Text variant="small" muted>
              Use the Pomodoro technique for focused study sessions
            </Text>
          </div>
        </div>

        {/* Active Session Alert */}
        {activeSession && viewMode === 'select' && (
          <Alert variant="info" className="mb-6">
            <div className="flex items-center justify-between">
              <span>
                You have an active session. Would you like to resume?
              </span>
              <Button size="sm" onClick={handleResumeSession}>
                Resume
              </Button>
            </div>
          </Alert>
        )}

        {/* Stats */}
        {stats && (
          <div className="mb-8">
            <SessionStatsBox stats={stats} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Content */}
          <div>
            {viewMode === 'select' ? (
              <Card>
                <Text variant="h3" className="mb-4">
                  Start New Session
                </Text>

                {/* Domain Selection */}
                <div className="mb-6">
                  <Text variant="label" className="mb-2">
                    Select Domain
                  </Text>
                  <div className="grid grid-cols-1 gap-2">
                    {domains?.map((domain) => (
                      <button
                        key={domain.id}
                        onClick={() => {
                          setSelectedDomain(domain.domainNumber);
                          setSelectedTopic(null);
                        }}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          selectedDomain === domain.domainNumber
                            ? 'border-accent-cyan bg-accent-cyan/10'
                            : 'border-cyber-border hover:border-cyber-muted'
                        }`}
                      >
                        <span
                          className="font-semibold"
                          style={{ color: domain.color }}
                        >
                          Domain {domain.domainNumber}:
                        </span>{' '}
                        <span className="text-cyber-text">{domain.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Topic Selection */}
                {selectedDomainData && (
                  <div className="mb-6">
                    <Text variant="label" className="mb-2">
                      Select Topic
                    </Text>
                    <div className="max-h-[200px] overflow-y-auto space-y-2">
                      {selectedDomainData.topics.map((topic, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedTopic(index)}
                          className={`w-full p-3 rounded-lg border text-left transition-all ${
                            selectedTopic === index
                              ? 'border-accent-cyan bg-accent-cyan/10'
                              : 'border-cyber-border hover:border-cyber-muted'
                          }`}
                        >
                          <span className="text-cyber-muted text-sm">
                            {index + 1}.
                          </span>{' '}
                          <span className="text-cyber-text">{topic}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleStartSession}
                  disabled={selectedDomain === null || selectedTopic === null}
                  className="w-full"
                  size="lg"
                >
                  Start Study Session
                </Button>
              </Card>
            ) : (
              <div>
                {selectedDomainData && (
                  <div className="mb-4 text-center">
                    <Text variant="label" style={{ color: selectedDomainData.color }}>
                      DOMAIN {selectedDomain}
                    </Text>
                    <Text variant="h3" className="mt-1">
                      {selectedDomainData.topics[selectedTopic || 0]}
                    </Text>
                  </div>
                )}
                <PomodoroTimer
                  onComplete={handleSessionComplete}
                  sessionDuration={25}
                  breakDuration={5}
                />
              </div>
            )}
          </div>

          {/* Session History */}
          <div>
            <SessionHistory limit={10} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
