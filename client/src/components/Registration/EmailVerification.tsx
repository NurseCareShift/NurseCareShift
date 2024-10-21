// EmailVerification.tsx
import React, { useState } from 'react';

interface EmailVerificationProps {
  onNext: () => void; // 認証が成功したら次のステップへ進む
  email: string; // ユーザーのメールアドレス
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ onNext, email }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 確認コードのバリデーション関数
  const validateVerificationCode = (code: string): string | null => {
    return /^\d{6}$/.test(code) ? null : '6桁の確認コードを入力してください。';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーションチェック
    const validationError = validateVerificationCode(verificationCode);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // APIリクエストで確認コードを検証
      const response = await fetch('http://localhost:8000/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        // 認証成功
        onNext();
      } else {
        // サーバーからのエラーメッセージを表示
        setError(data.error || '確認コードが正しくありません。');
      }
    } catch (err) {
      setError('ネットワークエラーが発生しました。再度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-page flex justify-center items-center min-h-screen bg-blue-50 font-poppins">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">メール認証</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-gray-600 mb-4">
            <span className="font-semibold">{email}</span> に送信された6桁の確認コードを入力してください。
          </p>

          <input
            type="text"
            value={verificationCode}
            onChange={(e) => {
              setVerificationCode(e.target.value);
              setError(null); // エラーメッセージをクリア
            }}
            placeholder="確認コード"
            maxLength={6}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              error ? 'border-red-500' : ''
            }`}
            disabled={loading}
          />

          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-lg shadow-lg transition duration-300 mt-6 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? '認証中...' : '次へ'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerification;
