export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    userId: number;
    email: string;
    type: string | null;
  };
}

export interface AuthUserData {
  userId: number;
  email: string;
}

export type AuthData = {
  accessToken: string;
};
