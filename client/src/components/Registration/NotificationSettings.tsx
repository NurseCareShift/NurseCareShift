import React, { useState } from 'react';

interface NotificationSettingsProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onNext, onBack }) => {
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [lineNotification, setLineNotification] = useState(false);
  const [agreed, setAgreed] = useState(false); // 利用規約の同意状態

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const notificationSettings = {
      emailNotifications,
      lineNotification,
    };
    console.log('通知設定:', notificationSettings);

    // データを onNext 関数で送信し、次のステップへ進む
    onNext({ notificationSettings });
  };

  return (
    <div className="notification-settings-page flex justify-center items-center min-h-screen bg-blue-50 font-poppins">
      <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">通知設定と利用規約</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* メール通知 */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={() => setEmailNotifications(!emailNotifications)}
                className="mr-2 h-5 w-5 text-blue-600"
              />
              <span className="text-lg">メールで通知を受け取る</span>
            </label>
          </div>

          {/* LINE通知 */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={lineNotification}
                onChange={() => setLineNotification(!lineNotification)}
                className="mr-2 h-5 w-5 text-blue-600"
              />
              <span className="text-lg">LINEで通知を受け取る</span>
            </label>
          </div>

          {/* 利用規約・同意書 */}
          <div className="mb-4">
            <h3 className="font-bold text-gray-700">利用規約・同意書</h3>
            <div className="overflow-y-scroll h-48 p-4 border border-gray-300 rounded">
              {/* 仮の利用規約テキスト */}
              <p>
                本利用規約（以下、「本規約」といいます。）は、本サービスの利用条件を定めるものです。
                ユーザーの皆様には、本規約に従って本サービスをご利用いただきます。

                第1条（適用）
                本規約は、ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されるものとします。

                第2条（利用登録）
                登録希望者が当社の定める方法によって利用登録を申請し、当社がこれを承認することによって、利用登録が完了するものとします。

                第3条（禁止事項）
                ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。
                ・法令または公序良俗に違反する行為
                ・犯罪行為に関連する行為
                ・その他、当社が不適切と判断する行為

                第4条（免責事項）
                当社の債務不履行責任は、当社の故意または重過失によらない場合には免責されるものとします。

                （以下、続く）
              </p>
            </div>
            <label className="flex items-center mt-4">
              <input
                type="checkbox"
                checked={agreed}
                onChange={() => setAgreed(!agreed)}
                className="mr-2 h-5 w-5 text-blue-600"
              />
              <span className="text-lg">利用規約を読み、同意しました</span>
            </label>
          </div>

          {/* ボタン */}
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={onBack}
              className="bg-gray-300 text-gray-700 py-3 px-4 rounded-lg shadow-lg"
            >
              戻る
            </button>
            <button
              type="submit"
              disabled={!agreed}
              className={`py-3 px-4 rounded-lg shadow-lg transition duration-300 ${
                agreed
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              確認へ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationSettings;
