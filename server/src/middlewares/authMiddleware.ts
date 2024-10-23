import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken; // Cookieからトークンを取得
  if (!token) {
    return res.status(403).json({ error: '認証が必要です。' });
  }

  // トークンの検証
  jwt.verify(token, process.env.SECRET_KEY || 'your-secret-key', (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
    if (err) {
      return res.status(401).json({ error: '無効な認証トークンです。' });
    }

    // decodedがJwtPayloadかstringかを確認
    if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
      req.user = { id: (decoded as JwtPayload).id }; // req.user にユーザーIDを追加
      return next(); // 認証が成功したら次のミドルウェアへ
    }

    return res.status(401).json({ error: 'トークンの解析に失敗しました。' });
  });
};
