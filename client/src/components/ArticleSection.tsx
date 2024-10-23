// src/components/ArticleSection.tsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { articles, Article, Section } from '../articles';
import { apiClient } from '../components/utils/apiClient';
import { useAuth } from '../components/AuthContext';

interface SectionContent {
  id: number;
  title: string;
  content: string;
}

const ArticleSection: React.FC = () => {
  const { slug, sectionId } = useParams<{ slug: string; sectionId: string }>();
  const [sectionContent, setSectionContent] = useState<SectionContent | null>(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'understood' | 'review' | null>(null);
  const { user } = useAuth();

  // 記事とセクション情報を取得
  const article = articles.find((a) => a.slug === slug);
  const section = article?.sections.find((s) => s.id === Number(sectionId));

  useEffect(() => {
    if (!article || !section) {
      setError('記事またはセクションが見つかりませんでした。');
      return;
    }

    // 学習コンテンツをフェッチ
    const fetchSectionContent = async () => {
      try {
        const response = await fetch(section.contentFile);
        if (!response.ok) {
          throw new Error('データを取得できませんでした。');
        }
        const data: SectionContent = await response.json();
        setSectionContent(data);
      } catch (err) {
        console.error(err);
        setError('学習コンテンツを読み込めませんでした。');
      }
    };

    fetchSectionContent();

    // ユーザーの進捗状況をロード
    const fetchProgressStatus = async () => {
      try {
        const response = await apiClient.get('/progress/status', {
          params: {
            articleSlug: slug,
            sectionId: Number(sectionId),
          },
        });
        const progress = response.data.progress;
        if (progress) {
          setStatus(progress.status);
        }
      } catch (err) {
        console.error('進捗状況の取得に失敗しました:', err);
      }
    };

    fetchProgressStatus();
  }, [article, section, slug, sectionId]);

  // 進捗の更新
  const updateProgress = async (newStatus: 'understood' | 'review') => {
    try {
      await apiClient.post('/progress/update', {
        articleSlug: slug,
        sectionId: Number(sectionId),
        status: newStatus,
      });
      setStatus(newStatus);
    } catch (err) {
      console.error('進捗の更新に失敗しました:', err);
    }
  };

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  if (!sectionContent) {
    return <div className="text-center mt-10">読み込み中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 py-6 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">{sectionContent.title}</h1>
        </div>
      </header>

      <main className="container mx-auto mt-10 px-4 lg:px-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-800 text-lg leading-relaxed">{sectionContent.content}</p>
        </div>

        <div className="flex mt-6 space-x-4">
          <button
            onClick={() => updateProgress('understood')}
            className={`px-4 py-2 rounded-lg text-white ${
              status === 'understood' ? 'bg-green-500' : 'bg-blue-500'
            }`}
          >
            理解できた
          </button>
          <button
            onClick={() => updateProgress('review')}
            className={`px-4 py-2 rounded-lg text-white ${
              status === 'review' ? 'bg-yellow-500' : 'bg-blue-500'
            }`}
          >
            復習したい
          </button>
        </div>

        {status && (
          <div className="mt-4">
            {status === 'understood' && (
              <p className="text-green-600">このセクションは理解済みです。</p>
            )}
            {status === 'review' && (
              <p className="text-yellow-600">このセクションを復習リストに追加しました。</p>
            )}
          </div>
        )}
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

export default ArticleSection;
