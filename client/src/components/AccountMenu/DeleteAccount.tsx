import React, { useState } from 'react';
import { useAuth } from '../AuthContext'; // カスタムフックからログイン情報を取得
import { useNavigate } from 'react-router-dom';

const DeleteAccount: React.FC = () => {
  const { user, logout } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8000/api/account/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
        credentials: 'include', // クッキーを送信
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'アカウント削除に失敗しました。');
        setIsSubmitting(false);
        return;
      }

      // アカウント削除成功後、ログアウト処理を行い、ホーム画面へリダイレクト
      await logout();
      navigate('/');
      alert('アカウントが削除されました。');
    } catch (err) {
      console.error('アカウント削除エラー:', err);
      setError('サーバーへの接続に失敗しました。');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="delete-account-page">
      <h2 className="text-2xl font-bold mb-6">アカウント削除</h2>
      {error && <p className="text-red-500">{error}</p>}
      <p className="mb-4">アカウントを削除するには、パスワードを入力してください。</p>
      <form onSubmit={handleDeleteAccount}>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-2">パスワード</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-red-500 text-white py-2 px-4 rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? '削除中...' : 'アカウントを削除'}
        </button>
      </form>
    </div>
  );
};

export default DeleteAccount;
