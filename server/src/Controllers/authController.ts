import { Request, Response, NextFunction, CookieOptions } from 'express';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import User from '../models/User';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from '../utils/emailUtils';
import {
  generateAccessToken,
  generateRefreshToken,
  invalidateRefreshToken,
  blacklistToken,
  verifyRefreshToken,
} from '../utils/sessionUtils';
import crypto from 'crypto';

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;
const isProduction = process.env.NODE_ENV === 'production';

const getCookieOptions = (maxAge: number): CookieOptions => {
    // sameSite の値を明示的に指定
    const sameSiteValue: 'lax' | 'strict' | 'none' = 'lax';

    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: sameSiteValue,
      maxAge: maxAge,
    };
  };

if (!SECRET_KEY || !REFRESH_SECRET_KEY) {
  throw new Error('SECRET_KEY または REFRESH_SECRET_KEY が環境変数に設定されていません');
}

// ユーザー登録
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // リクエストのバリデーションチェック
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role } = req.body;

    // ユーザーが既に存在するか確認
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: 'このメールアドレスは既に使用されています。' });
    }

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 12);

    // 認証コードと期限を生成
    const verificationCode = crypto.randomBytes(3).toString('hex');
    const verificationCodeExpires = new Date(Date.now() + 3600000); // 1時間

    // 新しいユーザーを作成
    const newUser = await User.create({
      email,
      password: hashedPassword,
      isVerified: false,
      role: role || 'general',
      verificationCode,
      verificationCodeExpires,
      passwordHistory: [], // 空のパスワード履歴を初期化
    });

    // 認証メールを送信
    await sendVerificationEmail(email, verificationCode);

    res
      .status(201)
      .json({ message: '登録成功。確認メールを送信しました。' });
  } catch (error) {
    next(error);
  }
};

// メール確認処理
export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, verificationCode } = req.body;

    // ユーザーが存在するか確認
    const user = await User.findOne({ where: { email } });
    if (
      !user ||
      user.verificationCode !== verificationCode ||
      (user.verificationCodeExpires &&
        user.verificationCodeExpires.getTime() < Date.now())
    ) {
      return res.status(400).json({ error: '確認コードが無効です。' });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'メールアドレスが確認されました。' });
  } catch (error) {
    next(error);
  }
};

// ログイン処理
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // バリデーションエラーのチェック
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // ユーザーが存在するか確認
    const user = await User.findOne({ where: { email } });
    if (!user || !user.password) {
      return res
        .status(401)
        .json({ error: 'メールアドレスまたはパスワードが正しくありません。' });
    }

    // パスワードの検証
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res
        .status(401)
        .json({ error: 'メールアドレスまたはパスワードが正しくありません。' });
    }

    // メールアドレスが確認されているか確認
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ error: 'メールアドレスが確認されていません。' });
    }

    // JWT トークンを生成
    const accessToken = generateAccessToken(user.id.toString());
    const refreshToken = await generateRefreshToken(user.id.toString());

    // クッキーにトークンを設定
    res.cookie('accessToken', accessToken, getCookieOptions(15 * 60 * 1000)); // 15分
    res.cookie('refreshToken', refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000)); // 7日間
  
    res.json({ message: 'ログイン成功' });
  } catch (error) {
    next(error);
  }
};

// パスワードリセット要求処理
export const requestPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    // バリデーションエラーのチェック
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // ユーザーが存在するか確認
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(400)
        .json({ error: 'このメールアドレスは登録されていません。' });
    }

    // パスワードリセットトークンを生成
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1時間

    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    // パスワードリセットリンクをメールで送信
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(
      email
    )}`;
    await sendPasswordResetEmail(email, resetLink);

    res
      .status(200)
      .json({ message: 'パスワードリセットのメールを送信しました。' });
  } catch (error) {
    next(error);
  }
};

// パスワードリセット処理
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, token, newPassword } = req.body;

    // バリデーションエラーのチェック
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // ユーザーが存在するか確認
    const user = await User.findOne({
      where: { email, resetPasswordToken: hashedToken },
    });
    if (
      !user ||
      !user.resetPasswordExpires ||
      user.resetPasswordExpires.getTime() < Date.now()
    ) {
      return res.status(400).json({ error: '無効なリセットトークンです。' });
    }

    // 新しいパスワードを設定
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'パスワードがリセットされました。' });
  } catch (error) {
    next(error);
  }
};

// ログアウト処理
export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await invalidateRefreshToken(refreshToken);
    }

    // トークンをブラックリストに追加
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      await blacklistToken(accessToken);
    }

    // クッキーをクリア
    res.clearCookie('accessToken', getCookieOptions(0));
    res.clearCookie('refreshToken', getCookieOptions(0));
  
    res.json({ message: 'ログアウトしました。' });
  } catch (error) {
    next(error);
  }
};

// リフレッシュトークンによるアクセストークンの再発行
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ error: '認証が必要です。' });
    }

    // リフレッシュトークンが無効化されていないか確認
    const userId = await verifyRefreshToken(token);
    if (!userId) {
      return res.status(401).json({ error: '無効なリフレッシュトークンです。' });
    }

    // 新しいアクセストークンを生成
    const newAccessToken = generateAccessToken(userId);

    // 新しいアクセストークンをクッキーに設定
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 15 * 60 * 1000, // 15分
    });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};
