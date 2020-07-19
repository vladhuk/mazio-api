declare namespace Express {
  export interface Request {
    user?: import('../src/utils/jwt').IJwtPayload;
  }
}
