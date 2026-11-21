import axios from 'axios';

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
});

client.interceptors.request.use((config) => {
  if (!config.baseURL?.trim()) {
    throw new Error('VITE_API_BASE_URL 환경변수를 설정해 주세요.');
  }

  return config;
});
