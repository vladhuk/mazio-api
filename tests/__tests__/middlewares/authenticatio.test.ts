import request from 'supertest';
import express from 'express';
import { authRequired } from '../../../src/middlewares/authentication';
import User from '../../../src/models/User';

const testUser = { username: 'someusername', password: 'somepassword' };

it('authRequired(). When: jwt is valid. Expect: user field in request', async () => {
  const user = new User(testUser);
  await user.save();

  const jwt = `Bearer ${user.generateJWT()}`;

  const app = express();
  app.get('/', authRequired, (req, res) => {
    expect(req.user).not.toBeNull();
    expect(req.user?.sub).toBe(user._id);
    res.end();
  });

  return request(app).get('/').set('Authorization', jwt).expect(200);
});
