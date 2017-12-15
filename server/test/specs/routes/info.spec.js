import supertest from 'supertest';
import app from '../../../src/app';
import auth from '../../../src/auth';

const request = supertest(app);

// We don't want to test passport library  // TODO: mock passport directly.
jest.mock('../../../src/auth', () => ({
  isAuthenticated: jest.fn(),
  passport: {
    // Set it to empty middleware
    initialize: jest.fn(() => (req, res, next) => next()),
  },
}));

const mockUser = {
  id: 1,
  username: 'doctor',
  password: 'password',
  displayName: 'Dr Nick Riviera',
  role: 'doctor',
  exp: 1,
};

const appendUserToRequest = (req, _, next) => { req.user = mockUser; next(); };

const dateRegex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

describe('/info', () => {
  it('returns 200 with info about the user', async () => {
    auth.isAuthenticated.mockImplementation(appendUserToRequest);

    const response = await request.get('/info').send();

    expect(auth.isAuthenticated).toBeCalled();
    expect(response.statusCode).toBe(200);
    const expectedKeys = ['id', 'username', 'displayName', 'expiresIn', 'role'];
    const receivedUser = response.body;
    expect(Object.keys(receivedUser).sort()).toEqual(expectedKeys.sort());
    expect(receivedUser.id).toEqual(mockUser.id);
    expect(receivedUser.username).toEqual(mockUser.username);
    expect(receivedUser.displayName).toEqual(mockUser.displayName);
    expect(receivedUser.role).toEqual(mockUser.role);
    expect(receivedUser.expiresIn).toEqual(expect.stringMatching(dateRegex));
    expect(receivedUser.expiresIn).toEqual('1970-01-01T00:00:01.000Z');
  });
});
