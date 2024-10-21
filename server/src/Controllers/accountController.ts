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
  invalidateRefreshToken,
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
    const userId = req.userId;

    // バリデーションエラーのチェック
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // ユーザーの取得
    const user = await User.findByPk(userId);
    if (!user) {
      // 認証エラーのメッセージを統一
      return res.status(401).json({ error: '認証に失敗しました。' });
    }

    // パスワードが正しいか検証
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password || ''
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: '認証に失敗しました。' });
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

  if (!token) {
    return res.status(400).json({ error: 'トークンが提供されていません。' });
  }

  try {
    // トークンを検証し、デコード
    const decoded = jwt.verify(token as string, SECRET_KEY) as jwt.JwtPayload;

    if (decoded && 'newEmail' in decoded && 'id' in decoded) {
      const { newEmail, id } = decoded;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(400).json({ error: '無効なトークンです。' });
      }

      // メールアドレスの更新
      user.email = newEmail;
      await user.save();

      res
        .status(200)
        .json({ message: 'メールアドレスが正常に更新されました。' });
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
    const userId = req.userId;

    // バリデーションエラーのチェック
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // ユーザーの取得
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(401).json({ error: '認証に失敗しました。' });
    }

    // 現在のパスワードが正しいか確認
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password || ''
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: '認証に失敗しました。' });
    }

    // 新しいパスワードをハッシュ化して保存
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    // すべてのセッションを無効化
    await invalidateAllSessions(user.id.toString());

    // パスワード変更通知メールを送信
    await sendPasswordChangeNotification(user.email);

    // クッキーをクリア
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });

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
    const userId = req.userId;

    // バリデーションエラーのチェック
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // ユーザーの取得
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(401).json({ error: '認証に失敗しました。' });
    }

    // パスワードの検証
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password || ''
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: '認証に失敗しました。' });
    }

    // ユーザー削除
    await user.destroy();

    // すべてのセッションを無効化
    await invalidateAllSessions(user.id.toString());

    // クッキーをクリア
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });

    res.status(200).json({
      message: 'アカウントが正常に削除されました。',
    });
  } catch (error) {
    next(error);
  }
};
