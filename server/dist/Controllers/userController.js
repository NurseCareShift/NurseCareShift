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
exports.updateUserProfile = exports.getUserProfile = void 0;
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
// ユーザープロフィール取得
const getUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId; // verifyTokenミドルウェアで設定される
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
// ユーザープロフィール更新
const updateUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // バリデーションエラーのチェック
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userId = req.userId;
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
