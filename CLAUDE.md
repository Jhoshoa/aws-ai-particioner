# AWS AI Practitioner Study Plan

## Project Overview
A Firebase-based monorepo for AWS AI Practitioner (AIF-C01) certification preparation.

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Firebase Cloud Functions (Node.js 20)
- **Database**: Firestore
- **Auth**: Firebase Authentication
- **Monorepo**: NPM Workspaces

## Commands
```bash
# Development
npm run dev              # Start frontend + emulators
npm run emulators        # Start Firebase emulators only
npm run dev:frontend     # Start frontend only

# Build
npm run build            # Build all packages
npm run build:frontend   # Build frontend
npm run build:functions  # Build functions
npm run build:types      # Build shared types

# Deploy
npm run deploy           # Deploy everything
npm run deploy:hosting   # Deploy frontend only
npm run deploy:functions # Deploy functions only
npm run deploy:rules     # Deploy Firestore/Storage rules

# Lint & Type Check
npm run lint
npm run typecheck
```

## Project Structure
```
├── frontend/src/
│   ├── components/
│   │   ├── atoms/       # Button, Input, Text, Badge
│   │   ├── molecules/   # Card, FormField, NavItem
│   │   ├── organisms/   # Header, Sidebar, StudyPlanSection
│   │   └── templates/   # MainLayout, DashboardLayout
│   ├── pages/
│   ├── hooks/
│   ├── lib/             # Firebase client, utils
│   ├── types/
│   └── styles/
├── functions/src/       # Cloud Functions
├── packages/shared-types/src/  # Shared TS types
└── scripts/             # Seed scripts, utilities
```

## Firebase Emulators
| Service | Port |
|---------|------|
| Auth | 9099 |
| Functions | 5001 |
| Firestore | 8080 |
| Hosting | 5000 |
| Storage | 9199 |
| UI | 4000 |

## Key Conventions
- Functional components only
- TypeScript strict mode everywhere
- Tailwind for all styling (no inline styles)
- Atomic Design component hierarchy
- Props interfaces: `{ComponentName}Props`
- Use shared-types for cross-package types

## Rules
- @.claude/rules/code-style.md
- @.claude/rules/components.md
- @.claude/rules/styling.md
