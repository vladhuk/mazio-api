import { IUserDto } from '../models/User';

export default class AuthResponse {
  private user: IUserDto;
  private token: string;

  constructor(user: IUserDto, token: string) {
    this.user = user;
    this.token = `Bearer ${token}`;
  }
}
