import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    // ダッシュボードにリダイレクトする前に、必要なリクエストを送信する
    fetch('/api/protected-route', {
      method: 'GET',
      credentials: 'include', // HttpOnlyクッキーを送信
    })
      .then((response) => {
        if (response.ok) {
          // ダッシュボードに遷移する
          navigate('/dashboard'); // ダッシュボードへのルートを指定
        } else {
          // エラーハンドリング（例：ログインページにリダイレクトする）
          navigate('/login');
        }
      })
      .catch(() => {
        // リクエストエラー時の処理
        navigate('/login');
      });
  };

  return (
    <div className="success-page flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 font-poppins">
      <div className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-2xl text-center">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6" />
        <h2 className="text-4xl font-bold mb-4 text-blue-700">登録が完了しました！</h2>
        <p className="text-gray-700 mb-8">
          アカウントの登録が正常に完了しました。ご利用いただきありがとうございます。
        </p>
        <button
          type="button"
          onClick={handleGoToDashboard}
          className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-full shadow-lg transition duration-300"
        >
          ダッシュボードに進む
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
