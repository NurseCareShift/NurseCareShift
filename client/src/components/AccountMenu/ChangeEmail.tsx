import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

const ChangeEmail: React.FC = () => {
  const { user, updateEmail } = useAuth(); // updateEmail 関数を使用
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      // サーバーに新しいメールアドレスと現在のパスワードを送信
      await updateEmail(newEmail, currentPassword);
      setSuccessMessage('メールアドレスを更新しました。確認メールをご確認ください。');
    } catch (err: any) {
      setError(err.message || 'メールアドレスの更新に失敗しました。');
    }
  };

  return (
    <div className="change-email-page">
      <h2>メールアドレスの変更</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {error && <p className="error-message">{error}</p>}
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
          <label>新しいメールアドレス:</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">変更</button>
      </form>
    </div>
  );
};

export default ChangeEmail;
