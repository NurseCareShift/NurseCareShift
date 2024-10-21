// InitialRegistration.tsx
import React, { useReducer, useState } from 'react';
import { FaGoogle, FaInstagram, FaApple, FaEye, FaEyeSlash } from 'react-icons/fa';
import { SiX } from 'react-icons/si';
// import { Link } from 'react-router-dom'; // 不要なインポートを削除

// CSRFトークンを取得する関数
const getCsrfToken = () => {
  const matches = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return matches ? decodeURIComponent(matches[1]) : '';
};

type Field = 'email' | 'password' | 'confirmPassword';

interface InitialRegistrationProps {
  onNext: (data: { email: string; password: string }) => void;
}

interface State {
  email: string;
  password: string;
  confirmPassword: string;
  errors: {
    email?: string;
    password?: string[];
    confirmPassword?: string;
  };
}

type Action =
  | { type: 'SET_FIELD'; field: Field; value: string }
  | { type: 'SET_ERROR'; field: Field; error: string | string[] | null }
  | { type: 'CLEAR_ERRORS' };

const initialState: State = {
  email: '',
  password: '',
  confirmPassword: '',
  errors: {},
};

// バリデーション関数
const validateEmail = (email: string): string | null => {
  const emailRegex =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email) ? null : '有効なメールアドレスを入力してください。';
};

const validatePassword = (password: string): string[] => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('8文字以上');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('大文字を含める');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('小文字を含める');
  }
  if (!/\d/.test(password)) {
    errors.push('数字を含める');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('特殊文字を含める');
  }

  return errors;
};

// Reducer関数
function formReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error },
      };
    case 'CLEAR_ERRORS':
      return { ...state, errors: {} };
    default:
      return state;
  }
}

const InitialRegistration: React.FC<InitialRegistrationProps> = ({ onNext }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 入力変更時の処理
  const handleChange = (field: Field) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch({ type: 'SET_FIELD', field, value });

    // リアルタイムバリデーション
    if (field === 'email') {
      const emailError = validateEmail(value);
      dispatch({ type: 'SET_ERROR', field: 'email', error: emailError });
    }

    if (field === 'password') {
      const passwordErrors = validatePassword(value);
      dispatch({
        type: 'SET_ERROR',
        field: 'password',
        error: passwordErrors.length > 0 ? passwordErrors : null,
      });

      // パスワードと確認用パスワードの一致チェック
      if (state.confirmPassword) {
        const confirmPasswordError =
          value === state.confirmPassword ? null : 'パスワードが一致しません。';
        dispatch({ type: 'SET_ERROR', field: 'confirmPassword', error: confirmPasswordError });
      }
    }

    if (field === 'confirmPassword') {
      const confirmPasswordError =
        value === state.password ? null : 'パスワードが一致しません。';
      dispatch({ type: 'SET_ERROR', field: 'confirmPassword', error: confirmPasswordError });
    }
  };

  // 登録ボタンの処理
  const handleRegister = async () => {
    // 全てのエラーをクリア
    dispatch({ type: 'CLEAR_ERRORS' });

    // 入力値の最終バリデーション
    const emailError = validateEmail(state.email);
    const passwordErrors = validatePassword(state.password);
    const confirmPasswordError =
      state.password === state.confirmPassword ? null : 'パスワードが一致しません。';

    let hasError = false;

    if (emailError) {
      dispatch({ type: 'SET_ERROR', field: 'email', error: emailError });
      hasError = true;
    }
    if (passwordErrors.length > 0) {
      dispatch({ type: 'SET_ERROR', field: 'password', error: passwordErrors });
      hasError = true;
    }
    if (confirmPasswordError) {
      dispatch({ type: 'SET_ERROR', field: 'confirmPassword', error: confirmPasswordError });
      hasError = true;
    }

    if (hasError) return;

    setIsSubmitting(true);

    try {
      // CSRFトークンを取得
      const csrfToken = getCsrfToken();

      // サーバーにユーザー情報を送信
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
          email: state.email,
          password: state.password,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        const serverErrors = data.errors || [data.error] || ['登録に失敗しました。'];
        alert(serverErrors.join('\n'));
        setIsSubmitting(false);
        return;
      }

      // 登録成功の場合、次のステップへ
      onNext({ email: state.email, password: state.password });
    } catch (error) {
      console.error('登録エラー:', error);
      alert('サーバーへの接続に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  // OAuthログイン処理（必要に応じてエンドポイントを修正）
  const handleOAuthLogin = (provider: string) => {
    window.location.href = `http://localhost:8000/auth/${provider}`;
  };

  return (
    <div className="register-page flex justify-center items-center min-h-screen bg-blue-50 font-poppins">
      <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">アカウント登録</h2>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* メールアドレス */}
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={state.email}
              onChange={handleChange('email')}
              placeholder="メールアドレス"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                state.errors.email ? 'border-red-500' : ''
              }`}
              aria-invalid={!!state.errors.email}
              aria-describedby="email-error"
              required
              pattern="^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
            />
            {state.errors.email && (
              <p id="email-error" className="text-red-500 text-sm mt-1">
                {state.errors.email}
              </p>
            )}
          </div>

          {/* パスワード */}
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">
              パスワード
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={state.password}
                onChange={handleChange('password')}
                placeholder="パスワード"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  state.errors.password ? 'border-red-500' : ''
                }`}
                aria-invalid={!!state.errors.password}
                aria-describedby="password-error"
                required
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-500" />
                ) : (
                  <FaEye className="text-gray-500" />
                )}
              </div>
            </div>
            {state.errors.password && (
              <ul id="password-error" className="text-red-500 text-sm mt-1 list-disc pl-5">
                {state.errors.password.map((error, index) => (
                  <li key={index}>パスワードは{error}必要があります。</li>
                ))}
              </ul>
            )}
          </div>

          {/* パスワード確認 */}
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
              パスワード（確認用）
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={state.confirmPassword}
                onChange={handleChange('confirmPassword')}
                placeholder="パスワード（確認用）"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  state.errors.confirmPassword ? 'border-red-500' : ''
                }`}
                aria-invalid={!!state.errors.confirmPassword}
                aria-describedby="confirm-password-error"
                required
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className="text-gray-500" />
                ) : (
                  <FaEye className="text-gray-500" />
                )}
              </div>
            </div>
            {state.errors.confirmPassword && (
              <p id="confirm-password-error" className="text-red-500 text-sm mt-1">
                {state.errors.confirmPassword}
              </p>
            )}
          </div>

          {/* SNSアカウント連携 */}
          <div className="flex justify-center space-x-6 mt-6">
            <FaGoogle
              className="text-red-500 text-4xl cursor-pointer"
              onClick={() => handleOAuthLogin('google')}
              aria-label="Googleでログイン"
            />
            <SiX
              className="text-black text-4xl cursor-pointer"
              onClick={() => handleOAuthLogin('x')}
              aria-label="X（Twitter）でログイン"
            />
            <FaInstagram
              className="text-pink-500 text-4xl cursor-pointer"
              onClick={() => handleOAuthLogin('instagram')}
              aria-label="Instagramでログイン"
            />
            <FaApple
              className="text-black text-4xl cursor-pointer"
              onClick={() => handleOAuthLogin('apple')}
              aria-label="Appleでログイン"
            />
          </div>

          {/* 登録ボタン */}
          <button
            type="button"
            onClick={handleRegister}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-lg shadow-lg transition duration-300 mt-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? '登録中...' : 'メールアドレスで登録'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InitialRegistration;
