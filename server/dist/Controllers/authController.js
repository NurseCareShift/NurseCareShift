"use strict";
// src/controllers/authController.ts
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
exports.refreshTokenHandler = exports.logoutUser = exports.resetPassword = exports.requestPasswordReset = exports.loginUser = exports.verifyEmail = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
const emailUtils_1 = require("../utils/emailUtils");
const sessionUtils_1 = require("../utils/sessionUtils");
const crypto_1 = __importDefault(require("crypto"));
const isProduction = process.env.NODE_ENV === 'production';
// クッキーオプションの統一
const getCookieOptions = (maxAge) => ({
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge,
});
// ユーザー登録
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // リクエストのバリデーションチェック
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password, role } = req.body;
        // ユーザーが既に存在するか確認
        const existingUser = yield User_1.default.findOne({ where: { email } });
        if (existingUser) {
            return res
                .status(400)
                .json({ error: 'このメールアドレスは既に使用されています。' });
        }
        // パスワードをハッシュ化
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        // 認証コードと期限を生成
        const verificationCode = crypto_1.default.randomBytes(3).toString('hex');
        const verificationCodeExpires = new Date(Date.now() + 3600000); // 1時間
        // 新しいユーザーを作成
        const newUser = yield User_1.default.create({
            email,
            password: hashedPassword,
            isVerified: false,
            role: role || 'general',
            verificationCode,
            verificationCodeExpires,
            passwordHistory: [hashedPassword], // パスワード履歴を初期化
        });
        // 認証メールを送信
        yield (0, emailUtils_1.sendVerificationEmail)(email, verificationCode);
        res
            .status(201)
            .json({ message: '登録成功。確認メールを送信しました。' });
    }
    catch (error) {
        next(error);
    }
});
exports.registerUser = registerUser;
// メール確認処理
const verifyEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, verificationCode } = req.body;
        // ユーザーが存在するか確認
        const user = yield User_1.default.findOne({ where: { email } });
        if (!user ||
            user.verificationCode !== verificationCode ||
            (user.verificationCodeExpires &&
                user.verificationCodeExpires.getTime() < Date.now())) {
            return res.status(400).json({ error: '確認コードが無効です。' });
        }
        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        yield user.save();
        res.status(200).json({ message: 'メールアドレスが確認されました。' });
    }
    catch (error) {
        next(error);
    }
});
exports.verifyEmail = verifyEmail;
// ログイン処理
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // バリデーションエラーのチェック
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // ユーザーが存在するか確認
        const user = yield User_1.default.findOne({ where: { email } });
        if (!user || !user.password) {
            return res
                .status(401)
                .json({ error: 'メールアドレスまたはパスワードが正しくありません。' });
        }
        // パスワードの検証
        const passwordIsValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!passwordIsValid) {
            return res
                .status(401)
                .json({ error: 'メールアドレスまたはパスワードが正しくありません。' });
        }
        // メールアドレスが確認されているか確認
        if (!user.isVerified) {
            return res
                .status(403)
                .json({ error: 'メールアドレスが確認されていません。' });
        }
        // JWT トークンを生成（role を含める）
        const accessToken = (0, sessionUtils_1.generateAccessToken)(user.id.toString(), user.role);
        const refreshToken = yield (0, sessionUtils_1.generateRefreshToken)(user.id.toString());
        // クッキーにトークンを設定
        res.cookie('accessToken', accessToken, getCookieOptions(15 * 60 * 1000)); // 15分
        res.cookie('refreshToken', refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000)); // 7日間
        res.json({ message: 'ログイン成功' });
    }
    catch (error) {
        next(error);
    }
});
exports.loginUser = loginUser;
// パスワードリセット要求処理
const requestPasswordReset = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        // バリデーションエラーのチェック
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // ユーザーが存在するか確認
        const user = yield User_1.default.findOne({ where: { email } });
        if (!user) {
            // セキュリティ上、存在しないメールアドレスでも成功メッセージを返す
            return res
                .status(200)
                .json({ message: 'パスワードリセットのメールを送信しました。' });
        }
        // パスワードリセットトークンを生成
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const hashedResetToken = crypto_1.default
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        const resetTokenExpires = new Date(Date.now() + 3600000); // 1時間
        user.resetPasswordToken = hashedResetToken;
        user.resetPasswordExpires = resetTokenExpires;
        yield user.save();
        // パスワードリセットリンクをメールで送信
        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
        yield (0, emailUtils_1.sendPasswordResetEmail)(email, resetLink);
        res
            .status(200)
            .json({ message: 'パスワードリセットのメールを送信しました。' });
    }
    catch (error) {
        next(error);
    }
});
exports.requestPasswordReset = requestPasswordReset;
// パスワードリセット処理
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, token, newPassword } = req.body;
        // バリデーションエラーのチェック
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const hashedToken = crypto_1.default
            .createHash('sha256')
            .update(token)
            .digest('hex');
        // ユーザーが存在するか確認
        const user = yield User_1.default.findOne({
            where: { email, resetPasswordToken: hashedToken },
        });
        if (!user ||
            !user.resetPasswordExpires ||
            user.resetPasswordExpires.getTime() < Date.now()) {
            return res.status(400).json({ error: '無効なリセットトークンです。' });
        }
        // パスワード履歴のチェック
        const isPasswordUsed = yield user.checkPasswordHistory(newPassword);
        if (isPasswordUsed) {
            return res.status(400).json({ error: '過去に使用したパスワードは使用できません。' });
        }
        // 新しいパスワードを設定
        yield user.updatePassword(newPassword);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        yield user.save();
        res.status(200).json({ message: 'パスワードがリセットされました。' });
    }
    catch (error) {
        next(error);
    }
});
exports.resetPassword = resetPassword;
// ログアウト処理
const logoutUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            yield (0, sessionUtils_1.invalidateRefreshToken)(refreshToken);
        }
        // トークンをブラックリストに追加
        const accessToken = req.cookies.accessToken;
        if (accessToken) {
            yield (0, sessionUtils_1.blacklistToken)(accessToken);
        }
        // クッキーをクリア
        res.clearCookie('accessToken', { httpOnly: true, secure: isProduction, sameSite: 'lax' });
        res.clearCookie('refreshToken', { httpOnly: true, secure: isProduction, sameSite: 'lax' });
        res.json({ message: 'ログアウトしました。' });
    }
    catch (error) {
        next(error);
    }
});
exports.logoutUser = logoutUser;
// リフレッシュトークンによるアクセストークンの再発行
const refreshTokenHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({ error: '認証が必要です。' });
        }
        // リフレッシュトークンが無効化されていないか確認
        const userId = yield (0, sessionUtils_1.verifyRefreshToken)(token);
        if (!userId) {
            return res.status(401).json({ error: '無効なリフレッシュトークンです。' });
        }
        // ユーザー情報を取得
        const user = yield User_1.default.findByPk(userId);
        if (!user) {
            return res.status(401).json({ error: '無効なリフレッシュトークンです。' });
        }
        // 新しいアクセストークンを生成（role を含める）
        const newAccessToken = (0, sessionUtils_1.generateAccessToken)(user.id.toString(), user.role);
        // 新しいアクセストークンをクッキーに設定
        res.cookie('accessToken', newAccessToken, getCookieOptions(15 * 60 * 1000)); // 15分
        res.json({ message: 'アクセストークンを再発行しました。' });
    }
    catch (error) {
        next(error);
    }
});
exports.refreshTokenHandler = refreshTokenHandler;
