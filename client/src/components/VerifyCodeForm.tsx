import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    verifyCodeSchema,
    type VerifyCodeFormData,
} from "../schemas/auth.schema";
import Button from "./shared/button";
import Input from "./shared/input";
import Label from "./shared/label";

interface VerifyCodeFormProps {
    email: string;
    onVerify: (code: number) => Promise<void>;
    onResend: () => Promise<void>;
    onBack: () => void;
    isLoading?: boolean;
    isResending?: boolean;
}

export default function VerifyCodeForm({
    email,
    onVerify,
    onResend,
    onBack,
    isLoading = false,
    isResending = false,
}: VerifyCodeFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<VerifyCodeFormData>({
        resolver: zodResolver(verifyCodeSchema),
    });

    const submit = handleSubmit((data) => onVerify(Number(data.code)));

    return (
        <form onSubmit={submit} className="space-y-4">
            <p className="text-sm text-natural">
                Мы отправили код подтверждения на{" "}
                <span className="font-semibold text-fern">{email}</span>. Введите
                его ниже, чтобы завершить регистрацию.
            </p>

            <div>
                <Label htmlFor="code">Код подтверждения</Label>
                <Input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Введите 6-значный код"
                    error={errors.code?.message}
                    {...register("code")}
                />
            </div>

            <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isLoading}
            >
                {isLoading ? "Проверка..." : "Подтвердить"}
            </Button>

            <div className="flex items-center justify-between text-sm">
                <button
                    type="button"
                    onClick={onBack}
                    className="text-natural transition hover:text-fern"
                    disabled={isLoading}
                >
                    ← Назад
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
