import { Router, Request, Response } from 'express';
import domainRoutes from './domain.routes';
import resourceRoutes from './resource.routes';
import studyPlanRoutes from './studyPlan.routes';
import progressRoutes from './progress.routes';
import userRoutes from './user.routes';
import quizRoutes from './quiz.routes';
import notesRoutes from './notes.routes';
import achievementRoutes from './achievement.routes';
import streakRoutes from './streak.routes';
import sessionRoutes from './session.routes';
import mockExamRoutes from './mockExam.routes';
import reviewRoutes from './review.routes';
import settingsRoutes from './settings.routes';

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
router.use('/quiz', quizRoutes);
router.use('/notes', notesRoutes);
router.use('/achievements', achievementRoutes);
router.use('/streak', streakRoutes);
router.use('/sessions', sessionRoutes);
router.use('/mock-exams', mockExamRoutes);
router.use('/review', reviewRoutes);
router.use('/settings', settingsRoutes);

export default router;
