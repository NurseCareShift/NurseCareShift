"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/authRoutes.ts
const express_1 = require("express");
const authController_1 = require("../Controllers/authController");
const authValidators_1 = require("../validators/authValidators");
const verifyToken_1 = require("../middlewares/verifyToken");
const router = (0, express_1.Router)();
// ユーザー登録
router.post('/register', [authValidators_1.emailValidator, authValidators_1.passwordValidator, authValidators_1.roleValidator], authController_1.registerUser);
// ユーザーログイン
router.post('/login', [authValidators_1.emailValidator, authValidators_1.passwordRequiredValidator], authController_1.loginUser);
// メール確認
router.post('/verify-email', [authValidators_1.emailValidator, authValidators_1.verificationCodeValidator], authController_1.verifyEmail);
// パスワードリセット要求
router.post('/request-password-reset', [authValidators_1.emailValidator], authController_1.requestPasswordReset);
// パスワードリセット
router.post('/reset-password', [authValidators_1.emailValidator, authValidators_1.tokenValidator, authValidators_1.newPasswordValidator], authController_1.resetPassword);
// ログアウト
router.post('/logout', verifyToken_1.verifyToken, authController_1.logoutUser);
// トークンリフレッシュ
router.post('/refresh-token', authController_1.refreshToken);
exports.default = router;
