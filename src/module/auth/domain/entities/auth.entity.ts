export class Auth {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
  ) {}
}
