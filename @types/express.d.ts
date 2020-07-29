declare namespace Express {
  interface Request {
    user?: import('../src/utils/jwt').IJwtPayload;
  }
}
