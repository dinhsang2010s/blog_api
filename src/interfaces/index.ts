export interface LoginModel {
  name: string;
  password: string;
}

export interface RegisterModel {
  name: string;
  password: string;
  displayName: string;
  role: string;
}

export interface Token {
  type: string;
  accessToken: string;
  expiresIn: string;
}
