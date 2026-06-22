import { useEffect, useRef, useState } from "react";

import { Button, Logo } from "../components/shared"; 
import { useUser } from "../features/auth/user-provider";

const cabinetLinks = [
    { label: "Профиль", icon: "♙" },
    { label: "Мои лайки", icon: "♡" },
    { label: "Список чтения", icon: "☷" },
    { label: "Комментарии", icon: "▱" },
    { label: "Поиск по моим", icon: "⌕" },
];

function getInitials(username: string) {
    const parts = username
        .replace(/_/g, " ")
        .split(" ")
        .filter(Boolean);

    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return username.slice(0, 2).toUpperCase();
}

export default function AppHeader() {
    const { user, isLoading } = useUser();
    const [isCabinetOpen, setIsCabinetOpen] = useState(false);
    const cabinetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (!cabinetRef.current?.contains(event.target as Node)) {
                setIsCabinetOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const username = user?.username ?? "Пользователь";
    const initials = getInitials(username);

    return (
        <header className="sticky top-0 z-50 border-b border-fern-dark/40 bg-fern/95 shadow-page backdrop-blur">
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <a href="#top" className="transition hover:opacity-85">
                    <Logo />
                </a>

                <nav className="flex items-center gap-2 sm:gap-4">
                    <Button
                        variant="ghost"
                        className="hidden bg-natural/15 px-4 py-2 text-apricot hover:bg-natural/25 sm:flex"
                    >
                        ⌕ Поиск
                    </Button>

                    {isLoading ? (
                        <div className="h-10 w-28 animate-pulse rounded-xl bg-natural/20" />
                    ) : user ? (
                        <>
                            <div ref={cabinetRef} className="relative">
                                <Button
                                    variant="ghost"
                                    className="px-3 py-2 text-ivory hover:bg-natural/15"
                                    onClick={() =>
                                        setIsCabinetOpen((current) => !current)
                                    }
                                    aria-expanded={isCabinetOpen}
                                >
                                    ♙ Кабинет
                                    <span className="text-natural">⌄</span>
                                </Button>

                                {isCabinetOpen && (
                                    <div className="absolute right-0 top-12 w-52 overflow-hidden rounded-2xl border border-natural/25 bg-ivory-card py-2 shadow-dropdown">
                                        {cabinetLinks.map((link) => (
                                            <button
                                                key={link.label}
                                                type="button"
                                                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-fern transition hover:bg-natural/15"
                                            >
                                                <span className="w-4 text-apricot">
                                                    {link.icon}
                                                </span>
                                                {link.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                className="hidden items-center gap-2 rounded-xl border border-natural/30 bg-natural/15 px-3 py-2 text-sm font-semibold text-ivory transition hover:bg-natural/25 md:flex"
                            >
                                <span className="rounded-full bg-apricot px-2 py-1 text-xs text-ivory">
                                    {initials}
                                </span>
                                {username}
                            </button>

                            <Button
                                variant="ghost"
                                className="px-3 py-2 text-natural hover:bg-natural/15 hover:text-apricot"
                                aria-label="Выйти"
                            >
                                ↪
                            </Button>
                        </>
                    ) : (
                        <Button className="px-5 py-2">Войти</Button>
                    )}
                </nav>
            </div>
        </header>
    );
}