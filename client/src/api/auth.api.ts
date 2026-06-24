import axiosInstance from "./axios";
import type { LoginFormData, RegisterFormData } from "../schemas/auth.schema";

interface AuthResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

// Функция для логина
export const loginUser = async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>("/auth/login", data);
    return response.data;
};

// Функция для регистрации
export const registerUser = async (
    data: RegisterFormData
): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>("/auth/register", data);
    return response.data;
};
