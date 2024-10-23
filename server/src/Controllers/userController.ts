import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import Profile from '../models/Profile';
import { invalidateAllSessions } from '../utils/sessionUtils';

// 管理者専用の認可ミドルウェア
const adminAuthorization = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'アクセス権限がありません。' });
  }
  next();
};

// ユーザープロフィール取得（一般ユーザー）
export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id; // JWTトークンで認証されたユーザーIDを取得
    if (!userId) {
      return res.status(401).json({ error: '認証が必要です。' });
    }

    // ユーザーをデータベースから取得
    const user = await User.findByPk(userId, {
      attributes: ['id', 'email', 'name', 'profileImage'], // 必要なフィールドのみ取得
    });

    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません。' });
    }

    // ユーザープロフィールを返す
    res.json({ user });
  } catch (error) {
    console.error('ユーザープロフィール取得エラー:', error);
    next(error); // エラーハンドリング
  }
};

// ユーザープロフィール更新（一般ユーザー）
export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id; // 認証されたユーザーID
    const { name, profileImage } = req.body; // 更新したいフィールドをリクエストボディから取得

    if (!userId) {
      return res.status(401).json({ error: '認証が必要です。' });
    }

    // ユーザーの検索
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません。' });
    }

    // フィールドの更新
    user.name = name || user.name;
    user.profileImage = profileImage || user.profileImage;

    // 更新内容を保存
    await user.save();

    res.json({ message: 'プロフィールが更新されました。', user });
  } catch (error) {
    console.error('プロフィール更新エラー:', error);
    next(error); // エラーハンドリング
  }
};

// ユーザー一覧取得（管理者用）
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.findAll({
      include: [{ model: Profile, as: 'profile' }],
      attributes: { exclude: ['password', 'passwordHistory'] }, // パスワードを除外
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('ユーザー一覧取得エラー:', error);
    next(error);
  }
};

// ユーザー個別取得（管理者用）
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: [{ model: Profile, as: 'profile' }],
      attributes: { exclude: ['password', 'passwordHistory'] }, // パスワードを除外
    });

    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません。' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('ユーザー取得エラー:', error);
    next(error);
  }
};

// ユーザー削除（管理者用）
export const deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません。' });
    }

    await user.destroy();
    await invalidateAllSessions(user.id.toString());

    res.status(200).json({ message: 'ユーザーが正常に削除されました。' });
  } catch (error) {
    console.error('ユーザー削除エラー:', error);
    next(error);
  }
};

// ユーザーロール更新（管理者用）
export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません。' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ message: 'ユーザーのロールが正常に更新されました。' });
  } catch (error) {
    console.error('ロール更新エラー:', error);
    next(error);
  }
};
