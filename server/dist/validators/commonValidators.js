"use strict";
// commonValidators.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordRequiredValidator = exports.passwordValidator = exports.emailValidator = void 0;
const express_validator_1 = require("express-validator");
// メールアドレスのバリデーション
exports.emailValidator = (0, express_validator_1.body)('email')
    .trim()
    .isEmail()
    .withMessage('有効なメールアドレスを入力してください。')
    .normalizeEmail();
// パスワードのバリデーション
exports.passwordValidator = (0, express_validator_1.body)('password')
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
exports.passwordRequiredValidator = (0, express_validator_1.body)('password')
    .trim()
    .notEmpty()
    .withMessage('パスワードを入力してください。');
