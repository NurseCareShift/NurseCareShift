"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const accountController_1 = require("../Controllers/accountController");
const accountValidators_1 = require("../validators/accountValidators");
const verifyToken_1 = require("../middlewares/verifyToken");
const router = (0, express_1.Router)();
/**
 * @route   PUT /api/account/change-email
 * @desc    メールアドレスの変更リクエスト
 * @access  Private
 */
router.put('/change-email', [
    accountValidators_1.newEmailValidator,
    accountValidators_1.passwordRequiredValidator // 現在のパスワードが必須
], verifyToken_1.verifyToken, // 認証済みユーザーのみアクセス可能
accountController_1.requestEmailChange);
/**
 * @route   GET /api/account/verify-email
 * @desc    新しいメールアドレス確認
 * @access  Private
 */
router.get('/verify-email', verifyToken_1.verifyToken, // 認証済みユーザーのみアクセス可能
accountController_1.verifyEmailChange);
/**
 * @route   PUT /api/account/change-password
 * @desc    パスワード変更
 * @access  Private
 */
router.put('/change-password', [
    accountValidators_1.currentPasswordValidator,
    accountValidators_1.newPasswordValidator // 新しいパスワードのバリデーション
], verifyToken_1.verifyToken, // 認証済みユーザーのみアクセス可能
accountController_1.changePassword);
/**
 * @route   DELETE /api/account/delete-account
 * @desc    アカウント削除
 * @access  Private
 */
router.delete('/delete-account', [accountValidators_1.passwordRequiredValidator], // パスワードが必須
verifyToken_1.verifyToken, // 認証済みユーザーのみアクセス可能
accountController_1.deleteAccount);
exports.default = router;
