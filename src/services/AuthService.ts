import User, { IUser } from '../models/User';

export function registerUser(
  username: string,
  password: string
): Promise<IUser> {
  const user = new User({ username, password });
  return user.save();
}
