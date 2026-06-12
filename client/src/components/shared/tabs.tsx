import type { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface TabItem {
    label: string;
    value: string;
}

interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    items: TabItem[];
    activeTab: string;
    onTabChange: (value: string) => void;
}

export default function Tabs({
    items,
    activeTab,
    onTabChange,
    className,
    ...props
}: TabsProps) {
    return (
        <div
            className={twMerge("flex rounded-2xl bg-natural/15 p-1", className)}
            {...props}
        >
            {items.map((item) => (
                <button
                    key={item.value}
                    type="button"
                    onClick={() => onTabChange(item.value)}
                    className={twMerge(
                        "flex-1 cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold transition",
                        activeTab === item.value
                            ? "bg-apricot text-ivory"
                            : "text-fern hover:bg-ivory-card"
                    )}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
}