import dotenv from 'dotenv';
import sequelize from './db/db';
import app from './app';
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';
import { connectRedis } from './config/redis'; // Redis接続関数
import './models/index';

// 環境変数の読み込み
dotenv.config();

// 必須の環境変数をチェックする関数
const checkRequiredEnvVars = () => {
  const requiredEnvVars = [
    'EMAIL_HOST', 'EMAIL_USER', 'EMAIL_PASS',
    'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET',
    'TWITTER_CONSUMER_KEY', 'TWITTER_CONSUMER_SECRET',
    'INSTAGRAM_CLIENT_ID', 'INSTAGRAM_CLIENT_SECRET',
    'PORT', 'CLIENT_URL', 'SERVER_URL',
    // 他の必須環境変数も追加
  ];

  requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`環境変数 ${key} が設定されていません`);
    }
  });
};

checkRequiredEnvVars(); // サーバー起動前に環境変数の確認

// メール設定
export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true', // 'true'の場合、ポートは465を使用
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: process.env.NODE_ENV !== 'production', // 開発環境でのみログを有効化
  debug: process.env.NODE_ENV !== 'production',  // 開発環境でのみデバッグモードを有効化
});

// OAuthクライアント設定
const googleClient = new OAuth2Client({
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

// Instagram OAuthの設定
const instagramConfig = {
  clientID: process.env.INSTAGRAM_CLIENT_ID,
  clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
  callbackURL: `${process.env.SERVER_URL}/auth/instagram/callback`,
};

// サーバー起動
const startServer = async () => {
  try {
    // Redis接続
    await connectRedis();
    console.log('Redis接続に成功しました。');

    // データベース接続
    await sequelize.authenticate();
    console.log('データベース接続に成功しました。');

    // テーブル同期
    await sequelize.sync();

    // サーバーの起動
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`サーバーがポート${port}で起動しました。`);
    });

  } catch (error) {
    console.error('サーバーの起動中にエラーが発生しました:', error);
    process.exit(1); // エラー発生時にはプロセスを終了する
  }
};

startServer();
