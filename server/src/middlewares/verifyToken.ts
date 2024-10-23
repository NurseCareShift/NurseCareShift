import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { isTokenBlacklisted } from '../utils/sessionUtils';
import User from '../models/User';
import { IAccessTokenPayload } from '../../types/jwt'; // トークンのペイロード型

// 環境変数から SECRET_KEY を取得
const SECRET_KEY = process.env.SECRET_KEY || '';

if (!SECRET_KEY) {
  throw new Error('SECRET_KEY が環境変数に設定されていません');
}

// JWT トークンを検証するミドルウェア
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    // Authorization ヘッダーまたは Cookie からトークンを取得
    const authHeader = req.headers['authorization'];
    const token = req.cookies.accessToken || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);

    // トークンがない場合
    if (!token) {
      return res.status(401).json({ error: '認証トークンがありません。' });
    }

    // トークンがブラックリストにあるか確認
    const isBlacklisted = await isTokenBlacklisted(token);
    if (isBlacklisted) {
      return res.status(401).json({ error: '認証トークンは無効です。' });
    }

    // トークンの検証とデコード
    const decoded = jwt.verify(token, SECRET_KEY) as IAccessTokenPayload;

    // デコードしたトークンのバリデーション
    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: '無効なトークンです。' });
    }

    // データベースからユーザーを取得
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'ユーザーが存在しません。' });
    }

    // 認証されたユーザー情報を req.user にセット
    req.user = user;

    // 次のミドルウェアまたはルートへ
    next();
  } catch (error) {
    // JWT トークンが無効または期限切れの場合の処理
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: '認証に失敗しました。' });
    }

    // その他のエラー処理
    return res.status(500).json({ error: 'サーバーエラーが発生しました。' });
  }
};
