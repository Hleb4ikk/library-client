import type { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import Button from "./button";

interface PaginationProps extends HTMLAttributes<HTMLDivElement> {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    page,
    totalPages,
    onPageChange,
    className,
    ...props
}: PaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div
            className={twMerge("flex items-center justify-center gap-2", className)}
            {...props}
        >
            <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
            >
                Назад
            </Button>

            <span className="rounded-xl bg-fern/10 px-4 py-2 text-sm font-semibold text-fern">
                {page} / {totalPages}
            </span>

            <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
            >
                Вперёд
            </Button>
        </div>
    );
}