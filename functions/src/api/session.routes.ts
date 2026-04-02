import { Router, Response } from 'express';
import { body, param, query } from 'express-validator';
import { sessionService } from '../services/session.service';
import { asyncHandler, authenticate, validate } from '../middleware';
import { successResponse, createdResponse } from '../utils/response.utils';
import { AuthenticatedRequest } from '../types';

const router = Router();

/**
 * GET /sessions/active
 * Get current active session
 */
router.get(
  '/active',
  authenticate,
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const session = await sessionService.getActiveSession(authReq.user.uid);
    return successResponse(
      res,
      session,
      session ? 'Active session found' : 'No active session'
    );
  })
);

/**
 * GET /sessions/stats
 * Get session statistics
 */
router.get(
  '/stats',
  authenticate,
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const stats = await sessionService.getSessionStats(authReq.user.uid);
    return successResponse(res, stats, 'Session stats retrieved');
  })
);

/**
 * GET /sessions
 * Get session history
 */
router.get(
  '/',
  authenticate,
  validate([
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
      .toInt(),
  ]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const sessions = await sessionService.getSessionHistory(authReq.user.uid, limit);
    return successResponse(res, sessions, 'Sessions retrieved');
  })
);

/**
 * POST /sessions/start
 * Start a new study session
 */
router.post(
  '/start',
  authenticate,
  validate([
    body('domainId')
      .isInt({ min: 1, max: 5 })
      .withMessage('Domain ID must be between 1 and 5'),
    body('topicIndex')
      .isInt({ min: 0 })
      .withMessage('Topic index must be a non-negative integer'),
  ]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const session = await sessionService.startSession(authReq.user.uid, req.body);
    return createdResponse(res, session, 'Session started');
  })
);

/**
 * PUT /sessions/:sessionId
 * Update session (progress)
 */
router.put(
  '/:sessionId',
  authenticate,
  validate([
    param('sessionId')
      .isString()
      .notEmpty()
      .withMessage('Session ID is required'),
    body('durationMinutes')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Duration must be a non-negative integer'),
    body('pausedMinutes')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Paused minutes must be a non-negative integer'),
    body('pomodorosCompleted')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Pomodoros must be a non-negative integer'),
    body('status')
      .optional()
      .isIn(['active', 'paused'])
      .withMessage('Status must be active or paused'),
  ]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const session = await sessionService.updateSession(
      authReq.user.uid,
      req.params.sessionId,
      req.body
    );
    return successResponse(res, session, 'Session updated');
  })
);

/**
 * POST /sessions/:sessionId/end
 * End a study session
 */
router.post(
  '/:sessionId/end',
  authenticate,
  validate([
    param('sessionId')
      .isString()
      .notEmpty()
      .withMessage('Session ID is required'),
    body('durationMinutes')
      .isInt({ min: 0 })
      .withMessage('Duration must be a non-negative integer'),
    body('pausedMinutes')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Paused minutes must be a non-negative integer'),
    body('pomodorosCompleted')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Pomodoros must be a non-negative integer'),
    body('status')
      .optional()
      .isIn(['completed', 'abandoned'])
      .withMessage('Status must be completed or abandoned'),
    body('notes')
      .optional()
      .isString()
      .withMessage('Notes must be a string'),
  ]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const session = await sessionService.endSession(
      authReq.user.uid,
      req.params.sessionId,
      req.body
    );
    return successResponse(res, session, 'Session ended');
  })
);

export default router;
