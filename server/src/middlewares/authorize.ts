import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

// 役割ベースのアクセス制御ミドルウェア
export const authorize = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 認証済みのユーザーIDを取得
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ error: '認証が必要です。' });
      }

      // データベースからユーザー情報を取得
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(401).json({ error: '認証が無効です。' });
      }

      // ユーザーが許可されたロールを持っているか確認
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: 'この操作を行う権限がありません。' });
      }

      // 次のミドルウェアへ
      next();
    } catch (error) {
      console.error('認可エラー:', error);
      res.status(500).json({ error: 'サーバーエラーが発生しました。' });
    }
  };
};
