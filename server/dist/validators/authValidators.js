"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordRequiredValidator = exports.passwordValidator = exports.emailValidator = exports.roleValidator = exports.tokenValidator = exports.verificationCodeValidator = exports.newPasswordValidator = void 0;
const commonValidators_1 = require("./commonValidators");
Object.defineProperty(exports, "emailValidator", { enumerable: true, get: function () { return commonValidators_1.emailValidator; } });
Object.defineProperty(exports, "passwordValidator", { enumerable: true, get: function () { return commonValidators_1.passwordValidator; } });
Object.defineProperty(exports, "passwordRequiredValidator", { enumerable: true, get: function () { return commonValidators_1.passwordRequiredValidator; } });
const express_validator_1 = require("express-validator");
// 新しいパスワードのバリデーション
exports.newPasswordValidator = (0, express_validator_1.body)('newPassword')
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
exports.verificationCodeValidator = (0, express_validator_1.body)('verificationCode')
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage('6桁の確認コードを入力してください。')
    .isNumeric()
    .withMessage('確認コードは数字のみを含めてください。');
// トークンのバリデーション
exports.tokenValidator = (0, express_validator_1.body)('token')
    .trim()
    .notEmpty()
    .withMessage('トークンが必要です。');
// ロールのバリデーション
exports.roleValidator = (0, express_validator_1.body)('role')
    .optional()
    .isIn(['admin', 'official', 'general'])
    .withMessage('有効なロールを指定してください。');
