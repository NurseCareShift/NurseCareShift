// RegistrationPage.tsx
import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import InitialRegistration from '../components/Registration/InitialRegistration';
import EmailVerification from '../components/Registration/EmailVerification';
import InitialStepTwo from '../components/Registration/InitialStepTwo';
import DobInput from '../components/Registration/DobInput';
import JobInfoInput from '../components/Registration/JobInfoInput';
import NotificationSettings from '../components/Registration/NotificationSettings';
import ConfirmationPage from '../components/Registration/ConfirmationPage';
import PasswordReset from './PasswordReset';
import PasswordResetRequest from './PasswordResetRequest';

interface RegistrationPageProps {
  children?: React.ReactNode;
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({ children }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    userId: '',
    birthdate: '',
    gender: '',
    isStudent: false,
    departments: [] as string[],
    otherDepartment: '',
    experienceYears: {} as { [key: string]: string },
    certifiedNurseDetails: [] as string[],
    specialistNurseDetails: [] as string[],
    advancedNurseDetails: [] as string[],
    notificationSettings: {
      emailNotifications: false,
      lineNotification: false,
    },
    verificationCode: '',
  });

  const navigate = useNavigate();

  // ステップ進行を管理する関数
  const handleNext = (data?: any, nextPath?: string) => {
    if (data) {
      setFormData((prevData) => ({ ...prevData, ...data }));
    }
    if (nextPath) {
      navigate(nextPath);
    } else {
      navigate('step2');
    }
  };

  // ステップを戻る関数
  const handleBack = () => {
    navigate(-1);
  };

  // パスワードリセット成功時の処理
  const handleResetSuccess = () => {
    navigate('/login');
  };

  // パスワードリセットリクエスト成功時の処理
  const handleResetRequestSuccess = () => {
    alert('パスワードリセットのメールを送信しました。メールを確認してください。');
    navigate('/login');
  };

  return (
    <div>
      {children ? (
        // 子コンポーネントが提供された場合はそれを表示
        children
      ) : (
        // そうでない場合は登録ページのルーティングを表示
        <Routes>
          <Route path="/" element={<InitialRegistration onNext={handleNext} />} />
          <Route
            path="email-verification"
            element={
              <EmailVerification onNext={handleNext} email={formData.email} />
            }
          />
          <Route
            path="initial-step-two"
            element={<InitialStepTwo onNext={handleNext} />}
          />
          <Route path="dob-input" element={<DobInput onNext={handleNext} />} />
          <Route path="job-info" element={<JobInfoInput onNext={handleNext} />} />
          <Route
            path="notification-settings"
            element={
              <NotificationSettings onNext={handleNext} onBack={handleBack} />
            }
          />
          <Route
            path="confirmation"
            element={
              <ConfirmationPage onBack={handleBack} formData={formData} />
            }
          />
          {/* パスワードリセット関連ページ */}
          <Route
            path="password-reset-request"
            element={
              <PasswordResetRequest
                onRequestSuccess={handleResetRequestSuccess}
              />
            }
          />
          <Route
            path="password-reset"
            element={<PasswordReset onResetSuccess={handleResetSuccess} />}
          />
          {/* その他のルート */}
          <Route path="*" element={<InitialRegistration onNext={handleNext} />} />
        </Routes>
      )}
    </div>
  );
};

export default RegistrationPage;
