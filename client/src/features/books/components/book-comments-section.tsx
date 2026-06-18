import { useState } from "react";

import { Badge, Button, IconButton, Textarea } from "../../../components/shared";
import { createBookComment } from "../api/comments.api";
import type { BookComment } from "../types/book-details";

type BookCommentsSectionProps = {
    bookId: string;
    comments: BookComment[];
    isAuthorized: boolean;
    currentUsername?: string;
    onCommentCreated: (comment: BookComment) => void;
};

function getInitials(username: string) {
    return username.slice(0, 2).toUpperCase();
}

export default function BookCommentsSection({
    bookId,
    comments,
    isAuthorized,
    currentUsername = "user",
    onCommentCreated,
}: BookCommentsSectionProps) {
    const [commentText, setCommentText] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    async function handleCreateComment() {
        const trimmedText = commentText.trim();

        if (!trimmedText || !isAuthorized) {
            return;
        }

        setIsCreating(true);

        try {
            const createdComment = await createBookComment({
                bookId,
                text: trimmedText,
                authorName: currentUsername,
                authorInitials: getInitials(currentUsername),
            });

            onCommentCreated(createdComment);
            setCommentText("");
        } finally {
            setIsCreating(false);
        }
    }

    return (
        <section className="rounded-3xl border border-natural/20 bg-ivory-card px-6 py-7 shadow-page sm:px-8">
            <div className="mb-7 flex items-center gap-3">
                <h2 className="flex items-center gap-3 text-2xl font-bold text-fern">
                    <span className="text-apricot">▱</span>
                    Комментарии
                </h2>

                <span className="rounded-full bg-apricot px-2 py-1 text-sm font-bold text-ivory">
                    {comments.length}
                </span>
            </div>

            <div className="flex items-start gap-3">
                <Textarea
                    value={commentText}
                    onChange={(event) => setCommentText(event.target.value)}
                    placeholder={
                        isAuthorized
                            ? "Поделитесь мнением о книге..."
                            : "Войдите, чтобы оставить комментарий"
                    }
                    disabled={!isAuthorized || isCreating}
                    className="min-h-28 resize-none bg-ivory"
                />

                <Button
                    onClick={handleCreateComment}
                    disabled={!isAuthorized || isCreating || !commentText.trim()}
                    className="mt-14 h-12 w-12 shrink-0 rounded-2xl px-0 text-2xl"
                    aria-label="Добавить комментарий"
                    title={
                        isAuthorized
                            ? "Добавить комментарий"
                            : "Войдите, чтобы оставить комментарий"
                    }
                >
                    +
                </Button>
            </div>

            <div className="mt-6 space-y-4">
                {comments.map((comment) => (
                    <article
                        key={comment.id}
                        className="rounded-2xl border border-natural/20 bg-ivory px-4 py-4"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-natural text-sm font-bold text-ivory">
                                    {comment.authorInitials}
                                </div>

                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-fern">
                                        {comment.authorName}
                                    </p>

                                    {comment.isOwn && <Badge>Вы</Badge>}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-natural-text">
                                <span>{comment.createdAt}</span>

                                {isAuthorized && comment.isOwn && (
                                    <>
                                        <IconButton
                                            aria-label="Редактировать"
                                            title="Редактировать"
                                            className="text-natural hover:text-apricot"
                                        >
                                            <svg
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                                className="h-5 w-5"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M12 20h9" />
                                                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
                                            </svg>
                                        </IconButton>

                                        <IconButton
                                            aria-label="Удалить"
                                            title="Удалить"
                                            className="text-error hover:text-error"
                                        >
                                            <svg
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                                className="h-5 w-5"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M3 6h18" />
                                                <path d="M8 6V4h8v2" />
                                                <path d="M19 6l-1 14H6L5 6" />
                                                <path d="M10 11v6" />
                                                <path d="M14 11v6" />
                                            </svg>
                                        </IconButton>
                                    </>
                                )}
                            </div>
                        </div>

                        <p className="mt-4 text-base leading-6 text-fern">
                            {comment.text}
                        </p>
                    </article>
                ))}
            </div>
        </section>
    );
}