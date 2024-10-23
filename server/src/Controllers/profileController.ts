// src/controllers/profileController.ts

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
    // アップロードされたファイルを削除
    if (req.file) {
      await fs.unlink(req.file.path);
    }
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, bio } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    // アップロードされたファイルを削除
    if (req.file) {
      await fs.unlink(req.file.path);
    }
    return res.status(401).json({ error: '認証が必要です。' });
  }

  const transaction: Transaction = await sequelize.transaction();

  try {
    // ユーザーとプロフィールの取得
    const user = await User.findByPk(userId, {
      include: [{ model: Profile, as: 'profile' }],
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      // アップロードされたファイルを削除
      if (req.file) {
        await fs.unlink(req.file.path);
      }
      return res.status(404).json({ error: 'ユーザーが見つかりません。' });
    }

    // プロフィール画像の処理
    if (req.file) {
      // ファイルタイプのバリデーション
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        await transaction.rollback();
        // アップロードされたファイルを削除
        await fs.unlink(req.file.path);
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

    // プロフィールの bio の更新
    if (user.profile) {
      if (bio) {
        user.profile.bio = bio;
      }
      await user.profile.save({ transaction });
    } else if (bio) {
      // プロフィールがない場合は新規作成
      await Profile.create({ userId: user.id, bio }, { transaction });
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
      bio: user.profile?.bio || bio,
    };

    res.json({ message: 'プロフィールが更新されました。', user: sanitizedUser });
  } catch (error) {
    // トランザクションのロールバック
    await transaction.rollback();
    // アップロードされたファイルを削除
    if (req.file) {
      await fs.unlink(req.file.path);
    }
    console.error('プロフィール更新エラー:', error);
    next(error);
  }
};

// ユーザープロフィール取得
export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id; // verifyTokenミドルウェアで設定される

    if (!userId) {
      return res.status(401).json({ error: '認証が必要です。' });
    }

    // ユーザーを取得し、必要なフィールドのみを選択
    const user = await User.findByPk(userId, {
      attributes: ['id', 'email', 'name', 'profileImage'],
    });

    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません。' });
    }

    res.json({ user });
  } catch (error) {
    console.error('ユーザー取得エラー:', error);
    next(error); // エラーハンドリングミドルウェアに委ねる
  }
};

// ユーザープロフィール更新（管理者用ではない場合）
export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // バリデーションエラーのチェック
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: '認証が必要です。' });
    }

    const { name, profileImage } = req.body;

    // ユーザーの取得
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません。' });
    }

    // フィールドの更新
    user.name = name || user.name;
    user.profileImage = profileImage || user.profileImage;

    await user.save();

    res.json({ message: 'プロフィールが更新されました。', user });
  } catch (error) {
    console.error('プロフィール更新エラー:', error);
    next(error);
  }
};

// 進捗の更新など他のコントローラーも同様に修正
