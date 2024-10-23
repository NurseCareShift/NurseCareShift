"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// app.ts
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const accountRouter_1 = __importDefault(require("./routes/accountRouter"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const verifyToken_1 = require("./middlewares/verifyToken");
const csrfProtection_1 = require("./middlewares/csrfProtection");
const progressRoutes_1 = __importDefault(require("./routes/progressRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// プロキシを信頼する設定
app.set('trust proxy', 1);
// セキュリティ対策: Helmetを使用
app.use((0, helmet_1.default)());
// JSONおよびCookieのパーサーを使用
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// CORS設定: クライアントのURLを指定し、クッキーを許可
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000', // フロントエンドのURLを明示的に指定
    credentials: true, // クッキーを含むリクエストを許可
}));
// レートリミッターの設定: 1分間に100リクエストまで許可
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1分間
    max: 100, // 最大100リクエスト
    message: 'リクエストが多すぎます。後でもう一度お試しください。',
    standardHeaders: true, // RateLimitヘッダーを有効にする
    legacyHeaders: false, // X-RateLimitヘッダーを無効にする
});
// レートリミッターを全てのリクエストに適用
app.use('/api/', apiLimiter);
// CSRF トークンを提供するルート
app.get('/api/auth/csrf-token', csrfProtection_1.csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});
// APIルートの定義
app.use('/api/auth', csrfProtection_1.csrfProtection, authRoutes_1.default); // 認証関連ルートにCSRF保護を適用
app.use('/api/account', verifyToken_1.verifyToken, csrfProtection_1.csrfProtection, accountRouter_1.default); // ユーザーのアカウントルートにJWTとCSRF保護を適用
app.use('/api/admin', verifyToken_1.verifyToken, csrfProtection_1.csrfProtection, adminRoutes_1.default); // 管理者ルートにJWTとCSRF保護を適用
app.use('/api', verifyToken_1.verifyToken, csrfProtection_1.csrfProtection, userRoutes_1.default); // ユーザー情報取得ルートに認証とCSRF保護を適用
app.use('/progress', progressRoutes_1.default);
// ルートが存在しない場合のエラーハンドリング
app.use((req, res) => {
    res.status(404).json({ error: '指定されたルートは存在しません。' });
});
// CSRFエラーのハンドリング
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        res.status(403).json({ error: '不正なCSRFトークンです。' });
    }
    else {
        next(err);
    }
});
// グローバルエラーハンドリングミドルウェア
app.use(errorHandler_1.errorHandler);
exports.default = app;
