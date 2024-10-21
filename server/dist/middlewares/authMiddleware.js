"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(403).json({ error: '認証が必要です。' });
    }
    jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || 'your-secret-key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: '無効な認証トークンです。' });
        }
        if (decoded && typeof decoded !== 'string') {
            req.userId = decoded.id; // decoded がオブジェクトの場合に処理
        }
        next();
    });
};
exports.verifyToken = verifyToken;
