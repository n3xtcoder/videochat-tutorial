const supertest = require('supertest');
const app = require('../../../src/app');
const { mockTokenJwt } = require('../../utils');
// to be mocked
const twilio = require('../../../src/twilio');
const auth = require('../../../src/auth');

const request = supertest(app);

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

const username = 'anybody';

const appendUserToRequest = (req, _, next) => { req.user = { username }; next(); };
const mockCreateToken = identity => ({ identity, toJwt: () => mockTokenJwt });

describe('/token', () => {
  it('returns 200 with the identity and token in the response', async () => {
    auth.isAuthenticated.mockImplementation(appendUserToRequest);
    twilio.createToken.mockImplementation(mockCreateToken);

    const response = await request.get('/token').send();

    expect(auth.isAuthenticated).toBeCalled();
    expect(twilio.createToken).toBeCalledWith(username);

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBe(mockTokenJwt);
    expect(response.body.identity).toBe(username);
  });
});
