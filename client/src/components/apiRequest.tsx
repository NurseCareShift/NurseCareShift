import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// axiosインスタンスの作成
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true, // クッキーを含むリクエストを送信するための設定
});

// ユーザーの型定義
interface User {
  id: number;
  email: string;
  name?: string;
  bio?: string;
  profileImage?: string;
}

// AuthContext の型定義
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  refreshToken: () => Promise<string>;
  isLoading: boolean;
}

// AuthContext の作成
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// useAuth カスタムフックを作成して、AuthContext にアクセスしやすくする
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth は AuthProvider の内部で使用する必要があります。');
  }
  return context;
};

// AuthProvider コンポーネント
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // ローディング状態を管理

  // ユーザー情報を取得する関数
  const fetchUser = async () => {
    try {
      const response = await apiClient.get('/user'); // ユーザー情報を取得するAPI
      setUser(response.data);
      setToken('authenticated'); // 認証済み状態に設定
    } catch (error) {
      setUser(null); // エラーハンドリング
      setToken(null);
    } finally {
      setIsLoading(false); // ロード完了
    }
  };

  useEffect(() => {
    fetchUser(); // コンポーネントがマウントされた時にユーザー情報を取得
  }, []);

  // ログイン処理
  const login = async (email: string, password: string) => {
    try {
      await apiClient.post('/login', { email, password });
      await fetchUser(); // ログイン成功後にユーザー情報を再取得
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'ログインに失敗しました');
      } else {
        throw new Error('通信エラーが発生しました');
      }
    }
  };

  // ログアウト処理
  const logout = async () => {
    await apiClient.post('/logout');
    setUser(null); // ユーザー状態をクリア
    setToken(null); // トークンもクリア
  };

  // プロフィール更新
  const updateProfile = async (data: any) => {
    await apiClient.put('/account/profile', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    await fetchUser(); // 更新後にユーザー情報を再取得
  };

  // 新しいトークンを取得する関数
  const refreshToken = async (): Promise<string> => {
    const response = await apiClient.post('/refresh-token');
    const { accessToken } = response.data;
    setToken(accessToken); // 新しいアクセストークンを設定
    return accessToken;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateProfile, refreshToken, isLoading }}>
      {!isLoading && children} {/* ローディング中は children を表示しない */}
    </AuthContext.Provider>
  );
};
