import { twMerge } from "tailwind-merge";

type LogoProps = {
    variant?: "header" | "hero";
    className?: string;
};

export default function Logo({ variant = "header", className }: LogoProps) {
    const isHero = variant === "hero";

    return (
        <span
            className={twMerge(
                "inline-flex items-center gap-2 font-playfair font-bold text-ivory",
                isHero ? "text-5xl sm:text-6xl" : "text-xl",
                className
            )}
        >
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className={twMerge(
                    "shrink-0 text-apricot",
                    isHero ? "h-10 w-10 sm:h-12 sm:w-12" : "h-7 w-7"
                )}
            >
                <path
                    d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 1 4 17.5v-12Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
                <path
                    d="M13 3h4.5A2.5 2.5 0 0 1 20 5.5v12a2.5 2.5 0 0 1-2.5 2.5H13V3Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
            </svg>

            <span>LibraNet</span>
        </span>
    );
}