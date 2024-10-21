// routes/authRoutes.ts
import { Router } from 'express';
import {
  registerUser,
  loginUser,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  logoutUser,
  refreshToken, // リフレッシュトークンのエンドポイントを追加
} from '../Controllers/authController';
import {
  emailValidator,
  passwordValidator,
  roleValidator,
  verificationCodeValidator,
  tokenValidator,
  newPasswordValidator,
  passwordRequiredValidator,
} from '../validators/authValidators';
import { verifyToken } from '../middlewares/verifyToken';

const router = Router();

// ユーザー登録
router.post('/register', [emailValidator, passwordValidator, roleValidator], registerUser);

// ユーザーログイン
router.post('/login', [emailValidator, passwordRequiredValidator], loginUser);

// メール確認
router.post('/verify-email', [emailValidator, verificationCodeValidator], verifyEmail);

// パスワードリセット要求
router.post('/request-password-reset', [emailValidator], requestPasswordReset);

// パスワードリセット
router.post('/reset-password', [emailValidator, tokenValidator, newPasswordValidator], resetPassword);

// ログアウト
router.post('/logout', verifyToken, logoutUser);

// トークンリフレッシュ
router.post('/refresh-token', refreshToken);

export default router;
