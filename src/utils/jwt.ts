import jwt from 'jsonwebtoken';
import JWT from '../../@types/JWT';

export function generateJwtForUser(userId: string): string {
  const iat = new Date();
  const age = parseInt(process.env.jwt_age!);
  const exp = new Date(iat);
  exp.setSeconds(iat.getSeconds() + age);

  const jwtPayload: JWT = {
    sub: userId,
    exp: exp.getTime() / 1000,
    iat: iat.getTime() / 1000,
  };

  return jwt.sign(jwtPayload, process.env.jwt_secret!, { algorithm: 'HS256' });
}
