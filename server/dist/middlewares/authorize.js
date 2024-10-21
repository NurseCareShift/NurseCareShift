"use strict";
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
exports.authorize = void 0;
const User_1 = __importDefault(require("../models/User"));
// 役割ベースのアクセス制御ミドルウェア
const authorize = (allowedRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // 認証済みのユーザーIDを取得
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ error: '認証が必要です。' });
            }
            // データベースからユーザー情報を取得
            const user = yield User_1.default.findByPk(userId);
            if (!user) {
                return res.status(401).json({ error: '認証が無効です。' });
            }
            // ユーザーが許可されたロールを持っているか確認
            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({ error: 'この操作を行う権限がありません。' });
            }
            // 次のミドルウェアへ
            next();
        }
        catch (error) {
            console.error('認可エラー:', error);
            res.status(500).json({ error: 'サーバーエラーが発生しました。' });
        }
    });
};
exports.authorize = authorize;
