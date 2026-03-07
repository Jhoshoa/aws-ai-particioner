# Component Rules (Atomic Design + React)

## Atomic Design Hierarchy

### Atoms (`components/atoms/`)
- Smallest UI units: Button, Input, Text, Icon, Badge, Spinner
- No business logic
- Highly reusable, style-only variations via props
- Example: `<Button variant="primary" size="sm">Click</Button>`

### Molecules (`components/molecules/`)
- Combine 2-3 atoms into functional units
- Examples: Card, FormField, NavItem, SearchBar, ProgressBar
- Minimal logic, mostly composition
- Example: `<FormField label="Email" error={error}><Input /></FormField>`

### Organisms (`components/organisms/`)
- Complex, self-contained sections
- Examples: Header, Sidebar, StudyPlanSection, DomainCard
- Can contain state and business logic
- Example: `<StudyPlanSection weekData={week} onComplete={handleComplete} />`

### Templates (`components/templates/`)
- Page layouts defining structure
- Examples: MainLayout, DashboardLayout
- Use children prop for content injection
- Handle responsive layout logic here

## Component File Structure

```tsx
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/atoms';
import type { CardProps } from './Card.types';

// 2. Props interface (or import from .types.ts)
interface CardProps {
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'highlighted';
}

// 3. Component
const Card = ({ title, children, variant = 'default' }: CardProps) => {
  return (
    <div className={cn('rounded-lg p-4', variantStyles[variant])}>
      <h3 className="text-lg font-semibold">{title}</h3>
      {children}
    </div>
  );
};

// 4. Export
export default Card;
```

## Rules
- One component per file
- Props interface in same file (or separate `.types.ts` for complex types)
- Use default export for components
- Use named exports for hooks and utils
- Keep components focused - if > 150 lines, consider splitting
- Colocate related files: `Card.tsx`, `Card.types.ts`, `Card.test.tsx`
