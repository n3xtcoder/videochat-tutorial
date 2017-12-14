const supertest = require('supertest');
const app = require('../../../src/app');
const { jwtRegex, mockTokenJwt } = require('../../utils');

const request = supertest(app);

// Don't create tokens with Twilio for unit tests.
jest.mock('../../../src/twilio', () => ({
  createToken: jest.fn(identity => ({
    identity,
    toJwt: () => mockTokenJwt,
  })),
}));

describe('Integration?', () => {
  // TODO: Can split this up?
  it('has endpoints that play well together', async () => {
    const username = 'doctor';
    const password = 'password';

    const responseUser = await request
      .post('/user')
      .send({ username, password });
    expect(responseUser.statusCode).toBe(200);

    const { jwt } = responseUser.body;

    const responseInfo = await request
      .get('/info')
      .set('Authorization', `Bearer ${jwt}`)
      .send();
    expect(responseInfo.statusCode).toBe(200);
    const expectedInfoKeys = ['id', 'username', 'displayName', 'expiresIn', 'role'];
    expect(Object.keys(responseInfo.body).sort()).toEqual(expectedInfoKeys.sort());

    const responseToken = await request
      .get('/token')
      .set('Authorization', `Bearer ${jwt}`)
      .send();
    expect(responseToken.statusCode).toBe(200);
    const { identity, token } = responseToken.body;
    expect(identity).toEqual('doctor');
    expect(token).toEqual(expect.stringMatching(jwtRegex));
    expect(token).toEqual(mockTokenJwt);
  });
});
