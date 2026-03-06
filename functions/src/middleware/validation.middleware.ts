import { Request, Response, NextFunction } from 'express';
import {
  validationResult,
  ValidationChain,
  body,
  param,
  query,
} from 'express-validator';
import { ValidationError } from '../types/errors';

/**
 * Middleware to check validation results
 * Throws ValidationError if validation fails
 */
export function validate(validations: ValidationChain[]) {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    // Check for errors
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    // Format errors
    const formattedErrors = errors.array().map((error) => {
      if (error.type === 'field') {
        return {
          field: error.path,
          message: error.msg,
        };
      }
      return {
        field: 'unknown',
        message: error.msg,
      };
    });

    next(new ValidationError('Validation failed', formattedErrors));
  };
}

// ============================================
// Common Validation Rules
// ============================================

/**
 * Validate MongoDB-style ObjectId (24 hex characters)
 * Note: Firestore uses different IDs, adjust as needed
 */
export const validateId = (field: string, location: 'param' | 'body' = 'param') => {
  const validator = location === 'param' ? param(field) : body(field);
  return validator
    .trim()
    .notEmpty()
    .withMessage(`${field} is required`)
    .isLength({ min: 1, max: 128 })
    .withMessage(`${field} must be between 1 and 128 characters`);
};

/**
 * Validate email
 */
export const validateEmail = (field = 'email') =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail();

/**
 * Validate required string
 */
export const validateRequiredString = (
  field: string,
  minLength = 1,
  maxLength = 255
) =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage(`${field} is required`)
    .isLength({ min: minLength, max: maxLength })
    .withMessage(`${field} must be between ${minLength} and ${maxLength} characters`);

/**
 * Validate optional string
 */
export const validateOptionalString = (
  field: string,
  maxLength = 255
) =>
  body(field)
    .optional()
    .trim()
    .isLength({ max: maxLength })
    .withMessage(`${field} must be at most ${maxLength} characters`);

/**
 * Validate boolean
 */
export const validateBoolean = (field: string) =>
  body(field)
    .isBoolean()
    .withMessage(`${field} must be a boolean`);

/**
 * Validate optional boolean
 */
export const validateOptionalBoolean = (field: string) =>
  body(field)
    .optional()
    .isBoolean()
    .withMessage(`${field} must be a boolean`);

/**
 * Validate integer
 */
export const validateInteger = (field: string, min?: number, max?: number) => {
  let validator = body(field)
    .isInt()
    .withMessage(`${field} must be an integer`);

  if (min !== undefined) {
    validator = validator.isInt({ min }).withMessage(`${field} must be at least ${min}`);
  }
  if (max !== undefined) {
    validator = validator.isInt({ max }).withMessage(`${field} must be at most ${max}`);
  }

  return validator.toInt();
};

/**
 * Validate pagination query params
 */
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
  query('sortBy')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Sort field must be at most 50 characters'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be "asc" or "desc"'),
];

/**
 * Validate array of strings
 */
export const validateStringArray = (field: string, maxItems = 100) =>
  body(field)
    .isArray({ max: maxItems })
    .withMessage(`${field} must be an array with at most ${maxItems} items`)
    .custom((value: unknown[]) => {
      if (!value.every((item) => typeof item === 'string')) {
        throw new Error(`All items in ${field} must be strings`);
      }
      return true;
    });

/**
 * Validate URL
 */
export const validateUrl = (field: string) =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage(`${field} is required`)
    .isURL()
    .withMessage(`${field} must be a valid URL`);

/**
 * Validate optional URL
 */
export const validateOptionalUrl = (field: string) =>
  body(field)
    .optional()
    .trim()
    .isURL()
    .withMessage(`${field} must be a valid URL`);
