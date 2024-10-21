// src/components/LogoutButton.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // AuthContextを使うためにインポート

const LogoutButton: React.FC = () => {
  const { logout } = useAuth(); // AuthContextからlogout関数を取得
  const navigate = useNavigate(); // ログアウト後にリダイレクトするためのナビゲートフック

  const handleLogout = () => {
    logout(); // ログアウト処理
    navigate('/login'); // ログインページにリダイレクト
  };

  return (
    <button
      onClick={handleLogout}
      className=" hover:bg-blue-600 text-white font-bold py-2 px-5 mx-3 rounded"
    >
      ログアウト
    </button>
  );
};

export default LogoutButton;
