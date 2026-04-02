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
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const progress = await progressService.getUserProgress(authReq.user.uid);
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
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const summary = await progressService.getProgressSummary(authReq.user.uid);
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
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const domainId = parseInt(req.params.domainId, 10);
    const progress = await progressService.getProgressByDomain(
      authReq.user.uid,
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
    body('topicIndex')
      .isInt({ min: 0 })
      .withMessage('Topic index must be a non-negative integer')
      .toInt(),
    validateBoolean('completed'),
  ]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const { domainId, topicIndex, completed } = req.body;

    const progress = await progressService.updateProgress(
      authReq.user.uid,
      domainId,
      topicIndex,
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
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    await progressService.resetProgress(authReq.user.uid);
    return noContentResponse(res);
  })
);

/**
 * DELETE /progress/:domainId/:topicId
 * Delete progress for a specific topic
 */
router.delete(
  '/:domainId/:topicIndex',
  authenticate,
  validate([
    param('domainId')
      .isInt({ min: 1, max: 10 })
      .withMessage('Domain ID must be between 1 and 10')
      .toInt(),
    param('topicIndex')
      .isInt({ min: 0 })
      .withMessage('Topic index must be a non-negative integer')
      .toInt(),
  ]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const domainId = parseInt(req.params.domainId, 10);
    const topicIndex = parseInt(req.params.topicIndex, 10);

    await progressService.deleteProgress(authReq.user.uid, domainId, topicIndex);
    return noContentResponse(res);
  })
);

/**
 * GET /progress/enhanced
 * Get enhanced progress summary with user stats
 */
router.get(
  '/enhanced',
  authenticate,
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const summary = await progressService.getEnhancedProgressSummary(authReq.user.uid);
    return successResponse(res, summary, 'Enhanced progress summary retrieved successfully');
  })
);

/**
 * GET /progress/domains/:domainId/detail
 * Get detailed progress for a specific domain
 */
router.get(
  '/domains/:domainId/detail',
  authenticate,
  validate([
    param('domainId')
      .isInt({ min: 1, max: 5 })
      .withMessage('Domain ID must be between 1 and 5')
      .toInt(),
  ]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const domainId = parseInt(req.params.domainId, 10);
    const progress = await progressService.getDomainProgressDetail(authReq.user.uid, domainId);
    return successResponse(res, progress, 'Domain progress detail retrieved successfully');
  })
);

/**
 * PUT /progress/topics
 * Update topic progress (enhanced version)
 */
router.put(
  '/topics',
  authenticate,
  validate([
    body('domainId')
      .isInt({ min: 1, max: 5 })
      .withMessage('Domain ID must be between 1 and 5'),
    body('topicIndex')
      .isInt({ min: 0 })
      .withMessage('Topic index must be a non-negative integer'),
    validateBoolean('completed'),
    body('studyTimeMinutes')
      .optional()
      .isInt({ min: 0, max: 480 })
      .withMessage('Study time must be between 0 and 480 minutes'),
    body('notes')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Notes must be less than 1000 characters'),
  ]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const progress = await progressService.updateTopicProgressEnhanced(authReq.user.uid, req.body);
    return successResponse(res, progress, 'Progress updated successfully');
  })
);

/**
 * PUT /progress/topics/batch
 * Batch update multiple topics
 */
router.put(
  '/topics/batch',
  authenticate,
  validate([
    body('updates')
      .isArray({ min: 1, max: 100 })
      .withMessage('Updates must be an array with 1-100 items'),
    body('updates.*.domainId')
      .isInt({ min: 1, max: 5 })
      .withMessage('Each update domain ID must be between 1 and 5'),
    body('updates.*.topicIndex')
      .isInt({ min: 0 })
      .withMessage('Each update topic index must be a non-negative integer'),
    body('updates.*.completed')
      .isBoolean()
      .withMessage('Each update completed must be a boolean'),
  ]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    await progressService.batchUpdateProgress(authReq.user.uid, req.body.updates);
    return successResponse(res, null, 'Progress batch updated successfully');
  })
);

/**
 * POST /progress/study-time
 * Add study time
 */
router.post(
  '/study-time',
  authenticate,
  validate([
    body('minutes')
      .isInt({ min: 1, max: 480 })
      .withMessage('Minutes must be between 1 and 480'),
  ]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    await progressService.addStudyTime(authReq.user.uid, req.body.minutes);
    return successResponse(res, null, 'Study time added successfully');
  })
);

/**
 * GET /progress/stats
 * Get user stats
 */
router.get(
  '/stats',
  authenticate,
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const stats = await progressService.getUserStats(authReq.user.uid);
    return successResponse(res, stats, 'User stats retrieved successfully');
  })
);

export default router;
