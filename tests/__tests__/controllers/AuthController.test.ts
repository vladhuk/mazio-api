import request from 'supertest';
import app from '../../../src/app';
import User from '../../../src/models/User';

const testUser = { username: 'testusername', password: 'testpassword' };

it('signUp(). When: username and password are correct. Expected: Created user, 200 and correct response body', async () => {
  const response = await request(app)
    .post('/api/auth/signup')
    .send(testUser)
    .expect(200);

  expect(response.body.tokenType).toBe('Bearer');
  expect(response.body.token).not.toBeNull();
  expect(!!response.body.user).toBeTruthy();
  expect(response.body.user.username).toBe(testUser.username);
  expect(await User.exists({ _id: response.body.user.id })).toBeTruthy();
});

it('signIn(). When: user exists. Expected: 200 and correct response body', async () => {
  const user = new User(testUser);
  await user.save();

  const response = await request(app)
    .post('/api/auth/signin')
    .send(testUser)
    .expect(200);
  expect(response.body.token).not.toBeNull();
  expect(response.body.user.username).toBe(testUser.username);
});

it('signIn(). When: user does not exist. Expected: 400', () => {
  return request(app).post('/api/auth/signin').send(testUser).expect(400);
});
