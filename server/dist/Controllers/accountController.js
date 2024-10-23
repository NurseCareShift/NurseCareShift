"use strict";
// src/controllers/accountController.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.changePassword = exports.verifyEmailChange = exports.requestEmailChange = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
const emailUtils_1 = require("../utils/emailUtils");
const sessionUtils_1 = require("../utils/sessionUtils");
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';
// メールアドレス変更リクエスト処理
const requestEmailChange = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { newEmail, currentPassword } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // バリデーションエラーのチェック
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        if (!userId) {
            return res.status(401).json({ error: '認証が必要です。' });
        }
        // ユーザーの取得
        const user = yield User_1.default.findByPk(userId);
        if (!user || !user.password) {
            return res.status(401).json({ error: '認証に失敗しました。' });
        }
        // パスワードが正しいか検証
        const isPasswordValid = yield bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'パスワードが正しくありません。' });
        }
        // 新しいメールアドレス確認用トークン生成
        const verificationToken = jsonwebtoken_1.default.sign({ id: userId, newEmail }, SECRET_KEY, { expiresIn: '1h' });
        const verificationLink = `${process.env.CLIENT_URL}/account/verify-email?token=${verificationToken}`;
        // 確認メール送信
        yield (0, emailUtils_1.sendEmailChangeVerification)(newEmail, verificationLink);
        res.status(200).json({
            message: '確認メールを送信しました。新しいメールアドレスを確認してください。',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.requestEmailChange = requestEmailChange;
// メールアドレス変更確認処理
const verifyEmailChange = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: 'トークンが提供されていません。' });
    }
    try {
        // トークンを検証し、デコード
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        if (decoded && 'newEmail' in decoded && 'id' in decoded) {
            const { newEmail, id } = decoded;
            const user = yield User_1.default.findByPk(id);
            if (!user) {
                return res.status(400).json({ error: '無効なトークンです。' });
            }
            // メールアドレスの更新
            user.email = newEmail;
            yield user.save();
            res.status(200).json({ message: 'メールアドレスが正常に更新されました。' });
        }
        else {
            return res.status(400).json({ error: '無効なトークンです。' });
        }
    }
    catch (error) {
        return res.status(400).json({ error: '無効なトークンです。' });
    }
});
exports.verifyEmailChange = verifyEmailChange;
// パスワード変更処理
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // バリデーションエラーのチェック
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        if (!userId) {
            return res.status(401).json({ error: '認証が必要です。' });
        }
        // ユーザーの取得
        const user = yield User_1.default.findByPk(userId);
        if (!user || !user.password) {
            return res.status(401).json({ error: '認証に失敗しました。' });
        }
        // 現在のパスワードが正しいか確認
        const isPasswordValid = yield bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'パスワードが正しくありません。' });
        }
        // パスワード履歴のチェック
        const isPasswordUsed = yield user.checkPasswordHistory(newPassword);
        if (isPasswordUsed) {
            return res.status(400).json({ error: '過去に使用したパスワードは使用できません。' });
        }
        // 新しいパスワードを更新
        yield user.updatePassword(newPassword);
        // すべてのセッションを無効化
        yield (0, sessionUtils_1.invalidateAllSessions)(user.id.toString());
        // パスワード変更通知メールを送信
        yield (0, emailUtils_1.sendPasswordChangeNotification)(user.email);
        // クッキーをクリア
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(200).json({
            message: 'パスワードが変更されました。再度ログインしてください。',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.changePassword = changePassword;
// アカウント削除処理
const deleteAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { password } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // バリデーションエラーのチェック
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        if (!userId) {
            return res.status(401).json({ error: '認証が必要です。' });
        }
        // ユーザーの取得
        const user = yield User_1.default.findByPk(userId);
        if (!user || !user.password) {
            return res.status(401).json({ error: '認証に失敗しました。' });
        }
        // パスワードの検証
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'パスワードが正しくありません。' });
        }
        // ユーザー削除
        yield user.destroy();
        // すべてのセッションを無効化
        yield (0, sessionUtils_1.invalidateAllSessions)(user.id.toString());
        // クッキーをクリア
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(200).json({
            message: 'アカウントが正常に削除されました。',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteAccount = deleteAccount;
