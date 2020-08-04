import { RequestHandler } from 'express';
import { authenticate } from 'passport';
import User, { IUser } from '../models/User';
import { registerUser } from '../services/AuthService';
import AuthResponse from '../payload/AuthResponse';
import HttpStatus from 'http-status-codes';

export const signUp: RequestHandler = (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send('Blank username or password');
  }

  registerUser(req.body.username, req.body.password)
    .then((user) => {
      return res.json(new AuthResponse(User.toDto(user), user.generateJwt()));
    })
    .catch(() =>
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error creating user')
    );
};

export const signIn: RequestHandler = (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send('Blank username or password');
  }

  authenticate('local', { session: false }, (err, user: IUser, info) => {
    if (err) {
      return next(err);
    }
    if (user) {
      return res.json(new AuthResponse(User.toDto(user), user.generateJwt()));
    }
    return res.status(HttpStatus.BAD_REQUEST).send(info);
  })(req, res, next);
};
