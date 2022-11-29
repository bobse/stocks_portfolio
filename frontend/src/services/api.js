import axios from 'axios';
import auth from './auth';

const api = axios.create({});

api.interceptors.request.use(async config => {
  const token = auth.getAccessToken();
  if (token) {
    config.headers.Authorization = 'Token ' + token;
  }
  return config;
});

export default api;
