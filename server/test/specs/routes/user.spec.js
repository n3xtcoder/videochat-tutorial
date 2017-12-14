const supertest = require('supertest');
const app = require('../../../src/app');

const request = supertest(app);

describe('/user', () => {
  let username;
  let password;

  test('returns 200 with jwt when username+password is correct', async () => {
    username = 'doctor';
    password = 'password';
    const response = await request.post('/user').send({ username, password });
    expect(response.statusCode).toBe(200);
    expect(typeof response.body.jwt).toEqual('string');
  });

  test('returns 401 when username case is not correct', async () => {
    username = 'Doctor';
    password = 'password';
    const response = await request.post('/user').send({ username, password });
    expect(response.statusCode).toBe(404);
    expect(typeof response.body.message).toEqual('string');
  });

  test('returns 404 when user does not exist', async () => {
    username = 'DOESNOTEXIST';
    password = '123';
    const response = await request.post('/user').send({ username, password });
    expect(response.statusCode).toBe(404);
    expect(typeof response.body.message).toEqual('string');
  });

  test('returns 401 when username exists but the password is incorrect', async () => {
    username = 'doctor';
    password = 'wrongpassword';
    const response = await request.post('/user').send({ username, password });
    expect(response.statusCode).toBe(401);
    expect(typeof response.body.message).toEqual('string');
  });

  test('returns 400 when username is missing from request body', async () => {
    password = 'password';
    const response = await request.post('/user').send({ password });
    expect(response.statusCode).toBe(400);
    expect(typeof response.body.message).toEqual('string');
  });

  test('returns 400 when password is missing from request body', async () => {
    username = 'doctor';
    const response = await request.post('/user').send({ username });
    expect(response.statusCode).toBe(400);
    expect(typeof response.body.message).toEqual('string');
  });

  test('returns 400 when username is not a string', async () => {
    username = { obj: [1, 2, 3]};
    password = 'password';
    const response = await request.post('/user').send({ password });
    expect(response.statusCode).toBe(400);
    expect(typeof response.body.message).toEqual('string');
  });

  test('returns 400 when password is not a string', async () => {
    username = 'doctor';
    password = 1;
    const response = await request.post('/user').send({ username });
    expect(response.statusCode).toBe(400);
    expect(typeof response.body.message).toEqual('string');
  });
});
