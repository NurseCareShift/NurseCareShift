if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.CLIENT_URL) {
    throw new Error('必要なGoogle OAuthの環境変数が設定されていません。');
  }
  
  const googleClient = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: `${process.env.CLIENT_URL}/auth/google/callback`,
  });
  