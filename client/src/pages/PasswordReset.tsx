import React, { useReducer, useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { validateEmail, validatePassword } from '../components/utils/validators';
import { getCsrfToken, apiClient } from '../components/utils/apiClient';
import axios from 'axios';

type Field = 'email' | 'token' | 'newPassword' | 'confirmNewPassword';

interface PasswordResetProps {
  onResetSuccess: () => void;
}

interface State {
  email: string;
  token: string;
  newPassword: string;
  confirmNewPassword: string;
  errors: {
    email?: string;
    token?: string;
    newPassword?: string[];
    confirmNewPassword?: string;
  };
}

type Action =
  | { type: 'SET_FIELD'; field: Field; value: string }
  | { type: 'SET_ERROR'; field: Field; error: string | string[] | null }
  | { type: 'CLEAR_ERRORS' };

const initialState: State = {
  email: '',
  token: '',
  newPassword: '',
  confirmNewPassword: '',
  errors: {},
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

const PasswordReset: React.FC<PasswordResetProps> = ({ onResetSuccess }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();

  // URLパラメータからemailとtokenを取得
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const email = params.get('email') || '';
    const token = params.get('token') || '';

    dispatch({ type: 'SET_FIELD', field: 'email', value: decodeURIComponent(email) });
    dispatch({ type: 'SET_FIELD', field: 'token', value: token });
  }, [location.search]);

  // 入力変更時の処理
  const handleChange = (field: Field) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch({ type: 'SET_FIELD', field, value });

    // リアルタイムバリデーション
    if (field === 'email') {
      const emailError = validateEmail(value) ?? null;
      dispatch({ type: 'SET_ERROR', field: 'email', error: emailError });
    }

    if (field === 'newPassword') {
      const passwordErrors = validatePassword(value);
      dispatch({
        type: 'SET_ERROR',
        field: 'newPassword',
        error: passwordErrors.length > 0 ? passwordErrors : null,
      });

      // パスワードと確認用パスワードの一致チェック
      if (state.confirmNewPassword) {
        const confirmPasswordError =
          value === state.confirmNewPassword ? null : 'パスワードが一致しません。';
        dispatch({
          type: 'SET_ERROR',
          field: 'confirmNewPassword',
          error: confirmPasswordError,
        });
      }
    }

    if (field === 'confirmNewPassword') {
      const confirmPasswordError =
        value === state.newPassword ? null : 'パスワードが一致しません。';
      dispatch({
        type: 'SET_ERROR',
        field: 'confirmNewPassword',
        error: confirmPasswordError,
      });
    }

    if (field === 'token') {
      if (!value) {
        dispatch({
          type: 'SET_ERROR',
          field: 'token',
          error: 'トークンを入力してください。',
        });
      } else {
        dispatch({ type: 'SET_ERROR', field: 'token', error: null });
      }
    }
  };

  // パスワードリセットの処理
  const handleResetPassword = async () => {
    // 全てのエラーをクリア
    dispatch({ type: 'CLEAR_ERRORS' });

    // 入力値の最終バリデーション
    const emailError = validateEmail(state.email);
    const passwordErrors = validatePassword(state.newPassword);
    const confirmPasswordError =
      state.newPassword === state.confirmNewPassword ? null : 'パスワードが一致しません。';
    const tokenError = state.token ? null : 'トークンを入力してください。';

    let hasError = false;

    if (emailError) {
      dispatch({ type: 'SET_ERROR', field: 'email', error: emailError });
      hasError = true;
    }
    if (passwordErrors.length > 0) {
      dispatch({
        type: 'SET_ERROR',
        field: 'newPassword',
        error: passwordErrors,
      });
      hasError = true;
    }
    if (confirmPasswordError) {
      dispatch({
        type: 'SET_ERROR',
        field: 'confirmNewPassword',
        error: confirmPasswordError,
      });
      hasError = true;
    }
    if (tokenError) {
      dispatch({ type: 'SET_ERROR', field: 'token', error: tokenError });
      hasError = true;
    }

    if (hasError) return;

    setIsSubmitting(true);

    try {
      const csrfToken = await getCsrfToken();

      // サーバーにリクエストを送信
      const response = await apiClient.post(
        '/auth/reset-password',
        {
          email: state.email,
          token: state.token,
          newPassword: state.newPassword,
        },
        {
          headers: {
            'X-CSRF-Token': csrfToken,
          },
        }
      );

      // リセット成功
      alert('パスワードがリセットされました。ログインしてください。');
      onResetSuccess();
    } catch (error) {
      console.error('パスワードリセットエラー:', error);
      if (axios.isAxiosError(error) && error.response) {
        const serverErrors =
          error.response.data.errors || [error.response.data.error] || ['パスワードリセットに失敗しました。'];
        alert(serverErrors.join('\n'));
      } else {
        alert('サーバーへの接続に失敗しました。');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="password-reset-page flex justify-center items-center min-h-screen bg-blue-50 font-poppins">
      <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
          パスワードリセット
        </h2>

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
            />
            {state.errors.email && (
              <p id="email-error" className="text-red-500 text-sm mt-1">
                {state.errors.email}
              </p>
            )}
          </div>

          {/* トークン */}
          <div>
            <label htmlFor="token" className="block text-gray-700 mb-2">
              リセットトークン
            </label>
            <input
              id="token"
              type="text"
              value={state.token}
              onChange={handleChange('token')}
              placeholder="メールで受け取ったトークンを入力"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                state.errors.token ? 'border-red-500' : ''
              }`}
              aria-invalid={!!state.errors.token}
              aria-describedby="token-error"
              required
            />
            {state.errors.token && (
              <p id="token-error" className="text-red-500 text-sm mt-1">
                {state.errors.token}
              </p>
            )}
          </div>

          {/* 新しいパスワード */}
          <div>
            <label htmlFor="newPassword" className="block text-gray-700 mb-2">
              新しいパスワード
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={state.newPassword}
                onChange={handleChange('newPassword')}
                placeholder="新しいパスワード"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  state.errors.newPassword ? 'border-red-500' : ''
                }`}
                aria-invalid={!!state.errors.newPassword}
                aria-describedby="new-password-error"
                required
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <FaEyeSlash className="text-gray-500" />
                ) : (
                  <FaEye className="text-gray-500" />
                )}
              </div>
            </div>
            {state.errors.newPassword && (
              <ul
                id="new-password-error"
                className="text-red-500 text-sm mt-1 list-disc pl-5"
              >
                {state.errors.newPassword.map((error, index) => (
                  <li key={index}>パスワードは{error}必要があります。</li>
                ))}
              </ul>
            )}
          </div>

          {/* パスワード確認 */}
          <div>
            <label
              htmlFor="confirmNewPassword"
              className="block text-gray-700 mb-2"
            >
              新しいパスワード（確認用）
            </label>
            <div className="relative">
              <input
                id="confirmNewPassword"
                type={showConfirmNewPassword ? 'text' : 'password'}
                value={state.confirmNewPassword}
                onChange={handleChange('confirmNewPassword')}
                placeholder="新しいパスワード（確認用）"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  state.errors.confirmNewPassword ? 'border-red-500' : ''
                }`}
                aria-invalid={!!state.errors.confirmNewPassword}
                aria-describedby="confirm-new-password-error"
                required
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() =>
                  setShowConfirmNewPassword(!showConfirmNewPassword)
                }
              >
                {showConfirmNewPassword ? (
                  <FaEyeSlash className="text-gray-500" />
                ) : (
                  <FaEye className="text-gray-500" />
                )}
              </div>
            </div>
            {state.errors.confirmNewPassword && (
              <p
                id="confirm-new-password-error"
                className="text-red-500 text-sm mt-1"
              >
                {state.errors.confirmNewPassword}
              </p>
            )}
          </div>

          {/* パスワードリセットボタン */}
          <button
            type="button"
            onClick={handleResetPassword}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-lg shadow-lg transition duration-300 mt-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'リセット中...' : 'パスワードをリセット'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
