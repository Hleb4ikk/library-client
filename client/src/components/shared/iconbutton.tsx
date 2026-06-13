import type { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import Button from "./button";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean;
}

export default function IconButton({
    children,
    className,
    active = false,
    type = "button",
    ...props
}: IconButtonProps) {
    return (
        <Button
            type={type}
            variant="ghost"
            className={twMerge(
                "min-h-10 min-w-10 rounded-full border px-3 py-2 text-sm",
                active
                    ? "border-apricot bg-apricot text-ivory"
                    : "border-natural/30 bg-natural/10 text-fern hover:bg-apricot/10 hover:text-apricot",
                className
            )}
            {...props}
        >
            {children}
        </Button>
    );
}