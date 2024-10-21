"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/userRoutes.ts
const express_1 = __importDefault(require("express"));
const userController_1 = require("../Controllers/userController");
const verifyToken_1 = require("../middlewares/verifyToken"); // JWTトークンの検証ミドルウェア
const router = express_1.default.Router();
// ユーザープロフィール取得 (GET /api/user)
router.get('/user', verifyToken_1.verifyToken, userController_1.getUserProfile);
// ユーザープロフィール更新 (PUT /api/user)
router.put('/user', verifyToken_1.verifyToken, userController_1.updateUserProfile);
exports.default = router;
