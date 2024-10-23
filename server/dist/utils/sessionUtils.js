"use strict";
// src/utils/sessionUtils.ts
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
exports.isTokenBlacklisted = exports.blacklistToken = exports.invalidateAllSessions = exports.invalidateRefreshToken = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Redisクライアントの作成（セッション管理に使用）
const redisClient = (0, redis_1.createClient)({
    url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
    password: process.env.REDIS_PASSWORD || undefined, // パスワードが必要な場合
});
// Redis接続処理
redisClient.on('error', (err) => console.error('Redis接続エラー:', err));
redisClient.on('connect', () => console.log('Redisに接続しました'));
redisClient.on('reconnecting', () => console.log('Redisに再接続中'));
// Redisクライアントの接続
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield redisClient.connect();
    }
    catch (error) {
        console.error('Redis接続に失敗しました:', error);
    }
}))();
// トークンの有効期限
const TOKEN_EXPIRATION_TIME = process.env.TOKEN_EXPIRATION_TIME || '15m';
const REFRESH_TOKEN_EXPIRATION_TIME = process.env.REFRESH_TOKEN_EXPIRATION_TIME || '7d';
// トークンの秘密鍵
const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;
if (!SECRET_KEY || !REFRESH_SECRET_KEY) {
    console.error('環境変数にSECRET_KEYまたはREFRESH_SECRET_KEYが設定されていません');
    process.exit(1); // 必須の環境変数がない場合、アプリケーションを停止
}
// アクセストークンの生成
const generateAccessToken = (userId, role) => {
    const payload = { id: userId, role };
    return jsonwebtoken_1.default.sign(payload, SECRET_KEY, {
        expiresIn: TOKEN_EXPIRATION_TIME,
    });
};
exports.generateAccessToken = generateAccessToken;
// リフレッシュトークンの生成
const generateRefreshToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = { id: userId };
    const refreshToken = jsonwebtoken_1.default.sign(payload, REFRESH_SECRET_KEY, {
        expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
    });
    try {
        // Redisにリフレッシュトークンを保存（トークンをキーにして）
        yield redisClient.set(`refreshToken:${refreshToken}`, userId, {
            EX: parseExpirationTime(REFRESH_TOKEN_EXPIRATION_TIME),
        });
    }
    catch (error) {
        console.error('Redisにリフレッシュトークンを保存できませんでした:', error);
    }
    return refreshToken;
});
exports.generateRefreshToken = generateRefreshToken;
// アクセストークンの検証
const verifyAccessToken = (token) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, SECRET_KEY, (err, decoded) => {
            if (err || !decoded) {
                return reject('無効なトークンです');
            }
            resolve(decoded);
        });
    });
};
exports.verifyAccessToken = verifyAccessToken;
// リフレッシュトークンの検証
const verifyRefreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, REFRESH_SECRET_KEY);
        const userId = decoded.id;
        const storedUserId = yield redisClient.get(`refreshToken:${token}`);
        if (storedUserId && storedUserId === userId) {
            return userId;
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.error('リフレッシュトークンの検証エラー:', error);
        return null;
    }
});
exports.verifyRefreshToken = verifyRefreshToken;
// リフレッシュトークンの無効化
const invalidateRefreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield redisClient.del(`refreshToken:${token}`);
    }
    catch (error) {
        console.error('リフレッシュトークンの無効化中にエラーが発生しました:', error);
    }
});
exports.invalidateRefreshToken = invalidateRefreshToken;
// すべてのセッションを無効化
const invalidateAllSessions = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const keys = yield redisClient.keys('refreshToken:*');
        for (const key of keys) {
            const storedUserId = yield redisClient.get(key);
            if (storedUserId === userId) {
                yield redisClient.del(key);
            }
        }
    }
    catch (error) {
        console.error('セッション無効化中にエラーが発生しました:', error);
    }
});
exports.invalidateAllSessions = invalidateAllSessions;
// トークンをブラックリストに追加
const blacklistToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = jsonwebtoken_1.default.decode(token);
        if (!decoded || !decoded.exp)
            return;
        const expiration = decoded.exp - Math.floor(Date.now() / 1000);
        if (expiration > 0) {
            yield redisClient.set(`blacklist:${token}`, 'true', { EX: expiration });
        }
    }
    catch (error) {
        console.error('トークンをブラックリストに追加できませんでした:', error);
    }
});
exports.blacklistToken = blacklistToken;
// ブラックリストにトークンが含まれているかチェック
const isTokenBlacklisted = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isBlacklisted = yield redisClient.exists(`blacklist:${token}`);
        return isBlacklisted === 1;
    }
    catch (error) {
        console.error('トークンのブラックリストチェック中にエラーが発生しました:', error);
        return false;
    }
});
exports.isTokenBlacklisted = isTokenBlacklisted;
// トークンの有効期限を秒数に変換
const parseExpirationTime = (time) => {
    const unit = time.slice(-1);
    const value = parseInt(time.slice(0, -1), 10);
    switch (unit) {
        case 's':
            return value;
        case 'm':
            return value * 60;
        case 'h':
            return value * 3600;
        case 'd':
            return value * 86400;
        default:
            return 0;
    }
};
