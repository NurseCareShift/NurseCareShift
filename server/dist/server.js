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
exports.transporter = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db/db"));
const app_1 = __importDefault(require("./app")); // app.ts で定義されたExpressアプリ
const nodemailer_1 = __importDefault(require("nodemailer"));
const google_auth_library_1 = require("google-auth-library");
require("./models/index");
// 環境変数の読み込み
dotenv_1.default.config();
// メール設定
exports.transporter = nodemailer_1.default.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    logger: process.env.NODE_ENV !== 'production',
    debug: process.env.NODE_ENV !== 'production', // 開発環境でのみデバッグモードを有効化
});
// OAuthクライアント設定
const googleClient = new google_auth_library_1.OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: `${process.env.CLIENT_URL}/auth/google/callback`,
});
// Twitter OAuthの設定
const twitterConfig = {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackUrl: `${process.env.CLIENT_URL}/auth/twitter/callback`,
};
// データベース接続とサーバーの起動
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // データベース接続
        yield db_1.default.authenticate();
        console.log('データベース接続に成功しました。');
        // テーブル同期
        yield db_1.default.sync();
        // サーバーの起動
        const port = process.env.PORT || 8000;
        app_1.default.listen(port, () => {
            console.log(`サーバーがポート${port}で起動しました。`);
        });
    }
    catch (error) {
        console.error('サーバーの起動中にエラーが発生しました:', error);
        process.exit(1); // エラー発生時にはプロセスを終了する
    }
});
startServer();
