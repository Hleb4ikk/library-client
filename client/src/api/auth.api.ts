import axios from "axios";

import type { LoginFormData, RegisterFormData } from "../schemas/auth.schema";
import axiosInstance from "./axios";

export type AuthUser = {
    id: number;
    username: string;
};

type ApiSuccessResponse<T> = {
    success: true;
    message: string;
    data: T;
};

type ApiErrorResponse = {
    success: false;
    message: string;
    description?: unknown;
};

export type RegisterResponse = ApiSuccessResponse<{ email: string }>;

export type VerifyEmailResponse = ApiSuccessResponse<{
    user: AuthUser;
    token: string;
}>;

export type LoginResponse = ApiSuccessResponse<{
    user: AuthUser;
    token: string;
}>;

function getApiErrorMessage(error: unknown) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
        return error.response?.data?.message ?? "Ошибка запроса";
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Произошла ошибка";
}

export const loginUser = async (data: LoginFormData): Promise<LoginResponse> => {
    try {
        const response = await axiosInstance.post<LoginResponse>("/auth/login", data);
        return response.data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error));
    }
};

export const registerUser = async (
    data: RegisterFormData,
): Promise<RegisterResponse> => {
    try {
        const { confirmPassword: _confirmPassword, ...requestData } = data;

        const response = await axiosInstance.post<RegisterResponse>(
            "/auth/register",
            requestData,
        );

        return response.data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error));
    }
};

export const verifyEmail = async (
    email: string,
    code: number,
): Promise<VerifyEmailResponse> => {
    try {
        const response = await axiosInstance.post<VerifyEmailResponse>(
            "/auth/verify-email",
            { email, code },
        );

        return response.data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error));
    }
};

export const resendVerificationCode = async (email: string): Promise<void> => {
    try {
        await axiosInstance.post("/auth/resend-verification", { email });
    } catch (error) {
        throw new Error(getApiErrorMessage(error));
    }
};