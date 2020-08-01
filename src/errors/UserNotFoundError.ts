import { Types } from 'mongoose';
import NotFoundError from './http/NotFoundError';

export default class UserNotFoundError extends NotFoundError {
  constructor(userId?: Types.ObjectId, username?: string) {
    if (userId) {
      super(`User with id ${userId} is not found.`);
    } else {
      super(`User with username ${username} is not found.`);
    }
  }
}
