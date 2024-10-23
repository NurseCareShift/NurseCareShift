import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import ProfileSection from '../components/ProfileSection';
import { apiClient } from '../components/utils/apiClient';
import { articles } from '../articles';

const Dashboard: React.FC = () => {
  const [profile, setProfile] = useState<{ id: number; name: string } | null>(null);
  const [understoodCount, setUnderstoodCount] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setError('ログインが必要です');
      navigate('/login');
      return;
    }

    // プロフィール取得のAPIリクエスト
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/account/profile');
        setProfile(response.data);
      } catch (err: unknown) {
        console.error('プロフィール取得エラー:', err);
        setError('プロフィールの取得に失敗しました');
      }
    };

    // 進捗データの取得
    const fetchProgress = async () => {
      try {
        const response = await apiClient.get('/progress');
        const progresses = response.data.progresses;

        const understood = progresses.filter((p: any) => p.status === 'understood').length;
        const review = progresses.filter((p: any) => p.status === 'review').length;

        setUnderstoodCount(understood);
        setReviewCount(review);
      } catch (err) {
        console.error('進捗データの取得に失敗しました:', err);
      }
    };

    fetchProfile();
    fetchProgress();
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-blue-50 p-10">
      <div className="w-full max-w-6xl">
        <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center">ダッシュボード</h2>

        {/* ユーザープロフィールカード */}
        <div className="flex w-full space-x-6">
          {/* 左側: プロフィールセクション */}
          <div className="w-1/3">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {profile ? (
              <ProfileSection
                user={{ name: profile.name }}
                understoodCount={understoodCount}
                reviewCount={reviewCount}
              />
            ) : (
              !error && <p>プロフィールを読み込み中...</p>
            )}
            {/* 理解した記事一覧へのリンク */}
            <div className="mt-4">
              <Link to="/understood" className="text-blue-600 hover:underline">
                理解したコンテンツ一覧を見る
              </Link>
            </div>
            {/* 復習したい記事一覧へのリンク */}
            <div className="mt-2">
              <Link to="/review" className="text-blue-600 hover:underline">
                復習したいコンテンツ一覧を見る
              </Link>
            </div>
          </div>

          {/* 右側: 進捗状況のカード */}
          <div className="w-2/3 bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-700 text-center mb-6">進捗状況</h3>
            {/* 進捗状況の表示を実装 */}
          </div>
        </div>

        {/* カルーセル部分 */}
        <div className="mt-12 w-full">
          <Carousel
            showArrows={false}
            showThumbs={false}
            infiniteLoop
            centerMode
            centerSlidePercentage={20}
            autoPlay
            interval={3000}
            transitionTime={500}
          >
            {articles.map((article) => (
              <div key={article.slug} className="p-4">
                <Link
                  to={`/articles/${article.slug}`}
                  className="block bg-gray-200 p-6 rounded-lg shadow-md hover:bg-blue-200"
                >
                  <p className="text-xl font-semibold text-gray-700">{article.title}</p>
                </Link>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
