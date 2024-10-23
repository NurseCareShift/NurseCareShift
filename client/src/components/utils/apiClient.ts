import axios from 'axios';
import { getCsrfToken } from './csrfUtils'; // CSRFトークンを取得する関数
import { useAuth } from '../AuthContext'; // AuthContextから必要な関数を取得

// axiosインスタンスの作成
export const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
});

// Axiosのレスポンスインターセプターを設定
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { refreshToken, logout } = useAuth(); // AuthContextから関数を取得

    // 401エラーで、リフレッシュトークンを使用していない場合
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // リフレッシュトークンを使用してトークンを更新
        await refreshToken();

        // CSRFトークンを再取得
        const csrfToken = await getCsrfToken();
        originalRequest.headers['X-CSRF-Token'] = csrfToken;

        // 元のリクエストを再試行
        return apiClient(originalRequest);
      } catch (refreshError) {
        // リフレッシュトークンの更新に失敗した場合はログアウト
        await logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// getCsrfToken はここでエクスポートしていません
