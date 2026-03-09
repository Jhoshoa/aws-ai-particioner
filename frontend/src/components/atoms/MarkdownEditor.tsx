import { useState } from 'react';
import { cn } from '../../lib/utils';
import { MarkdownPreview } from './MarkdownPreview';

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const MarkdownEditor = ({
  value,
  onChange,
  placeholder = 'Write your notes in Markdown...',
  minHeight = '300px',
}: MarkdownEditorProps) => {
  const [mode, setMode] = useState<'write' | 'preview'>('write');

  const wordCount = value.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="border border-cyber-border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-cyber-border bg-cyber-bg/50">
        <button
          type="button"
          onClick={() => setMode('write')}
          className={cn(
            'px-3 py-1 text-sm rounded transition-colors',
            mode === 'write'
              ? 'bg-accent-cyan/20 text-accent-cyan'
              : 'text-cyber-muted hover:text-cyber-text'
          )}
        >
          Write
        </button>
        <button
          type="button"
          onClick={() => setMode('preview')}
          className={cn(
            'px-3 py-1 text-sm rounded transition-colors',
            mode === 'preview'
              ? 'bg-accent-cyan/20 text-accent-cyan'
              : 'text-cyber-muted hover:text-cyber-text'
          )}
        >
          Preview
        </button>
        <span className="flex-1" />
        <span className="text-xs text-cyber-muted">{wordCount} words</span>
      </div>

      {/* Content */}
      {mode === 'write' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ minHeight }}
          className={cn(
            'w-full p-4 bg-transparent resize-y',
            'text-cyber-text placeholder:text-cyber-muted',
            'focus:outline-none font-mono text-sm'
          )}
        />
      ) : (
        <div className="p-4" style={{ minHeight }}>
          {value ? (
            <MarkdownPreview content={value} />
          ) : (
            <p className="text-cyber-muted text-sm">Nothing to preview</p>
          )}
        </div>
      )}
    </div>
  );
};
