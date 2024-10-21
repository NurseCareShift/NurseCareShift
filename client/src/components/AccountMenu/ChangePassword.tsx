import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

const ChangePassword: React.FC = () => {
  const { user, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // 新しいパスワードと確認用パスワードの一致をチェック
    if (newPassword !== confirmPassword) {
      setError('新しいパスワードが一致しません。');
      return;
    }

    try {
      const response = await fetch('/api/account/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: 'include', // クッキーを送信
      });

      if (response.ok) {
        setSuccess('パスワードが変更されました。');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');

        // 他のデバイスからのログアウト処理
        await logout();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'パスワード変更に失敗しました。');
      }
    } catch (error) {
      setError('サーバーエラーが発生しました。');
    }
  };

  return (
    <div>
      <h2>パスワード変更</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>現在のパスワード:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>新しいパスワード:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>新しいパスワード（確認）:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">パスワードを変更</button>
      </form>
    </div>
  );
};

export default ChangePassword;
