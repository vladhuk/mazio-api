import request from 'supertest';
import express from 'express';
import { authRequired } from '../../../src/middlewares/authentication';
import User from '../../../src/models/User';
import jwt from 'jsonwebtoken';
import { IJWTPayload } from '../../../src/utils/jwt';

const testUser = { username: 'someusername', password: 'somepassword' };

it('authRequired(). When: jwt is valid. Expect: user field in request', async () => {
  const user = new User(testUser);
  await user.save();

  const app = express();
  app.get('/', authRequired, (req, res) => res.json(req.user));

  const encodedToken = user.generateJWT();
  const decodedBody = <IJWTPayload>jwt.decode(encodedToken);
  const bearerToken = `Bearer ${encodedToken}`;

  await request(app)
    .get('/')
    .set('Authorization', bearerToken)
    .expect(200)
    .expect(decodedBody);
});
