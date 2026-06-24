import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser, registerUser } from "../api/auth.api";
import { tokenStorage } from "../api/tokenStorage";
import AuthForm from "../components/AuthForm";
import Tabs from "../components/shared/tabs";
import { saveUser, useUser } from "../features/auth/user-provider";
import type { LoginFormData, RegisterFormData } from "../schemas/auth.schema";

type AuthType = "login" | "register";

export default function AuthPage() {
    const [activeTab, setActiveTab] = useState<AuthType>("login");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    const { setUser } = useUser();

    const tabs = [
        { label: "Вход", value: "login" },
        { label: "Регистрация", value: "register" },
    ];

    const handleSubmit = async (data: LoginFormData | RegisterFormData) => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            if (activeTab === "login") {
                const response = await loginUser(data as LoginFormData);

                tokenStorage.set(response.data.token);
                saveUser(response.data.user);
                setUser(response.data.user);

                navigate("/");
                return;
            }

            const response = await registerUser(data as RegisterFormData);

            setSuccessMessage(response.message);
            setActiveTab("login");
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Произошла ошибка";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-ivory p-4">
            <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-fern">Добро пожаловать</h1>
                    <p className="mt-2 text-sm text-natural">
                        {activeTab === "login"
                            ? "Войдите в свой аккаунт"
                            : "Создайте новый аккаунт"}
                    </p>
                </div>

                <Tabs
                    items={tabs}
                    activeTab={activeTab}
                    onTabChange={(value) => {
                        setActiveTab(value as AuthType);
                        setError(null);
                        setSuccessMessage(null);
                    }}
                />

                {error && (
                    <div className="rounded-xl bg-error/10 p-3 text-sm text-error">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="rounded-xl bg-success/10 p-3 text-sm text-fern">
                        {successMessage}. Теперь войдите в аккаунт.
                    </div>
                )}

                <AuthForm
                    type={activeTab}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}