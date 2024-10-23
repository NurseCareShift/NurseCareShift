import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User';
import {
  sendEmailChangeVerification,
  sendPasswordChangeNotification,
} from '../utils/emailUtils';
import {
  invalidateAllSessions,
} from '../utils/sessionUtils';

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

// メールアドレス変更リクエスト処理
export const requestEmailChange = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { newEmail, currentPassword } = req.body;
    const userId = req.user?.id;

    // バリデーションエラーのチェック
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!userId) {
      return res.status(401).json({ error: '認証が必要です。' });
    }

    // ユーザーの取得
    const user = await User.findByPk(userId);
    if (!user || !user.password) {
      return res.status(401).json({ error: '認証に失敗しました。' });
    }

    // パスワードが正しいか検証
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'パスワードが正しくありません。' });
    }

    // 新しいメールアドレス確認用トークン生成
    const verificationToken = jwt.sign(
      { id: userId, newEmail },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
    const verificationLink = `${process.env.CLIENT_URL}/account/verify-email?token=${verificationToken}`;

    // 確認メール送信
    await sendEmailChangeVerification(newEmail, verificationLink);

    res.status(200).json({
      message: '確認メールを送信しました。新しいメールアドレスを確認してください。',
    });
  } catch (error) {
    next(error);
  }
};

// メールアドレス変更確認処理
export const verifyEmailChange = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'トークンが提供されていません。' });
  }

  try {
    // トークンを検証し、デコード
    const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;

    if (decoded && 'newEmail' in decoded && 'id' in decoded) {
      const { newEmail, id } = decoded;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(400).json({ error: '無効なトークンです。' });
      }

      // メールアドレスの更新
      user.email = newEmail;
      await user.save();

      res.status(200).json({ message: 'メールアドレスが正常に更新されました。' });
    } else {
      return res.status(400).json({ error: '無効なトークンです。' });
    }
  } catch (error) {
    return res.status(400).json({ error: '無効なトークンです。' });
  }
};

// パスワード変更処理
export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id;

    // バリデーションエラーのチェック
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!userId) {
      return res.status(401).json({ error: '認証が必要です。' });
    }

    // ユーザーの取得
    const user = await User.findByPk(userId);
    if (!user || !user.password) {
      return res.status(401).json({ error: '認証に失敗しました。' });
    }

    // 現在のパスワードが正しいか確認
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'パスワードが正しくありません。' });
    }

    // パスワード履歴のチェック
    const isPasswordUsed = await user.checkPasswordHistory(newPassword);
    if (isPasswordUsed) {
      return res.status(400).json({ error: '過去に使用したパスワードは使用できません。' });
    }

    // 新しいパスワードを更新
    await user.updatePassword(newPassword);

    // すべてのセッションを無効化
    await invalidateAllSessions(user.id.toString());

    // パスワード変更通知メールを送信
    await sendPasswordChangeNotification(user.email);

    // クッキーをクリア
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).json({
      message: 'パスワードが変更されました。再度ログインしてください。',
    });
  } catch (error) {
    next(error);
  }
};

// アカウント削除処理
export const deleteAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password } = req.body;
    const userId = req.user?.id;

    // バリデーションエラーのチェック
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!userId) {
      return res.status(401).json({ error: '認証が必要です。' });
    }

    // ユーザーの取得
    const user = await User.findByPk(userId);
    if (!user || !user.password) {
      return res.status(401).json({ error: '認証に失敗しました。' });
    }

    // パスワードの検証
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'パスワードが正しくありません。' });
    }

    // ユーザー削除
    await user.destroy();

    // すべてのセッションを無効化
    await invalidateAllSessions(user.id.toString());

    // クッキーをクリア
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).json({
      message: 'アカウントが正常に削除されました。',
    });
  } catch (error) {
    next(error);
  }
};
