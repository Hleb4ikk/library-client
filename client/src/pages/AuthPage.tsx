import { useState } from "react";
import Tabs from "../components/shared/tabs";
import AuthForm from "../components/AuthForm";
import { loginUser, registerUser } from "../api/auth.api";
import type { LoginFormData, RegisterFormData } from "../schemas/auth.schema";

type AuthType = "login" | "register";

export default function AuthPage() {
    const [activeTab, setActiveTab] = useState<AuthType>("login");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const tabs = [
        { label: "Вход", value: "login" },
        { label: "Регистрация", value: "register" },
    ];

    const handleSubmit = async (data: LoginFormData | RegisterFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            let response;

            if (activeTab === "login") {
                response = await loginUser(data as LoginFormData);
            } else {
                response = await registerUser(data as RegisterFormData);
            }

            // Сохраняем токен
            localStorage.setItem("token", response.token);

            // Здесь можно добавить редирект или обновление состояния приложения
            console.log("Успешная авторизация:", response.user);

            // Пример редиректа (если используется React Router):
            // navigate('/dashboard');
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Произошла ошибка";
            setError(errorMessage);
            console.error("Ошибка авторизации:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-ivory p-4">
            <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-fern">
                        Добро пожаловать
                    </h1>
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
                    }}
                />

                {error && (
                    <div className="rounded-xl bg-error/10 p-3 text-sm text-error">
                        {error}
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
