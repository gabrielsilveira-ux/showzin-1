import { apiRequest } from "@/server/httpClient";
import {
  AuthData,
  AuthResponse,
  AuthUserData,
  LoginRequest,
  RegisterRequest,
} from "@/types/auth";
import { RequestResponse } from "@/types/interfaces";

export default class AuthServer {
  static async login(
    data: LoginRequest
  ): Promise<RequestResponse<AuthResponse>> {
    const response = await apiRequest<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  }

  static async register(
    data: RegisterRequest
  ): Promise<RequestResponse<AuthData>> {
    const response = await apiRequest<AuthData>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  }

  static async getUser(): Promise<RequestResponse<AuthUserData>> {
    const response = await apiRequest<AuthUserData>("/api/auth/user", {
      method: "GET",
    });
    return response;
  }
}
