import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

export function FormField({
  label,
  error,
  hint,
  required,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label className="block text-sm font-mono text-cyber-muted">
          {label}
          {required && <span className="text-accent-pink ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-xs text-accent-pink font-mono">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-cyber-muted/70 font-mono">{hint}</p>
      )}
    </div>
  );
}
