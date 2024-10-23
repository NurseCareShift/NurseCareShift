"use strict";
// src/controllers/userController.ts
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
exports.updateUserRole = exports.deleteUserById = exports.getUserById = exports.getAllUsers = void 0;
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
const Profile_1 = __importDefault(require("../models/Profile"));
const sessionUtils_1 = require("../utils/sessionUtils");
// ユーザー一覧取得（管理者用）
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // 認可チェック（管理者のみ）
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
            return res.status(403).json({ error: 'アクセス権限がありません。' });
        }
        // 全ユーザーを取得し、関連するプロフィールも含める
        const users = yield User_1.default.findAll({
            include: [{ model: Profile_1.default, as: 'profile' }],
            attributes: { exclude: ['password', 'passwordHistory'] }, // パスワードを除外して取得
        });
        res.status(200).json(users);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllUsers = getAllUsers;
// ユーザー個別取得（管理者用）
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // 認可チェック（管理者のみ）
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
            return res.status(403).json({ error: 'アクセス権限がありません。' });
        }
        const { id } = req.params;
        // 特定のユーザーを取得し、関連するプロフィールも含める
        const user = yield User_1.default.findByPk(id, {
            include: [{ model: Profile_1.default, as: 'profile' }],
            attributes: { exclude: ['password', 'passwordHistory'] }, // パスワードを除外して取得
        });
        if (!user) {
            return res.status(404).json({ error: 'ユーザーが見つかりません。' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.getUserById = getUserById;
// ユーザー削除（管理者用）
const deleteUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // 認可チェック（管理者のみ）
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
            return res.status(403).json({ error: 'アクセス権限がありません。' });
        }
        const { id } = req.params;
        // ユーザーの存在確認
        const user = yield User_1.default.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'ユーザーが見つかりません。' });
        }
        // ユーザー削除
        yield user.destroy();
        // セッションの無効化
        yield (0, sessionUtils_1.invalidateAllSessions)(user.id.toString());
        res.status(200).json({ message: 'ユーザーが正常に削除されました。' });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUserById = deleteUserById;
// ユーザーロール更新（管理者用）
const updateUserRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // 認可チェック（管理者のみ）
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
            return res.status(403).json({ error: 'アクセス権限がありません。' });
        }
        const { id } = req.params;
        const { role } = req.body;
        // リクエストのバリデーションチェック
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // ユーザーの存在確認
        const user = yield User_1.default.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'ユーザーが見つかりません。' });
        }
        // ロールの更新
        user.role = role;
        yield user.save();
        res.status(200).json({ message: 'ユーザーのロールが更新されました。' });
    }
    catch (error) {
        next(error);
    }
});
exports.updateUserRole = updateUserRole;
