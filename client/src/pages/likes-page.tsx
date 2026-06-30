import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { BookCard, Button, Pagination } from "../components/shared";
import {
    getLikedBooks,
    removeLikedBook,
} from "../features/books/api/user-likes.api";
import type { Book } from "../features/books/types/book";
import ProfileSidebar from "../features/profile/components/profile-sidebar";
import AppHeader from "../layouts/app-header";

const LIKED_BOOKS_PER_PAGE = 6;

type PaginationState = {
    total: number;
    totalPages: number;
    start: number;
    end: number;
};

export default function LikesPage() {
    const navigate = useNavigate();

    const [books, setBooks] = useState<Book[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [pagination, setPagination] = useState<PaginationState>({
        total: 0,
        totalPages: 0,
        start: 0,
        end: 0,
    });

    const loadLikedBooks = useCallback(async (page: number) => {
        setIsLoading(true);
        setError("");

        try {
            const response = await getLikedBooks({
                page,
                limit: LIKED_BOOKS_PER_PAGE,
            });

            setBooks(response.items);
            setCurrentPage(response.page);
            setPagination({
                total: response.total,
                totalPages: response.totalPages,
                start: response.start,
                end: response.end,
            });
        } catch {
            setBooks([]);
            setPagination({
                total: 0,
                totalPages: 0,
                start: 0,
                end: 0,
            });
            setError("Не удалось загрузить лайки");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void loadLikedBooks(currentPage);
    }, [currentPage, loadLikedBooks]);

    function handleOpenBook(book: Book) {
        navigate(`/books/${book.id}`);
    }

    async function handleRemoveLike(bookId: string) {
        await removeLikedBook(bookId);

        const nextPage =
            books.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;

        await loadLikedBooks(nextPage);
    }

    return (
        <div className="min-h-screen bg-ivory text-fern">
            <AppHeader />

            <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                    <ProfileSidebar activeItem="likes" />

                    <section className="rounded-3xl border border-natural/20 bg-ivory-card p-5 shadow-page sm:p-7">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-fern">Мои лайки</h1>

                            
                            </div>

                            {!isLoading && pagination.total > 0 && (
                                <p className="rounded-xl bg-natural/10 px-4 py-2 text-sm font-semibold text-natural-text">
                                    {pagination.start}–{pagination.end} из {pagination.total}
                                </p>
                            )}
                        </div>

                        {error && (
                            <div className="mt-6 rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm font-semibold text-error">
                                {error}
                            </div>
                        )}

                        <div className="mt-6">
                            {isLoading ? (
                                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                    {Array.from({ length: LIKED_BOOKS_PER_PAGE }).map(
                                        (_, index) => (
                                            <div
                                                key={index}
                                                className="overflow-hidden rounded-2xl border border-fern/10 bg-ivory-card shadow-card"
                                            >
                                                <div className="h-64 animate-pulse bg-natural/20" />

                                                <div className="space-y-3 p-4">
                                                    <div className="h-4 w-3/4 animate-pulse rounded bg-natural/20" />
                                                    <div className="h-3 w-1/2 animate-pulse rounded bg-natural/20" />

                                                    <div className="flex items-center justify-between pt-24">
                                                        <div className="h-9 w-20 animate-pulse rounded-full bg-natural/20" />
                                                        <div className="h-9 w-28 animate-pulse rounded-full bg-natural/20" />
                                                    </div>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            ) : books.length > 0 ? (
                                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                    {books.map((book) => (
                                        <BookCard
                                            key={book.id}
                                            title={book.title}
                                            author={book.author}
                                            cover={book.cover}
                                            likes={book.likes}
                                            isLiked={book.isLiked}
                                            onOpen={() => handleOpenBook(book)}
                                            onLike={() => handleRemoveLike(book.id)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-natural/25 bg-ivory px-6 py-12 text-center shadow-card">
                                    <p className="text-lg font-bold text-fern">
                                        Вы пока не лайкали книги
                                    </p>

                                    <p className="mx-auto mt-2 max-w-md text-sm text-natural-text">
                                        Когда вы поставите лайк книге, она появится здесь.
                                    </p>

                                    <Button
                                        variant="secondary"
                                        onClick={() => navigate("/")}
                                        className="mx-auto mt-5 px-5 py-2"
                                    >
                                        Найти книги
                                    </Button>
                                </div>
                            )}
                        </div>

                        {!isLoading && books.length > 0 && (
                            <Pagination
                                page={currentPage}
                                totalPages={pagination.totalPages}
                                onPageChange={setCurrentPage}
                                className="mt-10"
                            />
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}