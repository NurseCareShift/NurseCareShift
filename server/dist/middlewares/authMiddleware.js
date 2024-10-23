"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// 認証を行うミドルウェア
const isAuthenticated = (req, res, next) => {
    const token = req.cookies.accessToken; // Cookie からトークンを取得
    if (!token) {
        return res.status(403).json({ error: '認証が必要です。' });
    }
    // トークンの検証
    jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || 'your-secret-key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: '無効な認証トークンです。' });
        }
        if (decoded && typeof decoded !== 'string') {
            req.user = { id: decoded.id }; // user に id を追加
        }
        next();
    });
};
exports.isAuthenticated = isAuthenticated;
