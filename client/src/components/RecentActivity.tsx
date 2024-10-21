// RecentActivity.tsx
import React from 'react';

const RecentActivity: React.FC<{ recentArticles: { title: string; action: string; }[] }> = ({ recentArticles }) => {
  return (
    <div className="recent-activity bg-white p-4 rounded shadow-md">
      <h2 className="text-lg font-bold">最近の活動</h2>
      <ul className="list-disc pl-5">
        {recentArticles.map((article, index) => (
          <li key={index}>
            {article.title} - <span className="italic">{article.action === 'understood' ? '理解した' : '復習したい'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;
