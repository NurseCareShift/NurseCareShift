"use strict";
// src/middlewares/verifyToken.ts
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
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sessionUtils_1 = require("../utils/sessionUtils");
const User_1 = __importDefault(require("../models/User"));
const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
    throw new Error('SECRET_KEY が環境変数に設定されていません');
}
// JWT トークンを検証するミドルウェア
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // リクエストヘッダーとクッキーからトークンを取得
    const authHeader = req.headers['authorization'];
    const token = req.cookies.accessToken ||
        (authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : null);
    // トークンが存在しない場合
    if (!token) {
        return res.status(401).json({ error: '認証が必要です。' });
    }
    try {
        // トークンがブラックリストに含まれていないか確認
        const blacklisted = yield (0, sessionUtils_1.isTokenBlacklisted)(token);
        if (blacklisted) {
            return res.status(401).json({ error: '認証が無効です。' });
        }
        // トークンの検証
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        // トークンが正当な場合、ユーザー情報をデータベースから取得
        if (!decoded || !decoded.id || !decoded.role) {
            return res.status(401).json({ error: '認証が無効です。' });
        }
        // ユーザー情報をデータベースから取得
        const user = yield User_1.default.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ error: '認証が無効です。' });
        }
        // ユーザー情報を req.user にセット
        req.user = user;
        // 次のミドルウェアへ
        next();
    }
    catch (error) {
        // トークンの検証に失敗した場合
        return res.status(401).json({ error: '認証が無効です。' });
    }
});
exports.verifyToken = verifyToken;
