import axios from 'axios';
import { Notification } from 'element-ui';
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
  validateToken().then((valid) => {
    if (!valid) {
      console.warn('Token missing, expired or invalid');
      next({
        path: '/login',
      });
    } else {
      Notification({
        title: 'Demonstrate 200',
        message: 'Your token has passed server authorisation. Refresh the browser to retry',
      });
    }
    next();
  });
};

