import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../types/errors';
import { errorResponse } from '../utils/response.utils';
import * as functions from 'firebase-functions';

/**
 * Global error handler middleware
 * Catches all errors and returns standardized error responses
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response {
  // Log error for debugging
  functions.logger.error('Error:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });

  // Handle known operational errors
  if (err instanceof AppError) {
    // Handle validation errors with field details
    if (err instanceof ValidationError) {
      return errorResponse(
        res,
        err.message,
        err.statusCode,
        err.errors.map((e) => ({
          field: e.field,
          message: e.message,
        }))
      );
    }

    return errorResponse(res, err.message, err.statusCode);
  }

  // Handle Firebase Auth errors
  if (err.name === 'FirebaseAuthError') {
    return errorResponse(res, 'Authentication error', 401);
  }

  // Handle Firestore errors
  if (err.name === 'FirebaseError') {
    const firebaseError = err as { code?: string };

    if (firebaseError.code === 'not-found') {
      return errorResponse(res, 'Resource not found', 404);
    }

    if (firebaseError.code === 'permission-denied') {
      return errorResponse(res, 'Permission denied', 403);
    }

    if (firebaseError.code === 'already-exists') {
      return errorResponse(res, 'Resource already exists', 409);
    }
  }

  // Handle JSON parsing errors
  if (err instanceof SyntaxError && 'body' in err) {
    return errorResponse(res, 'Invalid JSON in request body', 400);
  }

  // Handle unknown errors (don't expose details in production)
  const message =
    process.env.NODE_ENV === 'development'
      ? err.message
      : 'Internal server error';

  return errorResponse(res, message, 500);
}

/**
 * 404 Not Found handler for undefined routes
 */
export function notFoundHandler(
  req: Request,
  res: Response,
  _next: NextFunction
): Response {
  return errorResponse(
    res,
    `Route ${req.method} ${req.path} not found`,
    404
  );
}

/**
 * Async handler wrapper to catch errors in async route handlers
 * Uses generic type to support both Request and AuthenticatedRequest
 */
export function asyncHandler<T, R extends Request = Request>(
  fn: (req: R, res: Response, next: NextFunction) => Promise<T>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req as R, res, next)).catch(next);
  };
}
