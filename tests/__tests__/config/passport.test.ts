import '../../../src/config/passport';
import { authenticate } from 'passport';
import User from '../../../src/models/User';
import express from 'express';
import request from 'supertest';
import bodyParser from 'body-parser';

const testUser = { username: 'testUsername', password: 'testPassword' };

const app = express();
app.use(bodyParser.json());
app.post('/', authenticate('local', { session: false }), (req, res) =>
  res.end()
);

it('authenticate(). When: user exists in db. Expect: 200', async () => {
  const user = new User(testUser);
  await user.save();

  return request(app).post('/').send(testUser).expect(200);
});

it('authenticate(). When: user does not exist. Expect: 401', () => {
  return request(app).post('/').send(testUser).expect(401);
});
