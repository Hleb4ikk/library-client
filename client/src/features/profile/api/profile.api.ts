import axios from "axios";

import axiosInstance from "../../../api/axios";

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

export type Profile = {
    id: number;
    username: string;
    createdAt: string;
};

function getApiErrorMessage(error: unknown) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
        return error.response?.data?.message ?? "Ошибка запроса";
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Произошла ошибка";
}

export async function getProfile(): Promise<Profile> {
    try {
        const response = await axiosInstance.get<ApiSuccessResponse<Profile>>("/me");
        return response.data.data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error));
    }
}

export async function changeLogin(newUsername: string): Promise<Profile> {
    try {
        const response = await axiosInstance.put<ApiSuccessResponse<Profile>>(
            "/me/login",
            { new_username: newUsername },
        );
        return response.data.data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error));
    }
}

export async function changePassword(
    currentPassword: string,
    newPassword: string,
): Promise<void> {
    try {
        await axiosInstance.put("/me/password", {
            current_password: currentPassword,
            new_password: newPassword,
        });
    } catch (error) {
        throw new Error(getApiErrorMessage(error));
    }
}
