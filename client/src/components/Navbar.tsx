import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../styles/navbar.css';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          NurseCareShift
        </Link>
      </div>

      <div className="navbar-right">
        {user ? (
          <div className="dropdown">
            <img
              src={user.profileImage || '/default-avatar.png'}
              alt="Profile"
              className="profile-image"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-haspopup="true"
              aria-expanded={menuOpen}
            />
            {menuOpen && (
              <div className="dropdown-menu" role="menu">
                <Link to="/dashboard" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                  ダッシュボード
                </Link>
                <Link to="/post-article" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                  記事投稿
                </Link>
                <Link to="/article-list" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                  記事一覧
                </Link>
                <Link to="/account/profile-edit" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                  プロフィール編集
                </Link>
                <Link to="/account/change-email" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                  メールアドレスの変更
                </Link>
                <Link to="/account/change-password" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                  パスワードの変更
                </Link>
                <button onClick={handleLogout} className="dropdown-item">
                  ログアウト
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="auth-link">
              ログイン
            </Link>
            <Link to="/register" className="auth-link">
              登録
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
