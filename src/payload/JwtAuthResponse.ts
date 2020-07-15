export default class JwtAuthResponse {
  private token: string;
  private type = 'Bearer';

  constructor(token: string) {
    this.token = token;
  }
}
