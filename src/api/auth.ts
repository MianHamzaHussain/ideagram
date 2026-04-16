import { apiClient } from './client';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string | null;
  roleValue: number | null;
  phone: string | null;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  detail: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface PasswordChangeRequest {
  oldPassword: string;
  newPassword1: string;
  newPassword2: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('auth/login/', data);
  },
  refreshToken: async (refresh: string): Promise<{ access: string; refresh: string }> => {
    return apiClient.post<{ access: string; refresh: string }>('auth/token/refresh/', { refresh });
  },
  logout: async (refresh: string): Promise<void> => {
    return apiClient.post('auth/logout/', { refresh });
  },
  changePassword: async (data: PasswordChangeRequest): Promise<{ detail: string }> => {
    return apiClient.post<{ detail: string }>('auth/password/change/', data);
  },
  forgotPassword: async (data: ForgotPasswordRequest): Promise<{ detail: string }> => {
    return apiClient.post<{ detail: string }>('auth/password/reset/', data);
  },
};
