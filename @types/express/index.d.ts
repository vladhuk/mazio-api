declare namespace Express {
  interface Request {
    jwt?: import('../../src/utils/jwt').IJwtPayload;
  }
}
