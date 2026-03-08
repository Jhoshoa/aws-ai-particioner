import { Router, Response } from 'express';
import { body, query } from 'express-validator';
import { quizService } from '../services';
import {
  asyncHandler,
  authenticate,
  validate,
  validateId,
} from '../middleware';
import { successResponse, createdResponse } from '../utils/response.utils';
import { AuthenticatedRequest } from '../types';

const router = Router();

/**
 * GET /quiz/questions
 * Get questions (optionally filtered by domain)
 * Returns questions without answers for preview
 */
router.get(
  '/questions',
  validate([
    query('domainId')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('domainId must be between 1 and 5'),
  ]),
  asyncHandler(async (req, res: Response) => {
    const domainId = req.query.domainId
      ? parseInt(req.query.domainId as string)
      : undefined;
    const questions = await quizService.getQuestions(domainId);

    // Remove answers for public access
    const sanitized = questions.map(
      ({ correctAnswer, explanation, ...rest }) => rest
    );
    return successResponse(res, sanitized, 'Questions retrieved successfully');
  })
);

/**
 * POST /quiz/start
 * Start a new quiz session
 */
router.post(
  '/start',
  authenticate,
  validate([
    body('mode')
      .isIn(['practice', 'timed', 'domain', 'weak', 'random'])
      .withMessage('mode must be one of: practice, timed, domain, weak, random'),
    body('domainId')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('domainId must be between 1 and 5'),
    body('questionCount')
      .isInt({ min: 5, max: 65 })
      .withMessage('questionCount must be between 5 and 65'),
    body('timeLimit')
      .optional()
      .isInt({ min: 30, max: 180 })
      .withMessage('timeLimit must be between 30 and 180 seconds'),
  ]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const result = await quizService.startQuiz(authReq.user.uid, req.body);
    return createdResponse(res, result, 'Quiz started successfully');
  })
);

/**
 * POST /quiz/attempts/:attemptId/submit
 * Submit an answer for a question
 */
router.post(
  '/attempts/:attemptId/submit',
  authenticate,
  validate([
    validateId('attemptId'),
    body('questionId')
      .isString()
      .notEmpty()
      .withMessage('questionId is required'),
    body('selectedAnswer')
      .isIn(['A', 'B', 'C', 'D'])
      .withMessage('selectedAnswer must be A, B, C, or D'),
    body('timeSpentSeconds')
      .isInt({ min: 0 })
      .withMessage('timeSpentSeconds must be a non-negative integer'),
  ]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const result = await quizService.submitAnswer(
      authReq.user.uid,
      req.params.attemptId,
      req.body
    );
    return successResponse(res, result, 'Answer submitted');
  })
);

/**
 * POST /quiz/attempts/:attemptId/complete
 * Complete the quiz and get final results
 */
router.post(
  '/attempts/:attemptId/complete',
  authenticate,
  validate([validateId('attemptId')]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const result = await quizService.completeQuiz(
      authReq.user.uid,
      req.params.attemptId
    );
    return successResponse(res, result, 'Quiz completed');
  })
);

/**
 * GET /quiz/attempts/:attemptId
 * Get a specific quiz attempt
 */
router.get(
  '/attempts/:attemptId',
  authenticate,
  validate([validateId('attemptId')]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const result = await quizService.getAttemptById(
      authReq.user.uid,
      req.params.attemptId
    );
    return successResponse(res, result, 'Quiz attempt retrieved');
  })
);

/**
 * GET /quiz/attempts
 * Get user's quiz history
 */
router.get(
  '/attempts',
  authenticate,
  validate([
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('limit must be between 1 and 50'),
  ]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const attempts = await quizService.getUserAttempts(authReq.user.uid, limit);
    return successResponse(res, attempts, 'Quiz history retrieved');
  })
);

/**
 * GET /quiz/stats
 * Get user's quiz statistics
 */
router.get(
  '/stats',
  authenticate,
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const stats = await quizService.getUserStats(authReq.user.uid);
    return successResponse(res, stats, 'Quiz statistics retrieved');
  })
);

export default router;
