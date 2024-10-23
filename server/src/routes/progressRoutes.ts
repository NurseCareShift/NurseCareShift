import { Router } from 'express';
import {
  updateProgress,
  getProgress,
  getSectionProgress,
} from '../controllers/progressController';
import { isAuthenticated } from '../middlewares/authMiddleware';
import { body } from 'express-validator';

const router = Router();

// 進捗の更新
router.post(
  '/update',
  isAuthenticated,
  [
    body('articleSlug').isString(),
    body('sectionId').isInt(),
    body('status').isIn(['understood', 'review']),
  ],
  updateProgress
);

// 進捗の取得
router.get('/', isAuthenticated, getProgress);

// 特定のセクションの進捗取得
router.get('/status', isAuthenticated, getSectionProgress);

export default router;
