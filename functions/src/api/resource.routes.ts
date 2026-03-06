import { Router, Response } from 'express';
import { body, query } from 'express-validator';
import { resourceService } from '../services';
import {
  asyncHandler,
  authenticate,
  requireAdmin,
  validate,
  validateId,
  validateRequiredString,
  validateUrl,
} from '../middleware';
import {
  successResponse,
  createdResponse,
  noContentResponse,
} from '../utils/response.utils';
import { AuthenticatedRequest } from '../types';

const router = Router();

const RESOURCE_TYPES = ['FREE', 'PAID', 'PRACTICE', 'OFFICIAL'];

/**
 * GET /resources
 * Get all resources (public)
 * Optional filter by type
 */
router.get(
  '/',
  validate([
    query('type')
      .optional()
      .isIn(RESOURCE_TYPES)
      .withMessage(`Type must be one of: ${RESOURCE_TYPES.join(', ')}`),
  ]),
  asyncHandler(async (req, res: Response) => {
    const { type } = req.query;

    const resources = type
      ? await resourceService.getByType(type as string)
      : await resourceService.getAll();

    return successResponse(res, resources, 'Resources retrieved successfully');
  })
);

/**
 * GET /resources/:id
 * Get resource by ID (public)
 */
router.get(
  '/:id',
  validate([validateId('id')]),
  asyncHandler(async (req, res: Response) => {
    const resource = await resourceService.getById(req.params.id);
    return successResponse(res, resource, 'Resource retrieved successfully');
  })
);

/**
 * POST /resources
 * Create a new resource (admin only)
 */
router.post(
  '/',
  authenticate,
  requireAdmin,
  validate([
    body('type')
      .trim()
      .isIn(RESOURCE_TYPES)
      .withMessage(`Type must be one of: ${RESOURCE_TYPES.join(', ')}`),
    validateRequiredString('name', 3, 200),
    validateUrl('url'),
    validateRequiredString('note', 1, 500),
  ]),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const resource = await resourceService.create(req.body);
    return createdResponse(res, resource, 'Resource created successfully');
  })
);

/**
 * PUT /resources/:id
 * Update a resource (admin only)
 */
router.put(
  '/:id',
  authenticate,
  requireAdmin,
  validate([
    validateId('id'),
    body('type')
      .optional()
      .trim()
      .isIn(RESOURCE_TYPES)
      .withMessage(`Type must be one of: ${RESOURCE_TYPES.join(', ')}`),
    body('name').optional().trim().isLength({ min: 3, max: 200 }),
    body('url').optional().trim().isURL(),
    body('note').optional().trim().isLength({ min: 1, max: 500 }),
  ]),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const resource = await resourceService.update(req.params.id, req.body);
    return successResponse(res, resource, 'Resource updated successfully');
  })
);

/**
 * DELETE /resources/:id
 * Delete a resource (admin only)
 */
router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  validate([validateId('id')]),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await resourceService.delete(req.params.id);
    return noContentResponse(res);
  })
);

export default router;
