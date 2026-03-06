import { Router, Response } from 'express';
import { userService } from '../services';
import {
  asyncHandler,
  authenticate,
  requireAdmin,
  validate,
  validateId,
  validateOptionalString,
  validateOptionalUrl,
  validateBoolean,
} from '../middleware';
import {
  successResponse,
  noContentResponse,
} from '../utils/response.utils';
import { AuthenticatedRequest } from '../types';
import { body } from 'express-validator';

const router = Router();

/**
 * GET /users/me
 * Get current authenticated user profile
 */
router.get(
  '/me',
  authenticate,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const user = await userService.getById(req.user.uid);
    return successResponse(res, user, 'User profile retrieved successfully');
  })
);

/**
 * PUT /users/me
 * Update current user profile
 */
router.put(
  '/me',
  authenticate,
  validate([
    validateOptionalString('displayName', 100),
    validateOptionalUrl('photoURL'),
  ]),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const user = await userService.update(req.user.uid, req.body);
    return successResponse(res, user, 'User profile updated successfully');
  })
);

/**
 * DELETE /users/me
 * Delete current user account
 */
router.delete(
  '/me',
  authenticate,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await userService.delete(req.user.uid);
    return noContentResponse(res);
  })
);

// ============================================
// Admin Routes
// ============================================

/**
 * GET /users/:id
 * Get user by ID (admin only)
 */
router.get(
  '/:id',
  authenticate,
  requireAdmin,
  validate([validateId('id')]),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const user = await userService.getById(req.params.id);
    return successResponse(res, user, 'User retrieved successfully');
  })
);

/**
 * PUT /users/:id/admin
 * Set admin status for user (admin only)
 */
router.put(
  '/:id/admin',
  authenticate,
  requireAdmin,
  validate([
    validateId('id'),
    body('isAdmin').isBoolean().withMessage('isAdmin must be a boolean'),
  ]),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { isAdmin } = req.body;
    await userService.setAdminClaim(req.params.id, isAdmin);
    return successResponse(
      res,
      { userId: req.params.id, isAdmin },
      `Admin status ${isAdmin ? 'granted' : 'revoked'} successfully`
    );
  })
);

/**
 * DELETE /users/:id
 * Delete user by ID (admin only)
 */
router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  validate([validateId('id')]),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await userService.delete(req.params.id);
    return noContentResponse(res);
  })
);

export default router;
