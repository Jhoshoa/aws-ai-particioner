import { Router, Response } from 'express';
import { body, param } from 'express-validator';
import { progressService } from '../services';
import {
  asyncHandler,
  authenticate,
  validate,
  validateBoolean,
} from '../middleware';
import {
  successResponse,
  noContentResponse,
} from '../utils/response.utils';
import { AuthenticatedRequest } from '../types';

const router = Router();

/**
 * GET /progress
 * Get all progress for authenticated user
 */
router.get(
  '/',
  authenticate,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const progress = await progressService.getUserProgress(req.user.uid);
    return successResponse(res, progress, 'Progress retrieved successfully');
  })
);

/**
 * GET /progress/summary
 * Get progress summary for authenticated user
 */
router.get(
  '/summary',
  authenticate,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const summary = await progressService.getProgressSummary(req.user.uid);
    return successResponse(res, summary, 'Progress summary retrieved successfully');
  })
);

/**
 * GET /progress/domain/:domainId
 * Get progress for a specific domain
 */
router.get(
  '/domain/:domainId',
  authenticate,
  validate([
    param('domainId')
      .isInt({ min: 1, max: 10 })
      .withMessage('Domain ID must be between 1 and 10')
      .toInt(),
  ]),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const domainId = parseInt(req.params.domainId, 10);
    const progress = await progressService.getProgressByDomain(
      req.user.uid,
      domainId
    );
    return successResponse(res, progress, 'Domain progress retrieved successfully');
  })
);

/**
 * POST /progress
 * Update progress for a topic
 */
router.post(
  '/',
  authenticate,
  validate([
    body('domainId')
      .isInt({ min: 1, max: 10 })
      .withMessage('Domain ID must be between 1 and 10')
      .toInt(),
    body('topicId')
      .trim()
      .notEmpty()
      .withMessage('Topic ID is required')
      .isLength({ max: 100 })
      .withMessage('Topic ID must be at most 100 characters'),
    validateBoolean('completed'),
  ]),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { domainId, topicId, completed } = req.body;

    const progress = await progressService.updateProgress(
      req.user.uid,
      domainId,
      topicId,
      completed
    );

    return successResponse(res, progress, 'Progress updated successfully');
  })
);

/**
 * DELETE /progress
 * Reset all progress for authenticated user
 */
router.delete(
  '/',
  authenticate,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await progressService.resetProgress(req.user.uid);
    return noContentResponse(res);
  })
);

/**
 * DELETE /progress/:domainId/:topicId
 * Delete progress for a specific topic
 */
router.delete(
  '/:domainId/:topicId',
  authenticate,
  validate([
    param('domainId')
      .isInt({ min: 1, max: 10 })
      .withMessage('Domain ID must be between 1 and 10')
      .toInt(),
    param('topicId')
      .trim()
      .notEmpty()
      .withMessage('Topic ID is required'),
  ]),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const domainId = parseInt(req.params.domainId, 10);
    const { topicId } = req.params;

    await progressService.deleteProgress(req.user.uid, domainId, topicId);
    return noContentResponse(res);
  })
);

export default router;
