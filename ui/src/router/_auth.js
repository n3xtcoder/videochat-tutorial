import axios from 'axios';
import { TOKEN_NAME } from '@/environment';

const validateToken = () => {
  const token = localStorage.getItem(TOKEN_NAME);
  return axios.get('/api/token', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then(() => true).catch(() => false);
};

export default (to, from, next) => {
  validateToken().then((res) => {
    if (!res) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    }
    next();
  });
};

