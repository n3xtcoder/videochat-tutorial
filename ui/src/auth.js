import axios from 'axios';

const jwt = (() => {
  let value = null;

  return {
    get() {  // TODO: use it later in router
      return value || localStorage.getItem('jwt');
    },
    set(j) {
      value = j;
      localStorage.setItem('jwt', value);
    },
  };
})();

const getErrorMessage = (response) => {
  const msg = (response && response.data && response.data.message) || 'Unknown Error';
  const status = response.status;
  return `${msg} (${status})`;
};

function authenticate(username, password) {
  return axios.post('/api/user', { username, password })
    .then((response) => { jwt.set(response.data.jwt); })
    .catch((error) => { throw getErrorMessage(error.response); });
}

export default {
  authenticate,
};
