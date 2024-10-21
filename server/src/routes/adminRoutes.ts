import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserRole
} from '../Controllers/adminController';
import { roleValidator } from '../validators/adminValidators';
import { authorize } from '../middlewares/authorize';
import { verifyToken } from '../middlewares/verifyToken';

const router = Router();

/**
 * @route   GET /api/admin/users
 * @desc    すべてのユーザーの取得
 * @access  Private (Admin only)
 */
router.get(
  '/users',
  verifyToken,               // 認証済みユーザーであることを確認
  authorize(['admin']),       // 管理者ロールを持つユーザーのみアクセス可能
  getAllUsers
);

/**
 * @route   GET /api/admin/users/:id
 * @desc    特定のユーザーの取得
 * @access  Private (Admin only)
 */
router.get(
  '/users/:id',
  verifyToken,               // 認証済みユーザーであることを確認
  authorize(['admin']),       // 管理者ロールを持つユーザーのみアクセス可能
  getUserById
);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    特定のユーザーの削除
 * @access  Private (Admin only)
 */
router.delete(
  '/users/:id',
  verifyToken,               // 認証済みユーザーであることを確認
  authorize(['admin']),       // 管理者ロールを持つユーザーのみアクセス可能
  deleteUserById
);

/**
 * @route   PUT /api/admin/users/:id/role
 * @desc    特定のユーザーのロールを更新
 * @access  Private (Admin only)
 */
router.put(
  '/users/:id/role',
  verifyToken,               // 認証済みユーザーであることを確認
  authorize(['admin']),       // 管理者ロールを持つユーザーのみアクセス可能
  [roleValidator],            // ロール更新のバリデーション
  updateUserRole
);

export default router;
