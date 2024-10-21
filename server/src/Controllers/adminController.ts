import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import Profile from '../models/Profile';
import { invalidateAllSessions } from '../utils/sessionUtils';

// ユーザー一覧取得（管理者用）
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 全ユーザーを取得し、関連するプロフィールも含める
    const users = await User.findAll({
      include: [{ model: Profile, as: 'profile' }],
      attributes: { exclude: ['password'] } // パスワードを除外して取得
    });

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// ユーザー個別取得（管理者用）
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // 特定のユーザーを取得し、関連するプロフィールも含める
    const user = await User.findByPk(id, {
      include: [{ model: Profile, as: 'profile' }],
      attributes: { exclude: ['password'] } // パスワードを除外して取得
    });

    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません。' });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// ユーザー削除（管理者用）
export const deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // ユーザーの存在確認
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません。' });
    }

    // ユーザー削除
    await user.destroy();

    // セッションの無効化
    await invalidateAllSessions(user.id.toString());


    res.status(200).json({ message: 'ユーザーが正常に削除されました。' });
  } catch (error) {
    next(error);
  }
};

// ユーザーロール更新（管理者用）
export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // リクエストのバリデーションチェック
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // ユーザーの存在確認
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません。' });
    }

    // ロールの更新
    user.role = role;
    await user.save();

    res.status(200).json({ message: 'ユーザーのロールが更新されました。' });
  } catch (error) {
    next(error);
  }
};
