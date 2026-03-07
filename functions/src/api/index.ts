import { Router, Request, Response } from 'express';
import domainRoutes from './domain.routes';
import resourceRoutes from './resource.routes';
import studyPlanRoutes from './studyPlan.routes';
import progressRoutes from './progress.routes';
import userRoutes from './user.routes';

const router = Router();

/**
 * Health check endpoint
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
  });
});

/**
 * API routes
 */
router.use('/domains', domainRoutes);
router.use('/resources', resourceRoutes);
router.use('/study-plan', studyPlanRoutes);
router.use('/progress', progressRoutes);
router.use('/users', userRoutes);

export default router;
