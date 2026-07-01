import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    resetPasswordSchema,
    type ResetPasswordFormData,
} from "../schemas/auth.schema";
import Button from "./shared/button";
import Input from "./shared/input";
import Label from "./shared/label";

interface ResetPasswordFormProps {
    email: string;
    onSubmit: (data: { code: number; password: string }) => Promise<void>;
    onResend: () => Promise<void>;
    onBack: () => void;
    isLoading?: boolean;
    isResending?: boolean;
}

export default function ResetPasswordForm({
    email,
    onSubmit,
    onResend,
    onBack,
    isLoading = false,
    isResending = false,
}: ResetPasswordFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const submit = handleSubmit((data) =>
        onSubmit({ code: Number(data.code), password: data.password }),
    );

    return (
        <form onSubmit={submit} className="space-y-4">
            <p className="text-sm text-natural">
                Код восстановления отправлен на{" "}
                <span className="font-semibold text-fern">{email}</span>. Введите
                его и задайте новый пароль.
            </p>

            <div>
                <Label htmlFor="reset-code">Код подтверждения</Label>
                <Input
                    id="reset-code"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Введите 6-значный код"
                    error={errors.code?.message}
                    {...register("code")}
                />
            </div>

            <div>
                <Label htmlFor="reset-password">Новый пароль</Label>
                <Input
                    id="reset-password"
                    type="password"
                    placeholder="Введите новый пароль"
                    error={errors.password?.message}
                    autoComplete="new-password"
                    {...register("password")}
                />
            </div>

            <div>
                <Label htmlFor="reset-confirm">Подтвердите пароль</Label>
                <Input
                    id="reset-confirm"
                    type="password"
                    placeholder="Повторите новый пароль"
                    error={errors.confirmPassword?.message}
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                />
            </div>

            <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isLoading}
            >
                {isLoading ? "Сохранение..." : "Изменить пароль"}
            </Button>

            <div className="flex items-center justify-between text-sm">
                <button
                    type="button"
                    onClick={onBack}
                    className="text-natural transition hover:text-fern"
                    disabled={isLoading}
                >
                    ← Назад ко входу
                </button>

                <button
                    type="button"
                    onClick={onResend}
                    className="font-semibold text-apricot transition hover:text-fern disabled:opacity-60"
                    disabled={isResending || isLoading}
                >
                    {isResending ? "Отправка..." : "Отправить код повторно"}
                </button>
            </div>
        </form>
    );
}
