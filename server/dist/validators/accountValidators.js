"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordRequiredValidator = exports.confirmPasswordValidator = exports.newEmailValidator = exports.currentPasswordValidator = exports.newPasswordValidator = void 0;
const commonValidators_1 = require("./commonValidators");
Object.defineProperty(exports, "passwordRequiredValidator", { enumerable: true, get: function () { return commonValidators_1.passwordRequiredValidator; } });
const express_validator_1 = require("express-validator");
// 新しいパスワードのバリデーション（共通バリデーションを使用）
exports.newPasswordValidator = commonValidators_1.passwordValidator.withMessage('新しいパスワードには条件を満たす必要があります。');
// 現在のパスワードのバリデーション
exports.currentPasswordValidator = (0, express_validator_1.body)('currentPassword')
    .trim()
    .notEmpty()
    .withMessage('現在のパスワードを入力してください。');
// メールアドレス変更時のバリデーション
exports.newEmailValidator = commonValidators_1.emailValidator.withMessage('有効な新しいメールアドレスを入力してください。');
// 確認用パスワードのバリデーション
exports.confirmPasswordValidator = (0, express_validator_1.body)('confirmPassword')
    .trim()
    .custom((value, { req }) => {
    if (value !== req.body.newPassword) {
        throw new Error('確認パスワードが一致しません。');
    }
    return true;
});
