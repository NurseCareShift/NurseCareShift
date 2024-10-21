import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { isTokenBlacklisted } from '../utils/sessionUtils';

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error('SECRET_KEY が環境変数に設定されていません');
}

// JWT トークンを検証するミドルウェア
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // リクエストヘッダーとクッキーからトークンを取得
  const authHeader = req.headers['authorization'];
  const token =
    req.cookies.accessToken ||
    (authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null);

  // トークンが存在しない場合
  if (!token) {
    return res.status(401).json({ error: '認証が必要です。' });
  }

  try {
    // トークンがブラックリストに含まれていないか確認
    const blacklisted = await isTokenBlacklisted(token);
    if (blacklisted) {
      return res.status(401).json({ error: '認証が無効です。' });
    }

    // トークンの検証
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;

    // トークンが正当な場合、ユーザーIDをリクエストオブジェクトに追加
    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: '認証が無効です。' });
    }

    req.userId = decoded.id;

    // 次のミドルウェアへ
    next();
  } catch (error) {
    // トークンの検証に失敗した場合
    return res.status(401).json({ error: '認証が無効です。' });
  }
};
