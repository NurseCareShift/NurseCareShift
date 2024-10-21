import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ConfirmationProps {
  formData: {
    email: string;
    username: string;
    userId: string;
    birthdate: string;
    gender: string;
    isStudent: boolean;
    departments: string[];
    otherDepartment?: string;
    experienceYears: { [key: string]: string };
    certifiedNurseDetails: string[];
    specialistNurseDetails: string[];
    advancedNurseDetails: string[];
    notificationSettings: {
      emailNotifications: boolean;
      lineNotification: boolean;
    };
  };
  onBack: () => void;
}

const ConfirmationPage: React.FC<ConfirmationProps> = ({ formData, onBack }) => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    // 本来はここでサーバーにデータを送信する処理が行われる
    console.log('アカウント情報:', formData);

    // サーバーからの成功レスポンスを想定して、登録完了後にサクセスページへ遷移
    navigate('/success');
  };

  return (
    <div className="confirmation-page flex justify-center items-center min-h-screen bg-gray-50 font-poppins">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-4xl font-bold mb-8 text-center text-blue-700">
          登録内容の確認
        </h2>

        <div className="space-y-8">
          {/* アカウント情報の確認 */}
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4 text-blue-600">
              アカウント情報
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p>
                <strong>メールアドレス:</strong> {formData.email}
              </p>
              <p>
                <strong>アカウント名:</strong> {formData.username}
              </p>
              <p>
                <strong>ユーザーID:</strong> {formData.userId}
              </p>
              <p>
                <strong>生年月日:</strong> {formData.birthdate}
              </p>
              <p>
                <strong>性別:</strong> {formData.gender}
              </p>
            </div>
          </div>

          {/* 職務情報の確認 */}
          {!formData.isStudent && (
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4 text-blue-600">
                職務情報
              </h3>
              <div className="space-y-4">
                <p>
                  <strong>診療科:</strong> {formData.departments.join(', ')}
                </p>
                {formData.otherDepartment && (
                  <p>
                    <strong>その他の診療科:</strong> {formData.otherDepartment}
                  </p>
                )}
                <div>
                  <h4 className="font-semibold mb-2">経験年数:</h4>
                  <ul className="list-disc list-inside">
                    {formData.departments.map((department) => (
                      <li key={department}>
                        <strong>{department}:</strong>{' '}
                        {formData.experienceYears[department]}
                      </li>
                    ))}
                  </ul>
                </div>
                <p>
                  <strong>認定看護師資格:</strong>{' '}
                  {formData.certifiedNurseDetails.length > 0
                    ? formData.certifiedNurseDetails.join(', ')
                    : 'なし'}
                </p>
                <p>
                  <strong>専門看護師資格:</strong>{' '}
                  {formData.specialistNurseDetails.length > 0
                    ? formData.specialistNurseDetails.join(', ')
                    : 'なし'}
                </p>
                <p>
                  <strong>特定行為看護師資格:</strong>{' '}
                  {formData.advancedNurseDetails.length > 0
                    ? formData.advancedNurseDetails.join(', ')
                    : 'なし'}
                </p>
              </div>
            </div>
          )}

          {/* 通知設定の確認 */}
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4 text-blue-600">
              通知設定
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p>
                <strong>メール通知:</strong>{' '}
                {formData.notificationSettings.emailNotifications
                  ? '受け取る'
                  : '受け取らない'}
              </p>
              <p>
                <strong>LINE通知:</strong>{' '}
                {formData.notificationSettings.lineNotification
                  ? '受け取る'
                  : '受け取らない'}
              </p>
            </div>
          </div>

          {/* ボタン */}
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={onBack}
              className="bg-gray-300 text-gray-700 py-3 px-6 rounded-lg shadow-lg hover:bg-gray-400 transition duration-300"
            >
              戻る
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
            >
              登録
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
