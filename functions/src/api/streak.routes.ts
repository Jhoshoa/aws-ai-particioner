import { Router, Response } from 'express';
import { streakService } from '../services/streak.service';
import { asyncHandler, authenticate } from '../middleware';
import { successResponse } from '../utils/response.utils';
import { AuthenticatedRequest } from '../types';

const router = Router();

/**
 * GET /streak
 * Get user's streak information
 */
router.get(
  '/',
  authenticate,
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const streakInfo = await streakService.getStreakInfo(authReq.user.uid);
    return successResponse(res, streakInfo, 'Streak info retrieved successfully');
  })
);

/**
 * POST /streak/record
 * Record study activity for today
 */
router.post(
  '/record',
  authenticate,
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const streakInfo = await streakService.recordStudyActivity(authReq.user.uid);
    return successResponse(res, streakInfo, 'Activity recorded successfully');
  })
);

export default router;
