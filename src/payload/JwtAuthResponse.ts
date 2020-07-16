import { IJsonUser } from '../models/User';

export default class JwtAuthResponse {
  private user: IJsonUser;
  private token: string;
  private tokenType = 'Bearer';

  constructor(user: IJsonUser, token: string) {
    this.user = user;
    this.token = token;
  }
}
