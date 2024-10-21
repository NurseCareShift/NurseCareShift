import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { getCsrfToken, apiClient } from '../components/utils/apiClient';

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
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  updateEmail: (newEmail: string, currentPassword: string) => Promise<void>;
  refreshToken: () => Promise<void>;
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
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
  
    // ユーザー情報を取得する関数
    const fetchUser = async () => {
      try {
        const csrfToken = await getCsrfToken();
  
        const response = await apiClient.get('/user', {
          headers: {
            'X-CSRF-Token': csrfToken,
          },
        });
  
        setUser(response.data);
      } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            // ユーザーが未認証の場合
            setUser(null);
          } else {
            console.error('Fetch user failed:', error);
          }
      } finally {
          setIsLoading(false);
      }
    };

  useEffect(() => {
    fetchUser();
  }, []);

  // ログイン処理
  const login = async (email: string, password: string) => {
    try {
      const csrfToken = await getCsrfToken();

      await apiClient.post(
        '/auth/login',
        { email, password },
        {
          headers: {
            'X-CSRF-Token': csrfToken,
          },
        }
      );

      // ログイン後にユーザー情報を取得
      await fetchUser();
    } catch (error) {
      console.error('Login error:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error || 'ログインに失敗しました');
      } else {
        throw new Error('通信エラーが発生しました');
      }
    }
  };

  // ログアウト処理
  const logout = async () => {
    try {
      const csrfToken = await getCsrfToken();

      await apiClient.post(
        '/auth/logout',
        null,
        {
          headers: {
            'X-CSRF-Token': csrfToken,
          },
        }
      );

      setUser(null);
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  // プロフィール更新
  const updateProfile = async (data: any) => {
    try {
      const csrfToken = await getCsrfToken();
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('bio', data.bio);
      if (data.profileImage) {
        formData.append('profileImage', data.profileImage);
      }
      await apiClient.put('/account/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRF-Token': csrfToken,
        },
      });
      await fetchUser();
    } catch (error) {
      console.error('プロフィール更新エラー:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error || 'プロフィールの更新に失敗しました');
      } else {
        throw new Error('通信エラーが発生しました');
      }
    }
  };

  // メールアドレス更新関数
  const updateEmail = async (newEmail: string, currentPassword: string) => {
    try {
      const csrfToken = await getCsrfToken();
      await apiClient.put(
        '/account/change-email',
        { newEmail, currentPassword },
        {
          headers: {
            'X-CSRF-Token': csrfToken,
          },
        }
      );
      if (user) {
        setUser({ ...user, email: newEmail });
      }
    } catch (error) {
      console.error('メールアドレス更新エラー:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error || 'メールアドレスの更新に失敗しました');
      } else {
        throw new Error('通信エラーが発生しました');
      }
    }
  };

  // トークンのリフレッシュ
  const refreshToken = async () => {
    try {
      const csrfToken = await getCsrfToken();
      await apiClient.post(
        '/auth/refresh-token',
        null,
        {
          headers: {
            'X-CSRF-Token': csrfToken,
          },
        }
      );
    } catch (error) {
      console.error('トークンのリフレッシュに失敗しました:', error);
      setUser(null);
      throw new Error('トークンのリフレッシュに失敗しました');
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, updateProfile, refreshToken, updateEmail, isLoading }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
