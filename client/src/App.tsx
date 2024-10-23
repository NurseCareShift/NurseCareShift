import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UnderstoodArticles from './pages/UnderstoodArticles';
import ReviewArticles from './pages/ReviewArticles';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './components/AuthContext';
import Navbar from './components/Navbar';
import SuccessPage from './pages/SuccessPage';
import RegistrationPage from './pages/RegistrationPage';
import PasswordResetRequest from './pages/PasswordResetRequest';
import PasswordReset from './pages/PasswordReset';
import ProfileEdit from './components/AccountMenu/ProfileEdit';
import ChangeEmail from './components/AccountMenu/ChangeEmail';
import ChangePassword from './components/AccountMenu/ChangePassword';
import ArticleListPage from './pages/ArticleListPage';
import DeleteAccount from './components/AccountMenu/DeleteAccount';
import ArticleTableOfContents from './components/ArticleTableOfContents';
import ArticleSection from './components/ArticleSection';

// PasswordResetRequestWrapperコンポーネントを App コンポーネントの外側に移動
const PasswordResetRequestWrapper: React.FC = () => {
  const navigate = useNavigate();
  return (
    <PasswordResetRequest
      onRequestSuccess={() => {
        alert('パスワードリセットのメールを送信しました。メールを確認してください。');
        navigate('/login');
      }}
    />
  );
};

// PasswordResetWrapperコンポーネントを App コンポーネントの外側に移動
const PasswordResetWrapper: React.FC = () => {
  const navigate = useNavigate();
  return (
    <PasswordReset
      onResetSuccess={() => {
        alert('パスワードがリセットされました。ログインしてください。');
        navigate('/login');
      }}
    />
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div>
          <Navbar />
          <Routes>
            {/* ホームページとログイン・登録ページ */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register/*" element={<RegistrationPage />} />
            <Route path="/success" element={<SuccessPage />} />

            {/* パスワードリセット関連ページ */}
            <Route path="/password-reset-request" element={<PasswordResetRequestWrapper />} />
            <Route path="/password-reset" element={<PasswordResetWrapper />} />

            {/* 認証が必要なルート (ProtectedRoute) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/understood" element={<UnderstoodArticles />} />
              <Route path="/review" element={<ReviewArticles />} />
              <Route path="/article-list" element={<ArticleListPage />} />

              {/* アカウントメニュー関連のルート */}
              <Route path="/account/profile-edit" element={<ProfileEdit />} />
              <Route path="/account/change-email" element={<ChangeEmail />} />
              <Route path="/account/change-password" element={<ChangePassword />} />
              <Route path="/account/delete-account" element={<DeleteAccount />} />

              {/* 学習コンテンツのルート */}
              <Route path="/articles/:slug" element={<ArticleTableOfContents />} />
              <Route path="/articles/:slug/sections/:sectionId" element={<ArticleSection />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
