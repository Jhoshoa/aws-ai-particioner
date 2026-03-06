import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'glow';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  accentColor?: string;
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4 md:p-5',
  lg: 'p-5 md:p-6',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'md',
      accentColor,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const borderColor = accentColor ? `${accentColor}44` : undefined;

    return (
      <div
        ref={ref}
        className={cn(
          'bg-cyber-card rounded-xl',
          'transition-all duration-200',
          variant === 'default' && 'border border-cyber-border',
          variant === 'bordered' && 'border-2',
          variant === 'glow' && 'border border-cyber-border glow',
          paddingStyles[padding],
          className
        )}
        style={{
          ...style,
          ...(borderColor && { borderColor }),
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card Header
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
  children,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 mb-4',
        className
      )}
      {...props}
    >
      <div>
        {title && (
          <h3 className="font-sans font-semibold text-cyber-text">{title}</h3>
        )}
        {subtitle && (
          <p className="text-sm text-cyber-muted mt-0.5">{subtitle}</p>
        )}
        {children}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

// Card Content
export function CardContent({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

// Card Footer
export function CardFooter({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 mt-4 pt-4 border-t border-cyber-border/30',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
