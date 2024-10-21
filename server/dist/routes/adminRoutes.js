"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../Controllers/adminController");
const adminValidators_1 = require("../validators/adminValidators");
const authorize_1 = require("../middlewares/authorize");
const verifyToken_1 = require("../middlewares/verifyToken");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/admin/users
 * @desc    すべてのユーザーの取得
 * @access  Private (Admin only)
 */
router.get('/users', verifyToken_1.verifyToken, // 認証済みユーザーであることを確認
(0, authorize_1.authorize)(['admin']), // 管理者ロールを持つユーザーのみアクセス可能
adminController_1.getAllUsers);
/**
 * @route   GET /api/admin/users/:id
 * @desc    特定のユーザーの取得
 * @access  Private (Admin only)
 */
router.get('/users/:id', verifyToken_1.verifyToken, // 認証済みユーザーであることを確認
(0, authorize_1.authorize)(['admin']), // 管理者ロールを持つユーザーのみアクセス可能
adminController_1.getUserById);
/**
 * @route   DELETE /api/admin/users/:id
 * @desc    特定のユーザーの削除
 * @access  Private (Admin only)
 */
router.delete('/users/:id', verifyToken_1.verifyToken, // 認証済みユーザーであることを確認
(0, authorize_1.authorize)(['admin']), // 管理者ロールを持つユーザーのみアクセス可能
adminController_1.deleteUserById);
/**
 * @route   PUT /api/admin/users/:id/role
 * @desc    特定のユーザーのロールを更新
 * @access  Private (Admin only)
 */
router.put('/users/:id/role', verifyToken_1.verifyToken, // 認証済みユーザーであることを確認
(0, authorize_1.authorize)(['admin']), // 管理者ロールを持つユーザーのみアクセス可能
[adminValidators_1.roleValidator], // ロール更新のバリデーション
adminController_1.updateUserRole);
exports.default = router;
