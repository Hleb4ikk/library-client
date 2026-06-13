import type { LabelHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
}

export default function Label({
    children,
    className,
    required = false,
    ...props
}: LabelProps) {
    return (
        <label
            className={twMerge(
                "mb-1 block text-sm font-semibold text-fern",
                className
            )}
            {...props}
        >
            {children}
            {required && <span className="ml-1 text-apricot">*</span>}
        </label>
    );
}