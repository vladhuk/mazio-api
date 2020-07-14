import jwt from 'express-jwt';

const getTokenFromHeader: jwt.GetTokenCallback = (req) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
    return authHeader.split(' ')[1];
  }
  return null;
};

export const authRequired = jwt({
  secret: process.env.jwt_secret!,
  getToken: getTokenFromHeader,
});
