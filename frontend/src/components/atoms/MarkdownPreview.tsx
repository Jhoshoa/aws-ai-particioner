import ReactMarkdown from 'react-markdown';
import { cn } from '../../lib/utils';

export interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export const MarkdownPreview = ({ content, className }: MarkdownPreviewProps) => {
  return (
    <div
      className={cn(
        'prose prose-invert prose-sm max-w-none',
        'prose-headings:text-cyber-text prose-headings:font-display',
        'prose-p:text-cyber-text/90',
        'prose-code:text-accent-cyan prose-code:bg-cyber-bg prose-code:px-1 prose-code:rounded',
        'prose-pre:bg-cyber-bg prose-pre:border prose-pre:border-cyber-border',
        'prose-a:text-accent-cyan hover:prose-a:text-accent-cyan/80',
        'prose-strong:text-cyber-text',
        'prose-ul:text-cyber-text/90 prose-ol:text-cyber-text/90',
        className
      )}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};
