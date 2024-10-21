import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(403).json({ error: '認証が必要です。' });
  }

  jwt.verify(token, process.env.SECRET_KEY || 'your-secret-key', (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
    if (err) {
      return res.status(401).json({ error: '無効な認証トークンです。' });
    }

    if (decoded && typeof decoded !== 'string') {
      req.userId = (decoded as JwtPayload).id; // decoded がオブジェクトの場合に処理
    }
    next();
  });
};
