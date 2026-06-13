import type { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
}

export default function Button({
    children,
    className,
    variant = "primary",
    type = "button",
    ...props
}: ButtonProps) {
    const variants = {
        primary: "bg-apricot text-ivory hover:bg-apricot/90",
        secondary: "bg-fern text-ivory hover:bg-fern-dark",
        outline:
            "border border-natural/30 bg-transparent text-fern hover:bg-natural/15",
        ghost: "bg-transparent text-fern hover:bg-fern/10",
        danger: "bg-error text-white hover:bg-error/90",
    };

    return (
        <button
            type={type}
            className={twMerge(
                "flex items-center justify-center gap-2 cursor-pointer rounded-xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}