export type TokenPayload = {
  userId: string;
  role: string;
  exp?: string | number;
  refresh_token_id?: string;
};

export type UserType = {
  id: string;
  email: string;
  avatar: string;
  firstName: string;
  lastName: string;
  role: string;
};

export type ResTokenType = {
  accessToken: string;
  refreshToken: string;
};
