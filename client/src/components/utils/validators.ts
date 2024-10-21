// メールアドレスのバリデーション
export const validateEmail = (email: string): string | undefined => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email) ? undefined : '有効なメールアドレスを入力してください。';
};

// パスワードのバリデーション
export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('8文字以上');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('大文字を含める');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('小文字を含める');
  }
  if (!/\d/.test(password)) {
    errors.push('数字を含める');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('特殊文字を含める');
  }

  return errors;
};

// 名前のバリデーション
export const validateName = (name: string): string | undefined => {
  if (name.length < 2 || name.length > 50) {
    return '名前は2文字以上、50文字以内で入力してください。';
  }
  return undefined;
};

// 自己紹介のバリデーション
export const validateBio = (bio: string): string | undefined => {
  if (bio.length > 200) {
    return '自己紹介は200文字以内で入力してください。';
  }
  return undefined;
};

// プロフィール画像のバリデーション
export const validateProfileImage = (file: File): string | undefined => {
  const allowedMimeTypes = ['image/jpeg', 'image/png'];
  if (!allowedMimeTypes.includes(file.type)) {
    return 'JPEGまたはPNG形式のファイルをアップロードしてください。';
  }
  if (file.size > 2 * 1024 * 1024) { // 2MB 制限
    return 'ファイルサイズが大きすぎます。2MB以下のファイルをアップロードしてください。';
  }
  return undefined;
};
