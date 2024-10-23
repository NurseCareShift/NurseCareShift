import { Router } from 'express';
import {
  registerUser,
  loginUser,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  logoutUser,
  refreshToken,
} from '../controllers/authController';
import {
  emailValidator,
  passwordValidator,
  roleValidator,
  verificationCodeValidator,
  tokenValidator,
  newPasswordValidator,
  passwordRequiredValidator,
} from '../validators/authValidators';
import { isAuthenticated } from '../middlewares/authMiddleware';

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
router.post('/logout', isAuthenticated, logoutUser);

// トークンリフレッシュ
router.post('/refresh-token', refreshToken);

export default router;
