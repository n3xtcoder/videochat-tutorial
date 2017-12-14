const supertest = require('supertest');
const app = require('../../../src/app');
const request = supertest(app);
// mocks
const twilio = require('../../../src/twilio');
const auth = require('../../../src/auth');

// We don't want to test passport library  // TODO: mock passport directly.
jest.mock('../../../src/auth', () => ({
  isAuthenticated: jest.fn(),
  passport: {
    // Set it to empty middleware
    initialize: jest.fn(() => (req, res, next) => next()),
  },
}));
// Don't create tokens with Twilio for unit tests.
jest.mock('../../../src/twilio', () => ({ createToken: jest.fn() }));


const jwtExample = 'eyxxxxxiOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJwYXRpZW50IiwicGFzc3dvcmQiOiJwYXNzd29yZCIsImRpc3BsYXlOYW1lIjoiSG9tZXIgU2ltcHNvbiIsInJvbGUiOiJwYXRpZW50IiwiaWF0IjoxNTA4NzYxNDA0LCJleHAiOjE1MDg4NDc4MDR9.VDIbyyDpV8_g_KjWQw4H6UDPpvSuYjpjxM1hZ-ukpZ0';
const username = 'anybody';

const appendUserToRequest = (req, _, next) => { req.user = { username }; next(); };
const mockCreateToken = (identity) => ({ identity, toJwt: () => jwtExample });

describe('/token', () => {
  it('returns 200 with the identity and token in the response', async () => {
    auth.isAuthenticated.mockImplementation(appendUserToRequest);
    twilio.createToken.mockImplementation(mockCreateToken);

    const response = await request.get('/token').send();

    expect(auth.isAuthenticated).toBeCalled();
    expect(twilio.createToken).toBeCalledWith(username);

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBe(jwtExample);
    expect(response.body.identity).toBe(username);
  });
});
