# Styling Rules (Tailwind CSS)

## General Principles
- Use Tailwind utility classes exclusively
- No inline `style={{}}` attributes
- No CSS modules or external CSS files (except global styles)
- Use `cn()` helper (clsx/tailwind-merge) for conditional classes

## Class Organization Order
1. Layout (display, position, flex/grid)
2. Spacing (margin, padding)
3. Sizing (width, height)
4. Typography (font, text)
5. Colors (bg, text color, border color)
6. Borders (border, rounded)
7. Effects (shadow, opacity)
8. Transitions/animations

```tsx
// Good
className="flex items-center gap-4 p-4 w-full text-sm text-gray-700 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
```

## Custom Design Tokens (tailwind.config.ts)

```ts
// Define project colors
colors: {
  cyber: {
    bg: '#050A14',
    card: '#0A1525',
    border: '#1A2F45',
    text: '#E8EDF5',
    muted: '#8AACCA',
  },
  accent: {
    cyan: '#00D4FF',
    orange: '#FF6B35',
    gold: '#FFD700',
    green: '#00FF88',
    pink: '#FF4D8D',
    purple: '#A78BFA',
  }
}
```

## Responsive Design
- Mobile-first approach
- Breakpoint order: base -> sm -> md -> lg -> xl
- Example: `className="text-sm md:text-base lg:text-lg"`

## Component Variants Pattern

```tsx
const buttonVariants = {
  primary: 'bg-accent-cyan text-cyber-bg hover:bg-accent-cyan/90',
  secondary: 'bg-cyber-card text-cyber-text border border-cyber-border',
  ghost: 'bg-transparent text-cyber-muted hover:text-cyber-text',
};

const Button = ({ variant = 'primary', className, ...props }: ButtonProps) => (
  <button className={cn(baseStyles, buttonVariants[variant], className)} {...props} />
);
```

## Animations
- Define custom animations in tailwind.config.ts
- Use Tailwind's built-in transitions for simple effects
- Keep animations subtle and purposeful

## Don'ts
- No `!important` overrides
- No arbitrary values unless absolutely necessary `[#custom]`
- No mixing Tailwind with other CSS approaches
- No hardcoded colors - use design tokens
