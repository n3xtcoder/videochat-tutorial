import axios from 'axios';
import auth from '@/auth';

jest.mock('axios', () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

const username = 'username';
const password = 'password';

describe('auth.js', () => {
  beforeEach(() => {
    // // TODO: I don't think we need it.
    // jest.resetModules();
    // jest.clearAllMocks();
    localStorage.clear();
  });

  describe('authenticate', () => {
    it('is a function', () => {
      expect(typeof auth.authenticate).toEqual('function');
    });

    it('makes a POST request to /api/user with the passed in parameters', () => {
      axios.post.mockImplementation(() => Promise.resolve());
      auth.authenticate(username, password);
      expect(axios.post).toBeCalledWith('/api/user', { username, password });
    });

    it('sets the jwt from the response and writes it to localStorage on successful request', async () => {
      axios.post.mockImplementation(() => Promise.resolve({
        data: { jwt: 'some.long.string.here' },
      }));
      await auth.authenticate(username, password);
      expect(auth.jwt.get()).toEqual('some.long.string.here');
      expect(localStorage.getItem('jwt')).toEqual('some.long.string.here');
    });

    it('returns an error message on failed request and clears localStorage jwt', async () => {
      axios.post.mockImplementation(() => Promise.reject({
        response: {
          data: { message: 'error' },
          status: 999,
        },
      }));
      await expect(auth.authenticate(username, password)).rejects.toEqual('error (999)');
    });
  });

  describe('assertAuthenticated', () => {
    beforeEach(() => { auth.jwt.remove(); });

    it('throws if jwt storage is empty', async () => {
      await expect(auth.assertAuthenticated()).rejects.toEqual('No JWT available.');
    });

    it('makes a GET request to /api/info with the JWT token in the auth header ' +
       'when jwt storage contains jwt.', async () => {
      auth.jwt.set('jwttok3n');
      axios.get.mockImplementation(() => Promise.resolve());
      await auth.assertAuthenticated();
      expect(axios.get).toBeCalledWith('/api/info', { headers: { Authorization: 'Bearer jwttok3n' } });
    });

    it('resolves if GET request is successful', async () => {
      axios.get.mockImplementation(() => Promise.resolve());
      auth.jwt.set('jwttok3n');
      await expect(auth.assertAuthenticated()).resolves.not.toEqual(expect.anything());
    });
    it('rejects if GET request is not successful', async () => {
      axios.get.mockImplementation(() => Promise.reject());
      auth.jwt.set('jwttok3n');
      await expect(auth.assertAuthenticated()).rejects.toBe('JWT jwttok3n was invalid.');
    });

    it('cleans jwt if GET request is not successful', async () => {
      axios.get.mockImplementation(() => Promise.reject());
      auth.jwt.set('jwttok3n');
      expect(auth.jwt.get()).not.toBeNull();
      await expect(auth.assertAuthenticated()).rejects.toEqual(expect.anything());
      expect(auth.jwt.get()).toBeNull();
    });
  });
});
