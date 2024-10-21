import React from 'react';
import { useNavigate } from 'react-router-dom';

// 看護学習項目のダミーデータ
const articles = [
    { id: 1, title: 'バイタルサイン', description: 'バイタルサインの測定と評価方法を学びます。', category: '基礎', imageUrl: 'https://via.placeholder.com/600x400' },
    { id: 2, title: '身体初見', description: '看護の基本的な技術と知識を学びます。', category: '基礎', imageUrl: 'https://via.placeholder.com/600x400' },
    { id: 3, title: '輸液療法', description: '感染予防と対策について学びます。', category: '基礎', imageUrl: 'https://via.placeholder.com/600x400' },
    { id: 4, title: '酸素療法1', description: '傷のケアと包帯の巻き方を習得します。', category: '基礎', imageUrl: 'https://via.placeholder.com/600x400' },
    { id: 5, title: '心電図１', description: '急性期患者への対応方法を学びます。', category: '基礎', imageUrl: 'https://via.placeholder.com/600x400' },
    { id: 6, title: '皮膚異常', description: '集中治療室での看護技術を学びます。', category: '中級', imageUrl: 'https://via.placeholder.com/600x400' },
    { id: 7, title: '心電図２', description: '患者との効果的なコミュニケーション方法を学びます。', category: '中級', imageUrl: 'https://via.placeholder.com/600x400' },
    { id: 8, title: '酸素療法２', description: '患者の家族を支援する方法を学びます。', category: '中級', imageUrl: 'https://via.placeholder.com/600x400' },
    { id: 9, title: '検査値', description: '他職種との連携方法を学びます。', category: '中級', imageUrl: 'https://via.placeholder.com/600x400' },
    { id: 10, title: '脳神経', description: '他職種との連携方法を学びます。', category: '臓器別疾患', imageUrl: 'https://via.placeholder.com/600x400' },
    { id: 11, title: '心臓血管', description: '他職種との連携方法を学びます。', category: '臓器別疾患', imageUrl: 'https://via.placeholder.com/600x400' },
    { id: 12, title: '食道・胃・腸', description: '他職種との連携方法を学びます。', category: '臓器別疾患', imageUrl: 'https://via.placeholder.com/600x400' },
    { id: 13, title: '胆嚢・肝臓・膵臓', description: '他職種との連携方法を学びます。', category: '臓器別疾患', imageUrl: 'https://via.placeholder.com/600x400' },
    { id: 14, title: '肺', description: '他職種との連携方法を学びます。', category: '臓器別疾患', imageUrl: 'https://via.placeholder.com/600x400' },
    { id: 15, title: '腎臓', description: '他職種との連携方法を学びます。', category: '臓器別疾患', imageUrl: 'https://via.placeholder.com/600x400' },
    { id: 16, title: '筋・骨格', description: '他職種との連携方法を学びます。', category: '臓器別疾患', imageUrl: 'https://via.placeholder.com/600x400' },
    { id: 17, title: '皮膚', description: '他職種との連携方法を学びます。', category: '臓器別疾患', imageUrl: 'https://via.placeholder.com/600x400' },
];

const categories = ['基礎', '中級', '臓器別疾患'];

const LearningSite: React.FC = () => {
  const navigate = useNavigate();

  // カードクリック時のナビゲーション
  const handleCardClick = (id: number) => {
    navigate(`/articles/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 py-6 text-white shadow-lg">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-extrabold">Nurse Learning Platform</h1>
          <p className="mt-3 text-lg opacity-80">看護の専門知識を学びましょう！</p>
        </div>
      </header>

      <main className="container mx-auto mt-16 px-4 lg:px-8">
        {/* 各カテゴリごとにセクションを表示 */}
        {categories.map((category) => (
          <section id={category} key={category} className="mb-20">
            <h2 className="text-4xl font-bold mb-10 text-gray-800">{category}の学習</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {articles.filter(article => article.category === category).map((article) => (
                <div
                  key={article.id}
                  className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer rounded-lg overflow-hidden"
                  onClick={() => handleCardClick(article.id)}
                >
                  {/* カード上部画像：カードの半分を占める */}
                  <div className="h-48 w-full overflow-hidden">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      style={{ margin: '0px auto', borderRadius: '0px' }} // 余白なし、ボーダーなし
                    />
                  </div>
                  {/* カード下部のテキストコンテンツ */}
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-3 text-gray-900">{article.title}</h3>
                    <p className="text-gray-600 text-base leading-relaxed">{article.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* 右端に固定ナビゲーションメニュー */}
      <div className="fixed top-32 right-10 hidden lg:block">
        <nav className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-gray-800">カテゴリー</h3>
          <ul className="space-y-4">
            {categories.map((category) => (
              <li key={category}>
                <a
                  href={`#${category}`}
                  className="text-blue-700 hover:underline"
                >
                  {category}の学習
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <footer className="bg-gray-800 py-10 mt-16">
        <div className="container mx-auto text-center text-white">
          <p className="text-sm">&copy; 2024 Nurse Learning Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LearningSite;
