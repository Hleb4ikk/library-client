import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "../components/shared";
import { useUser } from "../features/auth/user-provider";
import BookCommentsSection from "../features/books/components/book-comments-section";
import BookDetailsCard from "../features/books/components/book-details-card";
import { getMockBookDetailsById } from "../features/books/data/book-details.mock";
import type {
    BookComment,
    BookDetails,
} from "../features/books/types/book-details";
import AppHeader from "../layouts/app-header";

export default function BookDetailsPage() {
    const navigate = useNavigate();
    const { bookId } = useParams();

    const { user } = useUser();
    const isAuthorized = Boolean(user);

    const [book, setBook] = useState<BookDetails>(() =>
        getMockBookDetailsById(bookId)
    );

    useEffect(() => {
        setBook(getMockBookDetailsById(bookId));
    }, [bookId]);

    function handleGoHome() {
        navigate("/");
    }

    function handleLike() {
        if (!isAuthorized) {
            return;
        }

        setBook((currentBook) => ({
            ...currentBook,
            isLiked: !currentBook.isLiked,
            likes: currentBook.isLiked
                ? currentBook.likes - 1
                : currentBook.likes + 1,
        }));
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
                <div>
                    <Button
                        variant="ghost"
                        onClick={handleGoHome}
                        className="bg-natural/10 px-4 py-2 text-natural-text hover:bg-natural/20 hover:text-apricot"
                    >
                        ← На главную
                    </Button>
                </div>

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
            </main>
        </div>
    );
}