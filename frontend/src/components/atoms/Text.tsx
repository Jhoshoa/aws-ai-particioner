import { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'small' | 'label' | 'mono';

type TextElement = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  as?: TextElement;
  muted?: boolean;
}

const variantStyles: Record<TextVariant, string> = {
  h1: 'font-display text-5xl md:text-7xl tracking-wide text-white',
  h2: 'font-display text-3xl md:text-4xl tracking-wide text-white',
  h3: 'font-sans text-xl font-semibold text-cyber-text',
  h4: 'font-sans text-lg font-semibold text-cyber-text',
  body: 'font-sans text-base text-cyber-text',
  small: 'font-sans text-sm text-cyber-muted',
  label: 'font-mono text-xs tracking-widest uppercase text-accent-cyan',
  mono: 'font-mono text-sm text-cyber-text',
};

const defaultElements: Record<TextVariant, TextElement> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body: 'p',
  small: 'span',
  label: 'span',
  mono: 'span',
};

export function Text({
  variant = 'body',
  as,
  muted = false,
  className,
  children,
  ...props
}: TextProps) {
  const Tag = as || defaultElements[variant];

  return (
    <Tag
      className={cn(
        variantStyles[variant],
        muted && 'text-cyber-muted',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
