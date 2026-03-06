import * as functions from 'firebase-functions';
import express, { Express } from 'express';
import cors from 'cors';

// Import routes
import apiRoutes from './api';

// Import middleware
import { errorHandler, notFoundHandler } from './middleware';

// Import triggers
import { onUserCreated, onUserDeleted } from './triggers';

// ============================================
// Express App Setup
// ============================================

const app: Express = express();

// CORS configuration
const corsOptions: cors.CorsOptions = {
  origin: true, // Allow all origins in development, configure for production
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 24 hours
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    functions.logger.info(`${req.method} ${req.path}`, {
      query: req.query,
      body: req.body,
    });
    next();
  });
}

// API routes
app.use('/api', apiRoutes);

// Legacy routes (redirect to /api)
app.use('/health', (_req, res) => {
  res.redirect('/api/health');
});

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ============================================
// Firebase Functions Exports
// ============================================

/**
 * Main API function
 * Exposed as HTTP endpoint
 */
export const api = functions
  .runWith({
    memory: '256MB',
    timeoutSeconds: 60,
    minInstances: 0,
    maxInstances: 10,
  })
  .https.onRequest(app);

/**
 * Auth triggers
 */
export { onUserCreated, onUserDeleted };
