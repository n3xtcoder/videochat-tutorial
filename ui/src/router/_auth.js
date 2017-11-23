import axios from 'axios';

const validateToken = () => {
  const token = localStorage.getItem('demoToken');
  return axios.get('/api/token', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then(() => true).catch(() => false);
};

export const checkAuth = (to, from, next) => {
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

