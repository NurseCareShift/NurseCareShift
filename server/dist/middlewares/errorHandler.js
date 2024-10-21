"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
// グローバルなエラーハンドリングミドルウェア
const errorHandler = (err, req, res, next) => {
    console.error('エラーログ:', err); // 開発中は詳細なエラーログを表示
    // デフォルトのエラーステータスとメッセージ
    let statusCode = 500;
    let message = 'サーバーエラーが発生しました。';
    // クライアントエラーの場合 (例: Validation Error)
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = err.message || '無効な入力です。';
    }
    // JWT認証エラーの場合
    if (err.name === 'UnauthorizedError') {
        statusCode = 401;
        message = '認証に失敗しました。トークンが無効です。';
    }
    // 404エラーの場合
    if (err.status === 404) {
        statusCode = 404;
        message = 'リソースが見つかりません。';
    }
    // ステータスコードとエラーメッセージをレスポンスとして返す
    res.status(statusCode).json({
        error: Object.assign({ message }, (process.env.NODE_ENV === 'development' && { stack: err.stack }) // 開発時のみエラースタックを表示
        )
    });
};
exports.errorHandler = errorHandler;
