// Auth middleware
export {
  authenticate,
  optionalAuthenticate,
  requireAdmin,
  requireClaim,
  requireOwnership,
} from './auth.middleware';

// Error middleware
export {
  errorHandler,
  notFoundHandler,
  asyncHandler,
} from './error.middleware';

// Validation middleware
export {
  validate,
  validateId,
  validateEmail,
  validateRequiredString,
  validateOptionalString,
  validateBoolean,
  validateOptionalBoolean,
  validateInteger,
  validatePagination,
  validateStringArray,
  validateUrl,
  validateOptionalUrl,
} from './validation.middleware';
