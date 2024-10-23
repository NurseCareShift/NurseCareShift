"use strict";
// src/controllers/profileController.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.getUserProfile = exports.updateProfile = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
const Profile_1 = __importDefault(require("../models/Profile"));
const db_1 = __importDefault(require("../db/db"));
// プロフィール更新処理
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // バリデーションエラーの確認
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        // アップロードされたファイルを削除
        if (req.file) {
            yield promises_1.default.unlink(req.file.path);
        }
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, bio } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        // アップロードされたファイルを削除
        if (req.file) {
            yield promises_1.default.unlink(req.file.path);
        }
        return res.status(401).json({ error: '認証が必要です。' });
    }
    const transaction = yield db_1.default.transaction();
    try {
        // ユーザーとプロフィールの取得
        const user = yield User_1.default.findByPk(userId, {
            include: [{ model: Profile_1.default, as: 'profile' }],
            transaction,
        });
        if (!user) {
            yield transaction.rollback();
            // アップロードされたファイルを削除
            if (req.file) {
                yield promises_1.default.unlink(req.file.path);
            }
            return res.status(404).json({ error: 'ユーザーが見つかりません。' });
        }
        // プロフィール画像の処理
        if (req.file) {
            // ファイルタイプのバリデーション
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(req.file.mimetype)) {
                yield transaction.rollback();
                // アップロードされたファイルを削除
                yield promises_1.default.unlink(req.file.path);
                return res.status(400).json({ error: '無効なファイルタイプです。' });
            }
            // 古い画像の削除
            if (user.profileImage) {
                const oldImagePath = path_1.default.join(__dirname, '..', 'uploads', user.profileImage);
                try {
                    yield promises_1.default.unlink(oldImagePath);
                }
                catch (error) {
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
            yield user.profile.save({ transaction });
        }
        else if (bio) {
            // プロフィールがない場合は新規作成
            yield Profile_1.default.create({ userId: user.id, bio }, { transaction });
        }
        // ユーザー情報の保存
        yield user.save({ transaction });
        // トランザクションのコミット
        yield transaction.commit();
        // レスポンスにユーザー情報を返す（敏感情報を除外）
        const sanitizedUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            profileImage: user.profileImage,
            bio: ((_b = user.profile) === null || _b === void 0 ? void 0 : _b.bio) || bio,
        };
        res.json({ message: 'プロフィールが更新されました。', user: sanitizedUser });
    }
    catch (error) {
        // トランザクションのロールバック
        yield transaction.rollback();
        // アップロードされたファイルを削除
        if (req.file) {
            yield promises_1.default.unlink(req.file.path);
        }
        console.error('プロフィール更新エラー:', error);
        next(error);
    }
});
exports.updateProfile = updateProfile;
// ユーザープロフィール取得
const getUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // verifyTokenミドルウェアで設定される
        if (!userId) {
            return res.status(401).json({ error: '認証が必要です。' });
        }
        // ユーザーを取得し、必要なフィールドのみを選択
        const user = yield User_1.default.findByPk(userId, {
            attributes: ['id', 'email', 'name', 'profileImage'],
        });
        if (!user) {
            return res.status(404).json({ error: 'ユーザーが見つかりません。' });
        }
        res.json({ user });
    }
    catch (error) {
        console.error('ユーザー取得エラー:', error);
        next(error); // エラーハンドリングミドルウェアに委ねる
    }
});
exports.getUserProfile = getUserProfile;
// ユーザープロフィール更新（管理者用ではない場合）
const updateUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // バリデーションエラーのチェック
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ error: '認証が必要です。' });
        }
        const { name, profileImage } = req.body;
        // ユーザーの取得
        const user = yield User_1.default.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'ユーザーが見つかりません。' });
        }
        // フィールドの更新
        user.name = name || user.name;
        user.profileImage = profileImage || user.profileImage;
        yield user.save();
        res.json({ message: 'プロフィールが更新されました。', user });
    }
    catch (error) {
        console.error('プロフィール更新エラー:', error);
        next(error);
    }
});
exports.updateUserProfile = updateUserProfile;
// 進捗の更新など他のコントローラーも同様に修正
