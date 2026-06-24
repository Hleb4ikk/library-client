import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

import { Badge, Button, Pagination } from "../components/shared";
import {
    deleteReadingListBook,
    getReadingListBooks,
    resetMockReadingListBooks,
    updateReadingListBookStatus,
} from "../features/books/api/reading-list.api";
import type { Book, BookStatus } from "../features/books/types/book";
import ProfileSidebar from "../features/profile/components/profile-sidebar";
import AppHeader from "../layouts/app-header";

type StatusFilter = "all" | BookStatus;

const BOOKS_PER_PAGE = 4;

const statusFilters: Array<{ label: string; value: StatusFilter }> = [
    { label: "Все", value: "all" },
    { label: "Хочу прочитать", value: "Хочу прочитать" },
    { label: "Читаю сейчас", value: "Читаю" },
    { label: "Прочитано", value: "Прочитано" },
];

const statusOptions: BookStatus[] = [
    "Хочу прочитать",
    "Читаю",
    "Прочитано",
];

const statusBadgeVariant: Record<BookStatus, "want" | "reading" | "done"> = {
    "Хочу прочитать": "want",
    Читаю: "reading",
    Прочитано: "done",
};

type PaginationState = {
    total: number;
    totalPages: number;
    start: number;
    end: number;
};

function ReadingListBookItem({
    book,
    onOpen,
    onStatusChange,
    onDelete,
}: {
    book: Book;
    onOpen: (book: Book) => void;
    onStatusChange: (bookId: string, status: BookStatus) => void;
    onDelete: (bookId: string) => void;
}) {
    const status = book.status ?? "Хочу прочитать";

    return (
        <article className="rounded-2xl border border-natural/25 bg-ivory px-4 py-4 shadow-card transition hover:shadow-page">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                    type="button"
                    onClick={() => onOpen(book)}
                    className="h-28 w-20 shrink-0 cursor-pointer overflow-hidden rounded-xl bg-ivory-muted sm:h-24 sm:w-16"
                    aria-label={`Открыть книгу ${book.title}`}
                >
                    {book.cover ? (
                        <img
                            src={book.cover}
                            alt={book.title}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <span className="flex h-full items-center justify-center px-2 text-center text-xs font-semibold text-natural">
                            Нет обложки
                        </span>
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => onOpen(book)}
                    className="min-w-0 flex-1 cursor-pointer text-left"
                >
                    <h3 className="text-base font-bold text-fern transition hover:text-apricot sm:text-lg">
                        {book.title}
                    </h3>

                    <p className="mt-1 text-sm text-natural-text">
                        {book.author}
                    </p>

                    <div className="mt-3">
                        <Badge variant={statusBadgeVariant[status]}>
                            {status}
                        </Badge>
                    </div>
                </button>

                <div className="flex items-center gap-2 sm:min-w-[240px] sm:justify-end">
                    <select
                        value={status}
                        onChange={(event) =>
                            onStatusChange(
                                book.id,
                                event.target.value as BookStatus
                            )
                        }
                        className="min-w-0 flex-1 cursor-pointer rounded-xl border border-natural/30 bg-ivory-card px-3 py-2 text-sm font-semibold text-fern outline-none transition focus:border-apricot sm:max-w-[190px]"
                        aria-label={`Изменить статус книги ${book.title}`}
                    >
                        {statusOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>

                    <Button
                        variant="danger"
                        onClick={() => onDelete(book.id)}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl px-0 py-0"
                        aria-label={`Удалить книгу ${book.title} из списка`}
                    >
                        ✕
                    </Button>
                </div>
            </div>
        </article>
    );
}
export default function ReadingListPage() {
    const navigate = useNavigate();

    const [books, setBooks] = useState<Book[]>([]);
    const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [pagination, setPagination] = useState<PaginationState>({
        total: 0,
        totalPages: 0,
        start: 0,
        end: 0,
    });

    const loadReadingListBooks = useCallback(
        async (page: number, status: StatusFilter) => {
            setIsLoading(true);
            setError("");

            try {
                const response = await getReadingListBooks({
                    page,
                    limit: BOOKS_PER_PAGE,
                    status,
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
                setError("Не удалось загрузить список чтения");
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        void loadReadingListBooks(currentPage, activeFilter);
    }, [activeFilter, currentPage, loadReadingListBooks]);

    function handleFilterChange(filter: StatusFilter) {
        setActiveFilter(filter);
        setCurrentPage(1);
    }

    function handleOpenBook(book: Book) {
        navigate(`/books/${book.id}`);
    }

    async function handleStatusChange(bookId: string, status: BookStatus) {
        await updateReadingListBookStatus(bookId, status);
        await loadReadingListBooks(currentPage, activeFilter);
    }

    async function handleDeleteBook(bookId: string) {
        await deleteReadingListBook(bookId);

        const nextPage =
            books.length === 1 && currentPage > 1
                ? currentPage - 1
                : currentPage;

        await loadReadingListBooks(nextPage, activeFilter);
    }

    async function handleResetList() {
        await resetMockReadingListBooks();

        setActiveFilter("all");
        setCurrentPage(1);
        await loadReadingListBooks(1, "all");
    }

    return (
        <div className="min-h-screen bg-ivory text-fern">
            <AppHeader />

            <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                    <ProfileSidebar activeItem="reading-list" />

                    <section className="rounded-3xl border border-natural/20 bg-ivory-card p-5 shadow-page sm:p-7">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-fern">
                                    Список чтения
                                </h1>

                                <p className="mt-2 text-sm text-natural-text">
                                    Управляйте книгами, меняйте статус и
                                    открывайте детали прямо из списка.
                                </p>
                            </div>

                            {!isLoading && pagination.total > 0 && (
                                <p className="rounded-xl bg-natural/10 px-4 py-2 text-sm font-semibold text-natural-text">
                                    {pagination.start}–{pagination.end} из{" "}
                                    {pagination.total}
                                </p>
                            )}
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2">
                            {statusFilters.map((filter) => (
                                <Button
                                    key={filter.value}
                                    variant={
                                        activeFilter === filter.value
                                            ? "secondary"
                                            : "ghost"
                                    }
                                    onClick={() =>
                                        handleFilterChange(filter.value)
                                    }
                                    className={twMerge(
                                        "px-4 py-2",
                                        activeFilter !== filter.value &&
                                        "bg-natural/10 text-fern hover:bg-natural/20"
                                    )}
                                >
                                    {filter.label}
                                </Button>
                            ))}
                        </div>

                        {error && (
                            <div className="mt-6 rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm font-semibold text-error">
                                {error}
                            </div>
                        )}

                        <div className="mt-6 space-y-4">
                            {isLoading ? (
                                Array.from({ length: BOOKS_PER_PAGE }).map(
                                    (_, index) => (
                                        <div
                                            key={index}
                                            className="rounded-2xl border border-natural/20 bg-ivory px-4 py-4 shadow-card"
                                        >
                                            <div className="flex animate-pulse gap-4">
                                                <div className="h-24 w-16 rounded-xl bg-natural/20" />

                                                <div className="flex flex-1 flex-col justify-center gap-3">
                                                    <div className="h-4 w-2/3 rounded bg-natural/20" />
                                                    <div className="h-3 w-1/3 rounded bg-natural/20" />
                                                    <div className="h-6 w-28 rounded-full bg-natural/20" />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )
                            ) : books.length > 0 ? (
                                books.map((book) => (
                                    <ReadingListBookItem
                                        key={book.id}
                                        book={book}
                                        onOpen={handleOpenBook}
                                        onStatusChange={handleStatusChange}
                                        onDelete={handleDeleteBook}
                                    />
                                ))
                            ) : (
                                <div className="rounded-2xl border border-natural/25 bg-ivory px-6 py-12 text-center shadow-card">
                                    <p className="text-lg font-bold text-fern">
                                        В этом разделе пока пусто
                                    </p>

                                    <p className="mx-auto mt-2 max-w-md text-sm text-natural-text">
                                        Попробуйте выбрать другой статус.
                                    </p>

                                   
                                </div>
                            )}
                        </div>

                        {!isLoading && books.length > 0 && (
                            <Pagination
                                page={currentPage}
                                totalPages={pagination.totalPages}
                                onPageChange={setCurrentPage}
                                className="mt-7"
                            />
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}