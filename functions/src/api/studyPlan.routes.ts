import { Router, Request, Response } from 'express';
import { body, query } from 'express-validator';
import { studyPlanService } from '../services';
import {
  asyncHandler,
  authenticate,
  requireAdmin,
  validate,
  validateId,
  validateRequiredString,
  validateInteger,
  validateStringArray,
} from '../middleware';
import {
  successResponse,
  createdResponse,
  noContentResponse,
} from '../utils/response.utils';

const router = Router();

const STUDY_PHASES = [
  'Foundation',
  'GenAI Core',
  'Applications',
  'Responsible AI',
  'Security',
  'Full Review',
  'Exam Prep',
  'Final Push',
];

/**
 * GET /study-plan
 * Get all study weeks (public)
 * Optional filter by phase
 */
router.get(
  '/',
  validate([
    query('phase')
      .optional()
      .isIn(STUDY_PHASES)
      .withMessage(`Phase must be one of: ${STUDY_PHASES.join(', ')}`),
  ]),
  asyncHandler(async (req, res: Response) => {
    const { phase } = req.query;

    const weeks = phase
      ? await studyPlanService.getByPhase(phase as string)
      : await studyPlanService.getAll();

    return successResponse(res, weeks, 'Study plan retrieved successfully');
  })
);

/**
 * GET /study-plan/:id
 * Get study week by ID (public)
 */
router.get(
  '/:id',
  validate([validateId('id')]),
  asyncHandler(async (req, res: Response) => {
    const week = await studyPlanService.getById(req.params.id);
    return successResponse(res, week, 'Study week retrieved successfully');
  })
);

/**
 * GET /study-plan/week/:weekNumber
 * Get study week by week number (public)
 */
router.get(
  '/week/:weekNumber',
  validate([validateInteger('weekNumber', 1, 12)]),
  asyncHandler(async (req, res: Response) => {
    const weekNumber = parseInt(req.params.weekNumber, 10);
    const week = await studyPlanService.getByWeekNumber(weekNumber);
    return successResponse(res, week, 'Study week retrieved successfully');
  })
);

/**
 * POST /study-plan
 * Create a new study week (admin only)
 */
router.post(
  '/',
  authenticate,
  requireAdmin,
  validate([
    validateInteger('week', 1, 52),
    body('phase')
      .trim()
      .isIn(STUDY_PHASES)
      .withMessage(`Phase must be one of: ${STUDY_PHASES.join(', ')}`),
    body('domainNumber')
      .optional({ nullable: true })
      .isInt({ min: 1, max: 10 })
      .withMessage('Domain number must be between 1 and 10'),
    validateStringArray('daily'),
    validateRequiredString('milestone', 1, 200),
    validateInteger('order', 1, 100),
  ]),
  asyncHandler(async (req: Request, res: Response) => {
    const week = await studyPlanService.create(req.body);
    return createdResponse(res, week, 'Study week created successfully');
  })
);

/**
 * PUT /study-plan/:id
 * Update a study week (admin only)
 */
router.put(
  '/:id',
  authenticate,
  requireAdmin,
  validate([
    validateId('id'),
    body('week').optional().isInt({ min: 1, max: 52 }),
    body('phase').optional().trim().isIn(STUDY_PHASES),
    body('domainNumber').optional({ nullable: true }).isInt({ min: 1, max: 10 }),
    body('daily').optional().isArray(),
    body('milestone').optional().trim().isLength({ min: 1, max: 200 }),
    body('order').optional().isInt({ min: 1, max: 100 }),
  ]),
  asyncHandler(async (req: Request, res: Response) => {
    const week = await studyPlanService.update(req.params.id, req.body);
    return successResponse(res, week, 'Study week updated successfully');
  })
);

/**
 * DELETE /study-plan/:id
 * Delete a study week (admin only)
 */
router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  validate([validateId('id')]),
  asyncHandler(async (req: Request, res: Response) => {
    await studyPlanService.delete(req.params.id);
    return noContentResponse(res);
  })
);

export default router;
