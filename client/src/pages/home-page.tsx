import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Badge, Button, Logo } from "../components/shared";
import { useUser } from "../features/auth/user-provider";
import BookGrid from "../features/books/components/book-grid";
import BookSearchForm from "../features/books/components/book-search-form";
import { popularBooks } from "../features/books/data/popular-books";
import AppHeader from "../layouts/app-header";

function formatStatValue(value: number) {
    if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1)}M`;
    }

    if (value >= 1_000) {
        return `${(value / 1_000).toFixed(1)}K`;
    }

    return String(value);
}

export default function HomePage() {
    const { user } = useUser();
    const isAuthorized = Boolean(user);

    const [searchValue, setSearchValue] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const visibleBooks = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();

        if (!normalizedQuery) {
            return popularBooks;
        }

        return popularBooks.filter((book) => {
            const searchableText = `${book.title} ${book.author}`.toLowerCase();

            return searchableText.includes(normalizedQuery);
        });
    }, [searchQuery]);

    const totalLikes = useMemo(() => {
        return popularBooks.reduce((sum, book) => sum + book.likes, 0);
    }, []);

    const stats = [
        {
            value: formatStatValue(popularBooks.length),
            label: "Книг в базе",
        },
        {
            value: "1",
            label: "Пользователей",
        },
        {
            value: "0",
            label: "Комментариев",
        },
        {
            value: formatStatValue(totalLikes),
            label: "Лайков",
        },
    ];

    function handleSearchSubmit() {
        setSearchQuery(searchValue.trim());
    }

    function handleResetSearch() {
        setSearchValue("");
        setSearchQuery("");
    }

    return (
        <div id="top" className="min-h-screen bg-ivory text-fern">
            <AppHeader />

            <main>
                <section className="bg-linear-to-br from-fern via-fern to-fern-dark px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
                    <div className="mx-auto max-w-4xl">
                        <Logo variant="hero" className="justify-center" />

                        <p className="mx-auto mt-6 max-w-3xl text-base text-natural sm:text-lg">
                            Открывайте новые книги, делитесь впечатлениями,
                            формируйте библиотеку мечты
                        </p>

                        <BookSearchForm
                            value={searchValue}
                            onChange={setSearchValue}
                            onSubmit={handleSearchSubmit}
                        />
                    </div>
                </section>

                <section className="bg-natural px-4 py-5 sm:px-6 lg:px-8">
                    <div className="mx-auto grid max-w-2xl grid-cols-2 gap-4 text-center sm:grid-cols-4">
                        {stats.map((item) => (
                            <div key={item.label}>
                                <p className="text-xl font-bold text-ivory">
                                    {item.value}
                                </p>
                                <p className="mt-1 text-xs text-ivory/80 sm:text-sm">
                                    {item.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
                    <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-fern sm:text-2xl">
                                {searchQuery
                                    ? "Результаты поиска"
                                    : "Популярные книги"}
                            </h2>

                            <Badge>{visibleBooks.length} книг</Badge>
                        </div>

                        {searchQuery && (
                            <Button
                                variant="outline"
                                className="w-fit px-4 py-2"
                                onClick={handleResetSearch}
                            >
                                Сбросить поиск
                            </Button>
                        )}
                    </div>

                    {visibleBooks.length > 0 ? (
                        <BookGrid
                            books={visibleBooks}
                            isAuthorized={isAuthorized}
                            onOpenBook={(book) => navigate(`/books/${book.id}`)}
                            onLikeBook={(book) => console.log("like book", book.id)}
                        />
                    ) : (
                        <div className="rounded-2xl border border-natural/25 bg-ivory-card px-6 py-12 text-center shadow-card">
                            <p className="text-lg font-bold text-fern">
                                Ничего не найдено
                            </p>
                            <p className="mt-2 text-sm text-natural-text">
                                Попробуйте изменить запрос или поискать книгу по
                                автору.
                            </p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}