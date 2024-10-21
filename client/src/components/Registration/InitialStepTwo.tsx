// InitialStepTwo.tsx
import React, { useState } from 'react';

interface InitialStepTwoProps {
  onNext: (data: { username: string; userId: string }, nextPath?: string) => void;
}

const InitialStepTwo: React.FC<InitialStepTwoProps> = ({ onNext }) => {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [errors, setErrors] = useState<{ username?: string; userId?: string }>({});

  // バリデーション関数
  const validateUsername = (value: string): string | null => {
    return value ? null : 'アカウント名を入力してください。';
  };

  const validateUserId = (value: string): string | null => {
    return value ? null : 'アカウントIDを入力してください。';
  };

  const handleNextStep = () => {
    // エラーをクリア
    setErrors({});

    // バリデーション
    const usernameError = validateUsername(username);
    const userIdError = validateUserId(userId);

    if (usernameError || userIdError) {
      setErrors({
        username: usernameError || undefined,
        userId: userIdError || undefined,
      });
      return;
    }

    // 次のステップへ進む
    onNext({ username, userId }, 'dob-input');
  };

  return (
    <div className="register-page flex justify-center items-center min-h-screen bg-blue-50 font-poppins">
      <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
          アカウント登録 - Step 2
        </h2>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* アカウント名 */}
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="アカウント名"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.username ? 'border-red-500' : ''
              }`}
              aria-invalid={!!errors.username}
              aria-describedby="username-error"
            />
            {errors.username && (
              <p id="username-error" className="text-red-500 text-sm mt-1">
                {errors.username}
              </p>
            )}
          </div>

          {/* アカウントID */}
          <div>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="アカウントID"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.userId ? 'border-red-500' : ''
              }`}
              aria-invalid={!!errors.userId}
              aria-describedby="userId-error"
            />
            {errors.userId && (
              <p id="userId-error" className="text-red-500 text-sm mt-1">
                {errors.userId}
              </p>
            )}
          </div>

          {/* 次へボタン */}
          <button
            type="button"
            onClick={handleNextStep}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-lg shadow-lg transition duration-300 mt-6"
          >
            次へ
          </button>
        </form>
      </div>
    </div>
  );
};

export default InitialStepTwo;
