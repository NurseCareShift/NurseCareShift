import jwt, { JwtPayload } from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY || 'your-refresh-secret-key';

// アクセストークンを生成
export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: '15m' });
};

// リフレッシュトークンを検証
export const verifyRefreshToken = (token: string): JwtPayload | string | null => {
  try {
    return jwt.verify(token, REFRESH_SECRET_KEY) as JwtPayload;
  } catch (error) {
    return null;
  }
};
