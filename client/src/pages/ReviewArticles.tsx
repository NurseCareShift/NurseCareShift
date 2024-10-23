import React, { useState, useEffect } from 'react';
import { articles } from '../articles';
import { Link } from 'react-router-dom';
import { apiClient } from '../components/utils/apiClient';

const ReviewArticles: React.FC = () => {
  const [reviewSections, setReviewSections] = useState<
    { articleTitle: string; sectionId: number; sectionTitle: string; slug: string }[]
  >([]);

  useEffect(() => {
    const fetchReviewSections = async () => {
      try {
        const response = await apiClient.get('/progress');
        const progresses = response.data.progresses;

        const review = progresses.filter((p: any) => p.status === 'review');

        const sections = review.map((progress: any) => {
          const article = articles.find((a) => a.slug === progress.articleSlug);
          const section = article?.sections.find((s) => s.id === progress.sectionId);
          return {
            articleTitle: article?.title || '',
            sectionId: progress.sectionId,
            sectionTitle: section?.title || '',
            slug: article?.slug || '',
          };
        });

        setReviewSections(sections);
      } catch (err) {
        console.error('復習したいセクションの取得に失敗しました:', err);
      }
    };

    fetchReviewSections();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">復習したいコンテンツ一覧</h1>
      {reviewSections.length === 0 ? (
        <p>復習したいコンテンツはまだありません。</p>
      ) : (
        <ul className="space-y-4">
          {reviewSections.map((section, index) => (
            <li key={index}>
              <Link
                to={`/articles/${section.slug}/section/${section.sectionId}`}
                className="text-blue-600 hover:underline"
              >
                {section.articleTitle} - {section.sectionTitle}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewArticles;
