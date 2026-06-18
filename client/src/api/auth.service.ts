import axiosInstance from './axios';
import { tokenStorage } from './tokenStorage';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
  };
}

interface RegisterRequest {
  email: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await axiosInstance.post<LoginResponse>(
      '/auth/login',
      credentials
    );
    
    if (response.data.accessToken) {
      tokenStorage.set(response.data.accessToken);
    }
    
    return response.data;
  },

  async register(userData: RegisterRequest): Promise<LoginResponse> {
    const response = await axiosInstance.post<LoginResponse>(
      '/auth/register',
      userData
    );
    
    if (response.data.accessToken) {
      tokenStorage.set(response.data.accessToken);
    }
    
    return response.data;
  },

  logout(): void {
    tokenStorage.remove();
    window.location.href = '/login';
  },

  isAuthenticated(): boolean {
    return tokenStorage.exists();
  },
};
