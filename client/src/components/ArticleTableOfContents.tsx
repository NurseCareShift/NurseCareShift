import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articles } from '../articles';

interface Section {
  id: number;
  title: string;
  duration: string;
}

const ArticleTableOfContents: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [sections, setSections] = useState<Section[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [error, setError] = useState('');

  // 記事データから現在の記事を取得
  const article = articles.find((a) => a.slug === slug);

  useEffect(() => {
    if (!article) {
      setError('記事が見つかりませんでした。');
      return;
    }

    // スラグを使用してJSONファイルをフェッチ
    const fetchSections = async () => {
      try {
        const response = await fetch(`/data/${article.slug}.json`);
        if (!response.ok) {
          throw new Error('データを取得できませんでした。');
        }
        const data = await response.json();
        setSections(data);
      } catch (err) {
        setError('目次データを読み込めませんでした。');
      }
    };

    fetchSections();

    // ユーザーの進捗状況をロード
    const progress = getUserProgress(article.slug);
    setCompletedSections(progress);
  }, [article]);

  // ユーザーの進捗を取得する関数
  const getUserProgress = (articleSlug: string): number[] => {
    const completedSections: number[] = [];
    sections.forEach((section) => {
      const status = localStorage.getItem(`${articleSlug}-section${section.id}-status`);
      if (status === 'understood') {
        completedSections.push(section.id);
      }
    });
    return completedSections;
  };

  // 検索入力の変更ハンドラー
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // セクションをクリックしたときのハンドラー
  const handleSectionClick = (sectionId: number) => {
    navigate(`/articles/${slug}/sections/${sectionId}`);
  };

  // フィルター済みセクション
  const filteredSections = sections.filter((section) =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 py-6 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">{article?.title} の目次</h1>
        </div>
      </header>

      <main className="container mx-auto mt-10 px-4 lg:px-8">
        <div className="mb-6">
          <input
            type="text"
            placeholder="セクションを検索..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">セクション一覧</h2>
        <ul className="space-y-4">
          {filteredSections.map((section) => (
            <li
              key={section.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer flex justify-between items-center"
              onClick={() => handleSectionClick(section.id)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSectionClick(section.id);
                }
              }}
            >
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{section.title}</h3>
                <span className="text-gray-600">{section.duration}</span>
              </div>
              <div>
                {completedSections.includes(section.id) ? (
                  <svg
                    className="w-6 h-6 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-label="完了済み"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="text-gray-400">未完了</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </main>

      <footer className="bg-gray-800 py-6 mt-16">
        <div className="container mx-auto text-center text-white">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Nurse Learning Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ArticleTableOfContents;
