import { Router, Response } from 'express';
import { body } from 'express-validator';
import { achievementService } from '../services/achievement.service';
import { asyncHandler, authenticate, optionalAuthenticate, validate } from '../middleware';
import { successResponse } from '../utils/response.utils';
import { AuthenticatedRequest } from '../types';

const router = Router();

/**
 * GET /achievements
 * Get all achievements (with user's unlock status if authenticated)
 */
router.get(
  '/',
  optionalAuthenticate,
  asyncHandler(async (req, res: Response) => {
    if (req.user) {
      const achievements = await achievementService.getUserAchievements(req.user.uid);
      return successResponse(res, achievements, 'Achievements retrieved successfully');
    } else {
      const achievements = await achievementService.getAllAchievements();
      return successResponse(res, achievements, 'Achievements retrieved successfully');
    }
  })
);

/**
 * GET /achievements/summary
 * Get user's achievement summary
 */
router.get(
  '/summary',
  authenticate,
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const summary = await achievementService.getAchievementSummary(authReq.user.uid);
    return successResponse(res, summary, 'Achievement summary retrieved successfully');
  })
);

/**
 * GET /achievements/unlocked
 * Get user's unlocked achievements only
 */
router.get(
  '/unlocked',
  authenticate,
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const achievements = await achievementService.getUserUnlockedAchievements(authReq.user.uid);
    return successResponse(res, achievements, 'Unlocked achievements retrieved successfully');
  })
);

/**
 * GET /achievements/points
 * Get user's total achievement points
 */
router.get(
  '/points',
  authenticate,
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const points = await achievementService.getTotalPoints(authReq.user.uid);
    return successResponse(res, { points }, 'Points retrieved successfully');
  })
);

/**
 * POST /achievements/check
 * Check for new unlockable achievements based on provided stats
 */
router.post(
  '/check',
  authenticate,
  validate([
    body('stats')
      .isObject()
      .withMessage('Stats must be an object'),
  ]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const stats = req.body.stats || {};
    const newlyUnlocked = await achievementService.checkAndUnlockAchievements(
      authReq.user.uid,
      stats
    );
    return successResponse(
      res,
      newlyUnlocked,
      `${newlyUnlocked.length} achievement(s) unlocked`
    );
  })
);

export default router;
