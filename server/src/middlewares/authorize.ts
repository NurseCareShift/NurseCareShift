import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

export const authorize = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 認証済みのユーザー情報からIDを取得
      const user = req.user; 
      if (!user || !user.id) {
        return res.status(401).json({ error: '認証が必要です。' });
      }

      // データベースからユーザー情報を取得
      const foundUser = await User.findByPk(user.id);
      if (!foundUser) {
        return res.status(401).json({ error: '無効なユーザーです。' });
      }

      // ユーザーが無効化されていないかを確認
      if (!foundUser.isActive) {
        return res.status(403).json({ error: 'ユーザーが無効化されています。' });
      }

      // ユーザーが許可されたロールを持っているか確認
      if (!allowedRoles.includes(foundUser.role)) {
        return res.status(403).json({ error: 'この操作を行う権限がありません。' });
      }

      // 次のミドルウェアへ
      next();
    } catch (error) {
      if (error instanceof Error) {
        // エラーが `Error` 型であることを確認してからメッセージを取得
        const errorMessage = error.message;

        // 本番環境では詳細なエラーを隠し、ログにのみ記録する
        if (process.env.NODE_ENV === 'production') {
          console.error(`認可エラー: ユーザーID: ${req.user?.id}, エラー: ${errorMessage}`);
          res.status(500).json({ error: 'サーバーエラーが発生しました。' });
        } else {
          console.error('認可エラー:', errorMessage);
          res.status(500).json({ error: errorMessage });
        }
      } else {
        // `Error` 型ではない場合の処理
        console.error('予期しないエラー:', error);
        res.status(500).json({ error: '予期しないエラーが発生しました。' });
      }
    }
  };
};
