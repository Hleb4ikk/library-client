import type { TextareaHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
}

export default function Textarea({ className, error, ...props }: TextareaProps) {
    return (
        <div className="w-full">
            <textarea
                className={twMerge(
                    "min-h-28 w-full resize-none rounded-xl border border-natural/30 bg-ivory-card px-4 py-3 text-sm text-fern outline-none placeholder:text-natural focus:border-apricot sm:text-base",
                    error && "border-error focus:border-error",
                    className
                )}
                {...props}
            />

            {error && <p className="mt-1 text-xs text-error">{error}</p>}
        </div>
    );
}