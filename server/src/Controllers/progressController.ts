import { Request, Response, NextFunction } from 'express';
import Progress from '../models/Progress';
import { validationResult } from 'express-validator';

// 進捗の更新
export const updateProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'ユーザーが認証されていません。' });
    }

    const { articleSlug, sectionId, status } = req.body;

    const existingProgress = await Progress.findOne({
      where: { userId, articleSlug, sectionId },
    });

    if (existingProgress) {
      existingProgress.status = status;
      await existingProgress.save();
    } else {
      await Progress.create({ userId, articleSlug, sectionId, status });
    }

    res.status(200).json({ message: '進捗が更新されました。' });
  } catch (error) {
    next(error);
  }
};

// 進捗の取得
export const getProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'ユーザーが認証されていません。' });
    }

    const progresses = await Progress.findAll({
      where: { userId },
    });

    res.status(200).json({ progresses });
  } catch (error) {
    next(error);
  }
};

// 特定のセクションの進捗取得
export const getSectionProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'ユーザーが認証されていません。' });
    }

    const articleSlug = Array.isArray(req.query.articleSlug) ? req.query.articleSlug[0] : req.query.articleSlug;
    const sectionId = Array.isArray(req.query.sectionId) ? req.query.sectionId[0] : req.query.sectionId;

    if (typeof articleSlug !== 'string' || typeof sectionId !== 'string') {
      return res.status(400).json({ error: 'articleSlug または sectionId が無効です。' });
    }

    const progress = await Progress.findOne({
      where: { userId, articleSlug, sectionId },
    });

    if (!progress) {
      return res.status(404).json({ error: '進捗が見つかりません。' });
    }

    res.status(200).json({ progress });
  } catch (error) {
    next(error);
  }
};
