import { emailValidator, passwordValidator, passwordRequiredValidator } from './commonValidators';
import { body } from 'express-validator';

// 新しいパスワードのバリデーション
export const newPasswordValidator = body('newPassword')
  .trim()
  .isLength({ min: 8 })
  .withMessage('パスワードは8文字以上である必要があります。')
  .matches(/[A-Z]/)
  .withMessage('新しいパスワードには少なくとも1つの大文字を含めてください。')
  .matches(/[a-z]/)
  .withMessage('新しいパスワードには少なくとも1つの小文字を含めてください。')
  .matches(/\d/)
  .withMessage('新しいパスワードには少なくとも1つの数字を含めてください。')
  .matches(/[!@#$%^&*(),.?":{}|<>]/)
  .withMessage('新しいパスワードには少なくとも1つの特殊文字を含めてください。');

// 確認コードのバリデーション
export const verificationCodeValidator = body('verificationCode')
  .trim()
  .isLength({ min: 6, max: 6 })
  .withMessage('6桁の確認コードを入力してください。')
  .isNumeric()
  .withMessage('確認コードは数字のみを含めてください。');

// トークンのバリデーション
export const tokenValidator = body('token')
  .trim()
  .notEmpty()
  .withMessage('トークンが必要です。');

// ロールのバリデーション
export const roleValidator = body('role')
  .optional()
  .isIn(['admin', 'official', 'general'])
  .withMessage('有効なロールを指定してください。');

// 必要なバリデータをエクスポート
export {
    emailValidator,
    passwordValidator,
    passwordRequiredValidator,
};