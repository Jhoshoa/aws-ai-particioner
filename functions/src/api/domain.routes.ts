import { Router } from 'express';
import { body } from 'express-validator';
import { domainService } from '../services';
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
import { AuthenticatedRequest } from '../types';
import { Response } from 'express';

const router = Router();

/**
 * GET /domains
 * Get all domains (public)
 */
router.get(
  '/',
  asyncHandler(async (_req, res: Response) => {
    const domains = await domainService.getAll();
    return successResponse(res, domains, 'Domains retrieved successfully');
  })
);

/**
 * GET /domains/:id
 * Get domain by ID (public)
 */
router.get(
  '/:id',
  validate([validateId('id')]),
  asyncHandler(async (req, res: Response) => {
    const domain = await domainService.getById(req.params.id);
    return successResponse(res, domain, 'Domain retrieved successfully');
  })
);

/**
 * POST /domains
 * Create a new domain (admin only)
 */
router.post(
  '/',
  authenticate,
  requireAdmin,
  validate([
    validateInteger('id', 1, 10),
    validateRequiredString('name', 3, 100),
    validateInteger('weight', 1, 100),
    body('color')
      .trim()
      .matches(/^#[0-9A-Fa-f]{6}$/)
      .withMessage('Color must be a valid hex color (e.g., #00D4FF)'),
    validateRequiredString('weeks', 1, 20),
    validateStringArray('topics'),
  ]),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const domain = await domainService.create(req.body);
    return createdResponse(res, domain, 'Domain created successfully');
  })
);

/**
 * PUT /domains/:id
 * Update a domain (admin only)
 */
router.put(
  '/:id',
  authenticate,
  requireAdmin,
  validate([
    validateId('id'),
    body('name').optional().trim().isLength({ min: 3, max: 100 }),
    body('weight').optional().isInt({ min: 1, max: 100 }),
    body('color')
      .optional()
      .trim()
      .matches(/^#[0-9A-Fa-f]{6}$/),
    body('weeks').optional().trim().isLength({ min: 1, max: 20 }),
    body('topics').optional().isArray(),
  ]),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const domain = await domainService.update(req.params.id, req.body);
    return successResponse(res, domain, 'Domain updated successfully');
  })
);

/**
 * DELETE /domains/:id
 * Delete a domain (admin only)
 */
router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  validate([validateId('id')]),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await domainService.delete(req.params.id);
    return noContentResponse(res);
  })
);

export default router;
