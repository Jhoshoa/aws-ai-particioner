# AWS AI Practitioner Study Plan

A Firebase-based web application to help you prepare for the AWS AI Practitioner (AIF-C01) certification.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Firebase Cloud Functions (Node.js 20)
- **Database**: Firestore
- **Auth**: Firebase Authentication
- **Storage**: Firebase Storage
- **Hosting**: Firebase Hosting

## Project Structure

```
├── frontend/              # React + Vite frontend
│   └── src/
│       ├── components/    # Atomic Design components
│       │   ├── atoms/
│       │   ├── molecules/
│       │   ├── organisms/
│       │   └── templates/
│       ├── pages/
│       ├── hooks/
│       ├── utils/
│       └── types/
├── functions/             # Firebase Cloud Functions
│   └── src/
├── packages/
│   └── shared-types/      # Shared TypeScript types
├── .github/workflows/     # CI/CD
├── firebase.json
├── firestore.rules
└── storage.rules
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 9+
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase project

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd aws-ai-practitioner
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Frontend
   cp frontend/.env.example frontend/.env.local

   # Functions
   cp functions/.env.example functions/.env
   ```

4. Update `.firebaserc` with your project ID:
   ```json
   {
     "projects": {
       "default": "your-project-id"
     }
   }
   ```

### Development

Run the frontend and Firebase emulators:

```bash
npm run dev
```

This starts:
- Frontend: http://localhost:5173
- Firebase Emulator UI: http://localhost:4000
- Firestore Emulator: http://localhost:8080
- Auth Emulator: http://localhost:9099
- Functions Emulator: http://localhost:5001

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend + emulators |
| `npm run build` | Build all packages |
| `npm run build:frontend` | Build frontend only |
| `npm run build:functions` | Build functions only |
| `npm run emulators` | Start Firebase emulators |
| `npm run deploy` | Deploy everything to Firebase |
| `npm run deploy:hosting` | Deploy frontend only |
| `npm run deploy:functions` | Deploy functions only |
| `npm run deploy:rules` | Deploy Firestore/Storage rules |

### Deployment

1. Login to Firebase:
   ```bash
   firebase login
   ```

2. Select your project:
   ```bash
   firebase use default
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

## Firebase Emulators

The project is configured to use Firebase emulators for local development:

| Service | Port |
|---------|------|
| Auth | 9099 |
| Functions | 5001 |
| Firestore | 8080 |
| Hosting | 5000 |
| Storage | 9199 |
| Emulator UI | 4000 |

Data is persisted in `.firebase-data/` directory.

## Environment Variables

### Frontend (`frontend/.env.local`)

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_USE_EMULATORS=true
```

### Functions (`functions/.env`)

```env
NODE_ENV=development
FIREBASE_PROJECT_ID=...
```

## License

MIT
