import { Types } from 'mongoose';

export default class UserNotFoundError extends Error {
  constructor(userId?: Types.ObjectId, username?: string) {
    if (userId) {
      super(`User with id ${userId} is not found.`);
    } else {
      super(`User with username ${username} is not found.`);
    }
  }
}
