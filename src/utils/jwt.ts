import jwt from 'jsonwebtoken';

export interface IJwtPayload {
  sub: string;
  exp: number;
  iat: number;
}

export function generateJwtForUser(userId: string): string {
  const iat = new Date();
  const age = parseInt(process.env.jwt_age!);
  const exp = new Date(iat);
  exp.setSeconds(iat.getSeconds() + age);

  const jwtPayload: IJwtPayload = {
    sub: userId,
    exp: exp.getTime() / 1000,
    iat: iat.getTime() / 1000,
  };

  return jwt.sign(jwtPayload, process.env.jwt_secret!, { algorithm: 'HS256' });
}
