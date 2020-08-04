declare namespace Express {
  interface Request {
    jwt?: import('../JWT').default;
  }
}
