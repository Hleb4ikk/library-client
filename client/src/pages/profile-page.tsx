import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import { Button, Input, Label } from "../components/shared";
import { saveUser, useUser } from "../features/auth/user-provider";
import { getLikedBooks } from "../features/books/api/user-likes.api";
import { getReadingListBooks } from "../features/books/api/reading-list.api";
import {
  changeLogin,
  changePassword,
  getProfile,
} from "../features/profile/api/profile.api";
import { getUserComments } from "../features/profile/api/user-comments.api";
import ProfileLayout from "../features/profile/components/profile-layout";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

type LoginFormErrors = {
  username?: string;
};

type PasswordFormErrors = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

type ProfileStats = {
  likes: number;
  readingList: number;
  comments: number;
};

function getInitials(username: string) {
  const parts = username.replace(/_/g, " ").split(" ").filter(Boolean);

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

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return `${months[parsedDate.getMonth()]} ${parsedDate.getFullYear()}`;
}

export default function ProfilePage() {
  const { setUser, user } = useUser();

  const [username, setUsername] = useState(user?.username ?? "");
  const [createdAt, setCreatedAt] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [newUsername, setNewUsername] = useState("");
  const [loginErrors, setLoginErrors] = useState<LoginFormErrors>({});
  const [isSavingLogin, setIsSavingLogin] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<PasswordFormErrors>({});
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [stats, setStats] = useState<ProfileStats>({
    likes: 0,
    readingList: 0,
    comments: 0,
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");

  const initials = useMemo(
    () => (username ? getInitials(username) : "—"),
    [username],
  );

  const memberSince = useMemo(
    () => (createdAt ? formatMemberSince(createdAt) : ""),
    [createdAt],
  );

  useEffect(() => {
    let isActive = true;

    async function loadProfile() {
      setIsLoading(true);

      try {
        const profile = await getProfile();

        if (!isActive) return;

        setUsername(profile.username);
        setCreatedAt(profile.createdAt);
        setUser((currentUser) =>
          currentUser
            ? { ...currentUser, username: profile.username }
            : currentUser,
        );
      } catch (error) {
        if (!isActive) return;
        setFormError(
          error instanceof Error ? error.message : "Не удалось загрузить профиль",
        );
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    async function loadStats() {
      try {
        const [likes, readingList, comments] = await Promise.all([
          getLikedBooks({ page: 1, limit: 1 }),
          getReadingListBooks({ page: 1, limit: 1, status: "all" }),
          getUserComments({ page: 1, limit: 1 }),
        ]);

        if (!isActive) return;

        setStats({
          likes: likes.total,
          readingList: readingList.total,
          comments: comments.total,
        });
      } catch {
        // статистику не удалось загрузить — оставляем нули
      }
    }

    void loadProfile();
    void loadStats();

    return () => {
      isActive = false;
    };
  }, [setUser]);

  function validateLoginForm() {
    const trimmedUsername = newUsername.trim();
    const errors: LoginFormErrors = {};

    if (!trimmedUsername) {
      errors.username = "Введите новый логин";
    } else if (trimmedUsername.length < 3) {
      errors.username = "Логин должен быть не короче 3 символов";
    } else if (trimmedUsername.length > 50) {
      errors.username = "Логин должен быть не длиннее 50 символов";
    } else if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      errors.username = "Можно использовать только латиницу, цифры и _";
    } else if (trimmedUsername.toLowerCase() === username.toLowerCase()) {
      errors.username = "Новый логин совпадает с текущим";
    }

    return errors;
  }

  function validatePasswordForm() {
    const errors: PasswordFormErrors = {};

    if (!currentPassword) {
      errors.currentPassword = "Введите текущий пароль";
    }

    if (!newPassword) {
      errors.newPassword = "Введите новый пароль";
    } else if (!PASSWORD_REGEX.test(newPassword)) {
      errors.newPassword =
        "Минимум 6 символов: заглавная и строчная буква, цифра и спецсимвол";
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

  async function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage("");
    setFormError("");

    const errors = validateLoginForm();
    setLoginErrors(errors);

    if (Object.keys(errors).length > 0) {
      setFormError("Проверьте форму смены логина");
      return;
    }

    setIsSavingLogin(true);

    try {
      const updated = await changeLogin(newUsername.trim());

      setUsername(updated.username);
      setUser((currentUser) => {
        const next = currentUser
          ? { ...currentUser, username: updated.username }
          : null;
        if (next) saveUser(next);
        return next;
      });

      setNewUsername("");
      setSuccessMessage("Логин успешно обновлён");
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Не удалось изменить логин",
      );
    } finally {
      setIsSavingLogin(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage("");
    setFormError("");

    const errors = validatePasswordForm();
    setPasswordErrors(errors);

    if (Object.keys(errors).length > 0) {
      setFormError("Проверьте форму смены пароля");
      return;
    }

    setIsSavingPassword(true);

    try {
      await changePassword(currentPassword, newPassword);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccessMessage("Пароль успешно обновлён");
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Не удалось изменить пароль",
      );
    } finally {
      setIsSavingPassword(false);
    }
  }

  return (
    <ProfileLayout activeItem="profile" title="Личный кабинет">
      <h2 className="text-2xl font-bold text-fern">Профиль</h2>

            <div className="mt-6 rounded-2xl border border-natural/25 bg-ivory px-4 py-5 shadow-card sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-apricot text-xl font-bold text-ivory">
                  {initials}
                </div>

                <div>
                  <p className="text-lg font-bold text-fern">
                    {isLoading ? "Загрузка..." : username}
                  </p>
                  <p className="mt-1 text-sm text-natural-text">
                    {memberSince ? `Участник с ${memberSince}` : " "}
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
                    placeholder={username ? `Текущий: ${username}` : "Новый логин"}
                    error={loginErrors.username}
                    autoComplete="username"
                    disabled={isSavingLogin}
                    className="bg-ivory-card"
                  />

                  <Button
                    type="submit"
                    className="h-12 px-6"
                    disabled={isSavingLogin}
                  >
                    {isSavingLogin ? "Сохранение..." : "▣ Сохранить"}
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
                    disabled={isSavingPassword}
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
                    disabled={isSavingPassword}
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
                    disabled={isSavingPassword}
                    className="bg-ivory-card"
                  />
                </div>

                <Button
                  type="submit"
                  className="mt-4 px-6"
                  disabled={isSavingPassword}
                >
                  {isSavingPassword ? "Обновление..." : "▣ Обновить пароль"}
                </Button>
              </form>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-natural/25 bg-ivory px-5 py-6 text-center shadow-card">
                <p className="text-3xl font-bold text-apricot">{stats.likes}</p>
                <p className="mt-1 text-sm text-natural-text">Лайков</p>
              </div>

              <div className="rounded-2xl border border-natural/25 bg-ivory px-5 py-6 text-center shadow-card">
                <p className="text-3xl font-bold text-apricot">
                  {stats.readingList}
                </p>
                <p className="mt-1 text-sm text-natural-text">В списке</p>
              </div>

              <div className="rounded-2xl border border-natural/25 bg-ivory px-5 py-6 text-center shadow-card">
                <p className="text-3xl font-bold text-apricot">
                  {stats.comments}
                </p>
                <p className="mt-1 text-sm text-natural-text">Комментариев</p>
              </div>
            </div>
    </ProfileLayout>
  );
}
