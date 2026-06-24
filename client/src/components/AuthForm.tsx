import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    loginSchema,
    registerSchema,
    type LoginFormData,
    type RegisterFormData,
} from "../schemas/auth.schema";
import Button from "./shared/button";
import Input from "./shared/input";
import Label from "./shared/label";

type FormType = "login" | "register";

interface AuthFormProps {
    type: FormType;
    onSubmit: (data: LoginFormData | RegisterFormData) => Promise<void>;
    isLoading?: boolean;
}

export default function AuthForm({
    type,
    onSubmit,
    isLoading = false,
}: AuthFormProps) {
    const isLogin = type === "login";
    const schema = isLogin ? loginSchema : registerSchema;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData | RegisterFormData>({
        resolver: zodResolver(schema),
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Label htmlFor="username">Логин</Label>
                <Input
                    id="username"
                    type="text"
                    placeholder="Введите логин"
                    error={errors.username?.message}
                    {...register("username")}
                />
            </div>

            <div>
                <Label htmlFor="password">Пароль</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="Введите пароль"
                    error={errors.password?.message}
                    {...register("password")}
                />
            </div>

            {!isLogin && (
                <div>
                    <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Повторите пароль"
                        error={
                            (
                                errors as Partial<
                                    Record<"confirmPassword", { message?: string }>
                                >
                            ).confirmPassword?.message
                        }
                        {...register("confirmPassword")}
                    />
                </div>
            )}

            <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isLoading}
            >
                {isLoading ? "Загрузка..." : isLogin ? "Войти" : "Зарегистрироваться"}
            </Button>
        </form>
    );
}