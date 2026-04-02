import { Router, Response } from 'express';
import { body } from 'express-validator';
import { settingsService } from '../services/settings.service';
import { asyncHandler, authenticate, validate } from '../middleware';
import { successResponse } from '../utils/response.utils';
import { AuthenticatedRequest } from '../types';

const router = Router();

/**
 * GET /settings
 * Get user notification settings
 */
router.get(
  '/',
  authenticate,
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const settings = await settingsService.getSettings(authReq.user.uid);
    return successResponse(res, settings, 'Settings retrieved');
  })
);

/**
 * PUT /settings
 * Update notification settings
 */
router.put(
  '/',
  authenticate,
  validate([
    body('push').optional().isObject(),
    body('push.enabled').optional().isBoolean(),
    body('email').optional().isObject(),
    body('email.enabled').optional().isBoolean(),
    body('email.email').optional().isEmail().withMessage('Invalid email'),
    body('whatsapp').optional().isObject(),
    body('whatsapp.enabled').optional().isBoolean(),
    body('whatsapp.phoneNumber').optional().isString(),
    body('studyReminders').optional().isBoolean(),
    body('reminderTime')
      .optional()
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage('Time must be in HH:MM format'),
    body('reminderDays').optional().isArray(),
    body('reminderDays.*')
      .optional()
      .isInt({ min: 0, max: 6 })
      .withMessage('Days must be 0-6'),
    body('streakAlerts').optional().isBoolean(),
    body('streakAlertTime')
      .optional()
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage('Time must be in HH:MM format'),
    body('quizDelivery').optional().isBoolean(),
    body('quizFrequency')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Frequency must be low, medium, or high'),
    body('weeklyDigest').optional().isBoolean(),
    body('weeklyDigestDay')
      .optional()
      .isInt({ min: 0, max: 6 })
      .withMessage('Day must be 0-6'),
    body('weeklyDigestTime')
      .optional()
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage('Time must be in HH:MM format'),
    body('quietHoursEnabled').optional().isBoolean(),
    body('quietHoursStart')
      .optional()
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage('Time must be in HH:MM format'),
    body('quietHoursEnd')
      .optional()
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage('Time must be in HH:MM format'),
    body('timezone').optional().isString(),
  ]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const settings = await settingsService.updateSettings(authReq.user.uid, req.body);
    return successResponse(res, settings, 'Settings updated');
  })
);

/**
 * POST /settings/reset
 * Reset settings to defaults
 */
router.post(
  '/reset',
  authenticate,
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const settings = await settingsService.resetSettings(authReq.user.uid);
    return successResponse(res, settings, 'Settings reset to defaults');
  })
);

/**
 * POST /settings/push/register
 * Register push notification subscription
 */
router.post(
  '/push/register',
  authenticate,
  validate([
    body('endpoint').isURL().withMessage('Invalid endpoint URL'),
    body('keys').isObject().withMessage('Keys object is required'),
    body('keys.p256dh').isString().notEmpty().withMessage('p256dh key is required'),
    body('keys.auth').isString().notEmpty().withMessage('auth key is required'),
  ]),
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const settings = await settingsService.registerPushSubscription(
      authReq.user.uid,
      req.body
    );
    return successResponse(res, settings, 'Push notifications enabled');
  })
);

/**
 * POST /settings/push/unregister
 * Unregister push notification subscription
 */
router.post(
  '/push/unregister',
  authenticate,
  asyncHandler(async (req, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const settings = await settingsService.unregisterPushSubscription(authReq.user.uid);
    return successResponse(res, settings, 'Push notifications disabled');
  })
);

export default router;
