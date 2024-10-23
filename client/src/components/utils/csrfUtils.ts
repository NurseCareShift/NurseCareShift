import { apiClient } from './apiClient';

let csrfToken: string | null = null;

interface CsrfResponse {
  csrfToken: string;
}

/**
 * CSRFトークンを取得する関数
 * 必要に応じてサーバーからトークンを取得し、キャッシュします。
 */
export const getCsrfToken = async (): Promise<string> => {
  // 既にキャッシュされている場合はそれを返す
  if (csrfToken) {
    return csrfToken;
  }

  try {
    // APIからCSRFトークンを取得
    const response = await apiClient.get<CsrfResponse>('/auth/csrf-token');

    // 取得したデータの検証
    if (!response.data || typeof response.data.csrfToken !== 'string') {
      throw new Error('CSRFトークンが正しくありません');
    }

    // CSRFトークンをキャッシュ
    csrfToken = response.data.csrfToken;
    return csrfToken;
  } catch (error) {
    // エラーハンドリング
    console.error('CSRFトークンの取得に失敗しました:', error);
    throw new Error('CSRFトークンの取得に失敗しました');
  }
};
