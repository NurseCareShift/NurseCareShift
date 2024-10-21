import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// 環境変数を読み込む
dotenv.config();

// 環境変数からデータベース接続情報を取得
const database = process.env.DB_NAME || 'your_database';
const username = process.env.DB_USER || 'your_username';
const password = process.env.DB_PASSWORD || 'your_password';
const host = process.env.DB_HOST || 'localhost';
const dialect = 'mysql'; // デフォルトのダイアレクトをMySQLに設定

// Sequelizeインスタンスの作成
const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
  port: parseInt(process.env.DB_PORT || '3306', 10), // 環境変数からポートを設定、デフォルトは3306
  logging: process.env.NODE_ENV === 'development' ? console.log : false, // 開発環境でのみSQLロギング
  pool: {
    max: 10, // 最大接続数
    min: 0,  // 最小接続数
    acquire: 30000, // 接続のタイムアウト（ミリ秒）
    idle: 10000, // 接続がアイドル状態で保持される最大時間（ミリ秒）
  },
  dialectOptions: {
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false, // SSL設定
  },
});

// データベース接続テストとエラーハンドリング
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('データベース接続に成功しました。');
    
    // テーブルの自動同期を追加
    await sequelize.sync({ alter: true }); // テーブルが存在しない場合は作成、既存のものは更新
    console.log('データベーススキーマが同期されました。');
    
  } catch (error) {
    console.error('データベース接続エラー:', error);
  }
};

testConnection();

export default sequelize;
