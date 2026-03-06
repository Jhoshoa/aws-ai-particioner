import { useState } from 'react';
import { cn } from '../../lib/utils';
import { Icon, ProgressBar } from '../atoms';
import type { Domain } from '../../types';

export interface DomainCardProps {
  domain: Domain;
  progress?: number;
  expanded?: boolean;
  onToggle?: () => void;
}

export function DomainCard({
  domain,
  progress = 0,
  expanded = false,
  onToggle,
}: DomainCardProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    onToggle?.();
  };

  return (
    <div
      className={cn(
        'bg-cyber-card rounded-xl overflow-hidden',
        'border transition-all duration-200 cursor-pointer',
        isExpanded ? 'border-opacity-100' : 'border-cyber-border hover:scale-[1.01]'
      )}
      style={{ borderColor: isExpanded ? domain.color : undefined }}
      onClick={handleToggle}
    >
      {/* Header */}
      <div className="p-4 md:p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Domain Number */}
          <div
            className="w-10 h-10 rounded-lg flex flex-col items-center justify-center border"
            style={{
              backgroundColor: `${domain.color}22`,
              borderColor: `${domain.color}44`,
            }}
          >
            <span
              className="font-display text-lg leading-none"
              style={{ color: domain.color }}
            >
              {domain.id}
            </span>
          </div>

          {/* Domain Info */}
          <div>
            <h3 className="font-sans font-semibold text-cyber-text text-sm md:text-base">
              {domain.name}
            </h3>
            <p className="text-xs text-cyber-muted mt-0.5">
              Weeks {domain.weeks} · {domain.topics.length} topics
            </p>
          </div>
        </div>

        {/* Weight & Expand */}
        <div className="flex items-center gap-3">
          <span
            className="font-display text-xl"
            style={{ color: domain.color }}
          >
            {domain.weight}%
          </span>
          <Icon
            name={isExpanded ? 'chevronUp' : 'chevronDown'}
            className="text-cyber-muted"
          />
        </div>
      </div>

      {/* Progress Bar */}
      {progress > 0 && (
        <div className="px-4 md:px-5 pb-3">
          <ProgressBar
            value={progress}
            barColor={domain.color}
            size="sm"
          />
        </div>
      )}

      {/* Expanded Topics */}
      {isExpanded && (
        <div
          className="border-t px-4 md:px-5 py-4"
          style={{ borderColor: `${domain.color}33` }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {domain.topics.map((topic, index) => (
              <div
                key={index}
                className="flex items-start gap-2.5 text-sm text-cyber-text/90 py-1"
              >
                <span
                  className="flex-shrink-0 mt-1.5 text-[8px]"
                  style={{ color: domain.color }}
                >
                  ◆
                </span>
                {topic}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
