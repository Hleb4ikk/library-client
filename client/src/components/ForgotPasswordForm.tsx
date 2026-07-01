import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    forgotPasswordSchema,
    type ForgotPasswordFormData,
} from "../schemas/auth.schema";
import Button from "./shared/button";
import Input from "./shared/input";
import Label from "./shared/label";

interface ForgotPasswordFormProps {
    onSubmit: (email: string) => Promise<void>;
    onBack: () => void;
    isLoading?: boolean;
}

export default function ForgotPasswordForm({
    onSubmit,
    onBack,
    isLoading = false,
}: ForgotPasswordFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const submit = handleSubmit((data) => onSubmit(data.email));

    return (
        <form onSubmit={submit} className="space-y-4">
            <p className="text-sm text-natural">
                Укажите email, привязанный к аккаунту. Мы отправим на него код для
                сброса пароля.
            </p>

            <div>
                <Label htmlFor="recovery-email">Email</Label>
                <Input
                    id="recovery-email"
                    type="email"
                    placeholder="Введите email"
                    error={errors.email?.message}
                    {...register("email")}
                />
            </div>

            <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isLoading}
            >
                {isLoading ? "Отправка..." : "Отправить код"}
            </Button>

            <button
                type="button"
                onClick={onBack}
                className="w-full text-center text-sm text-natural transition hover:text-fern"
                disabled={isLoading}
            >
                ← Назад ко входу
            </button>
        </form>
    );
}
