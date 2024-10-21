"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserValidator = exports.multiRoleValidator = exports.userIdValidator = exports.roleValidator = void 0;
const express_validator_1 = require("express-validator");
// ロールのバリデーション（admin、official、general のみ許可）
exports.roleValidator = (0, express_validator_1.body)('role')
    .trim()
    .isIn(['admin', 'official', 'general'])
    .withMessage('有効なロールを指定してください。');
// ユーザーIDのバリデーション（パラメータから取得）
exports.userIdValidator = (0, express_validator_1.param)('id')
    .isNumeric()
    .withMessage('有効なユーザーIDを指定してください。');
// ロールのバリデーション（複数ロールの管理が必要な場合の拡張例）
exports.multiRoleValidator = (0, express_validator_1.body)('roles')
    .isArray({ min: 1 })
    .withMessage('1つ以上のロールを指定してください。')
    .custom((roles) => {
    const validRoles = ['admin', 'official', 'general'];
    const invalidRoles = roles.filter(role => !validRoles.includes(role));
    if (invalidRoles.length > 0) {
        throw new Error(`無効なロールが含まれています: ${invalidRoles.join(', ')}`);
    }
    return true;
});
// ユーザーのアカウント削除バリデーション
exports.deleteUserValidator = (0, express_validator_1.param)('id')
    .isNumeric()
    .withMessage('削除するユーザーのIDが無効です。');
