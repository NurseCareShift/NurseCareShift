import React from 'react';
import { useNavigate } from 'react-router-dom';
import { articles } from '../articles';

const categories = ['基礎', '中級', '臓器別疾患'];

// 記事の型定義
interface Article {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  imageUrl: string;
}

// ヘッダーコンポーネント
const Header: React.FC = () => (
  <header className="bg-blue-700 py-6 text-white shadow-lg">
    <div className="container mx-auto text-center">
      <h1 className="text-5xl font-extrabold">Nurse Learning Platform</h1>
      <p className="mt-3 text-lg opacity-80">看護の専門知識を学びましょう！</p>
    </div>
  </header>
);

// フッターコンポーネント
const Footer: React.FC = () => (
  <footer className="bg-gray-800 py-10 mt-16">
    <div className="container mx-auto text-center text-white">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Nurse Learning Platform. All rights reserved.
      </p>
    </div>
  </footer>
);

// サイドバーコンポーネント
const Sidebar: React.FC<{ categories: string[] }> = ({ categories }) => (
  <div className="fixed top-32 right-10 hidden lg:block">
    <nav className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-gray-800">カテゴリー</h3>
      <ul className="space-y-4">
        {categories.map((category) => (
          <li key={category}>
            <a href={`#${category}`} className="text-blue-700 hover:underline">
              {category}の学習
            </a>
          </li>
        ))}
      </ul>
    </nav>
  </div>
);

// 記事カードコンポーネント
const ArticleCard: React.FC<{ article: Article; onClick: (slug: string) => void }> = ({
  article,
  onClick,
}) => (
  <div
    className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer rounded-lg overflow-hidden"
    onClick={() => onClick(article.slug)}
  >
    <div className="h-48 w-full overflow-hidden">
      <img
        src={article.imageUrl}
        alt={article.title}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="p-6">
      <h3 className="text-2xl font-semibold mb-3 text-gray-900">{article.title}</h3>
      <p className="text-gray-600 text-base leading-relaxed">{article.description}</p>
    </div>
  </div>
);

// カテゴリーセクションコンポーネント
const CategorySection: React.FC<{
  category: string;
  articles: Article[];
  onCardClick: (slug: string) => void;
}> = ({ category, articles, onCardClick }) => (
  <section id={category} className="mb-20">
    <h2 className="text-4xl font-bold mb-10 text-gray-800">{category}の学習</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} onClick={onCardClick} />
      ))}
    </div>
  </section>
);

// メインのコンポーネント
const LearningSite: React.FC = () => {
  const navigate = useNavigate();

  // カードクリック時のナビゲーション
  const handleCardClick = (slug: string) => {
    navigate(`/articles/${slug}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto mt-16 px-4 lg:px-8">
        {categories.map((category) => {
          const categoryArticles = articles.filter(
            (article) => article.category === category
          );
          return (
            <CategorySection
              key={category}
              category={category}
              articles={categoryArticles}
              onCardClick={handleCardClick}
            />
          );
        })}
      </main>

      <Sidebar categories={categories} />

      <Footer />
    </div>
  );
};

export default LearningSite;
