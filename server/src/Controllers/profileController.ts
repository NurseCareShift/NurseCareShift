import { Request, Response, NextFunction } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { validationResult } from 'express-validator';
import { Transaction } from 'sequelize';
import User from '../models/User';
import Profile from '../models/Profile';
import sequelize from '../db/db';

// プロフィール更新処理
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  // バリデーションエラーの確認
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, bio } = req.body;
  const transaction: Transaction = await sequelize.transaction();

  try {
    // ユーザーとプロフィールの取得
    const user = await User.findByPk(req.userId, {
      include: [{ model: Profile, as: 'profile' }],
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ error: 'ユーザーが見つかりません。' });
    }

    // プロフィール画像の処理
    if (req.file) {
      // ファイルタイプのバリデーション
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        await transaction.rollback();
        return res.status(400).json({ error: '無効なファイルタイプです。' });
      }

      // 古い画像の削除
      if (user.profileImage) {
        const oldImagePath = path.join(__dirname, '..', 'uploads', user.profileImage);
        try {
          await fs.unlink(oldImagePath);
        } catch (error) {
          console.warn(`古いプロフィール画像の削除に失敗しました: ${error}`);
        }
      }

      // 新しいプロフィール画像の設定
      user.profileImage = req.file.filename;
    }

    // ユーザー名の更新
    if (name) {
      user.name = name;
    }

    // プロフィールのbioの更新
    if (user.profile) {
      if (bio) {
        user.profile.bio = bio;
      }
      await user.profile.save({ transaction });
    }

    // ユーザー情報の保存
    await user.save({ transaction });

    // トランザクションのコミット
    await transaction.commit();

    // レスポンスにユーザー情報を返す（敏感情報を除外）
    const sanitizedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
    };

    res.json({ message: 'プロフィールが更新されました。', user: sanitizedUser });
  } catch (error) {
    // トランザクションのロールバック
    await transaction.rollback();
    console.error('プロフィール更新エラー:', error);
    next(error);
  }
};
