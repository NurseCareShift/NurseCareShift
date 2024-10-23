import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import session from 'express-session'; // セッション管理用
import passport from 'passport'; // passportのインポート
import authRoutes from './routes/authRoutes';
import accountRoutes from './routes/accountRouter';
import adminRoutes from './routes/adminRoutes';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { verifyToken } from './middlewares/verifyToken';
import { csrfProtection } from './middlewares/csrfProtection';
import progressRoutes from './routes/progressRoutes';

dotenv.config();

const app = express();

// プロキシを信頼する設定
app.set('trust proxy', 1);

// セキュリティ対策: Helmetを使用
app.use(helmet());

// JSONおよびCookieのパーサーを使用
app.use(express.json());
app.use(cookieParser());

// CORS設定: クライアントのURLを指定し、クッキーを許可
app.use(
  cors({
    origin: 'http://localhost:3000', // フロントエンドのURLを明示的に指定
    credentials: true, // クッキーを含むリクエストを許可
  })
);

// express-session の設定
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }, // 本番環境では secure: true を推奨
  })
);

// passport の初期化とセッションの設定
app.use(passport.initialize());
app.use(passport.session()); // セッションが必要な場合

// レートリミッターの設定: 1分間に100リクエストまで許可
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1分間
  max: 100, // 最大100リクエスト
  message: 'リクエストが多すぎます。後でもう一度お試しください。',
  standardHeaders: true, // RateLimitヘッダーを有効にする
  legacyHeaders: false, // X-RateLimitヘッダーを無効にする
});

// レートリミッターを全てのリクエストに適用
app.use('/api/', apiLimiter);

// CSRF トークンを提供するルート
app.get('/api/auth/csrf-token', csrfProtection, (req: Request, res: Response) => {
  res.json({ csrfToken: req.csrfToken() });
});

// APIルートの定義
app.use('/api/auth', csrfProtection, authRoutes); // 認証関連ルートにCSRF保護を適用
app.use('/api/account', verifyToken, csrfProtection, accountRoutes); // ユーザーのアカウントルートにJWTとCSRF保護を適用
app.use('/api/admin', verifyToken, csrfProtection, adminRoutes); // 管理者ルートにJWTとCSRF保護を適用
app.use('/api', verifyToken, csrfProtection, userRoutes); // ユーザー情報取得ルートに認証とCSRF保護を適用
app.use('/progress', progressRoutes);

// ルートが存在しない場合のエラーハンドリング
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: '指定されたルートは存在しません。' });
});

// CSRFエラーのハンドリング
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.code === 'EBADCSRFTOKEN') {
    res.status(403).json({ error: '不正なCSRFトークンです。' });
  } else {
    next(err);
  }
});

// グローバルエラーハンドリングミドルウェア
app.use(errorHandler);

export default app;
