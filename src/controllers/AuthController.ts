import { RequestHandler } from 'express';
import { authenticate } from 'passport';
import { IUser } from '../models/User';
import { registerUser } from '../services/AuthService';
import JwtAuthResponse from '../payload/JwtAuthResponse';

export const signUp: RequestHandler = (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send('Blank username or password');
  }

  registerUser(req.body.username, req.body.password)
    .then((user) => {
      return res.json(new JwtAuthResponse(user.toDto(), user.generateJwt()));
    })
    .catch(() => res.status(500).send('Error creating user'));
};

export const signIn: RequestHandler = (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send('Blank username or password');
  }

  authenticate('local', { session: false }, (err, user: IUser, info) => {
    if (err) {
      return next(err);
    }
    if (user) {
      return res.json(new JwtAuthResponse(user.toDto(), user.generateJwt()));
    }
    return res.status(400).send(info);
  })(req, res, next);
};
