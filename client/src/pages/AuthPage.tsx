import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    forgotPassword,
    loginUser,
    registerUser,
    resendVerificationCode,
    resetPassword,
    verifyEmail,
} from "../api/auth.api";
import { tokenStorage } from "../api/tokenStorage";
import AuthForm from "../components/AuthForm";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import ResetPasswordForm from "../components/ResetPasswordForm";
import VerifyCodeForm from "../components/VerifyCodeForm";
import Tabs from "../components/shared/tabs";
import { saveUser, useUser } from "../features/auth/user-provider";
import type { LoginFormData, RegisterFormData } from "../schemas/auth.schema";

type AuthType = "login" | "register";
type RegisterStep = "form" | "verify";
type RecoveryStep = "request" | "reset";

export default function AuthPage() {
    const [activeTab, setActiveTab] = useState<AuthType>("login");
    const [registerStep, setRegisterStep] = useState<RegisterStep>("form");
    const [isRecovery, setIsRecovery] = useState(false);
    const [recoveryStep, setRecoveryStep] = useState<RecoveryStep>("request");
    const [pendingEmail, setPendingEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    const { setUser } = useUser();

    const tabs = [
        { label: "Вход", value: "login" },
        { label: "Регистрация", value: "register" },
    ];

    function resetMessages() {
        setError(null);
        setSuccessMessage(null);
    }

    const handleSubmit = async (data: LoginFormData | RegisterFormData) => {
        setIsLoading(true);
        resetMessages();

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

            setPendingEmail(response.data.email);
            setRegisterStep("verify");
            setSuccessMessage(
                `Код подтверждения отправлен на ${response.data.email}`,
            );
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Произошла ошибка";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (code: number) => {
        setIsLoading(true);
        resetMessages();

        try {
            const response = await verifyEmail(pendingEmail, code);

            tokenStorage.set(response.data.token);
            saveUser(response.data.user);
            setUser(response.data.user);

            navigate("/");
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Произошла ошибка";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setIsResending(true);
        resetMessages();

        try {
            await resendVerificationCode(pendingEmail);
            setSuccessMessage(`Код отправлен повторно на ${pendingEmail}`);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Произошла ошибка";
            setError(errorMessage);
        } finally {
            setIsResending(false);
        }
    };

    const handleForgotRequest = async (email: string) => {
        setIsLoading(true);
        resetMessages();

        try {
            await forgotPassword(email);
            setPendingEmail(email);
            setRecoveryStep("reset");
            setSuccessMessage(`Код восстановления отправлен на ${email}`);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Произошла ошибка";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = async ({
        code,
        password,
    }: {
        code: number;
        password: string;
    }) => {
        setIsLoading(true);
        resetMessages();

        try {
            await resetPassword(pendingEmail, code, password);

            setIsRecovery(false);
            setRecoveryStep("request");
            setActiveTab("login");
            setSuccessMessage("Пароль изменён. Войдите с новым паролем.");
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Произошла ошибка";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendRecovery = async () => {
        setIsResending(true);
        resetMessages();

        try {
            await forgotPassword(pendingEmail);
            setSuccessMessage(`Код отправлен повторно на ${pendingEmail}`);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Произошла ошибка";
            setError(errorMessage);
        } finally {
            setIsResending(false);
        }
    };

    function handleBackToForm() {
        setRegisterStep("form");
        resetMessages();
    }

    function startRecovery() {
        setIsRecovery(true);
        setRecoveryStep("request");
        setPendingEmail("");
        resetMessages();
    }

    function cancelRecovery() {
        setIsRecovery(false);
        setRecoveryStep("request");
        resetMessages();
    }

    function handleTabChange(value: AuthType) {
        setActiveTab(value);
        setRegisterStep("form");
        setIsRecovery(false);
        setPendingEmail("");
        resetMessages();
    }

    const isVerifying = activeTab === "register" && registerStep === "verify";

    let subtitle = "Войдите в свой аккаунт";
    if (isRecovery) {
        subtitle = "Восстановление пароля";
    } else if (activeTab === "register") {
        subtitle = isVerifying ? "Подтвердите email" : "Создайте новый аккаунт";
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-ivory p-4">
            <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-fern">Добро пожаловать</h1>
                    <p className="mt-2 text-sm text-natural">{subtitle}</p>
                </div>

                {!isRecovery && (
                    <Tabs
                        items={tabs}
                        activeTab={activeTab}
                        onTabChange={(value) => handleTabChange(value as AuthType)}
                    />
                )}

                {error && (
                    <div className="rounded-xl bg-error/10 p-3 text-sm text-error">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="rounded-xl bg-success/10 p-3 text-sm text-fern">
                        {successMessage}
                    </div>
                )}

                {isRecovery ? (
                    recoveryStep === "request" ? (
                        <ForgotPasswordForm
                            onSubmit={handleForgotRequest}
                            onBack={cancelRecovery}
                            isLoading={isLoading}
                        />
                    ) : (
                        <ResetPasswordForm
                            email={pendingEmail}
                            onSubmit={handleReset}
                            onResend={handleResendRecovery}
                            onBack={cancelRecovery}
                            isLoading={isLoading}
                            isResending={isResending}
                        />
                    )
                ) : isVerifying ? (
                    <VerifyCodeForm
                        email={pendingEmail}
                        onVerify={handleVerify}
                        onResend={handleResend}
                        onBack={handleBackToForm}
                        isLoading={isLoading}
                        isResending={isResending}
                    />
                ) : (
                    <>
                        <AuthForm
                            type={activeTab}
                            onSubmit={handleSubmit}
                            isLoading={isLoading}
                        />

                        {activeTab === "login" && (
                            <button
                                type="button"
                                onClick={startRecovery}
                                className="w-full text-center text-sm font-semibold text-apricot transition hover:text-fern"
                            >
                                Забыли пароль?
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
