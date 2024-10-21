// routes/userRoutes.ts
import express from 'express';
import { getUserProfile, updateUserProfile } from '../Controllers/userController';
import { verifyToken } from '../middlewares/verifyToken'; // JWTトークンの検証ミドルウェア

const router = express.Router();

// ユーザープロフィール取得 (GET /api/user)
router.get('/user', verifyToken, getUserProfile);

// ユーザープロフィール更新 (PUT /api/user)
router.put('/user', verifyToken, updateUserProfile);

export default router;
