import { body, param } from 'express-validator';

// ロールのバリデーション（admin、official、general のみ許可）
export const roleValidator = body('role')
  .trim()
  .isIn(['admin', 'official', 'general'])
  .withMessage('有効なロールを指定してください。');

// ユーザーIDのバリデーション（パラメータから取得）
export const userIdValidator = param('id')
  .isNumeric()
  .withMessage('有効なユーザーIDを指定してください。');

// ロールのバリデーション（複数ロールの管理が必要な場合の拡張例）
export const multiRoleValidator = body('roles')
  .isArray({ min: 1 })
  .withMessage('1つ以上のロールを指定してください。')
  .custom((roles: string[]) => {
    const validRoles = ['admin', 'official', 'general'];
    const invalidRoles = roles.filter(role => !validRoles.includes(role));
    if (invalidRoles.length > 0) {
      throw new Error(`無効なロールが含まれています: ${invalidRoles.join(', ')}`);
    }
    return true;
  });

// ユーザーのアカウント削除バリデーション
export const deleteUserValidator = param('id')
  .isNumeric()
  .withMessage('削除するユーザーのIDが無効です。');
