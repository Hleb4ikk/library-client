import { twMerge } from "tailwind-merge";

const sidebarItems = [
    { label: "Профиль", icon: "♙", active: true },
    { label: "Мои лайки", icon: "♡" },
    { label: "Список чтения", icon: "☷" },
    { label: "Комментарии", icon: "▱" },
    { label: "Поиск по моим", icon: "⌕" },
];

export default function ProfileSidebar() {
    return (
        <aside className="overflow-hidden rounded-2xl border border-natural/20 bg-ivory-card shadow-card lg:sticky lg:top-24">
            <nav aria-label="Навигация личного кабинета">
                {sidebarItems.map((item) => (
                    <button
                        key={item.label}
                        type="button"
                        className={twMerge(
                            "flex w-full items-center gap-3 border-b border-natural/10 px-5 py-4 text-left text-sm font-semibold text-fern transition last:border-b-0 hover:bg-natural/10",
                            item.active &&
                            "border-l-4 border-l-apricot bg-apricot/5 pl-4 text-apricot"
                        )}
                    >
                        <span className="w-5 text-lg leading-none text-natural">
                            {item.icon}
                        </span>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
}