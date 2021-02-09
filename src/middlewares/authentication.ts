import jwt from 'express-jwt';

const getTokenFromHeader: jwt.GetTokenCallback = (req) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
    return authHeader.split(' ')[1];
  }
  return null;
};

const defaultOptions: jwt.Options = {
  algorithms: ['HS256'],
  userProperty: 'jwt',
  secret: process.env.jwt_secret!,
  getToken: getTokenFromHeader,
};

export const authRequired = jwt(defaultOptions);

export const authOptional = jwt({
  ...defaultOptions,
  credentialsRequired: false,
});
