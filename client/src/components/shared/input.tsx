import type { InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

export default function Input({ className, error, ...props }: InputProps) {
    return (
        <div className="w-full">
            <input
                className={twMerge(
                    "w-full rounded-xl border border-natural/30 bg-ivory-card px-4 py-3 text-sm text-fern outline-none placeholder:text-natural focus:border-apricot sm:text-base",
                    error && "border-error focus:border-error",
                    className
                )}
                {...props}
            />

            {error && <p className="mt-1 text-xs text-error">{error}</p>}
        </div>
    );
}