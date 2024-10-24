import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { IAccessTokenPayload, IRefreshTokenPayload } from '../../types/jwt';
import redisClient from '../config/redis';

dotenv.config();

// トークンの有効期限
const TOKEN_EXPIRATION_TIME = process.env.TOKEN_EXPIRATION_TIME || '15m';
const REFRESH_TOKEN_EXPIRATION_TIME = process.env.REFRESH_TOKEN_EXPIRATION_TIME || '7d';

// トークンの秘密鍵
const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

if (!SECRET_KEY || !REFRESH_SECRET_KEY) {
  console.error('環境変数にSECRET_KEYまたはREFRESH_SECRET_KEYが設定されていません');
  process.exit(1); // 必須の環境変数がない場合、アプリケーションを停止
}

// アクセストークンの生成
export const generateAccessToken = (userId: string, role: 'admin' | 'official' | 'general'): string => {
  const payload: IAccessTokenPayload = { id: userId, role };
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: TOKEN_EXPIRATION_TIME,
  });
};

// リフレッシュトークンの生成
export const generateRefreshToken = async (userId: string): Promise<string> => {
  const payload: IRefreshTokenPayload = { id: userId };
  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
    expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
  });

  try {
    // Redisにリフレッシュトークンを保存（トークンをキーにして）
    await redisClient.set(`refreshToken:${refreshToken}`, userId, {
      EX: parseExpirationTime(REFRESH_TOKEN_EXPIRATION_TIME),
    });
  } catch (error) {
    console.error('Redisにリフレッシュトークンを保存できませんでした:', error);
  }

  return refreshToken;
};

// アクセストークンの検証
export const verifyAccessToken = (token: string): Promise<IAccessTokenPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err || !decoded) {
        return reject('無効なトークンです');
      }
      resolve(decoded as IAccessTokenPayload);
    });
  });
};

// リフレッシュトークンの検証
export const verifyRefreshToken = async (token: string): Promise<string | null> => {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET_KEY) as IRefreshTokenPayload;
    const userId = decoded.id;

    const storedUserId = await redisClient.get(`refreshToken:${token}`);
    if (storedUserId && storedUserId === userId) {
      return userId;
    } else {
      return null;
    }
  } catch (error) {
    console.error('リフレッシュトークンの検証エラー:', error);
    return null;
  }
};

// リフレッシュトークンの無効化
export const invalidateRefreshToken = async (token: string): Promise<void> => {
  try {
    await redisClient.del(`refreshToken:${token}`);
  } catch (error) {
    console.error('リフレッシュトークンの無効化中にエラーが発生しました:', error);
  }
};

// すべてのセッションを無効化
export const invalidateAllSessions = async (userId: string): Promise<void> => {
  try {
    const keys = await redisClient.keys('refreshToken:*');
    for (const key of keys) {
      const storedUserId = await redisClient.get(key);
      if (storedUserId === userId) {
        await redisClient.del(key);
      }
    }
  } catch (error) {
    console.error('セッション無効化中にエラーが発生しました:', error);
  }
};

// トークンをブラックリストに追加
export const blacklistToken = async (token: string): Promise<void> => {
  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    if (!decoded || !decoded.exp) return;

    const expiration = decoded.exp - Math.floor(Date.now() / 1000);
    if (expiration > 0) {
      await redisClient.set(`blacklist:${token}`, 'true', { EX: expiration });
    }
  } catch (error) {
    console.error('トークンをブラックリストに追加できませんでした:', error);
  }
};

// ブラックリストにトークンが含まれているかチェック
export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  try {
    const isBlacklisted = await redisClient.exists(`blacklist:${token}`);
    return isBlacklisted === 1;
  } catch (error) {
    console.error('トークンのブラックリストチェック中にエラーが発生しました:', error);
    return false;
  }
};

// トークンの有効期限を秒数に変換
const parseExpirationTime = (time: string): number => {
  const unit = time.slice(-1);
  const value = parseInt(time.slice(0, -1), 10);

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 3600;
    case 'd':
      return value * 86400;
    default:
      return 0;
  }
};
