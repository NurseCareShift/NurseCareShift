"use strict";
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
exports.updateProfile = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
const Profile_1 = __importDefault(require("../models/Profile"));
const db_1 = __importDefault(require("../db/db"));
// プロフィール更新処理
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // バリデーションエラーの確認
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, bio } = req.body;
    const transaction = yield db_1.default.transaction();
    try {
        // ユーザーとプロフィールの取得
        const user = yield User_1.default.findByPk(req.userId, {
            include: [{ model: Profile_1.default, as: 'profile' }],
            transaction,
        });
        if (!user) {
            yield transaction.rollback();
            return res.status(404).json({ error: 'ユーザーが見つかりません。' });
        }
        // プロフィール画像の処理
        if (req.file) {
            // ファイルタイプのバリデーション
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(req.file.mimetype)) {
                yield transaction.rollback();
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
        // プロフィールのbioの更新
        if (user.profile) {
            if (bio) {
                user.profile.bio = bio;
            }
            yield user.profile.save({ transaction });
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
        };
        res.json({ message: 'プロフィールが更新されました。', user: sanitizedUser });
    }
    catch (error) {
        // トランザクションのロールバック
        yield transaction.rollback();
        console.error('プロフィール更新エラー:', error);
        next(error);
    }
});
exports.updateProfile = updateProfile;
