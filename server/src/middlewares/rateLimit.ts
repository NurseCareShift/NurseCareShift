import rateLimit from 'express-rate-limit';

// 共通のレートリミット設定（全体的に適用）
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分間
  max: 100, // 15分間に最大100リクエスト
  message: 'リクエストが多すぎます。しばらくしてから再度お試しください。',
  standardHeaders: true, // レート制限の情報を `RateLimit-*` ヘッダーに含める
  legacyHeaders: false,  // `X-RateLimit-*` ヘッダーを無効にする
});

// 特定のエンドポイントに適用するレートリミット設定（例: 認証関連）
export const authRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10分間
  max: 5, // 10分間に最大5リクエスト
  message: 'ログインの試行回数が多すぎます。10分後に再度お試しください。',
  standardHeaders: true,  // レート制限の情報を `RateLimit-*` ヘッダーに含める
  legacyHeaders: false,   // `X-RateLimit-*` ヘッダーを無効にする
  skipSuccessfulRequests: true, // 成功したリクエストはレート制限のカウントから除外
});

// パスワードリセットやアカウント作成など、センシティブなエンドポイントに適用するレートリミット設定
export const sensitiveActionRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1時間
  max: 3, // 1時間に最大3回の試行
  message: '操作が多すぎます。1時間後に再度お試しください。',
  standardHeaders: true, // レート制限の情報を `RateLimit-*` ヘッダーに含める
  legacyHeaders: false,  // `X-RateLimit-*` ヘッダーを無効にする
});
