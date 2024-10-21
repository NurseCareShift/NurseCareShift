// commonValidators.ts

import { body } from 'express-validator';

// メールアドレスのバリデーション
export const emailValidator = body('email')
  .trim()
  .isEmail()
  .withMessage('有効なメールアドレスを入力してください。')
  .normalizeEmail();

// パスワードのバリデーション
export const passwordValidator = body('password')
  .trim()
  .isLength({ min: 8 })
  .withMessage('パスワードは8文字以上である必要があります。')
  .matches(/[A-Z]/)
  .withMessage('パスワードには少なくとも1つの大文字を含めてください。')
  .matches(/[a-z]/)
  .withMessage('パスワードには少なくとも1つの小文字を含めてください。')
  .matches(/\d/)
  .withMessage('パスワードには少なくとも1つの数字を含めてください。')
  .matches(/[!@#$%^&*(),.?":{}|<>]/)
  .withMessage('パスワードには少なくとも1つの特殊文字を含めてください。');

// パスワード必須チェック
export const passwordRequiredValidator = body('password')
  .trim()
  .notEmpty()
  .withMessage('パスワードを入力してください。');
