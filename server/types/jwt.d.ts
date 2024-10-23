export interface IAccessTokenPayload {
    id: string;
    role: 'admin' | 'official' | 'general';
    // 必要に応じて他のプロパティを追加
  }
  
  export interface IRefreshTokenPayload {
    id: string;
  }
  