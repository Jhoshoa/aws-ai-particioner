# Firebase Cloud Functions

Backend API for the AWS AI Practitioner Study Plan application.

## Tech Stack

- Firebase Cloud Functions v4
- Firebase Admin SDK v12
- Express.js 4
- TypeScript 5
- Node.js 20

## Directory Structure

```
functions/
├── src/
│   ├── api/                  # API route definitions
│   │   ├── index.ts          # Main router
│   │   ├── domain.routes.ts
│   │   ├── resource.routes.ts
│   │   ├── progress.routes.ts
│   │   └── user.routes.ts
│   ├── services/             # Business logic
│   │   ├── domain.service.ts
│   │   ├── resource.service.ts
│   │   ├── progress.service.ts
│   │   └── user.service.ts
│   ├── middleware/           # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   ├── utils/                # Helper functions
│   │   ├── response.utils.ts
│   │   └── firestore.utils.ts
│   ├── triggers/             # Firebase triggers
│   │   └── auth.triggers.ts
│   ├── seeders/              # Database seeding
│   │   └── index.ts
│   ├── config/
│   │   └── firebase.config.ts
│   ├── types/
│   │   ├── index.ts
│   │   └── errors.ts
│   └── index.ts              # Entry point
├── lib/                      # Compiled output (gitignored)
├── jest.config.js
├── tsconfig.json
└── package.json
```

## API Endpoints

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

### Domains

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/domains` | - | Get all domains |
| GET | `/api/domains/:id` | - | Get domain by ID |
| POST | `/api/domains` | Admin | Create domain |
| PUT | `/api/domains/:id` | Admin | Update domain |
| DELETE | `/api/domains/:id` | Admin | Delete domain |

### Resources

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/resources` | - | Get all resources |
| GET | `/api/resources?type=FREE` | - | Filter by type |
| GET | `/api/resources/:id` | - | Get resource by ID |
| POST | `/api/resources` | Admin | Create resource |
| PUT | `/api/resources/:id` | Admin | Update resource |
| DELETE | `/api/resources/:id` | Admin | Delete resource |

### Progress

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/progress` | User | Get user progress |
| GET | `/api/progress/summary` | User | Get progress summary |
| GET | `/api/progress/domain/:id` | User | Get domain progress |
| POST | `/api/progress` | User | Update topic progress |
| DELETE | `/api/progress` | User | Reset all progress |
| DELETE | `/api/progress/:domainId/:topicId` | User | Delete topic progress |

### Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/me` | User | Get current user |
| PUT | `/api/users/me` | User | Update profile |
| DELETE | `/api/users/me` | User | Delete account |
| GET | `/api/users/:id` | Admin | Get user by ID |
| PUT | `/api/users/:id/admin` | Admin | Set admin status |
| DELETE | `/api/users/:id` | Admin | Delete user |

## Scripts

```bash
# Build
npm run build           # Compile TypeScript

# Development
npm run serve           # Build + start emulator
npm run build:watch     # Watch mode

# Testing
npm run test            # Run tests
npm run test:watch      # Watch mode

# Linting
npm run lint            # Check for issues
npm run lint:fix        # Auto-fix issues
npm run typecheck       # Type check only

# Deployment
npm run deploy          # Build + deploy

# Seeding
npm run seed            # Seed database
```

## Authentication

API uses Firebase Auth tokens. Include in requests:

```
Authorization: Bearer <firebase-id-token>
```

### Custom Claims

- `admin: true` - Grants admin access

## Response Format

### Success

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Rate Limit Exceeded |
| 500 | Internal Server Error |

## Environment Variables

Copy `.env.example` to `.env`:

```env
NODE_ENV=development
FIREBASE_PROJECT_ID=your-project-id
```

## Development

1. Start emulators from root:
   ```bash
   npm run emulators
   ```

2. Seed the database:
   ```bash
   npm run seed -w functions
   ```

3. Test the API:
   ```bash
   curl http://localhost:5001/your-project/us-central1/api/health
   ```
