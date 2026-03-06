import { Response } from 'express';
import { ApiSuccessResponse, ApiErrorResponse, ValidationErrorDetail } from '../types';

/**
 * Send a successful response
 */
export function successResponse<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200
): Response<ApiSuccessResponse<T>> {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

/**
 * Send a created response (201)
 */
export function createdResponse<T>(
  res: Response,
  data: T,
  message = 'Created successfully'
): Response<ApiSuccessResponse<T>> {
  return successResponse(res, data, message, 201);
}

/**
 * Send a no content response (204)
 */
export function noContentResponse(res: Response): Response {
  return res.status(204).send();
}

/**
 * Send an error response
 */
export function errorResponse(
  res: Response,
  message: string,
  statusCode = 500,
  errors?: ValidationErrorDetail[]
): Response<ApiErrorResponse> {
  const response: ApiErrorResponse = {
    success: false,
    message,
  };

  if (errors && errors.length > 0) {
    response.errors = errors;
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = new Error().stack;
  }

  return res.status(statusCode).json(response);
}

/**
 * Send a bad request response (400)
 */
export function badRequestResponse(
  res: Response,
  message = 'Bad request',
  errors?: ValidationErrorDetail[]
): Response<ApiErrorResponse> {
  return errorResponse(res, message, 400, errors);
}

/**
 * Send an unauthorized response (401)
 */
export function unauthorizedResponse(
  res: Response,
  message = 'Unauthorized'
): Response<ApiErrorResponse> {
  return errorResponse(res, message, 401);
}

/**
 * Send a forbidden response (403)
 */
export function forbiddenResponse(
  res: Response,
  message = 'Forbidden'
): Response<ApiErrorResponse> {
  return errorResponse(res, message, 403);
}

/**
 * Send a not found response (404)
 */
export function notFoundResponse(
  res: Response,
  message = 'Not found'
): Response<ApiErrorResponse> {
  return errorResponse(res, message, 404);
}

/**
 * Send a conflict response (409)
 */
export function conflictResponse(
  res: Response,
  message = 'Conflict'
): Response<ApiErrorResponse> {
  return errorResponse(res, message, 409);
}
