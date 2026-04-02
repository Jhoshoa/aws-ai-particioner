import { Router, Response } from 'express';
import { body, param, query } from 'express-validator';
import { mockExamService } from '../services/mockExam.service';
import { asyncHandler, authenticate, validate } from '../middleware';
import { successResponse, createdResponse } from '../utils/response.utils';
import { AuthenticatedRequest } from '../types';

const router = Router();

/**
 * POST /mock-exams/start
 * Start a new mock exam
 */
router.post(
  '/start',
  authenticate,
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const exam = await mockExamService.startExam(authReq.user.uid);
    return createdResponse(res, exam, 'Mock exam started');
  })
);

/**
 * GET /mock-exams/active
 * Get current active exam
 */
router.get(
  '/active',
  authenticate,
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const exam = await mockExamService.getActiveExam(authReq.user.uid);
    return successResponse(
      res,
      exam,
      exam ? 'Active exam found' : 'No active exam'
    );
  })
);

/**
 * GET /mock-exams/stats
 * Get exam statistics
 */
router.get(
  '/stats',
  authenticate,
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const stats = await mockExamService.getExamStats(authReq.user.uid);
    return successResponse(res, stats, 'Exam stats retrieved');
  })
);

/**
 * GET /mock-exams
 * Get exam history
 */
router.get(
  '/',
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
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const exams = await mockExamService.getExamHistory(authReq.user.uid, limit);
    return successResponse(res, exams, 'Exam history retrieved');
  })
);

/**
 * GET /mock-exams/:examId
 * Get exam with questions
 */
router.get(
  '/:examId',
  authenticate,
  validate([
    param('examId').isString().notEmpty().withMessage('Exam ID is required'),
  ]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const data = await mockExamService.getExamQuestions(
      authReq.user.uid,
      req.params.examId
    );
    return successResponse(res, data, 'Exam retrieved');
  })
);

/**
 * PUT /mock-exams/:examId/answer
 * Submit an answer
 */
router.put(
  '/:examId/answer',
  authenticate,
  validate([
    param('examId').isString().notEmpty().withMessage('Exam ID is required'),
    body('questionId').isString().notEmpty().withMessage('Question ID is required'),
    body('answer')
      .isIn(['A', 'B', 'C', 'D'])
      .withMessage('Answer must be A, B, C, or D'),
    body('timeSpent')
      .isInt({ min: 0 })
      .withMessage('Time spent must be a non-negative integer'),
  ]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    await mockExamService.updateAnswer(
      authReq.user.uid,
      req.params.examId,
      req.body.questionId,
      req.body.answer,
      req.body.timeSpent
    );
    return successResponse(res, null, 'Answer saved');
  })
);

/**
 * POST /mock-exams/:examId/flag
 * Toggle flag on question
 */
router.post(
  '/:examId/flag',
  authenticate,
  validate([
    param('examId').isString().notEmpty().withMessage('Exam ID is required'),
    body('questionId').isString().notEmpty().withMessage('Question ID is required'),
  ]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const flagged = await mockExamService.toggleFlag(
      authReq.user.uid,
      req.params.examId,
      req.body.questionId
    );
    return successResponse(res, { flagged }, 'Flag toggled');
  })
);

/**
 * POST /mock-exams/:examId/submit
 * Submit and score exam
 */
router.post(
  '/:examId/submit',
  authenticate,
  validate([
    param('examId').isString().notEmpty().withMessage('Exam ID is required'),
    body('timeSpent')
      .isInt({ min: 0 })
      .withMessage('Time spent must be a non-negative integer'),
  ]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const results = await mockExamService.submitExam(
      authReq.user.uid,
      req.params.examId,
      req.body.timeSpent
    );
    return successResponse(res, results, 'Exam submitted');
  })
);

export default router;
