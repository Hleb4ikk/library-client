import type { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "want" | "reading" | "done" | "dark" | "error";
}

export default function Badge({
    children,
    className,
    variant = "default",
    ...props
}: BadgeProps) {
    const variants = {
        default: "bg-apricot/10 text-apricot",
        want: "bg-status-want/15 text-status-want",
        reading: "bg-status-reading/15 text-status-reading",
        done: "bg-status-done/15 text-status-done",
        dark: "bg-fern text-ivory",
        error: "bg-error/10 text-error",
    };

    return (
        <span
            className={twMerge(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}