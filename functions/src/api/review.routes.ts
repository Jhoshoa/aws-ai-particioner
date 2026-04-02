import { Router, Response } from 'express';
import { body, query } from 'express-validator';
import { spacedRepetitionService } from '../services/spacedRepetition.service';
import { asyncHandler, authenticate, validate } from '../middleware';
import { successResponse } from '../utils/response.utils';
import { AuthenticatedRequest } from '../types';

const router = Router();

/**
 * GET /review/queue
 * Get questions due for review
 */
router.get(
  '/queue',
  authenticate,
  validate([
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50')
      .toInt(),
  ]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const queue = await spacedRepetitionService.getReviewQueue(authReq.user.uid, limit);
    return successResponse(res, queue, 'Review queue retrieved');
  })
);

/**
 * GET /review/stats
 * Get review statistics
 */
router.get(
  '/stats',
  authenticate,
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const stats = await spacedRepetitionService.getReviewStats(authReq.user.uid);
    return successResponse(res, stats, 'Review stats retrieved');
  })
);

/**
 * POST /review/submit
 * Submit a review answer
 */
router.post(
  '/submit',
  authenticate,
  validate([
    body('questionId').isString().notEmpty().withMessage('Question ID is required'),
    body('selectedAnswer')
      .isIn(['A', 'B', 'C', 'D'])
      .withMessage('Answer must be A, B, C, or D'),
    body('quality')
      .isInt({ min: 0, max: 5 })
      .withMessage('Quality must be between 0 and 5'),
    body('timeSpentSeconds')
      .isInt({ min: 0 })
      .withMessage('Time spent must be a non-negative integer'),
  ]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const result = await spacedRepetitionService.submitReview(authReq.user.uid, req.body);
    return successResponse(res, result, 'Review submitted');
  })
);

/**
 * POST /review/add
 * Add a question to the review queue (used after wrong quiz answers)
 */
router.post(
  '/add',
  authenticate,
  validate([
    body('questionId').isString().notEmpty().withMessage('Question ID is required'),
    body('domainId').isInt({ min: 1 }).withMessage('Domain ID is required'),
  ]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    await spacedRepetitionService.addToReviewQueue(
      authReq.user.uid,
      req.body.questionId,
      req.body.domainId
    );
    return successResponse(res, null, 'Question added to review queue');
  })
);

/**
 * GET /review/progress
 * Get all question progress
 */
router.get(
  '/progress',
  authenticate,
  validate([
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
      .toInt(),
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Offset must be non-negative')
      .toInt(),
  ]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
    const progress = await spacedRepetitionService.getAllProgress(
      authReq.user.uid,
      limit,
      offset
    );
    return successResponse(res, progress, 'Progress retrieved');
  })
);

export default router;
