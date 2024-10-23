// src/pages/UnderstoodArticles.tsx

import React, { useState, useEffect } from 'react';
import { articles } from '../articles';
import { Link } from 'react-router-dom';
import { apiClient } from '../components/utils/apiClient';

const UnderstoodArticles: React.FC = () => {
  const [understoodSections, setUnderstoodSections] = useState<
    { articleTitle: string; sectionId: number; sectionTitle: string; slug: string }[]
  >([]);

  useEffect(() => {
    const fetchUnderstoodSections = async () => {
      try {
        const response = await apiClient.get('/progress');
        const progresses = response.data.progresses;

        const understood = progresses.filter((p: any) => p.status === 'understood');

        const sections = understood.map((progress: any) => {
          const article = articles.find((a) => a.slug === progress.articleSlug);
          const section = article?.sections.find((s) => s.id === progress.sectionId);
          return {
            articleTitle: article?.title || '',
            sectionId: progress.sectionId,
            sectionTitle: section?.title || '',
            slug: article?.slug || '',
          };
        });

        setUnderstoodSections(sections);
      } catch (err) {
        console.error('理解したセクションの取得に失敗しました:', err);
      }
    };

    fetchUnderstoodSections();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">理解したコンテンツ一覧</h1>
      {understoodSections.length === 0 ? (
        <p>理解したコンテンツはまだありません。</p>
      ) : (
        <ul className="space-y-4">
          {understoodSections.map((section, index) => (
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

export default UnderstoodArticles;
