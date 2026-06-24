import { useMemo, useState } from "react";
import type { FormEvent } from "react";

import { Button, Input, Label } from "../components/shared";
import { useUser } from "../features/auth/user-provider";
import ProfileSidebar from "../features/profile/components/profile-sidebar";
import {
    MOCK_PROFILE_PASSWORD,
    mockTakenUsernames,
    mockUserProfile,
} from "../features/profile/data/profile.mock";
import AppHeader from "../layouts/app-header";

type LoginFormErrors = {
    username?: string;
};

type PasswordFormErrors = {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
};

function getInitials(username: string) {
    const parts = username
        .replace(/_/g, " ")
        .split(" ")
        .filter(Boolean);

    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return username.slice(0, 2).toUpperCase();
}

function formatMemberSince(date: string) {
    const months = [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря",
    ];

    const parsedDate = new Date(date);

    return `${months[parsedDate.getMonth()]} ${parsedDate.getFullYear()}`;
}

export default function ProfilePage() {
    const { setUser } = useUser();

    const [username, setUsername] = useState(mockUserProfile.username);
    const [newUsername, setNewUsername] = useState("");
    const [loginErrors, setLoginErrors] = useState<LoginFormErrors>({});

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordErrors, setPasswordErrors] = useState<PasswordFormErrors>({});

    const [successMessage, setSuccessMessage] = useState("");
    const [formError, setFormError] = useState("");

    const initials = useMemo(() => getInitials(username), [username]);

    const memberSince = useMemo(
        () => formatMemberSince(mockUserProfile.registeredAt),
        []
    );

    function validateLoginForm() {
        const trimmedUsername = newUsername.trim();
        const errors: LoginFormErrors = {};

        if (!trimmedUsername) {
            errors.username = "Введите новый логин";
        } else if (trimmedUsername.length < 3) {
            errors.username = "Логин должен быть не короче 3 символов";
        } else if (trimmedUsername.length > 20) {
            errors.username = "Логин должен быть не длиннее 20 символов";
        } else if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
            errors.username = "Можно использовать только латиницу, цифры и _";
        } else if (trimmedUsername.toLowerCase() === username.toLowerCase()) {
            errors.username = "Новый логин совпадает с текущим";
        } else if (
            mockTakenUsernames.some(
                (takenUsername) =>
                    takenUsername.toLowerCase() === trimmedUsername.toLowerCase()
            )
        ) {
            errors.username = "Этот логин уже занят";
        }

        return errors;
    }

    function validatePasswordForm() {
        const errors: PasswordFormErrors = {};

        if (!currentPassword) {
            errors.currentPassword = "Введите текущий пароль";
        } else if (currentPassword !== MOCK_PROFILE_PASSWORD) {
            errors.currentPassword = "Текущий пароль указан неверно";
        }

        if (!newPassword) {
            errors.newPassword = "Введите новый пароль";
        } else if (newPassword.length < 6) {
            errors.newPassword = "Пароль должен быть не короче 6 символов";
        } else if (newPassword === currentPassword) {
            errors.newPassword = "Новый пароль должен отличаться от текущего";
        }

        if (!confirmPassword) {
            errors.confirmPassword = "Повторите новый пароль";
        } else if (confirmPassword !== newPassword) {
            errors.confirmPassword = "Пароли не совпадают";
        }

        return errors;
    }

    function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSuccessMessage("");
        setFormError("");

        const errors = validateLoginForm();
        setLoginErrors(errors);

        if (Object.keys(errors).length > 0) {
            setFormError("Проверьте форму смены логина");
            return;
        }

        const trimmedUsername = newUsername.trim();

        setUsername(trimmedUsername);
        setUser((currentUser) =>
            currentUser
                ? { ...currentUser, username: trimmedUsername }
                : {
                    id: mockUserProfile.id,
                    username: trimmedUsername,
                    email: mockUserProfile.email,
                    registeredAt: mockUserProfile.registeredAt,
                }
        );

        setNewUsername("");
        setSuccessMessage("Логин успешно обновлён");
    }

    function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSuccessMessage("");
        setFormError("");

        const errors = validatePasswordForm();
        setPasswordErrors(errors);

        if (Object.keys(errors).length > 0) {
            setFormError("Проверьте форму смены пароля");
            return;
        }

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setSuccessMessage("Пароль успешно обновлён");
    }

    return (
        <div className="min-h-screen bg-ivory text-fern">
            <AppHeader />

            <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="font-playfair text-3xl font-semibold text-fern sm:text-4xl">
                    Личный кабинет
                </h1>

                <div className="mt-7 grid gap-6 lg:grid-cols-[280px_1fr]">
                    <ProfileSidebar activeItem="profile"/>

                    <section className="rounded-3xl border border-natural/20 bg-ivory-card p-5 shadow-page sm:p-7">
                        <h2 className="text-2xl font-bold text-fern">Профиль</h2>

                        <div className="mt-6 rounded-2xl border border-natural/25 bg-ivory px-4 py-5 shadow-card sm:px-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-apricot text-xl font-bold text-ivory">
                                    {initials}
                                </div>

                                <div>
                                    <p className="text-lg font-bold text-fern">
                                        {username}
                                    </p>
                                    <p className="mt-1 text-sm text-natural-text">
                                        Участник с {memberSince}
                                    </p>
                                </div>
                            </div>

                            {(successMessage || formError) && (
                                <div className="mt-5 space-y-2">
                                    {successMessage && (
                                        <div className="rounded-xl border border-status-done/20 bg-status-done/10 px-4 py-3 text-sm font-semibold text-status-done">
                                            {successMessage}
                                        </div>
                                    )}

                                    {formError && (
                                        <div className="rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm font-semibold text-error">
                                            {formError}
                                        </div>
                                    )}
                                </div>
                            )}

                            <form
                                onSubmit={handleLoginSubmit}
                                className="mt-7 border-t border-natural/20 pt-5"
                            >
                                <Label htmlFor="new-username">Изменить логин</Label>

                                <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                                    <Input
                                        id="new-username"
                                        value={newUsername}
                                        onChange={(event) => {
                                            setNewUsername(event.target.value);
                                            setLoginErrors({});
                                        }}
                                        placeholder={`Текущий: ${username}`}
                                        error={loginErrors.username}
                                        autoComplete="username"
                                        className="bg-ivory-card"
                                    />

                                    <Button type="submit" className="h-12 px-6">
                                        ▣ Сохранить
                                    </Button>
                                </div>
                            </form>

                            <form
                                onSubmit={handlePasswordSubmit}
                                className="mt-7 border-t border-natural/20 pt-5"
                            >
                                <Label>Изменить пароль</Label>

                                <div className="space-y-3">
                                    <Input
                                        value={currentPassword}
                                        onChange={(event) => {
                                            setCurrentPassword(event.target.value);
                                            setPasswordErrors({});
                                        }}
                                        type="password"
                                        placeholder="Текущий пароль"
                                        error={passwordErrors.currentPassword}
                                        autoComplete="current-password"
                                        className="bg-ivory-card"
                                    />

                                    <Input
                                        value={newPassword}
                                        onChange={(event) => {
                                            setNewPassword(event.target.value);
                                            setPasswordErrors({});
                                        }}
                                        type="password"
                                        placeholder="Новый пароль"
                                        error={passwordErrors.newPassword}
                                        autoComplete="new-password"
                                        className="bg-ivory-card"
                                    />

                                    <Input
                                        value={confirmPassword}
                                        onChange={(event) => {
                                            setConfirmPassword(event.target.value);
                                            setPasswordErrors({});
                                        }}
                                        type="password"
                                        placeholder="Подтверждение пароля"
                                        error={passwordErrors.confirmPassword}
                                        autoComplete="new-password"
                                        className="bg-ivory-card"
                                    />
                                </div>

                                <Button type="submit" className="mt-4 px-6">
                                    ▣ Обновить пароль
                                </Button>
                            </form>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl border border-natural/25 bg-ivory px-5 py-6 text-center shadow-card">
                                <p className="text-3xl font-bold text-apricot">
                                    {mockUserProfile.stats.likes}
                                </p>
                                <p className="mt-1 text-sm text-natural-text">
                                    Лайков
                                </p>
                            </div>

                            <div className="rounded-2xl border border-natural/25 bg-ivory px-5 py-6 text-center shadow-card">
                                <p className="text-3xl font-bold text-apricot">
                                    {mockUserProfile.stats.readingList}
                                </p>
                                <p className="mt-1 text-sm text-natural-text">
                                    В списке
                                </p>
                            </div>

                            <div className="rounded-2xl border border-natural/25 bg-ivory px-5 py-6 text-center shadow-card">
                                <p className="text-3xl font-bold text-apricot">
                                    {mockUserProfile.stats.comments}
                                </p>
                                <p className="mt-1 text-sm text-natural-text">
                                    Комментариев
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}