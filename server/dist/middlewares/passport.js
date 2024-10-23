"use strict";
// src/middlewares/passport.ts
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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const User_1 = __importDefault(require("../models/User"));
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_CALLBACK_URL = `${process.env.SERVER_URL}/auth/google/callback`;
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error('Google OAuth のクライアントIDまたはクライアントシークレットが設定されていません');
}
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // プロフィール情報からメールアドレスを取得
        const email = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
        if (!email) {
            return done(new Error('Google アカウントにメールアドレスが設定されていません。'), null);
        }
        // ユーザーを検索
        let user = yield User_1.default.findOne({ where: { email } });
        if (!user) {
            // ユーザーが存在しない場合は新規作成
            user = yield User_1.default.create({
                email,
                isVerified: true,
                role: 'general',
                passwordHistory: [], // パスワード履歴を初期化
            });
        }
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
})));
// serializeUser と deserializeUser の設定
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findByPk(id);
        if (user) {
            done(null, user);
        }
        else {
            done(new Error('ユーザーが見つかりません。'), null);
        }
    }
    catch (error) {
        done(error, null);
    }
}));
exports.default = passport_1.default;
