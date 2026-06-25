import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "../components/shared";
import { useUser } from "../features/auth/user-provider";
import { getBookDetails, toggleBookLike } from "../features/books/api/books.api";
import BookCommentsSection from "../features/books/components/book-comments-section";
import BookDetailsCard from "../features/books/components/book-details-card";
import { getMockBookDetailsById } from "../features/books/data/book-details.mock";
import type {
    BookComment,
    BookDetails,
} from "../features/books/types/book-details";
import AppHeader from "../layouts/app-header";
import { socketService } from "../services/socket.service";

export default function BookDetailsPage() {
    const navigate = useNavigate();
    const { bookId } = useParams();

    const { user } = useUser();
    const isAuthorized = Boolean(user);

    const [book, setBook] = useState<BookDetails>(() =>
        getMockBookDetailsById(bookId)
    );
    const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Загрузка деталей книги из API (fallback механизм)
    useEffect(() => {
        if (!bookId) return;

        const loadBookDetails = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await getBookDetails(bookId);
                const details = response.data;

                // Преобразуем данные из API в формат BookDetails
                setBook({
                    id: details.olid,
                    title: details.title,
                    author: "Автор неизвестен", // TODO: получить автора из API
                    year: 2024, // TODO: получить год из API
                    cover: details.cover_url || undefined,
                    description: details.description,
                    likes: details.likes_count,
                    isLiked: details.is_liked,
                    comments: [], // Комментарии загружаются отдельно
                });

                console.log(
                    `[BookDetailsPage] Данные книги загружены из API: ${details.likes_count} лайков`
                );
            } catch (err) {
                console.error("[BookDetailsPage] Ошибка загрузки книги:", err);
                setError(err instanceof Error ? err.message : "Ошибка загрузки книги");
                // Fallback на mock данные
                setBook(getMockBookDetailsById(bookId));
            } finally {
                setIsLoading(false);
            }
        };

        loadBookDetails();
    }, [bookId]);

    // WebSocket подключение и обработка событий
    useEffect(() => {
        if (!bookId) return;

        console.log(`[BookDetailsPage] Инициализация WebSocket для книги: ${bookId}`);

        // Подключение к WebSocket серверу
        socketService.connect();

        // Регистрация обработчиков событий
        socketService.on({
            onConnect: () => {
                console.log("[BookDetailsPage] WebSocket подключен");
                setIsWebSocketConnected(true);
                // Присоединяемся к комнате после успешного подключения
                socketService.joinBookRoom(bookId);
            },
            onDisconnect: () => {
                console.log("[BookDetailsPage] WebSocket отключен");
                setIsWebSocketConnected(false);
            },
            onError: (error) => {
                console.error("[BookDetailsPage] WebSocket ошибка:", error.message);
                setIsWebSocketConnected(false);
            },
            onLikesUpdated: (payload) => {
                console.log(
                    `[BookDetailsPage] Получено обновление лайков для ${payload.book_olid}: ${payload.count}`
                );
                // Обновляем только если это наша книга
                if (payload.book_olid === bookId) {
                    setBook((currentBook) => ({
                        ...currentBook,
                        likes: payload.count,
                    }));
                }
            },
        });

        // Если уже подключен, присоединяемся к комнате сразу
        if (socketService.isConnected()) {
            socketService.joinBookRoom(bookId);
            setIsWebSocketConnected(true);
        }

        // Cleanup при размонтировании или смене книги
        return () => {
            console.log(`[BookDetailsPage] Cleanup для книги: ${bookId}`);
            socketService.leaveBookRoom(bookId);
            // Не отключаем сокет полностью, только покидаем комнату
            // socketService.disconnect();
        };
    }, [bookId]);

    function handleGoHome() {
        navigate("/");
    }

    async function handleLike() {
        if (!isAuthorized || !bookId || isLikeLoading) {
            return;
        }

        setIsLikeLoading(true);

        try {
            // Оптимистичное обновление UI
            setBook((currentBook) => ({
                ...currentBook,
                isLiked: !currentBook.isLiked,
                likes: currentBook.isLiked
                    ? currentBook.likes - 1
                    : currentBook.likes + 1,
            }));

            // Отправляем запрос на сервер
            const response = await toggleBookLike(bookId);
            const { is_liked, likes_count } = response.data;

            console.log(
                `[BookDetailsPage] Лайк переключен: ${is_liked}, новое количество: ${likes_count}`
            );

            // Обновляем с данными сервера (на случай расхождения)
            setBook((currentBook) => ({
                ...currentBook,
                isLiked: is_liked,
                likes: likes_count,
            }));

            // WebSocket broadcast будет отправлен сервером автоматически
        } catch (err) {
            console.error("[BookDetailsPage] Ошибка при лайке:", err);

            // Откатываем оптимистичное обновление в случае ошибки
            setBook((currentBook) => ({
                ...currentBook,
                isLiked: !currentBook.isLiked,
                likes: currentBook.isLiked
                    ? currentBook.likes - 1
                    : currentBook.likes + 1,
            }));
        } finally {
            setIsLikeLoading(false);
        }
    }

    function handleCommentCreated(comment: BookComment) {
        setBook((currentBook) => ({
            ...currentBook,
            comments: [comment, ...currentBook.comments],
        }));
    }

    return (
        <div className="min-h-screen bg-ivory text-fern">
            <AppHeader />

            <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={handleGoHome}
                        className="bg-natural/10 px-4 py-2 text-natural-text hover:bg-natural/20 hover:text-apricot"
                    >
                        ← На главную
                    </Button>

                    {/* WebSocket статус индикатор (для разработки) */}
                    <div className="flex items-center gap-2 rounded-lg bg-natural/10 px-3 py-1.5 text-xs">
                        <span
                            className={`h-2 w-2 rounded-full ${
                                isWebSocketConnected ? "bg-green-500" : "bg-red-500"
                            }`}
                        />
                        <span className="text-natural-text">
                            {isWebSocketConnected ? "WS подключен" : "WS отключен"}
                        </span>
                    </div>
                </div>

                {error && (
                    <div className="rounded-xl bg-error/10 p-4 text-sm text-error">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="flex min-h-[400px] items-center justify-center">
                        <div className="text-center">
                            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-apricot border-t-transparent mx-auto" />
                            <p className="text-natural-text">Загрузка книги...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <BookDetailsCard
                            book={book}
                            isAuthorized={isAuthorized}
                            onLike={handleLike}
                        />

                        <BookCommentsSection
                            bookId={book.id}
                            comments={book.comments}
                            isAuthorized={isAuthorized}
                            currentUsername={user?.username}
                            onCommentCreated={handleCommentCreated}
                        />
                    </>
                )}
            </main>
        </div>
    );
}