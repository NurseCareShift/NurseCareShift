"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sensitiveActionRateLimiter = exports.authRateLimiter = exports.globalRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// 共通のレートリミット設定（全体的に適用）
exports.globalRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'リクエストが多すぎます。しばらくしてから再度お試しください。',
    standardHeaders: true,
    legacyHeaders: false, // `X-RateLimit-*` ヘッダーを無効にする
});
// 特定のエンドポイントに適用するレートリミット設定（例: 認証関連）
exports.authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: 'ログインの試行回数が多すぎます。10分後に再度お試しください。',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // 成功したリクエストはレート制限のカウントから除外
});
// パスワードリセットやアカウント作成など、センシティブなエンドポイントに適用するレートリミット設定
exports.sensitiveActionRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: '操作が多すぎます。1時間後に再度お試しください。',
    standardHeaders: true,
    legacyHeaders: false, // `X-RateLimit-*` ヘッダーを無効にする
});
