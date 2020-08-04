import User from '../../src/models/User';
import { generateJwtForUser } from '../../src/utils/jwt';
import jwt from 'jsonwebtoken';
import JWT from '../../@types/JWT';

const testUser = { username: 'username', password: 'password' };

it('generateJwtForUser(). When: everything is ok. Expected: valid jwt string', async () => {
  const user = new User(testUser);

  const token = generateJwtForUser(user._id);

  expect(token).not.toBe(null);

  const decodedToken = <JWT>jwt.verify(token, process.env.jwt_secret!);
  expect(decodedToken.sub).toBe(user._id.toString());
});
