import axios from 'axios';

const API_BASE_URL = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // クッキーを含める
});

// CSRFトークンを取得する関数
export const getCsrfToken = async () => {
  const response = await apiClient.get('/auth/csrf-token');
  return response.data.csrfToken;
};

