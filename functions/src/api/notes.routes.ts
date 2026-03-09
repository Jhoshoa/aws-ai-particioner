import { Router, Response } from 'express';
import { body, param, query } from 'express-validator';
import { notesService } from '../services';
import { asyncHandler, authenticate, validate, validateId } from '../middleware';
import { successResponse, createdResponse, noContentResponse } from '../utils/response.utils';
import { AuthenticatedRequest } from '../types';

const router = Router();

/**
 * GET /notes
 * Get all user notes (optionally filtered by domain)
 */
router.get(
  '/',
  authenticate,
  validate([
    query('domainId')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('domainId must be between 1 and 5'),
  ]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const domainId = req.query.domainId
      ? parseInt(req.query.domainId as string)
      : undefined;
    const notes = await notesService.getUserNotes(authReq.user.uid, domainId);
    return successResponse(res, notes, 'Notes retrieved successfully');
  })
);

/**
 * GET /notes/summary
 * Get notes summary
 */
router.get(
  '/summary',
  authenticate,
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const summary = await notesService.getNotesSummary(authReq.user.uid);
    return successResponse(res, summary, 'Notes summary retrieved successfully');
  })
);

/**
 * GET /notes/search
 * Search notes
 */
router.get(
  '/search',
  authenticate,
  validate([
    query('q')
      .isString()
      .trim()
      .isLength({ min: 2 })
      .withMessage('Search query must be at least 2 characters'),
  ]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const notes = await notesService.searchNotes(
      authReq.user.uid,
      req.query.q as string
    );
    return successResponse(res, notes, 'Search completed');
  })
);

/**
 * GET /notes/topic/:domainId/:topicIndex
 * Get notes for a specific topic
 */
router.get(
  '/topic/:domainId/:topicIndex',
  authenticate,
  validate([
    param('domainId')
      .isInt({ min: 1, max: 5 })
      .withMessage('domainId must be between 1 and 5'),
    param('topicIndex')
      .isInt({ min: 0 })
      .withMessage('topicIndex must be a non-negative integer'),
  ]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const domainId = parseInt(req.params.domainId);
    const topicIndex = parseInt(req.params.topicIndex);
    const notes = await notesService.getTopicNotes(
      authReq.user.uid,
      domainId,
      topicIndex
    );
    return successResponse(res, notes, 'Topic notes retrieved successfully');
  })
);

/**
 * GET /notes/:noteId
 * Get note by ID
 */
router.get(
  '/:noteId',
  authenticate,
  validate([validateId('noteId')]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const note = await notesService.getNoteById(
      authReq.user.uid,
      req.params.noteId
    );
    return successResponse(res, note, 'Note retrieved successfully');
  })
);

/**
 * POST /notes
 * Create a new note
 */
router.post(
  '/',
  authenticate,
  validate([
    body('domainId')
      .isInt({ min: 1, max: 5 })
      .withMessage('domainId must be between 1 and 5'),
    body('topicIndex')
      .isInt({ min: 0 })
      .withMessage('topicIndex must be a non-negative integer'),
    body('title')
      .isString()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('title must be between 1 and 200 characters'),
    body('content')
      .isString()
      .isLength({ min: 1, max: 50000 })
      .withMessage('content must be between 1 and 50000 characters'),
    body('tags')
      .optional()
      .isArray({ max: 10 })
      .withMessage('tags must be an array with max 10 items'),
    body('tags.*')
      .optional()
      .isString()
      .trim()
      .isLength({ min: 1, max: 30 })
      .withMessage('each tag must be between 1 and 30 characters'),
  ]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const note = await notesService.createNote(authReq.user.uid, req.body);
    return createdResponse(res, note, 'Note created successfully');
  })
);

/**
 * PUT /notes/:noteId
 * Update a note
 */
router.put(
  '/:noteId',
  authenticate,
  validate([
    validateId('noteId'),
    body('title')
      .optional()
      .isString()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('title must be between 1 and 200 characters'),
    body('content')
      .optional()
      .isString()
      .isLength({ min: 1, max: 50000 })
      .withMessage('content must be between 1 and 50000 characters'),
    body('tags')
      .optional()
      .isArray({ max: 10 })
      .withMessage('tags must be an array with max 10 items'),
  ]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const note = await notesService.updateNote(
      authReq.user.uid,
      req.params.noteId,
      req.body
    );
    return successResponse(res, note, 'Note updated successfully');
  })
);

/**
 * DELETE /notes/:noteId
 * Delete a note
 */
router.delete(
  '/:noteId',
  authenticate,
  validate([validateId('noteId')]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    await notesService.deleteNote(authReq.user.uid, req.params.noteId);
    return noContentResponse(res);
  })
);

export default router;
