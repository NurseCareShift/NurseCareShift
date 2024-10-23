// src/types/express/index.d.ts に追加する拡張型定義
declare global {
  namespace Express {
    interface Request {
      user?: import('../../models/User').default; // User 型をインポートして定義
    }
  }
}
