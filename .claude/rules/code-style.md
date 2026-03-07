# Code Style Rules

## TypeScript
- Use strict mode (`"strict": true` in tsconfig)
- No `any` type - use `unknown` if type is truly unknown
- Define interfaces for all props, API responses, and data structures
- Use type inference where obvious, explicit types for function returns
- Prefer `interface` over `type` for object shapes

## Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `StudyPlanCard.tsx` |
| Hooks | camelCase with `use` prefix | `useStudyProgress.ts` |
| Utils | camelCase | `formatDate.ts` |
| Types/Interfaces | PascalCase | `StudyPlanProps` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_RETRY_COUNT` |
| Files (non-component) | camelCase | `apiClient.ts` |

## Imports Order
1. React imports
2. Third-party libraries
3. Internal components (atoms, molecules, organisms)
4. Hooks
5. Utils
6. Types
7. Constants/data

## General Rules
- Use `const` by default, `let` only when reassignment needed
- No `var`
- Use arrow functions for components and callbacks
- Use early returns to reduce nesting
- Max function length: ~50 lines (split if longer)
- Destructure props in function signature
