export interface JWTClaims {
  iss: string;
  sub: string;
  email: string;
  email_verified: boolean;
  given_name: string;
  name: string;
}
