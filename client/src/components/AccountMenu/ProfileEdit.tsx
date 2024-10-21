// components/AccountMenu/ProfileEdit.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { validateName, validateBio, validateProfileImage } from '../utils/validators';

const ProfileEdit: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; bio?: string; profileImage?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (profileImage) {
      const imageUrl = URL.createObjectURL(profileImage);
      setPreviewImage(imageUrl);
      return () => URL.revokeObjectURL(imageUrl); // Release memory
    }
  }, [profileImage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const nameError = validateName(name);
    const bioError = validateBio(bio);
    const profileImageError = profileImage ? validateProfileImage(profileImage) : null;

    if (nameError || bioError || profileImageError) {
        setErrors({
          name: nameError ?? undefined,
          bio: bioError ?? undefined,
          profileImage: profileImageError ?? undefined
        });
        return;
      }

    setIsSubmitting(true);
    try {
      await updateProfile({ name, bio, profileImage });
      alert('プロフィールを更新しました。');
    } catch (error) {
      alert('プロフィールの更新に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>プロフィール編集</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>名前:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            disabled={isSubmitting} 
          />
          {errors.name && <p>{errors.name}</p>}
        </div>
        <div>
          <label>自己紹介:</label>
          <textarea 
            value={bio} 
            onChange={(e) => setBio(e.target.value)} 
            disabled={isSubmitting} 
          />
          {errors.bio && <p>{errors.bio}</p>}
        </div>
        <div>
          <label>プロフィール画像:</label>
          <input 
            type="file" 
            onChange={(e) => setProfileImage(e.target.files?.[0] || null)} 
            disabled={isSubmitting}
          />
          {previewImage && <img src={previewImage} alt="Profile Preview" width={100} height={100} />}
          {errors.profileImage && <p>{errors.profileImage}</p>}
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '更新中...' : '更新'}
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;
