import { emailValidator, passwordRequiredValidator, passwordValidator } from './commonValidators';
import { body } from 'express-validator';

// 新しいパスワードのバリデーション（共通バリデーションを使用）
export const newPasswordValidator = passwordValidator.withMessage('新しいパスワードには条件を満たす必要があります。');

// 現在のパスワードのバリデーション
export const currentPasswordValidator = body('currentPassword')
  .trim()
  .notEmpty()
  .withMessage('現在のパスワードを入力してください。');

// メールアドレス変更時のバリデーション
export const newEmailValidator = emailValidator.withMessage('有効な新しいメールアドレスを入力してください。');

// 確認用パスワードのバリデーション
export const confirmPasswordValidator = body('confirmPassword')
  .trim()
  .custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('確認パスワードが一致しません。');
    }
    return true;
  });

export {
  passwordRequiredValidator,
};
