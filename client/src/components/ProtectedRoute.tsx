// ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute: React.FC = () => {
  const { user } = useAuth();

  // ユーザーが未認証の場合はログインページへリダイレクト
  if (!user) {
    return <Navigate to="/login" />;
  }

  // ユーザーが認証されている場合は保護されたコンテンツを表示
  return <Outlet />;
};

export default ProtectedRoute;
