import React, { useState, useRef } from 'react';

interface DobInputProps {
  onNext: (data: { birthdate: string; gender: string }) => void;
}

const DobInput: React.FC<DobInputProps> = ({ onNext }) => {
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('未公開');
  const [error, setError] = useState<string | null>(null);
  const dobInputRef = useRef<HTMLInputElement>(null);

  // 生年月日のバリデーション
  const validateDob = (dob: string): string | null => {
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD形式
    if (!dobRegex.test(dob)) {
      return '有効な生年月日を入力してください。';
    }

    // 将来の日付を拒否
    const selectedDate = new Date(dob);
    const today = new Date();
    if (selectedDate > today) {
      return '未来の日付は選択できません。';
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーションチェック
    const validationError = validateDob(dob);
    if (validationError) {
      setError(validationError);
      return;
    }

    // 生年月日と性別を次のステップに渡す
    onNext({ birthdate: dob, gender });
  };

  // 生年月日入力フィールドをクリックするとカレンダーを表示
  const handleDobClick = () => {
    if (dobInputRef.current) {
      dobInputRef.current.showPicker(); // ブラウザが対応している場合
      dobInputRef.current.focus();
    }
  };

  return (
    <div className="dob-page flex justify-center items-center min-h-screen bg-blue-50 font-poppins">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">生年月日と性別入力</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-gray-600 mb-4">あなたの生年月日と性別を入力してください。</p>

          {/* 生年月日入力フィールド */}
          <div>
            <label className="block text-gray-700 mb-2">生年月日</label>
            <input
              type="date"
              value={dob}
              ref={dobInputRef}
              onChange={(e) => {
                setDob(e.target.value);
                setError(null); // エラーメッセージをクリア
              }}
              onClick={handleDobClick}
              placeholder="生年月日"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer ${
                error ? 'border-red-500' : ''
              }`}
            />
          </div>

          {/* 性別選択フィールド */}
          <div>
            <label className="block text-gray-700 mb-2">性別</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="男"
                  checked={gender === '男'}
                  onChange={(e) => setGender(e.target.value)}
                  className="form-radio text-blue-500"
                />
                <span className="ml-2">男</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="女"
                  checked={gender === '女'}
                  onChange={(e) => setGender(e.target.value)}
                  className="form-radio text-pink-500"
                />
                <span className="ml-2">女</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="未公開"
                  checked={gender === '未公開'}
                  onChange={(e) => setGender(e.target.value)}
                  className="form-radio text-gray-500"
                />
                <span className="ml-2">未公開</span>
              </label>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-lg shadow-lg transition duration-300 mt-6"
          >
            次へ
          </button>
        </form>
      </div>
    </div>
  );
};

export default DobInput;
