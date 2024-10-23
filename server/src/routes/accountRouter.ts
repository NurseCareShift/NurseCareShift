import { Router } from 'express';
import {
  requestEmailChange,
  verifyEmailChange,
  changePassword,
  deleteAccount
} from '../controllers/accountController';
import {
  newEmailValidator,
  currentPasswordValidator,
  newPasswordValidator,
  passwordRequiredValidator
} from '../validators/accountValidators';
import { authorize } from '../middlewares/authorize';
import { verifyToken } from '../middlewares/verifyToken';

const router = Router();

/**
 * @route   PUT /api/account/change-email
 * @desc    メールアドレスの変更リクエスト
 * @access  Private
 */
router.put(
  '/change-email',
  [
    newEmailValidator,          // 新しいメールアドレスのバリデーション
    passwordRequiredValidator // 現在のパスワードが必須
  ],
  verifyToken,               // 認証済みユーザーのみアクセス可能
  requestEmailChange
);

/**
 * @route   GET /api/account/verify-email
 * @desc    新しいメールアドレス確認
 * @access  Private
 */
router.get(
  '/verify-email',
  verifyToken,               // 認証済みユーザーのみアクセス可能
  verifyEmailChange
);

/**
 * @route   PUT /api/account/change-password
 * @desc    パスワード変更
 * @access  Private
 */
router.put(
  '/change-password',
  [
    currentPasswordValidator, // 現在のパスワードが必須
    newPasswordValidator      // 新しいパスワードのバリデーション
  ],
  verifyToken,               // 認証済みユーザーのみアクセス可能
  changePassword
);

/**
 * @route   DELETE /api/account/delete-account
 * @desc    アカウント削除
 * @access  Private
 */
router.delete(
  '/delete-account',
  [passwordRequiredValidator], // パスワードが必須
  verifyToken,                 // 認証済みユーザーのみアクセス可能
  deleteAccount
);

export default router;
