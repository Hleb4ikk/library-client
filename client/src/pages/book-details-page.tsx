import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "../components/shared";
import { EStatusBadgeVariant } from "../enums/EStatusBadgeVariant";
import { useUser } from "../features/auth/user-provider";
import { getBookDetails, toggleBookLike } from "../features/books/api/books.api";
import { getBookComments } from "../features/books/api/comments.api";
import { addOrUpdateBookStatus } from "../features/books/api/reading-list.api";
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
    const [isStatusLoading, setIsStatusLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!bookId) return;

        const loadBookDetails = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await getBookDetails(bookId);
                const details = response.data;

                const commentsResult = await getBookComments(
                    bookId,
                    1,
                    user?.id,
                ).catch(() => ({ comments: [] }));

                setBook({
                    id: details.olid,
                    title: details.title,
                    author: "Автор неизвестен",
                    year: 2024,
                    cover: details.cover_url || undefined,
                    description: details.description,
                    likes: details.likes_count,
                    isLiked: details.is_liked,
                    comments: commentsResult.comments,
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : "Ошибка загрузки книги");
                setBook(getMockBookDetailsById(bookId));
            } finally {
                setIsLoading(false);
            }
        };

        loadBookDetails();
    }, [bookId, user?.id]);

    useEffect(() => {
        if (!bookId) return;

        socketService.connect();

        socketService.on({
            onConnect: () => {
                setIsWebSocketConnected(true);
                socketService.joinBookRoom(bookId);
            },
            onDisconnect: () => {
                setIsWebSocketConnected(false);
            },
            onError: () => {
                setIsWebSocketConnected(false);
            },
            onLikesUpdated: (payload) => {
                if (payload.book_olid === bookId) {
                    setBook((currentBook) => ({
                        ...currentBook,
                        likes: payload.count,
                    }));
                }
            },
        });

        if (socketService.isConnected()) {
            socketService.joinBookRoom(bookId);
            setIsWebSocketConnected(true);
        }

        return () => {
            socketService.leaveBookRoom(bookId);
        };
    }, [bookId]);

    function handleGoHome() {
        navigate("/");
    }

    async function handleLike() {
        if (!isAuthorized || !bookId || isLikeLoading) return;

        setIsLikeLoading(true);

        try {
            setBook((currentBook) => ({
                ...currentBook,
                isLiked: !currentBook.isLiked,
                likes: currentBook.isLiked
                    ? currentBook.likes - 1
                    : currentBook.likes + 1,
            }));

            const response = await toggleBookLike(bookId);
            const { is_liked, likes_count } = response.data;

            setBook((currentBook) => ({
                ...currentBook,
                isLiked: is_liked,
                likes: likes_count,
            }));
        } catch (err) {
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

    async function handleStatusChange(status: EStatusBadgeVariant) {
        if (!isAuthorized || !bookId || isStatusLoading) return;

        setIsStatusLoading(true);

        try {
            setBook((currentBook) => ({
                ...currentBook,
                readingStatus: status,
            }));

            await addOrUpdateBookStatus(bookId, status);
        } catch (err) {
            setBook((currentBook) => ({
                ...currentBook,
                readingStatus: undefined,
            }));

            setError(
                err instanceof Error ? err.message : "Ошибка при изменении статуса"
            );
        } finally {
            setIsStatusLoading(false);
        }
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

                    {/* WebSocket indicator */}
                    <div className="flex items-center gap-2 rounded-lg bg-natural/10 px-3 py-1.5 text-xs">
                        <span
                            className={`h-2 w-2 rounded-full ${
                                isWebSocketConnected ? "bg-green-500" : "bg-red-500"
                            }`}
                        />
                        <span className="text-natural-text">
                            {isWebSocketConnected ? "WS" : "Offline"}
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
                            onStatusChange={handleStatusChange}
                            isStatusLoading={isStatusLoading}
                        />

                        <BookCommentsSection
                            bookId={book.id}
                            comments={book.comments}
                            isAuthorized={isAuthorized}
                            currentUserId={user?.id}
                            onCommentCreated={handleCommentCreated}
                        />
                    </>
                )}
            </main>
        </div>
    );
}