import { api } from "./client";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
} from "@/types";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post("/auth/login", credentials);
    return data;
  },

  register: async (data: RegisterData): Promise<User> => {
    const { data: user } = await api.post("/auth/register", data);
    return user;
  },

  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const { data } = await api.post("/auth/refresh", { refreshToken });
    return data;
  },

  me: async (): Promise<User> => {
    const { data } = await api.get("/auth/me");
    return data;
  },
};
