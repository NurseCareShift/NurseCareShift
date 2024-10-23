import { Request, Response, NextFunction, CookieOptions } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
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

const isProduction = process.env.NODE_ENV === 'production';

// クッキーオプションの統一
const getCookieOptions = (maxAge: number): CookieOptions => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge,
});

// ユーザー登録
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'このメールアドレスは既に使用されています。' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationCode = crypto.randomBytes(3).toString('hex');
    const verificationCodeExpires = new Date(Date.now() + 3600000); // 1時間

    const newUser = await User.create({
      email,
      password: hashedPassword,
      isVerified: false,
      role: role || 'general',
      verificationCode,
      verificationCodeExpires,
      passwordHistory: [hashedPassword],
    });

    await sendVerificationEmail(email, verificationCode);
    res.status(201).json({ message: '登録成功。確認メールを送信しました。' });
  } catch (error) {
    next(error);
  }
};

// メール確認処理
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, verificationCode } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || user.verificationCode !== verificationCode || (user.verificationCodeExpires && user.verificationCodeExpires.getTime() < Date.now())) {
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
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !user.password) {
      return res.status(401).json({ error: 'メールアドレスまたはパスワードが正しくありません。' });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ error: 'メールアドレスまたはパスワードが正しくありません。' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ error: 'メールアドレスが確認されていません。' });
    }

    const accessToken = generateAccessToken(user.id.toString(), user.role);
    const refreshToken = await generateRefreshToken(user.id.toString());

    res.cookie('accessToken', accessToken, getCookieOptions(15 * 60 * 1000));
    res.cookie('refreshToken', refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));

    res.json({ message: 'ログイン成功' });
  } catch (error) {
    next(error);
  }
};

// パスワードリセット要求処理
export const requestPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      // セキュリティ上、存在しないメールアドレスでも成功メッセージを返す
      return res.status(200).json({ message: 'パスワードリセットのメールを送信しました。' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1時間

    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    await sendPasswordResetEmail(email, resetLink);

    res.status(200).json({ message: 'パスワードリセットのメールを送信しました。' });
  } catch (error) {
    next(error);
  }
};

// パスワードリセット処理
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, token, newPassword } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ where: { email, resetPasswordToken: hashedToken } });
    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires.getTime() < Date.now()) {
      return res.status(400).json({ error: '無効なリセットトークンです。' });
    }

    const isPasswordUsed = await user.checkPasswordHistory(newPassword);
    if (isPasswordUsed) {
      return res.status(400).json({ error: '過去に使用したパスワードは使用できません。' });
    }

    await user.updatePassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'パスワードがリセットされました。' });
  } catch (error) {
    next(error);
  }
};

// ログアウト処理
export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await invalidateRefreshToken(refreshToken);
    }

    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      await blacklistToken(accessToken);
    }

    res.clearCookie('accessToken', { httpOnly: true, secure: isProduction, sameSite: 'lax' });
    res.clearCookie('refreshToken', { httpOnly: true, secure: isProduction, sameSite: 'lax' });

    res.json({ message: 'ログアウトしました。' });
  } catch (error) {
    next(error);
  }
};

// リフレッシュトークンによるアクセストークンの再発行
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: '認証が必要です。' });
    }

    const userId = await verifyRefreshToken(refreshToken);
    if (!userId) {
      return res.status(401).json({ error: '無効なリフレッシュトークンです。' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(401).json({ error: '無効なリフレッシュトークンです。' });
    }

    const newAccessToken = generateAccessToken(user.id.toString(), user.role);
    res.cookie('accessToken', newAccessToken, getCookieOptions(15 * 60 * 1000));

    res.json({ message: 'アクセストークンを再発行しました。' });
  } catch (error) {
    next(error);
  }
};
