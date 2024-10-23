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
exports.getSectionProgress = exports.getProgress = exports.updateProgress = void 0;
const Progress_1 = __importDefault(require("../models/Progress"));
const express_validator_1 = require("express-validator");
// 進捗の更新
const updateProgress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // バリデーションエラーのチェック
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // user が存在するかチェック
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ error: 'ユーザーが認証されていません。' });
        }
        const { articleSlug, sectionId, status } = req.body;
        // 既存の進捗を検索
        const existingProgress = yield Progress_1.default.findOne({
            where: { userId, articleSlug, sectionId },
        });
        if (existingProgress) {
            // 進捗の更新
            existingProgress.status = status;
            yield existingProgress.save();
        }
        else {
            // 新規進捗の作成
            yield Progress_1.default.create({ userId, articleSlug, sectionId, status });
        }
        res.status(200).json({ message: '進捗が更新されました。' });
    }
    catch (error) {
        next(error);
    }
});
exports.updateProgress = updateProgress;
// 進捗の取得
const getProgress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ error: 'ユーザーが認証されていません。' });
        }
        const progresses = yield Progress_1.default.findAll({
            where: { userId },
        });
        res.status(200).json({ progresses });
    }
    catch (error) {
        next(error);
    }
});
exports.getProgress = getProgress;
// 特定のセクションの進捗取得
const getSectionProgress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ error: 'ユーザーが認証されていません。' });
        }
        const articleSlug = Array.isArray(req.query.articleSlug) ? req.query.articleSlug[0] : req.query.articleSlug;
        const sectionId = Array.isArray(req.query.sectionId) ? req.query.sectionId[0] : req.query.sectionId;
        if (typeof articleSlug !== 'string' || typeof sectionId !== 'string') {
            return res.status(400).json({ error: 'articleSlug または sectionId が無効です。' });
        }
        const progress = yield Progress_1.default.findOne({
            where: { userId, articleSlug, sectionId },
        });
        res.status(200).json({ progress });
    }
    catch (error) {
        next(error);
    }
});
exports.getSectionProgress = getSectionProgress;
