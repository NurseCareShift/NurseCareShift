import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';

// ユーザープロフィール取得
export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId; // verifyTokenミドルウェアで設定される

    // ユーザーを取得し、必要なフィールドのみを選択
    const user = await User.findByPk(userId, {
      attributes: ['id', 'email', 'name', 'profileImage'],
    });

    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません。' });
    }

    res.json({ user });
  } catch (error) {
    console.error('ユーザー取得エラー:', error);
    next(error); // エラーハンドリングミドルウェアに委ねる
  }
};

// ユーザープロフィール更新
export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // バリデーションエラーのチェック
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId;
    const { name, profileImage } = req.body;

    // ユーザーの取得
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません。' });
    }

    // フィールドの更新
    user.name = name || user.name;
    user.profileImage = profileImage || user.profileImage;

    await user.save();

    res.json({ message: 'プロフィールが更新されました。', user });
  } catch (error) {
    console.error('プロフィール更新エラー:', error);
    next(error);
  }
};
