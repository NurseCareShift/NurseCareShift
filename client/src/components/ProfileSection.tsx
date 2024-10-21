import React from 'react';

const ProfileSection: React.FC<{ user: { name: string }; understoodCount: number; reviewCount: number; }> = ({ user, understoodCount, reviewCount }) => {
  return (
    <div className="profile-section bg-white p-4 rounded shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">プロフィール</h2>
      <p className="mb-2"><strong>名前:</strong> {user.name}</p>
      <div className="mt-4 flex flex-wrap">
        <button 
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors duration-300 w-full sm:w-auto" 
          aria-label={`理解した記事が ${understoodCount} 件あります`}
        >
          理解した記事: {understoodCount}
        </button>
        <button 
          className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-colors duration-300 w-full sm:w-auto ml-0 sm:ml-4 mt-2 sm:mt-0" 
          aria-label={`復習したい記事が ${reviewCount} 件あります`}
        >
          復習したい記事: {reviewCount}
        </button>
      </div>
    </div>
  );
};

export default ProfileSection;
